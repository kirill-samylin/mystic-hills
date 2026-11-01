/* Mystic Hills — презентация в виде вертикального документа: слайды идут друг за другом,
   листаются прокруткой, как страницы PDF. Плюс обзор, заметки, полный экран и демо-режим. */
(function () {
  'use strict';
  const $ = s => document.querySelector(s);
  const demo = $('#demo'), ov = $('#overview'), notes = $('#notes');
  const doc = $('#doc');
  // Телефон или планшет: слайды только для просмотра, кликать внутри них нельзя.
  // Прототип на таких устройствах открывается кнопкой «Демо» или на demo.html.
  const touch = window.matchMedia('(hover: none) and (pointer: coarse)').matches || (navigator.maxTouchPoints > 0 && window.innerWidth < 1024);
  if (touch) document.body.classList.add('touch');
  const slides = Array.from(doc.querySelectorAll('.slide'));
  const N = slides.length;
  let cur = -1;

  // ---------- страницы: каждый слайд в обёртке, масштаб под окно ----------
  const pages = slides.map((s, i) => {
    const p = document.createElement('div'); p.className = 'page'; p.id = 'p' + (i + 1); p.dataset.i = i;
    s.parentNode.insertBefore(p, s); p.appendChild(s);
    return p;
  });
  const GUT = () => (window.innerWidth < 720 ? 12 : 32);
  function fit() {
    const s = Math.min((window.innerWidth - GUT() * 2) / 1920, (window.innerHeight - GUT() * 2) / 1080);
    doc.style.setProperty('--s', s);
  }
  window.addEventListener('resize', () => { fit(); scheduleSync(); }); fit();

  // ---------- ленивые айфреймы: грузим, когда страница близко к экрану ----------
  const io = new IntersectionObserver(entries => {
    entries.forEach(en => {
      if (!en.isIntersecting) return;
      en.target.querySelectorAll('iframe[data-src]').forEach(f => {
        let src = f.dataset.src;
        // на телефоне встроенные экраны прототипа неподвижны: просим прототип отключить прокрутку
        if (touch) { src += (src.includes('?') ? '&' : '?') + 'still=1'; f.setAttribute('scrolling', 'no'); }
        f.src = src; f.removeAttribute('data-src');
      });
      io.unobserve(en.target);
    });
  }, { rootMargin: '120% 0px' });
  pages.forEach(p => io.observe(p));

  // ---------- плёнка над встроенными прототипами: прокрутка идёт по странице,
  // прототип включается только явной кнопкой (случайный тап при свайпе ничего не делает),
  // кнопка «Вернуться» выключает его; при уходе страницы с экрана плёнка возвращается
  let lastScroll = 0;
  window.addEventListener('scroll', () => { lastScroll = Date.now(); }, { passive: true });
  doc.querySelectorAll('.frame, .phone').forEach(box => {
    if (!box.querySelector('iframe') || touch) return;
    const c = document.createElement('div'); c.className = 'cover';
    c.innerHTML = '<button type="button" class="cover__btn">Попробовать прототип</button>';
    c.querySelector('button').addEventListener('click', e => { e.stopPropagation(); if (Date.now() - lastScroll < 350) return; box.classList.add('live'); });
    const off = document.createElement('button'); off.type = 'button'; off.className = 'cover__off'; off.textContent = '✕ К слайдам';
    off.addEventListener('click', () => box.classList.remove('live'));
    box.appendChild(c); box.appendChild(off);
  });
  const ioLive = new IntersectionObserver(entries => {
    entries.forEach(en => { if (!en.isIntersecting) en.target.querySelectorAll('.live').forEach(b => b.classList.remove('live')); });
  }, { threshold: 0 });
  pages.forEach(p => ioLive.observe(p));

  // ---------- текущий слайд по положению прокрутки ----------
  function setCur(i) {
    if (i === cur) return;
    cur = i;
    $('#cur').textContent = i + 1;
    $('#label').textContent = slides[i].dataset.label || '';
    $('#notes-text').textContent = slides[i].dataset.notes || '';
    history.replaceState(null, '', location.pathname + location.search + '#' + (i + 1));
    document.querySelectorAll('.thumb').forEach((t, k) => t.classList.toggle('on', k === i));
  }
  let raf = null;
  function sync() {
    raf = null;
    const mid = window.scrollY + window.innerHeight / 2;
    let best = 0, bd = Infinity;
    pages.forEach((p, i) => { const c = p.offsetTop + p.offsetHeight / 2; const d = Math.abs(c - mid); if (d < bd) { bd = d; best = i; } });
    setCur(best);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    $('#progress').style.width = (max > 0 ? Math.min(100, window.scrollY / max * 100) : 100) + '%';
  }
  function scheduleSync() { if (!raf) raf = requestAnimationFrame(sync); }
  window.addEventListener('scroll', scheduleSync, { passive: true });

  function go(i, instant) {
    i = Math.max(0, Math.min(N - 1, i));
    const top = pages[i].offsetTop - (window.innerHeight - pages[i].offsetHeight) / 2;
    window.scrollTo({ top: Math.max(0, top), behavior: instant ? 'auto' : 'smooth' });
  }
  const next = () => go(cur + 1), prev = () => go(cur - 1);
  $('#total').textContent = N;
  $('#next').addEventListener('click', next);
  $('#prev').addEventListener('click', prev);
  const fromHash = () => { const n = parseInt(location.hash.slice(1), 10); return isNaN(n) ? 0 : n - 1; };
  window.addEventListener('hashchange', () => { const i = fromHash(); if (i !== cur) go(i); });

  // ---------- HUD: прячем при бездействии ----------
  const hud = $('#hud'); let idleT;
  function wake() { hud.classList.remove('idle'); clearTimeout(idleT); idleT = setTimeout(() => { if (!hud.matches(':hover')) hud.classList.add('idle'); }, 3500); }
  ['mousemove', 'touchstart', 'keydown', 'scroll'].forEach(ev => window.addEventListener(ev, wake, { passive: true }));
  hud.addEventListener('mouseleave', wake); wake();

  // ---------- заметки ----------
  const toggleNotes = () => { notes.hidden = !notes.hidden; };
  $('#notes-btn').addEventListener('click', toggleNotes);

  // ---------- полный экран ----------
  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else document.documentElement.requestFullscreen && document.documentElement.requestFullscreen();
  }
  $('#fs-btn').addEventListener('click', toggleFs);

  // ---------- обзор ----------
  const grid = $('#overview-grid');
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
      b.addEventListener('click', () => { closeOverview(); go(i, true); });
      grid.appendChild(b);
    });
    scaleThumbs();
  }
  function scaleThumbs() {
    grid.querySelectorAll('.thumb__box').forEach(box => { const s = box.clientWidth / 1920; box.firstChild.style.transform = 'scale(' + s + ')'; });
  }
  window.addEventListener('resize', () => { if (!ov.hidden) scaleThumbs(); });
  function openOverview() { buildOverview(); ov.hidden = false; document.body.classList.add('locked'); scaleThumbs(); }
  function closeOverview() { ov.hidden = true; document.body.classList.remove('locked'); }
  $('#overview-btn').addEventListener('click', openOverview);
  $('#overview-close').addEventListener('click', closeOverview);

  // ---------- демо-режим ----------
  const dev = $('#demo-device'), dstage = $('#demo-stage');
  const DEV = { phone: [390, 844], tablet: [834, 1112], desktop: [1440, 900] };
  let device = 'phone', frame = null;
  function layoutDemo() {
    if (touch) { dev.className = 'demo__device fill'; dev.style.cssText = ''; return; }
    const [w, h] = DEV[device];
    const bw = w + (device === 'phone' ? 20 : device === 'tablet' ? 24 : 2), bh = h + (device === 'phone' ? 20 : device === 'tablet' ? 24 : 2);
    dev.className = 'demo__device ' + device;
    dev.style.width = w + 'px'; dev.style.height = h + 'px';
    const s = Math.min(1, (dstage.clientWidth - 32) / bw, (dstage.clientHeight - 32) / bh);
    dev.style.transform = 'scale(' + s + ')';
  }
  function openDemo() {
    if (!frame) { frame = document.createElement('iframe'); frame.title = 'Прототип'; frame.src = 'demo.html?embed=1'; dev.appendChild(frame); }
    demo.hidden = false; document.body.classList.add('locked'); layoutDemo();
  }
  function closeDemo() { demo.hidden = true; document.body.classList.remove('locked'); }
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
    else if (k === 'Home') { e.preventDefault(); go(0); }
    else if (k === 'End') { e.preventDefault(); go(N - 1); }
    else if (k === 'f' || k === 'F' || k === 'а') toggleFs();
    else if (k === 'd' || k === 'D' || k === 'в') openDemo();
    else if (k === 'n' || k === 'N' || k === 'т') toggleNotes();
    else if (k === 'o' || k === 'O' || k === 'щ') openOverview();
    else if (k === 'Escape' && !notes.hidden) notes.hidden = true;
  });

  // ---------- старт ----------
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  const start = fromHash();
  if (start > 0) go(start, true);
  sync();
})();
