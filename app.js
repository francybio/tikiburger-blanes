/* ==========================================================
   TIKIBURGER — interacciones
   Máscara tiki que sigue el puntero con los ojos y parpadea;
   burgers dibujadas capa a capa según su receta (caen al
   entrar y se vuelven a montar al tocarlas); tragaperras tiki
   que elige burger, tapa y cóctel con la cuenta; volcán de
   lava al tocar el Tiki Volcano XXL.
   ========================================================== */
(() => {
'use strict';

const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const STATIC = /[?&]static\b/.test(location.search);
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches || STATIC;
const hasGSAP = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
const motion = hasGSAP && !reduced;
if (hasGSAP) gsap.registerPlugin(ScrollTrigger);
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
document.documentElement.classList.add('js');
if (!motion) document.documentElement.classList.add('no-motion');
const play = (v) => { if (!v) return; const p = v.play(); if (p) p.catch(() => {}); };
const IMG = (f) => 'assets/img/' + f;

/* ---------------- idiomas ---------------- */
const I18N = window.TK_I18N || { langs: [{ c: 'es', n: 'Castellano', loc: 'es-ES' }], ui: { es: {} } };
const CARTA = window.TK_CARTA || { burgers: [], tapes: [], entrepans: [], postres: [], extres: [], coctels: [], combinats: [] };
const LANGS = I18N.langs, CODES = LANGS.map((l) => l.c), LANG_KEY = 'tikiburger-lang';
const store = { get: (k) => { try { return localStorage.getItem(k); } catch (e) { return null; } }, set: (k, v) => { try { localStorage.setItem(k, v); } catch (e) {} } };
let lang = [new URLSearchParams(location.search).get('lang'), store.get(LANG_KEY)].find((c) => CODES.includes(c)) || 'es';
const t = (k, vars) => { let s = (I18N.ui[lang] && I18N.ui[lang][k]) ?? (I18N.ui.es && I18N.ui.es[k]) ?? k; if (vars) for (const v in vars) s = s.split('{' + v + '}').join(vars[v]); return s; };
const loc = () => (LANGS.find((l) => l.c === lang) || LANGS[0]).loc;
const money = (v) => new Intl.NumberFormat(loc(), { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 }).format(v);
const LI = () => ({ ca: 0, es: 1, en: 2, fr: 3 })[lang] ?? 1;
const onLang = [];
let refreshT = 0;
const refreshSoon = () => { if (!hasGSAP) return; clearTimeout(refreshT); refreshT = setTimeout(() => ScrollTrigger.refresh(), 200); };
function paintSwitches() {
  const cur = LANGS.find((l) => l.c === lang);
  $$('[data-lang-switch]').forEach((box) => { box.innerHTML = `<button class="lang__btn" type="button" aria-expanded="false" aria-label="${t('lang.change')} (${cur.n})"><i class="ph-bold ph-globe-simple" aria-hidden="true"></i><span>${cur.c.toUpperCase()}</span><i class="ph-bold ph-caret-down" aria-hidden="true"></i></button><ul class="lang__menu" hidden>${LANGS.map((l) => `<li><button type="button" lang="${l.c}" data-set-lang="${l.c}"${l.c === lang ? ' aria-current="true"' : ''}><b>${l.c.toUpperCase()}</b>${l.n}</button></li>`).join('')}</ul>`; });
  $$('[data-lang-list]').forEach((box) => { box.innerHTML = `<span>${t('lang.label')}</span>` + LANGS.map((l) => `<button type="button" lang="${l.c}" data-set-lang="${l.c}"${l.c === lang ? ' aria-current="true"' : ''}>${l.n}</button>`).join(''); });
}
function applyLang() {
  document.documentElement.lang = lang; document.title = t('meta.title');
  const md = $('#metaDesc'); if (md) md.setAttribute('content', t('meta.desc'));
  $$('[data-i18n]').forEach((el) => { el.innerHTML = t(el.dataset.i18n); });
  $$('[data-i18n-attr]').forEach((el) => el.dataset.i18nAttr.split(';').forEach((p) => { const [a, k] = p.split(':'); if (a && k) el.setAttribute(a.trim(), t(k.trim())); }));
  paintSwitches(); onLang.forEach((f) => f());
}
function setLang(c) { if (!CODES.includes(c) || c === lang) return; lang = c; store.set(LANG_KEY, c); try { const u = new URL(location.href); if (c === 'es') u.searchParams.delete('lang'); else u.searchParams.set('lang', c); history.replaceState(history.state, '', u); } catch (e) {} applyLang(); refreshSoon(); }
const closeLangMenus = () => $$('.lang__menu:not([hidden])').forEach((m) => { m.hidden = true; m.previousElementSibling.setAttribute('aria-expanded', 'false'); });
document.addEventListener('click', (e) => {
  const sw = e.target.closest('.lang__btn');
  if (sw) { const m = sw.nextElementSibling, open = m.hidden; closeLangMenus(); m.hidden = !open; sw.setAttribute('aria-expanded', String(open)); if (open) { const c = m.querySelector('[aria-current]'); if (c) c.focus(); } return; }
  const set = e.target.closest('[data-set-lang]');
  if (set) { const box = set.closest('[data-lang-switch]'); closeLangMenus(); setLang(set.dataset.setLang); if (box) { const b = box.querySelector('.lang__btn'); if (b) b.focus(); } return; }
  if (!e.target.closest('.lang__menu')) closeLangMenus();
});
document.addEventListener('keydown', (e) => { const m = $('.lang__menu:not([hidden])'); if (!m) return; const items = $$('button', m), i = items.indexOf(document.activeElement); if (e.key === 'Escape') { closeLangMenus(); m.previousElementSibling.focus(); } if (e.key === 'ArrowDown' || e.key === 'ArrowUp') { e.preventDefault(); items[(i + (e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length].focus(); } });
document.addEventListener('focusin', (e) => { const m = $('.lang__menu:not([hidden])'); if (m && !m.parentNode.contains(e.target)) closeLangMenus(); });

/* ---------------- horario (Google, temporada) · 0 = domingo; minutos > 1440 = pasada la medianoche ---------------- */
const HOURS = { 0: [[1080, 1410]], 1: [[1080, 1410]], 2: null, 3: null, 4: [[1080, 1410]], 5: [[1080, 1500]], 6: [[720, 1560]] };
const hm = (m) => `${Math.floor(m / 60) % 24}:${String(m % 60).padStart(2, '0')}`;
const madrid = () => { try { const p = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Madrid', weekday: 'short', hour: '2-digit', minute: '2-digit', hour12: false }).formatToParts(new Date()); const g = (k) => (p.find((x) => x.type === k) || {}).value; return { wd: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(g('weekday')), m: (+g('hour') % 24) * 60 + +g('minute') }; } catch (e) { const d = new Date(); return { wd: d.getDay(), m: d.getHours() * 60 + d.getMinutes() }; } };
const dayName = (wd) => new Intl.DateTimeFormat(loc(), { weekday: 'long' }).format(new Date(2026, 9, 18 + wd, 12));
function paintLive() {
  const { wd, m } = madrid();
  const prev = HOURS[(wd + 6) % 7] || [], today = HOURS[wd] || [];
  let cur = prev.find(([, b]) => b > 1440 && m + 1440 < b);
  if (cur) cur = [cur[0], cur[1]]; else cur = today.find(([a, b]) => m >= a && m < b);
  let txt;
  if (cur) txt = t('live.open', { h: hm(cur[1]) });
  else {
    const later = today.find(([a]) => m < a);
    if (later) txt = t('live.closed', { when: t('live.today'), h: hm(later[0]) });
    else for (let i = 1; i <= 7; i++) { const d = (wd + i) % 7; if (HOURS[d]) { txt = t('live.closed', { when: i === 1 ? t('live.tomorrow') : t('live.on', { d: dayName(d) }), h: hm(HOURS[d][0][0]) }); break; } }
  }
  $$('[data-live]').forEach((el) => { el.classList.toggle('is-open', !!cur); el.classList.toggle('is-closed', !cur); const s = $('[data-live-text]', el); if (s) s.textContent = txt; });
}
function paintHours() {
  const ul = $('#hoursList'); if (!ul) return; const { wd } = madrid();
  ul.innerHTML = [1, 2, 3, 4, 5, 6, 0].map((d) => { const h = HOURS[d]; return `<li class="${d === wd ? 'is-today' : ''} ${h ? '' : 'is-off'}"><span>${dayName(d)}${d === wd ? `<small>${t('vis.today')}</small>` : ''}</span><span>${h ? h.map(([a, b]) => hm(a) + ' – ' + hm(b)).join(' · ') : t('vis.closed')}</span></li>`; }).join('');
}
onLang.push(paintLive, paintHours); setInterval(paintLive, 60000);

/* ---------------- cabecera ---------------- */
const nav = $('#nav'), burgerBtn = $('#burgerBtn'), drawer = $('#drawer');
let lenis = null;
if (motion && typeof window.Lenis !== 'undefined') { lenis = new Lenis({ lerp: 0.11, smoothWheel: true }); lenis.on('scroll', ScrollTrigger.update); gsap.ticker.add((time) => lenis.raf(time * 1000)); gsap.ticker.lagSmoothing(0); }
const goTo = (sel) => { const el = $(sel); if (!el) return; if (lenis) lenis.scrollTo(el, { offset: -60, duration: 1.2 }); else el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth' }); };
const toggleDrawer = (open) => { drawer.classList.toggle('is-open', open); burgerBtn.setAttribute('aria-expanded', String(open)); document.body.classList.toggle('is-locked', open); if (lenis) open ? lenis.stop() : lenis.start(); };
burgerBtn.addEventListener('click', () => toggleDrawer(!drawer.classList.contains('is-open')));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && drawer.classList.contains('is-open')) { toggleDrawer(false); burgerBtn.focus(); } });
$$('a[href^="#"]').forEach((a) => a.addEventListener('click', (e) => { const id = a.getAttribute('href'); if (id.length < 2) return; e.preventDefault(); toggleDrawer(false); goTo(id); history.replaceState(history.state, '', id); }));
let lastY = 0;
addEventListener('scroll', () => { const y = scrollY; nav.classList.toggle('is-solid', y > 40); nav.classList.toggle('is-hidden', y > lastY && y > 700 && !drawer.classList.contains('is-open')); lastY = y; }, { passive: true });
const navLinks = $$('.nav__links a');
if ('IntersectionObserver' in window) { const io = new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle('is-on', a.getAttribute('href') === '#' + en.target.id)); }), { rootMargin: '-45% 0px -50% 0px' }); $$('main section[id]').forEach((s) => io.observe(s)); }

/* ---------------- el tiki que mira ---------------- */
const pupils = [$('#pupilL'), $('#pupilR')], eyes = [[150, 225], [250, 225]], tikiSvg = $('#tiki svg');
let look = { x: 0, y: 0, tx: 0, ty: 0 };
addEventListener('pointermove', (e) => {
  if (!tikiSvg) return; const b = tikiSvg.getBoundingClientRect();
  const cx = b.left + b.width / 2, cy = b.top + b.height * 0.47;
  const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy) || 1, k = Math.min(1, d / 300);
  look.tx = dx / d * 15 * k; look.ty = dy / d * 15 * k;
}, { passive: true });
function lookLoop() {
  look.x += (look.tx - look.x) * 0.15; look.y += (look.ty - look.y) * 0.15;
  pupils.forEach((p, i) => { if (p) { p.setAttribute('cx', (eyes[i][0] + look.x).toFixed(1)); p.setAttribute('cy', (eyes[i][1] + look.y).toFixed(1)); } });
  if (!STATIC) requestAnimationFrame(lookLoop);
}
if (!reduced) requestAnimationFrame(lookLoop);
if (motion) {
  const blink = () => { gsap.to('.tiki__white', { scaleY: 0.08, transformOrigin: '50% 50%', duration: 0.08, yoyo: true, repeat: 1, onStart: () => pupils.forEach((p) => p && gsap.to(p, { opacity: 0, duration: 0.06, yoyo: true, repeat: 1 })) }); gsap.delayedCall(2.5 + Math.random() * 4, blink); };
  gsap.delayedCall(3, blink);
}

/* ---------------- burgers capa a capa ---------------- */
function stackHTML(b) { return b.L.map((l, i) => `<div class="ly ly--${l}" style="--drop:${-60 - i * 18}px" title="${t('ly.' + l)}"></div>`).join(''); }
function paintBurgers() {
  $('#bgrid').innerHTML = CARTA.burgers.map((b, i) => {
    const uniq = [...new Set(b.L.filter((l) => !['bun', 'top', 'vbun', 'vtop'].includes(l)))];
    return `<button class="bcard" type="button" data-b="${i}" aria-label="${b.n} · ${money(b.p)} — ${t('bu.build')}">
      <span class="bcard__p">${money(b.p)}</span>
      <span class="bcard__stack" aria-hidden="true">${stackHTML(b)}</span>
      <span class="bcard__n">${b.n}</span>
      <span class="bcard__d">${b.d[lang] || b.d.es}</span>
      <span class="bcard__layers">${uniq.map((l) => `<span>${t('ly.' + l)}</span>`).join('')}</span></button>`;
  }).join('');
  refreshSoon();
}
function build(card, delay = 0) {
  if (!motion) return;
  const layers = $$('.ly', card);
  gsap.fromTo(layers, { y: (i) => -90 - i * 26, opacity: 0, rotate: () => (Math.random() - 0.5) * 16 }, { y: 0, opacity: 1, rotate: 0, duration: 0.55, stagger: 0.07, ease: 'bounce.out', delay, overwrite: true });
}
document.addEventListener('click', (e) => { const c = e.target.closest('.bcard'); if (c) build(c); });
onLang.push(paintBurgers);

/* ---------------- tragaperras ---------------- */
const REELS = [
  CARTA.burgers.map((b) => ({ n: b.n, p: b.p, i: '🍔' })),
  CARTA.tapes.map((x) => ({ n: x, p: x[4], i: '🍟' })),
  CARTA.coctels.map((c) => ({ n: c.n, p: c.p, i: c.xxl ? '🌋' : '🍹', xxl: !!c.xxl }))
];
const itemName = (it) => Array.isArray(it.n) ? it.n[LI()] : it.n;
const REP = 6; // vueltas de tira
const reelPos = [0, 0, 0];
function paintReels() {
  $$('.reel').forEach((reel, r) => {
    const items = REELS[r], strip = $('.reel__strip', reel);
    let html = ''; for (let k = 0; k < REP; k++) html += items.map((it) => `<div class="cell"><i aria-hidden="true">${it.i}</i><b>${itemName(it)}</b><span>${money(it.p)}</span></div>`).join('');
    strip.innerHTML = html;
    strip.style.transform = `translateY(${-reelPos[r] * cellH()}px)`;
  });
}
const cellH = () => { const c = $('.cell'); return c ? c.offsetHeight : 150; };
let spinning = false, lastResult = null;
function spin() {
  if (spinning) return; spinning = true;
  const machine = $('.machine'); machine.classList.add('is-spin');
  const lever = $('#lever'); lever.classList.add('is-down'); setTimeout(() => lever.classList.remove('is-down'), 350);
  $('#slotMsg').textContent = '…'; $('#slotTotal').textContent = '';
  const res = REELS.map((items) => Math.floor(Math.random() * items.length));
  const H = cellH();
  let done = 0;
  $$('.reel__strip').forEach((strip, r) => {
    const n = REELS[r].length, target = (REP - 1) * n + res[r];
    const finish = () => { reelPos[r] = res[r]; strip.style.transform = `translateY(${-res[r] * H}px)`; if (++done === 3) end(res); };
    if (!motion) { finish(); return; }
    gsap.fromTo(strip, { y: -reelPos[r] * H }, { y: -target * H, duration: 1.4 + r * 0.45, ease: 'power3.out', onComplete: () => { gsap.set(strip, { y: -res[r] * H }); finish(); } });
  });
}
function end(res) {
  spinning = false; $('.machine').classList.remove('is-spin');
  lastResult = res; paintResult();
  if (REELS[2][res[2]].xxl) erupt();
}
function paintResult() {
  if (!lastResult) { $('#slotMsg').textContent = t('sl.idle'); $('#slotTotal').textContent = ''; return; }
  const picks = lastResult.map((k, r) => REELS[r][k]);
  const total = picks.reduce((a, b) => a + b.p, 0);
  $('#slotMsg').textContent = picks[2].xxl ? t('sl.jackpot') : picks.map(itemName).join(' + ');
  $('#slotTotal').textContent = `${t('sl.total')}: ${money(total)}`;
  $('#leverBtn span').textContent = t('sl.again');
}
$('#lever').addEventListener('click', spin);
$('#leverBtn').addEventListener('click', spin);
onLang.push(() => { paintReels(); if (lastResult) paintResult(); });

/* ---------------- carta ---------------- */
function paintCards() {
  const card = (key, cls, rows, sub) => `<div class="card ${cls}"><h3 class="card__h">${t(key)}${sub ? `<small>${sub}</small>` : ''}</h3>${rows.map((x) => `<div class="row"><b>${x[LI()]}</b><span>${money(x[4])}</span>${lang !== 'ca' ? `<small lang="ca">${x[0]}</small>` : `<small lang="es">${x[1]}</small>`}</div>`).join('')}</div>`;
  $('#cards').innerHTML = card('ca.tapes', 'card--a', CARTA.tapes) + card('ca.entrepans', 'card--b', CARTA.entrepans) + card('ca.postres', 'card--c', CARTA.postres) + card('ca.extres', 'card--d', CARTA.extres);
  refreshSoon();
}
onLang.push(paintCards);

/* ---------------- cócteles y volcán ---------------- */
function paintGlasses() {
  $('#glasses').innerHTML = CARTA.coctels.map((c, i) => `<button class="glass${c.xxl ? ' glass--xxl' : ''}" type="button" data-glass="${i}" style="--c1:${c.c[0]};--c2:${c.c[1]}"><span class="glass__cup" aria-hidden="true"></span><b>${c.n}</b><span>${money(c.p)}</span>${c.xxl ? `<small>${t('co.volcano')}</small>` : ''}</button>`).join('');
  $('#combi').innerHTML = CARTA.combinats.map((x) => `<li><b>${x[LI()]}</b><span>${money(x[4])}</span></li>`).join('');
}
onLang.push(paintGlasses);
const lava = $('#lava'), lx = lava ? lava.getContext('2d') : null;
const LV = { p: [], run: false, last: 0 };
function erupt(x0) {
  if (!lx || reduced) return;
  const sec = $('#coctels').getBoundingClientRect(), d = Math.min(2, devicePixelRatio || 1);
  lava.width = Math.round(sec.width * d); lava.height = Math.round(sec.height * d);
  const g = $('.glass--xxl'), gb = g ? g.getBoundingClientRect() : null;
  const sx = gb ? gb.left + gb.width / 2 - sec.left : x0 - sec.left, sy = gb ? gb.top - sec.top + 20 : sec.height * 0.6;
  for (let i = 0; i < 160; i++) { const a = -Math.PI / 2 + (Math.random() - 0.5) * 1.2, v = 300 + Math.random() * 520; LV.p.push({ x: sx, y: sy, vx: Math.cos(a) * v, vy: Math.sin(a) * v, r: 3 + Math.random() * 7, t: 0, life: 1.4 + Math.random() * 1.2, c: Math.random() }); }
  if (!LV.run) { LV.run = true; LV.last = performance.now(); requestAnimationFrame(lavaLoop); }
}
function lavaLoop(now) {
  const dt = clamp((now - LV.last) / 1000, 0.001, 0.04); LV.last = now;
  const d = Math.min(2, devicePixelRatio || 1);
  lx.setTransform(d, 0, 0, d, 0, 0); lx.clearRect(0, 0, lava.width, lava.height);
  lx.globalCompositeOperation = 'lighter';
  LV.p = LV.p.filter((p) => { p.t += dt; p.vy += 700 * dt; p.x += p.vx * dt; p.y += p.vy * dt; const a = clamp(1 - p.t / p.life, 0, 1); if (!a) return false; const gr = lx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 2.2); gr.addColorStop(0, `rgba(255,${200 + p.c * 50 | 0},120,${a})`); gr.addColorStop(0.4, `rgba(255,${90 + p.c * 60 | 0},20,${a * 0.8})`); gr.addColorStop(1, 'rgba(200,30,0,0)'); lx.fillStyle = gr; lx.beginPath(); lx.arc(p.x, p.y, p.r * 2.2, 0, 7); lx.fill(); return true; });
  lx.globalCompositeOperation = 'source-over';
  if (LV.p.length) requestAnimationFrame(lavaLoop); else { LV.run = false; lx.clearRect(0, 0, lava.width, lava.height); }
}
document.addEventListener('click', (e) => {
  const g = e.target.closest('[data-glass]'); if (!g) return;
  const c = CARTA.coctels[+g.dataset.glass];
  if (c.xxl) erupt(); else if (motion) gsap.fromTo($('.glass__cup', g), { rotate: -14 }, { rotate: 0, duration: 0.8, ease: 'elastic.out(1, .3)' });
});

/* ---------------- fotos ---------------- */
const STRIP = [['burger-ou.jpg', 'cap.burger'], ['trufada.jpg', 'cap.trufada'], ['chicken.jpg', 'cap.chicken'], ['texas.jpg', 'cap.texas'], ['dues.jpg', 'cap.dues'], ['cheddar.jpg', 'cap.cheddar'], ['fingers.jpg', 'cap.fingers'], ['anelles.jpg', 'cap.anelles'], ['patates.jpg', 'cap.patates'], ['coulant.jpg', 'cap.coulant'], ['burger-2.jpg', 'cap.burger'], ['cartell.jpg', 'cap.cartell']];
const MID = [['arros.jpg', 'cap.arros'], ['calamars.jpg', 'cap.calamars'], ['fideua.jpg', 'cap.fideua'], ['paella.jpg', 'cap.paella']];
function paintShots() {
  $('#strip').innerHTML = STRIP.map(([f, k], i) => `<button class="shot" type="button" data-shot="s${i}"><img src="${IMG(f)}" alt="${t(k)}" loading="lazy"><span>${t(k)}</span></button>`).join('');
  $('#midPics').innerHTML = MID.map(([f, k], i) => `<button class="shot" type="button" data-shot="m${i}"><img src="${IMG(f)}" alt="${t(k)}" loading="lazy"><span>${t(k)}</span></button>`).join('');
}
onLang.push(paintShots);
const lb = $('#lb'); let lbReturn = null;
document.addEventListener('click', (e) => {
  const b = e.target.closest('[data-shot]'); if (!b) return;
  const id = b.dataset.shot, [f, k] = (id[0] === 's' ? STRIP : MID)[+id.slice(1)];
  lbReturn = b; $('#lbImg').src = IMG(f); $('#lbImg').alt = t(k); $('#lbCap').textContent = t(k);
  lb.hidden = false; document.body.classList.add('is-locked'); if (lenis) lenis.stop(); $('#lbX').focus();
});
const closeLb = () => { lb.hidden = true; document.body.classList.remove('is-locked'); if (lenis) lenis.start(); if (lbReturn) lbReturn.focus(); };
$('#lbX').addEventListener('click', closeLb);
lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
document.addEventListener('keydown', (e) => { if (!lb.hidden && e.key === 'Escape') closeLb(); if (!lb.hidden && e.key === 'Tab') e.preventDefault(); });
const midVid = $('#midVid');
if (midVid && 'IntersectionObserver' in window) new IntersectionObserver((es) => es.forEach((en) => { if (en.isIntersecting && !STATIC) play(midVid); else midVid.pause(); }), { threshold: 0.3 }).observe(midVid);

/* ---------------- arranque ---------------- */
applyLang();

if (motion) {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
  tl.from('.hero__bg', { scale: 1.2, duration: 1.6 }, 0)
    .from('.leaves path', { scale: 0.6, opacity: 0, transformOrigin: '50% 50%', duration: 1, stagger: 0.05 }, 0.1)
    .from('.hero__s1', { yPercent: 100, opacity: 0, duration: 0.7 }, 0.2)
    .from('.hero__s2', { yPercent: 100, opacity: 0, duration: 0.7 }, 0.35)
    .from('.tiki', { y: 120, rotate: 8, opacity: 0, duration: 1, ease: 'back.out(1.5)' }, 0.3)
    .from('.hero .kicker, .hero__lead, .hero__meta, .hero .ctas, .how li', { y: 20, opacity: 0, duration: 0.6, stagger: 0.06 }, 0.6);
  $$('.reveal').forEach((el) => gsap.to(el, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } }));
  ScrollTrigger.batch('.bcard', { start: 'top 85%', once: true, onEnter: (els) => els.forEach((c, i) => build(c, i * 0.12)) });
  gsap.from('.machine', { y: 80, rotate: -3, opacity: 0, duration: 1, ease: 'back.out(1.4)', scrollTrigger: { trigger: '.machine', start: 'top 80%', once: true } });
  gsap.from('.glass', { y: 60, opacity: 0, duration: 0.7, stagger: 0.07, ease: 'back.out(1.6)', clearProps: 'transform,opacity', scrollTrigger: { trigger: '#glasses', start: 'top 85%', once: true } });
  gsap.from('.card', { y: 60, rotate: (i) => (i % 2 ? 2 : -2), opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', scrollTrigger: { trigger: '#cards', start: 'top 85%', once: true } });
  addEventListener('load', () => ScrollTrigger.refresh());
} else $$('.reveal').forEach((el) => { el.style.opacity = 1; el.style.transform = 'none'; });
})();
