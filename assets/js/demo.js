/* Mystic Hills — прототип сайта бронирования.
   Чистый JS без зависимостей. Данные о ценах и занятости условные. */
(function () {
  'use strict';

  // ---------- данные ----------
  const IMG = 'assets/img/';
  const PP = IMG + 'houses/';
  const PH = {
    sfera: ['67___2.jpg', '66___7.jpg', '64_024c6010-4c0f-493c-a.jpg', '65____.jpg'],
    'sfera-kupel': ['65____.jpg', '64_024c6010-4c0f-493c-a.jpg', '67___2.jpg', '66___7.jpg'],
    secret: ['69_IMG_3982.jpg', '68_IMG_3990.jpg', '67___2.jpg'],
    kot: ['70_IMG_3572.jpg', '71_IMG_3577.jpg', '65____.jpg'],
    lodzh: ['55_IMG_0435.jpg', '54_IMG_0397.jpg', '62_____3.jpg'],
    'les-lodzh': ['63____.jpg', '62_____3.jpg', '54_IMG_0397.jpg'],
    'villa-sauna': ['56_Awyp5cHy5O58MpLX44Ir.jpg', '57_IMG_1118.jpg', '58_IMG_0880.jpg'],
    villa: ['59_IMG_0512.jpg', '58_IMG_0880.jpg', '57_IMG_1118.jpg'],
    sky: ['61_IMG_1063.jpg', '60_IMG_0590.jpg'],
    dzen: ['24_461A3453.jpg', '53_IMG_1162.jpg', '10_IMG_4477.jpg', '25_461A3445.jpg', '50_461A3483.jpg', '49_461A3480.jpg', '13_IMG_4534.jpg', '14_IMG_4551.jpg'],
    mirror: ['73_IMG_9167.jpg', '72_IMG_7598.jpeg']
  };

  const HOUSES = [
    { id: 'sfera', name: 'Сфера', type: 'Сфера', area: '40 м²', guests: 4, dogs: true, feats: [], romance: false, price: 14000, feat: 'Уютный купольный дом с видом на озеро' },
    { id: 'sfera-kupel', name: 'Сфера с купелью', type: 'Сфера', area: '40 м²', guests: 4, dogs: true, feats: ['kupel'], romance: false, price: 19000, min: 2, feat: 'Купольный дом с видом на озеро и горячей купелью на террасе' },
    { id: 'secret', name: 'Сфера «Секрет» 18+', type: 'Сфера', area: '40 м²', guests: 4, dogs: true, feats: [], romance: true, price: 15000, feat: 'Видовой дом для самых незабываемых романтических свиданий' },
    { id: 'kot', name: 'Сфера «Дом с котом»', type: 'Сфера', area: '40 м²', guests: 4, dogs: true, anyPet: true, feats: [], romance: false, price: 14000, feat: 'Всё для вас и пушистых членов семьи — можно с любым питомцем' },
    { id: 'lodzh', name: 'Видовой лодж с купелью', type: 'Лодж', area: '60+ м²', guests: 6, dogs: true, feats: ['kupel'], romance: false, price: 22000, feat: 'Большой панорамный дом с купелью на террасе' },
    { id: 'les-lodzh', name: 'Лесной лодж с купелью', type: 'Лодж', area: '60+ м²', guests: 6, dogs: true, feats: ['kupel'], romance: false, price: 21000, feat: 'Панорамный дом в глубине леса с купелью на просторной террасе' },
    { id: 'villa-sauna', name: 'Вилла с сауной', type: 'Вилла', area: '30 м²', guests: 4, dogs: true, feats: ['sauna'], romance: false, price: 17000, feat: 'Окно во всю стену и личная панорамная сауна на террасе' },
    { id: 'villa', name: 'Вилла', type: 'Вилла', area: '30 м²', guests: 4, dogs: true, feats: [], romance: false, price: 14000, feat: 'Необычный дом с панорамным окном во всю стену' },
    { id: 'sky', name: 'Космодом Скайхаус', type: 'Скайхаус', area: '34 м²', guests: 4, dogs: true, feats: [], romance: false, price: 16000, feat: 'Зона отдыха на крыше, личная обсерватория и отдельная спальня' },
    { id: 'dzen', name: 'Дзен с видовой ванной', type: 'Дзен', area: '20 м²', guests: 2, dogs: false, feats: ['bath'], romance: true, price: 15000, feat: 'Панорамная ванна у окна с видом на лес' },
    { id: 'mirror', name: 'Зеркальный дом', type: 'Зеркальный дом', area: '20 м²', guests: 2, dogs: false, feats: [], romance: true, price: 16000, feat: 'Зеркальные стены — даже в душе — растворяют дом в лесу' }
  ].map(h => Object.assign(h, { img: PP + PH[h.id][0], gallery: PH[h.id].map(f => PP + f) }));

  const AMEN = {
    'Сфера': [['Большая кровать', 'Для крепкого сна'], ['Терраса с барбекю', 'Уличная мебель, гамак или качели'], ['Пеллетный камин', 'И кондиционер'], ['Мезонин', 'Два дополнительных спальных места'], ['Мини-кухня', 'Чайная станция, холодильник, посуда'], ['Свой санузел', 'Душевая кабина, фен'], ['Панорамное окно', 'Вид на лес и озеро']],
    'Лодж': [['Кровать и диван', 'Большая кровать и раскладной диван'], ['Терраса с купелью', 'Одна растопка входит в стоимость'], ['Пеллетный камин', 'И кондиционер'], ['Мезонин', 'Два дополнительных спальных места'], ['Кухонный уголок', 'Мини-плита, раковина, холодильник'], ['Свой санузел', 'Душевая кабина, фен'], ['Остекление в пол', 'Вид на лес и озеро']],
    'Вилла': [['Окно во всю стену', 'Лес прямо перед кроватью'], ['Крытая веранда', 'Можно сидеть в любую погоду'], ['Свой санузел', 'Душевая кабина, фен'], ['Мини-кухня', 'Чайная станция, холодильник, посуда']],
    'Скайхаус': [['Отдельная спальня', 'Изолированная от гостиной'], ['Полноценная кухня', 'В гостиной'], ['Крыша', 'Зона отдыха и обсерватория'], ['Крытая веранда', 'Можно сидеть в любую погоду']],
    'Дзен': [['Видовая ванна', 'Прямо у панорамного окна'], ['Для двоих', 'Без детей до 7 лет'], ['Свой санузел', 'Душевая, фен']],
    'Зеркальный дом': [['Зеркальные стены', 'Даже в душевой'], ['Терраса', 'С видом на лес'], ['Для двоих', 'Без детей до 7 лет']]
  };

  const EXTRAS = [
    { id: 'banya', name: 'Баня на озере, 2 часа', desc: 'До 6 человек, время согласует администратор', price: 7000 },
    { id: 'samovar', name: 'Самовар на дровах', desc: 'Травяной чай, мёд, варенье, сушки', price: 2000 },
    { id: 'romance', name: 'Романтическое украшение домика', desc: 'Шары, свечи, лепестки роз, сидр и фрукты', price: 3000 },
    { id: 'kupel', name: 'Травы и цитрусы в купель', desc: 'Для домиков с купелью', price: 2000, needs: 'kupel' },
    { id: 'picnic', name: 'Набор для пикника', desc: 'Пледы, посуда, сыры, фрукты, круассаны, сидр', price: 3000 },
    { id: 'projector', name: 'Проектор в домик', desc: '2 000 ₽ в сутки, подключение по HDMI и Wi-Fi', price: 2000, perNight: true },
    { id: 'late', name: 'Поздний заезд 21:00–00:00', desc: 'По согласованию с администратором', price: 1500 }
  ];

  const ACTS = [
    ['Самоварное чаепитие', 'от 1 500 ₽'], ['Иммерсивная прогулка', '1 000 ₽ с человека'], ['Квест по карельским легендам', '1 000 ₽'],
    ['Лодка и сапборд', 'от 300 ₽ за 30 минут'], ['Набор для пикника', '3 000 ₽'], ['Фотозоны', 'Свободно, 10:00–21:00'],
    ['Очки VR', 'от 999 ₽ за 3 часа'], ['Экотропы заказника', '15 минут на машине'], ['Пешие и веломаршруты', 'Велосипед от 400 ₽'],
    ['Настольные игры', 'Бесплатно в ресторане']
  ].map(([name, price], i) => ({ name, price, img: IMG + 'acts/a' + (i + 1) + '.jpg' }));

  const STEPS = ['Даты', 'Домик', 'Гости', 'Дополнения', 'Оплата'];
  const STEP_TITLES = ['Когда приедете?', 'Выберите домик', 'Кто едет?', 'Добавить к отдыху', 'Оплата'];

  // ---------- утилиты ----------
  const DAY = 864e5;
  const dnOf = d => Math.floor(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / DAY);
  const dOf = dn => new Date(dn * DAY);
  const money = n => Math.round(n).toLocaleString('ru-RU').replace(/ |,/g, ' ') + ' ₽';
  const plural = (n, f) => { const a = n % 10, b = n % 100; return f[a === 1 && b !== 11 ? 0 : a >= 2 && a <= 4 && (b < 10 || b >= 20) ? 1 : 2]; };
  const nightsW = n => n + ' ' + plural(n, ['ночь', 'ночи', 'ночей']);
  const shortD = dn => dOf(dn).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', weekday: 'short', timeZone: 'UTC' });
  // детерминированная «занятость»: около 22% дней заняты, чтобы календарь выглядел живым
  const booked = (hid, dn) => { let h = 2166136261; const s = hid + ':' + dn; for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); } return ((h >>> 0) % 100) < 22; };
  const rangeFree = (hid, a, b) => { for (let d = a; d < b; d++) if (booked(hid, d)) return false; return true; };
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const $ = (sel, root) => (root || document).querySelector(sel);

  // ---------- состояние ----------
  const S = {
    screen: null, houseId: null, step: 0, ci: null, co: null,
    adults: 2, kids: 0, kidsBig: 0, dogs: 0,
    fGuests: 0, fTypes: [], fFeats: [], fDogs: false, fRomance: false, fPrice: 0,
    extras: {}, name: '', phone: '', email: '', pay: 'card', agree: true, bookingNo: null, scrolled: false
  };

  // Обработчики кликов: при рендере кладём замыкание в H и ставим data-h="индекс".
  let H = [];
  const on = fn => { H.push(fn); return 'data-h="' + (H.length - 1) + '"'; };

  const set = o => { Object.assign(S, o); render(); };
  const toggleArr = (key, v) => set({ [key]: S[key].includes(v) ? S[key].filter(x => x !== v) : S[key].concat(v) });
  const house = () => HOUSES.find(h => h.id === S.houseId) || null;
  const hasDates = () => S.ci != null && S.co != null;
  const nights = () => hasDates() ? S.co - S.ci : 0;
  const free = h => !hasDates() || (rangeFree(h.id, S.ci, S.co) && nights() >= (h.min || 1));
  const filtered = () => HOUSES.filter(h =>
    (!S.fGuests || h.guests >= S.fGuests) &&
    (!S.fTypes.length || S.fTypes.includes(h.type)) &&
    (!S.fFeats.length || S.fFeats.some(f => h.feats.includes(f))) &&
    (!S.fDogs || h.dogs) && (!S.fRomance || h.romance) && (!S.fPrice || h.price <= S.fPrice));
  const filterCount = () => (S.fGuests ? 1 : 0) + S.fTypes.length + S.fFeats.length + (S.fDogs ? 1 : 0) + (S.fRomance ? 1 : 0) + (S.fPrice ? 1 : 0);
  const guestsLabel = () => { const n = S.adults + S.kids + S.kidsBig; return n + ' ' + plural(n, ['гость', 'гостя', 'гостей']) + (S.dogs ? ' · собака' : ''); };
  const ciLabel = () => S.ci != null ? shortD(S.ci) : 'Выбрать';
  const coLabel = () => S.co != null ? shortD(S.co) : 'Выбрать';

  const scrollToId = id => {
    set({ screen: null });
    setTimeout(() => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64, behavior: 'smooth' }); }, 30);
  };
  const openBooking = houseId => {
    const hid = houseId !== undefined ? houseId : S.houseId;
    const h = HOUSES.find(x => x.id === hid);
    let step = 0;
    if (hasDates()) step = h && rangeFree(h.id, S.ci, S.co) ? 2 : 1;
    set({ screen: 'booking', houseId: hid, step });
  };
  const pickDay = (dn, h) => {
    if (S.ci == null || S.co != null || dn <= S.ci) return set({ ci: dn, co: null });
    if (h && !rangeFree(h.id, S.ci, dn)) return set({ ci: dn, co: null });
    set({ co: dn });
  };

  const extrasAvail = () => { const h = house(); return EXTRAS.filter(x => !x.needs || (h && h.feats.includes(x.needs))); };
  const extraPrice = x => x.perNight ? x.price * Math.max(nights(), 1) : x.price;
  const totals = () => {
    const h = house();
    const lodging = h && hasDates() ? h.price * nights() : 0;
    const ex = extrasAvail().filter(x => S.extras[x.id]).reduce((a, x) => a + extraPrice(x), 0);
    return { lodging, extras: ex, total: lodging + ex };
  };
  const stepValid = () => {
    const h = house(), cap = S.adults + S.kidsBig;
    return [
      hasDates() && (!h || free(h)),
      !!h && free(h) && cap <= h.guests,
      !!h && cap <= h.guests,
      true,
      S.name.trim().length > 1 && S.phone.replace(/\D/g, '').length >= 10 && S.agree
    ][S.step];
  };

  // ---------- рендер: главная ----------
  const chip = (label, isOn, fn, cls) => '<button class="chip' + (isOn ? ' chip--on' : '') + (cls ? ' ' + cls : '') + '" ' + on(fn) + '>' + esc(label) + '</button>';

  function renderHero() {
    $('#hero-ci').textContent = ciLabel();
    $('#hero-co').textContent = coLabel();
    $('#hero-guests').textContent = guestsLabel();
  }

  function renderHouses() {
    const n = nights();
    $('#houses-sub').textContent = hasDates()
      ? 'Цены за ' + nightsW(n) + ', ' + shortD(S.ci) + ' — ' + shortD(S.co) + '. Заезд с 16:00, выезд до 12:00.'
      : 'Сферы, лоджи с купелью, виллы, Скайхаус и зеркальный дом. Выберите даты — покажем свободные.';

    const fc = filterCount();
    $('#chips').innerHTML =
      '<button class="chip chip--main" ' + on(() => set({ screen: 'filters' })) + '>Фильтры' + (fc ? ' <span class="chip__n">' + fc + '</span>' : '') + '</button>' +
      chip('Сферы', S.fTypes.includes('Сфера'), () => toggleArr('fTypes', 'Сфера')) +
      chip('Лоджи', S.fTypes.includes('Лодж'), () => toggleArr('fTypes', 'Лодж')) +
      chip('Виллы', S.fTypes.includes('Вилла'), () => toggleArr('fTypes', 'Вилла')) +
      chip('С купелью', S.fFeats.includes('kupel'), () => toggleArr('fFeats', 'kupel')) +
      chip('С сауной', S.fFeats.includes('sauna'), () => toggleArr('fFeats', 'sauna')) +
      chip('С ванной', S.fFeats.includes('bath'), () => toggleArr('fFeats', 'bath')) +
      chip('С собакой', S.fDogs, () => set({ fDogs: !S.fDogs })) +
      chip('Романтика · 18+', S.fRomance, () => set({ fRomance: !S.fRomance })) +
      chip('6 гостей', S.fGuests === 6, () => set({ fGuests: S.fGuests === 6 ? 0 : 6 }));

    const list = filtered();
    if (!list.length) {
      $('#cards').innerHTML = '<div class="empty"><div class="empty__t">Ничего не нашлось</div><button class="btn btn--ghost" ' + on(resetFilters) + '>Сбросить фильтры</button></div>';
      return;
    }
    $('#cards').innerHTML = '<div class="grid">' + list.map(h => {
      const ok = free(h);
      return '<button class="card' + (ok ? '' : ' card--off') + '" ' + on(() => set({ screen: 'house', houseId: h.id })) + '>' +
        '<div class="card__ph"><img src="' + h.img + '" alt="' + esc(h.name) + '" loading="lazy">' +
        '<div class="card__tags"><span class="tag">' + esc(h.type) + '</span>' + (ok ? '' : '<span class="tag tag--light">Занято на эти даты</span>') + '</div></div>' +
        '<div class="card__body"><div class="card__name">' + esc(h.name) + '</div><div class="card__feat">' + esc(h.feat) + '</div>' +
        '<div class="card__meta">' + [h.area, 'до ' + h.guests + ' гостей', h.dogs ? 'можно с собакой' : 'без животных'].join(' · ') + '</div>' +
        '<div class="price"><b>' + (hasDates() ? money(h.price * n) : 'от ' + money(h.price)) + '</b><span>' + (hasDates() ? 'за ' + nightsW(n) : '/ ночь') + '</span></div></div></button>';
    }).join('') + '</div>';
  }

  function resetFilters() { set({ fGuests: 0, fTypes: [], fFeats: [], fDogs: false, fRomance: false, fPrice: 0 }); }

  function renderBar() {
    const bar = $('#bar');
    const show = !S.screen && S.scrolled;
    bar.hidden = !show;
    if (!show) { bar.innerHTML = ''; return; }
    const hd = hasDates();
    bar.innerHTML = '<div class="bar__in"><button class="bar__txt" ' + on(() => openBooking()) + '><div class="bar__k">' +
      esc(hd ? nightsW(nights()) + ' · ' + guestsLabel() : 'Mystic Hills') + '</div><div class="bar__v">' +
      esc(hd ? shortD(S.ci) + ' — ' + shortD(S.co) : 'Выберите даты заезда') + '</div></button>' +
      '<button class="bar__cta" ' + on(findHouses) + '>' + (hd ? 'Смотреть домики' : 'Даты') + '</button></div>';
  }

  function findHouses() { hasDates() ? scrollToId('houses') : set({ screen: 'booking', step: 0, houseId: null }); }

  // ---------- рендер: экраны ----------
  function renderMenu() {
    const items = [['Домики', 'houses'], ['Баня на озере', 'banya'], ['Развлечения', 'activities'], ['Ресторан', 'cafe'], ['С собаками', 'dogs'], ['Как добраться', 'contacts']]
      .map(([l, id]) => '<button class="menu__item" ' + on(() => scrollToId(id)) + '>' + l + '</button>')
      .concat([['Спецпредложения', 'https://mystic-hills.ru/akcii'], ['Сертификаты', 'https://mystic-hills.ru/sertifikaty']]
        .map(([l, u]) => '<button class="menu__item" ' + on(() => window.open(u, '_blank')) + '>' + l + '</button>'));
    return '<div class="scr scr--menu"><div class="scr__top"><div class="brand">Mystic Hills</div><button class="btn btn--ghost" ' + on(() => set({ screen: null })) + '>Закрыть</button></div>' +
      '<nav class="menu__nav">' + items.join('') + '</nav>' +
      '<div class="menu__foot"><a href="tel:+79313154433" class="menu__phone">+7 931 315-44-33</a><div class="muted small">Бронирование, 10:00–22:00, звонок или MAX</div></div></div>';
  }

  function renderFilters() {
    const g = (title, chips) => '<div class="fgroup"><div class="fgroup__t">' + title + '</div><div class="fgroup__chips">' + chips.join('') + '</div></div>';
    const n = filtered().length;
    return '<div class="sheet-bg" ' + on(() => set({ screen: null })) + '><div class="sheet" data-stop>' +
      '<div class="sheet__head"><div class="sheet__title">Фильтры</div><button class="sheet__reset" ' + on(resetFilters) + '>Сбросить</button></div>' +
      '<div class="sheet__body" data-scroll>' +
      g('Сколько гостей', [[0, 'Любое'], [2, 'от 2'], [4, 'от 4'], [6, '6']].map(([v, l]) => chip(l, S.fGuests === v, () => set({ fGuests: v }), 'chip--tall'))) +
      g('Тип домика', ['Сфера', 'Лодж', 'Вилла', 'Скайхаус', 'Дзен', 'Зеркальный дом'].map(v => chip(v, S.fTypes.includes(v), () => toggleArr('fTypes', v), 'chip--tall'))) +
      g('Купель, сауна, ванна', [['kupel', 'Купель'], ['sauna', 'Сауна'], ['bath', 'Ванна у окна']].map(([v, l]) => chip(l, S.fFeats.includes(v), () => toggleArr('fFeats', v), 'chip--tall'))) +
      g('Цена за ночь', [[0, 'Любая'], [15000, 'до 15 000 ₽'], [18000, 'до 18 000 ₽']].map(([v, l]) => chip(l, S.fPrice === v, () => set({ fPrice: v }), 'chip--tall'))) +
      g('Ещё', [chip('С собакой', S.fDogs, () => set({ fDogs: !S.fDogs }), 'chip--tall'), chip('Романтика · 18+', S.fRomance, () => set({ fRomance: !S.fRomance }), 'chip--tall')]) +
      '</div><div class="sheet__foot"><button class="btn btn--acc btn--xl" ' + on(() => scrollToId('houses')) + '>Показать ' + n + ' ' + plural(n, ['домик', 'домика', 'домиков']) + '</button></div></div></div>';
  }

  function renderHouse() {
    const h = house(); if (!h) return '';
    const ok = free(h), hd = hasDates(), n = nights();
    const chips = [h.area, 'до ' + h.guests + ' гостей', h.anyPet ? 'с любыми питомцами' : h.dogs ? 'можно с собакой' : 'без животных'].concat(h.min ? ['от 2 ночей'] : []);
    const amen = (AMEN[h.type] || []).map(([t, d]) => '<div class="amen__i"><div class="amen__t">' + t + '</div><div class="amen__d">' + d + '</div></div>').join('');
    const pets = h.anyPet ? 'Любые питомцы, 1 500 ₽ за срок' : h.dogs ? 'Собаки, 2 000 ₽ за срок' : 'Без животных';
    return '<div class="scr scr--house">' +
      '<div class="house__head"><div class="house__head-in"><button class="btn btn--ghost" ' + on(() => set({ screen: null })) + '>← Назад</button><div class="house__title">' + esc(h.name) + '</div></div></div>' +
      '<div class="house__scroll" data-scroll>' +
      '<div class="gallery">' + h.gallery.map((src, i) => '<div class="gallery__ph"><img src="' + src + '" alt="' + esc(h.name) + ' · фото ' + (i + 1) + '" loading="lazy"></div>').join('') + '</div>' +
      '<div class="house__body"><div class="house__main">' +
      '<div class="house__intro"><div class="eyebrow">' + esc(h.type) + '</div><h1 class="house__h1">' + esc(h.name) + '</h1><p class="house__feat">' + esc(h.feat) + '</p>' +
      '<div class="pills">' + chips.map(c => '<span class="pill">' + c + '</span>').join('') + '</div></div>' +
      '<div class="house__sec"><h2 class="h3">В домике</h2><div class="amen">' + amen + '</div></div>' +
      '<div class="house__sec"><h2 class="h3">Условия</h2><div class="cond">' +
      '<div class="row"><span class="muted">Заезд / выезд</span><span>с 16:00 / до 12:00</span></div>' +
      '<div class="row"><span class="muted">Поздний заезд</span><span class="r">21:00–00:00 — 1 500 ₽<br>после 00:00 — 2 000 ₽</span></div>' +
      '<div class="row"><span class="muted">Дети до 5 лет</span><span class="r">Бесплатно, без доп. места</span></div>' +
      '<div class="row"><span class="muted">Питомцы</span><span class="r">' + pets + '</span></div></div></div>' +
      '</div><aside class="aside">' +
      '<div class="aside__price"><b>' + (hd && ok ? money(h.price * n) : 'от ' + money(h.price)) + '</b><span>' + (hd && ok ? 'за ' + nightsW(n) : '/ ночь') + '</span></div>' +
      '<button class="dates" ' + on(() => set({ screen: 'booking', step: 0 })) + '><div><div class="dates__k">Заезд</div><div class="dates__v">' + ciLabel() + '</div></div><div><div class="dates__k">Выезд</div><div class="dates__v">' + coLabel() + '</div></div></button>' +
      (hd && !ok ? '<div class="warn">На выбранные даты домик занят — выберите другие</div>' : '') +
      '<button class="btn btn--acc btn--xl" ' + on(() => openBooking(h.id)) + '>' + (hd && ok ? 'Забронировать' : 'Выбрать даты') + '</button>' +
      '<div class="aside__note">До ' + h.guests + ' гостей · ' + h.area + '</div></aside></div></div></div>';
  }

  function renderCalendar() {
    const h = house(), today = dnOf(new Date()), t = dOf(today), hd = hasDates();
    let out = '';
    for (let k = 0; k < 4; k++) {
      const y = t.getUTCFullYear(), m = t.getUTCMonth() + k;
      const first = new Date(Date.UTC(y, m, 1));
      const lead = (first.getUTCDay() + 6) % 7;
      const len = new Date(Date.UTC(y, m + 1, 0)).getUTCDate();
      const firstDn = Math.floor(first.getTime() / DAY);
      let cells = '';
      for (let i = 0; i < lead; i++) cells += '<button class="d d--pad" disabled></button>';
      for (let d = 0; d < len; d++) {
        const dn = firstDn + d, past = dn < today;
        const isB = h && booked(h.id, dn);
        const validCo = S.ci != null && S.co == null && dn > S.ci && (!h || rangeFree(h.id, S.ci, dn));
        const disabled = past || (isB && !validCo);
        const isS = dn === S.ci, isE = dn === S.co, inR = hd && dn > S.ci && dn < S.co;
        const cls = ['d', isS ? 'd--s' : '', isE ? 'd--e' : '', isS && hd ? 'd--range' : '', inR ? 'd--in' : '', isB && !past && !validCo ? 'd--b' : ''].filter(Boolean).join(' ');
        cells += '<button class="' + cls + '"' + (disabled ? ' disabled' : ' ' + on(() => pickDay(dn, h))) + '>' + (d + 1) + '</button>';
      }
      const title = first.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric', timeZone: 'UTC' }).replace(/\s*г\.?$/, '');
      out += '<div class="cal"><div class="cal__m">' + title + '</div><div class="cal__wd"><span>пн</span><span>вт</span><span>ср</span><span>чт</span><span>пт</span><span>сб</span><span>вс</span></div><div class="cal__g">' + cells + '</div></div>';
    }
    return out;
  }

  function renderBooking() {
    const h = house(), hd = hasDates(), n = nights(), cap = S.adults + S.kidsBig;
    const tt = totals();
    let body = '';

    if (S.step === 0) {
      const hint = h ? (h.min ? 'Зачёркнутые даты заняты. В этой сфере — минимум 2 ночи.' : 'Зачёркнутые даты заняты.') : (S.ci != null && S.co == null ? 'Теперь выберите дату выезда' : '');
      body = '<div class="col"><div class="dates"><div><div class="dates__k">Заезд с 16:00</div><div class="dates__v">' + ciLabel() + '</div></div><div><div class="dates__k">Выезд до 12:00</div><div class="dates__v">' + coLabel() + '</div></div></div>' +
        (hint ? '<div class="hint">' + hint + '</div>' : '') + renderCalendar() + '</div>';
    } else if (S.step === 1) {
      const list = HOUSES.map(x => {
        const ok = free(x), fits = cap <= x.guests, can = ok && fits, sel = h && h.id === x.id;
        const note = !ok ? (x.min && n < x.min ? 'Минимум 2 ночи' : 'Занято на эти даты') : !fits ? 'Не поместится ' + cap + ' гостей' : sel ? 'Выбран' : 'Свободно';
        const noteC = can ? (sel ? 'var(--acc)' : '#9fc39a') : 'var(--muted)';
        return { x, can, sel, note, noteC };
      }).sort((a, b) => (b.can ? 1 : 0) - (a.can ? 1 : 0));
      body = '<div class="col" style="gap:12px">' + list.map(({ x, can, sel, note, noteC }) =>
        '<button class="pick' + (sel ? ' pick--sel' : '') + (can ? '' : ' pick--off') + '"' + (can ? ' ' + on(() => set({ houseId: x.id })) : ' disabled') + '>' +
        '<img src="' + x.img + '" alt=""><div class="pick__b"><div class="pick__n">' + esc(x.name) + '</div><div class="pick__m">' + x.area + ' · до ' + x.guests + ' гостей' + (x.dogs ? ' · с собакой' : '') + '</div><div class="pick__note" style="color:' + noteC + '">' + note + '</div></div>' +
        '<div class="pick__p"><b>' + money(x.price * Math.max(n, 1)) + '</b><div>' + (n ? 'за ' + nightsW(n) : 'за ночь') + '</div></div></button>').join('') + '</div>';
    } else if (S.step === 2) {
      const maxCap = h ? h.guests : 6, dogsOk = !h || h.dogs;
      const stp = (label, sub, key, min, maxOk, dis) => '<div class="stp"><div class="stp__t"><div class="stp__l">' + label + '</div><div class="stp__s">' + sub + '</div></div><div class="stp__c' + (dis ? ' off' : '') + '">' +
        '<button class="stp__b" ' + on(() => !dis && S[key] > min && set({ [key]: S[key] - 1 })) + '>−</button><span class="stp__v">' + S[key] + '</span>' +
        '<button class="stp__b" ' + on(() => !dis && maxOk && set({ [key]: S[key] + 1 })) + '>+</button></div></div>';
      body = '<div class="col" style="gap:0">' +
        stp('Взрослые', 'От 18 лет', 'adults', 1, cap < maxCap, false) +
        stp('Дети от 5 лет', 'С отдельным спальным местом', 'kidsBig', 0, cap < maxCap, false) +
        stp('Дети до 5 лет', 'Бесплатно, без доп. места', 'kids', 0, S.kids < 3, false) +
        stp(h && h.anyPet ? 'Питомцы' : 'Собаки', dogsOk ? (h && h.anyPet ? '1 500 ₽ за срок, оплата на месте' : '2 000 ₽ за срок, оплата на месте') : 'В этом домике без животных', 'dogs', 0, S.dogs < 2, !dogsOk) +
        '<div class="hint" style="padding-top:16px">' + (h ? esc(h.name) + ': до ' + h.guests + ' гостей. Дети до 5 лет не учитываются.' : 'Дети до 5 лет не учитываются в вместимости.') + '</div></div>';
    } else if (S.step === 3) {
      body = '<div class="col" style="gap:10px">' + extrasAvail().map(x => { const isOn = !!S.extras[x.id]; return '<button class="ext' + (isOn ? ' ext--on' : '') + '" ' + on(() => set({ extras: Object.assign({}, S.extras, { [x.id]: !S.extras[x.id] }) })) + '>' +
        '<span class="cb' + (isOn ? ' cb--on' : '') + '">' + (isOn ? '✓' : '') + '</span><div class="ext__b"><div class="ext__n">' + x.name + '</div><div class="ext__d">' + x.desc + '</div></div><div class="ext__p">' + money(extraPrice(x)) + '</div></button>'; }).join('') + '</div>';
    } else if (S.step === 4) {
      const petFee = S.dogs && (!h || h.dogs) ? S.dogs * (h && h.anyPet ? 1500 : 2000) : 0;
      const rows = [['Проживание, ' + nightsW(n), money(tt.lodging)], ['Гости', guestsLabel()]].concat(extrasAvail().filter(x => S.extras[x.id]).map(x => [x.name, money(extraPrice(x))]));
      body = '<div class="col" style="gap:24px">' +
        '<div class="sum"><div class="sum__h"><img src="' + (h ? h.img : '') + '" alt=""><div><div class="sum__n">' + esc(h ? h.name : '') + '</div><div class="muted small">' + (hd ? shortD(S.ci) + ' — ' + shortD(S.co) + ' · ' + nightsW(n) : '') + '</div></div></div>' +
        rows.map(([k, v]) => '<div class="sum__r"><span>' + k + '</span><span>' + v + '</span></div>').join('') +
        '<div class="sum__t"><span>Итого</span><span>' + money(tt.total) + '</span></div>' +
        (petFee ? '<div class="muted small">Размещение питомца ' + money(petFee) + ' оплачивается при заселении</div>' : '') + '</div>' +
        '<div class="fld"><div class="fld__t">Контакты</div>' +
        '<input class="inp" data-in="name" value="' + esc(S.name) + '" placeholder="Имя и фамилия" autocomplete="name">' +
        '<input class="inp" data-in="phone" value="' + esc(S.phone) + '" placeholder="Телефон" inputmode="tel" autocomplete="tel">' +
        '<input class="inp" data-in="email" value="' + esc(S.email) + '" placeholder="Эл. почта для подтверждения" inputmode="email" autocomplete="email"></div>' +
        '<div class="fld"><div class="fld__t">Способ оплаты</div><div class="fgroup__chips">' + [['card', 'Картой онлайн'], ['sbp', 'СБП']].map(([v, l]) => chip(l, S.pay === v, () => set({ pay: v }), 'chip--tall')).join('') + '</div></div>' +
        '<button class="agree" ' + on(e => { if (e.target.tagName !== 'A') set({ agree: !S.agree }); }) + '><span class="cb' + (S.agree ? ' cb--on' : '') + '">' + (S.agree ? '✓' : '') + '</span><span>Согласен с <a href="https://mystic-hills.ru/pravila" target="_blank" rel="noopener">правилами пребывания</a> и <a href="https://mystic-hills.ru/oferta" target="_blank" rel="noopener">договором оферты</a></span></button></div>';
    } else {
      body = '<div class="done"><div class="done__ok">✓</div><h2 class="done__h">Ждём вас в лесу</h2>' +
        '<p class="p" style="max-width:44ch">Бронь ' + S.bookingNo + ' оплачена. Подтверждение и схему проезда отправили на ' + esc(S.email || 'вашу почту') + '.</p>' +
        '<div class="done__box"><div class="sum__n">' + esc(h ? h.name : '') + '</div><div class="muted">' + (hd ? shortD(S.ci) + ' — ' + shortD(S.co) + ' · ' + nightsW(n) : '') + '</div><div class="muted">Заезд с 16:00 · ресепшен до 21:00</div></div>' +
        '<div class="actions"><a href="https://yandex.ru/maps/?pt=29.639365,60.638255&z=13&l=map" target="_blank" rel="noopener" class="btn btn--acc btn--lg">Маршрут</a>' +
        '<button class="btn btn--ghost btn--lg" ' + on(() => set({ screen: null, step: 0, extras: {}, bookingNo: null })) + '>На главную</button></div></div>';
    }

    let footTop = 'Выберите даты', footBottom = '—';
    if (hd) { footTop = shortD(S.ci) + ' — ' + shortD(S.co); footBottom = nightsW(n); }
    if (h && hd) { footTop = h.name + ' · ' + nightsW(n); footBottom = money(tt.total); }
    const notDone = S.step < 5, valid = stepValid();

    return '<div class="scr scr--booking">' +
      '<div class="bk__head"><div class="bk__head-in"><div class="bk__row"><div><div class="bk__step">' + (notDone ? 'Шаг ' + (S.step + 1) + ' из 5 · ' + STEPS[S.step] : 'Бронирование') + '</div><div class="bk__title">' + (notDone ? STEP_TITLES[S.step] : 'Готово') + '</div></div>' +
      '<button class="btn btn--ghost" ' + on(() => set({ screen: null })) + '>Закрыть</button></div>' +
      (notDone ? '<div class="bk__bars">' + STEPS.map((_, i) => '<span' + (i <= S.step ? ' class="on"' : '') + '></span>').join('') + '</div>' : '') + '</div></div>' +
      '<div class="bk__scroll" data-scroll><div class="bk__body">' + body + '</div></div>' +
      (notDone ? '<div class="bk__foot"><div class="bk__foot-in"><div class="bk__sum"><div class="bk__sum-k">' + esc(footTop) + '</div><div class="bk__sum-v">' + esc(footBottom) + '</div></div>' +
        (S.step > 0 ? '<button class="bk__back" ' + on(() => set({ step: Math.max(0, S.step - 1) })) + '>Назад</button>' : '') +
        '<button id="bk-next" class="bk__next' + (valid ? '' : ' btn--dis') + '" ' + on(next) + '>' + (S.step === 4 ? 'Оплатить' : 'Далее') + '</button></div></div>' : '') +
      '</div>';
  }

  function next() {
    if (!stepValid()) return;
    if (S.step === 4) set({ step: 5, bookingNo: 'MH-' + (1000 + Math.floor(Math.random() * 9000)) });
    else set({ step: S.step + 1 });
  }

  // ---------- общий рендер ----------
  let lastScreen = null;
  function render() {
    H = [];
    renderHero();
    renderHouses();
    renderBar();
    const ov = $('#overlay');
    const prevScroll = ov.querySelector('[data-scroll]');
    const top = prevScroll && lastScreen === S.screen ? prevScroll.scrollTop : 0;
    ov.innerHTML = S.screen === 'menu' ? renderMenu() : S.screen === 'filters' ? renderFilters() : S.screen === 'house' ? renderHouse() : S.screen === 'booking' ? renderBooking() : '';
    const sc = ov.querySelector('[data-scroll]');
    if (sc && top) sc.scrollTop = top;
    lastScreen = S.screen;
    document.body.classList.toggle('locked', !!S.screen);
  }

  // клики: делегирование по data-h; data-stop останавливает всплытие до фона
  document.addEventListener('click', e => {
    // внешние ссылки — только в новой вкладке, чтобы не уводить прототип (и рамку в презентации) на чужой сайт
    const ext = e.target.closest('a[href^="http"]');
    if (ext) { ext.target = '_blank'; ext.rel = 'noopener'; }
    let n = e.target;
    while (n && n !== document) {
      if (n.dataset) {
        if (n.dataset.h !== undefined) { const fn = H[+n.dataset.h]; if (fn) fn(e); return; }
        if (n.dataset.stop !== undefined) return;
        if (n.dataset.act) { e.preventDefault(); ACT[n.dataset.act](e); return; }
      }
      n = n.parentNode;
    }
  });
  const ACT = {
    goTop: () => window.scrollTo({ top: 0, behavior: 'smooth' }),
    openMenu: () => set({ screen: 'menu' }),
    openFilters: () => set({ screen: 'filters' }),
    openBookingEmpty: () => openBooking(),
    findHouses
  };
  // поля формы: обновляем состояние без перерисовки, чтобы не терять фокус
  document.addEventListener('input', e => {
    const k = e.target.dataset && e.target.dataset.in;
    if (!k) return;
    S[k] = e.target.value;
    const b = $('#bk-next'); if (b) b.classList.toggle('btn--dis', !stepValid());
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && S.screen) set({ screen: null }); });
  window.addEventListener('scroll', () => { const v = window.scrollY > window.innerHeight * 0.75; if (v !== S.scrolled) { S.scrolled = v; renderBar(); } }, { passive: true });

  // ---------- старт ----------
  $('#acts').innerHTML = '<div class="rail__pad"></div>' + ACTS.map(a => '<div class="act"><div class="act__ph"><img src="' + a.img + '" alt="' + esc(a.name) + '" loading="lazy"></div><div><div class="act__n">' + a.name + '</div><div class="act__p">' + a.price + '</div></div></div>').join('') + '<div class="rail__pad"></div>';

  // На телефоне один раз, когда лента «Чем заняться» появляется на экране, слегка качаем её:
  // подсказка, что она листается вбок. Касание отменяет анимацию.
  function hintScroll() {
    const el = $('#acts');
    if (window.innerWidth > 720 || !('IntersectionObserver' in window) || document.documentElement.classList.contains('still')) return;
    let hinted = false;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting || hinted) return;
      hinted = true; io.disconnect();
      if (el.scrollLeft > 0) return;
      const stop = () => { el.removeEventListener('touchstart', stop); clearTimeout(t1); clearTimeout(t2); };
      el.addEventListener('touchstart', stop, { passive: true });
      const t1 = setTimeout(() => { el.style.scrollSnapType = 'none'; el.scrollTo({ left: 56, behavior: 'smooth' }); }, 350);
      const t2 = setTimeout(() => { el.scrollTo({ left: 0, behavior: 'smooth' }); setTimeout(() => { el.style.scrollSnapType = ''; }, 500); stop(); }, 1000);
    }, { threshold: 0.6 });
    io.observe(el);
  }
  setTimeout(hintScroll, 300);

  const q = new URLSearchParams(location.search);
  const embedded = window.self !== window.top || q.get('embed');
  if (!embedded) $('#demo-strip').hidden = false;
  // still=1 — экран внутри презентации на телефоне: показываем без возможности прокрутки
  if (q.get('still')) document.documentElement.classList.add('still');

  // Глубокие ссылки для презентации:
  // ?view=booking|house|filters|menu&step=N&house=id&dates=1&extras=1&name=1&no=1&scroll=sectionId
  if (q.get('view') || q.get('scroll')) {
    const today = dnOf(new Date());
    if (q.get('house')) S.houseId = q.get('house');
    if (q.get('dates')) {
      let ci = today + 12; const h = house();
      if (h) while (!rangeFree(h.id, ci, ci + 2) && ci < today + 120) ci++;
      S.ci = ci; S.co = ci + 2;
    }
    if (q.get('view')) S.screen = q.get('view');
    if (q.get('step')) S.step = +q.get('step');
    if (q.get('name')) { S.name = 'Анна Петрова'; S.phone = '+7 921 000-00-00'; S.email = 'anna@mail.ru'; }
    if (q.get('extras')) S.extras = { banya: true, samovar: true };
    if (q.get('no')) S.bookingNo = 'MH-4821';
    const id = q.get('scroll');
    if (id) setTimeout(() => { const el = document.getElementById(id); if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 64 }); }, 400);
  }
  render();
})();
