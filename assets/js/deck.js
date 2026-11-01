/* Mystic Hills — движок презентации: масштабирование, навигация, обзор, заметки, демо-режим. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const slides = Array.from(document.querySelectorAll('.stage > .slide'));
  const N = slides.length;
  let cur = -1;

  // ---------- масштаб ----------
  const stage = $('#stage');
  function fit() {
    const s = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    stage.style.transform = 'scale(' + s + ')';
  }
  window.addEventListener('resize', fit); fit();

  // ---------- навигация ----------
  function loadFrames(i) {
    for (let k = Math.max(0, i - 1); k <= Math.min(N - 1, i + 1); k++) {
      slides[k].querySelectorAll('iframe[data-src]').forEach(f => { f.src = f.dataset.src; f.removeAttribute('data-src'); });
    }
  }
  function go(i, push) {
    i = Math.max(0, Math.min(N - 1, i));
    if (i === cur) return;
    cur = i;
    slides.forEach((s, k) => s.classList.toggle('active', k === i));
    loadFrames(i);
    $('#cur').textContent = i + 1;
    $('#label').textContent = slides[i].dataset.label || '';
    $('#notes-text').textContent = slides[i].dataset.notes || '';
    $('#progress').style.width = ((i + 1) / N * 100) + '%';
    if (push !== false) history.replaceState(null, '', '#' + (i + 1));
    document.querySelectorAll('.thumb').forEach((t, k) => t.classList.toggle('on', k === i));
  }
  const next = () => go(cur + 1), prev = () => go(cur - 1);
  $('#total').textContent = N;
  $('#next').addEventListener('click', next);
  $('#prev').addEventListener('click', prev);
  const fromHash = () => { const n = parseInt(location.hash.slice(1), 10); return isNaN(n) ? 0 : n - 1; };
  window.addEventListener('hashchange', () => go(fromHash(), false));

  // свайп по сцене (на iframe не реагирует — это их зона)
  let tx = null, ty = null;
  const vp = $('#viewport');
  vp.addEventListener('touchstart', e => { tx = e.touches[0].clientX; ty = e.touches[0].clientY; }, { passive: true });
  vp.addEventListener('touchend', e => {
    if (tx == null) return;
    const dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty; tx = null;
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) dx < 0 ? next() : prev();
  }, { passive: true });

  // ---------- HUD: прячем при бездействии ----------
  const hud = $('#hud'); let idleT;
  function wake() { hud.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => { if (!hud.matches(':hover')) hud.classList.add('idle'); }, 3500); }
  ['mousemove', 'touchstart', 'keydown'].forEach(ev => window.addEventListener(ev, wake, { passive: true }));
  hud.addEventListener('mouseleave', wake); wake();

  // ---------- заметки ----------
  const notes = $('#notes');
  const toggleNotes = () => { notes.hidden = !notes.hidden; };
  $('#notes-btn').addEventListener('click', toggleNotes);

  // ---------- полный экран ----------
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  }
  $('#fs-btn').addEventListener('click', toggleFs);

  // ---------- обзор ----------
  const ov = $('#overview'), grid = $('#overview-grid');
  let ovBuilt = false;
  function buildOverview() {
    if (ovBuilt) return; ovBuilt = true;
    slides.forEach((s, i) => {
      const b = document.createElement('button'); b.className = 'thumb' + (i === cur ? ' on' : '');
      const box = document.createElement('div'); box.className = 'thumb__box';
      const clone = s.cloneNode(true);
      clone.querySelectorAll('iframe').forEach(f => { const d = document.createElement('div'); d.className = 'iframe-ph'; d.style.cssText = f.style.cssText; d.style.width = f.className.includes('web') ? '1280px' : '390px'; d.style.height = '900px'; f.replaceWith(d); });
      clone.querySelectorAll('[data-demo]').forEach(x => x.removeAttribute('data-demo'));
      box.appendChild(clone);
      const cap = document.createElement('div'); cap.className = 'thumb__cap'; cap.innerHTML = '<b>' + (i + 1) + '</b>' + (s.dataset.label || '');
      b.appendChild(box); b.appendChild(cap);
      b.addEventListener('click', () => { go(i); closeOverview(); });
      grid.appendChild(b);
    });
    scaleThumbs();
  }
  function scaleThumbs() {
    grid.querySelectorAll('.thumb__box').forEach(box => { const s = box.clientWidth / 1920; const sl = box.firstChild; sl.style.transform = 'scale(' + s + ')'; });
  }
  window.addEventListener('resize', () => { if (!ov.hidden) scaleThumbs(); });
  function openOverview() { buildOverview(); ov.hidden = false; scaleThumbs(); }
  function closeOverview() { ov.hidden = true; }
  $('#overview-btn').addEventListener('click', openOverview);
  $('#overview-close').addEventListener('click', closeOverview);

  // ---------- демо-режим ----------
  const demo = $('#demo'), dev = $('#demo-device'), dstage = $('#demo-stage');
  const DEV = { phone: [390, 844], tablet: [834, 1112], desktop: [1440, 900] };
  let device = 'phone', frame = null;
  function layoutDemo() {
    const [w, h] = DEV[device];
    const bw = w + (device === 'phone' ? 20 : device === 'tablet' ? 24 : 2), bh = h + (device === 'phone' ? 20 : device === 'tablet' ? 24 : 2);
    dev.className = 'demo__device ' + device;
    dev.style.width = w + 'px'; dev.style.height = h + 'px';
    const s = Math.min(1, (dstage.clientWidth - 32) / bw, (dstage.clientHeight - 32) / bh);
    dev.style.transform = 'scale(' + s + ')';
  }
  function openDemo() {
    if (!frame) { frame = document.createElement('iframe'); frame.title = 'Прототип'; frame.src = 'demo.html?embed=1'; dev.appendChild(frame); }
    demo.hidden = false; layoutDemo();
  }
  function closeDemo() { demo.hidden = true; }
  document.addEventListener('click', e => { const b = e.target.closest('[data-demo]'); if (b) { e.preventDefault(); openDemo(); } });
  $('#demo-close').addEventListener('click', closeDemo);
  $('#demo-reload').addEventListener('click', () => { if (frame) frame.src = 'demo.html?embed=1'; });
  $('#devices').addEventListener('click', e => {
    const b = e.target.closest('[data-dev]'); if (!b) return;
    device = b.dataset.dev;
    document.querySelectorAll('#devices button').forEach(x => x.classList.toggle('on', x === b));
    layoutDemo();
  });
  window.addEventListener('resize', () => { if (!demo.hidden) layoutDemo(); });

  // ---------- клавиатура ----------
  document.addEventListener('keydown', e => {
    if (e.target.matches('input,textarea')) return;
    if (!demo.hidden) { if (e.key === 'Escape') closeDemo(); return; }
    if (!ov.hidden) { if (e.key === 'Escape' || e.key === 'o' || e.key === 'O' || e.key === 'щ') closeOverview(); return; }
    const k = e.key;
    if (k === 'ArrowRight' || k === 'ArrowDown' || k === 'PageDown' || k === ' ' || k === 'Enter') { e.preventDefault(); next(); }
    else if (k === 'ArrowLeft' || k === 'ArrowUp' || k === 'PageUp' || k === 'Backspace') { e.preventDefault(); prev(); }
    else if (k === 'Home') go(0);
    else if (k === 'End') go(N - 1);
    else if (k === 'f' || k === 'F' || k === 'а') toggleFs();
    else if (k === 'd' || k === 'D' || k === 'в') openDemo();
    else if (k === 'n' || k === 'N' || k === 'т') toggleNotes();
    else if (k === 'o' || k === 'O' || k === 'щ') openOverview();
    else if (k === 'Escape' && !notes.hidden) notes.hidden = true;
  });

  // ---------- подсказка на телефоне ----------
  const toast = $('#toast');
  if (window.innerWidth < 700 && window.innerHeight > window.innerWidth && !sessionStorage.getItem('mh-toast')) toast.hidden = false;
  $('#toast-close').addEventListener('click', () => { toast.hidden = true; try { sessionStorage.setItem('mh-toast', '1'); } catch (e) {} });
  window.addEventListener('orientationchange', () => { toast.hidden = true; });

  go(fromHash());
})();
