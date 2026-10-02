// The sender's side: a form that builds the invitation, a live preview, and the
// "seal & send" step that produces a short, shareable link.

import { LOOK_CATEGORIES, THEMES, sabbatFor } from './themes.js';
import { FONTS, TEMPLATES, TEMPLATE_BY_ID, WORDING, resolveTheme } from './occasions.js';
import { MODULES, MODULE_BY_ID, QUESTIONS } from './modules.js';
import { encodeInvite } from './codec.js';
import { applyTheme, esc, particles, renderCard, wordsFor } from './render.js';
import { CORNER_OPTIONS, PAPERS, RULE_OPTIONS, SCENES, SIDE_OPTIONS, backdropCss, luminance, resolvePaper, safeHex } from './decor.js';
import { EMBLEM_GROUPS, FACE_FINISHES, SVG_EMBLEMS, WAX_BY_ID, WAX_COLORS, sealHtml } from './seal.js';
import { WRAPPERS, playOpening, resolveWrapper, wrapperHtml } from './wrappers.js';
import { shortenUrl } from './shorten.js';
import { $, copyText, randomId, store, toast } from './util.js';

const DRAFT_KEY = 'moonpost:draft';

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function blankState() {
  const nextWeek = new Date(Date.now() + 7 * 864e5);
  const look = sabbatFor(nextWeek.getMonth() + 1, nextWeek.getDate());
  return {
    id: randomId(), kind: 'custom', to: '', from: '', title: '', msg: '',
    date: isoDate(nextWeek), time: '19:00', endTime: '21:00', allDay: false, loc: '', addr: '',
    look, font: '', lookTab: THEMES[look].cat, bs: 'look', bc: [], pp: 'look', dc: 'look', ds: 'look', dv: 'look',
    wrap: 'auto', sealColor: '', sealFace: '', sealEmblem: '', emblemTab: 'regal',
    mods: {}, dl: {}, asks: [], askCustom: [], custom: [], tx: {},
    remind: 60, smsText: '',
  };
}

// Brings a draft saved by an older version up to date.
function normalize(saved) {
  const st = { ...blankState(), ...(saved && typeof saved === 'object' ? saved : {}) };
  if (saved && !saved.look && saved.theme) {
    // Older drafts: 'auto' meant "the season of the date".
    const [, m, d] = String(saved.date || '').split('-').map(Number);
    st.look = THEMES[saved.theme] ? saved.theme : m && d ? sabbatFor(m, d) : st.look;
    st.lookTab = THEMES[st.look].cat;
  }
  if (!THEMES[st.look]) st.look = blankState().look;
  if (!saved?.lookTab || !LOOK_CATEGORIES.some(c => c.id === st.lookTab)) st.lookTab = THEMES[st.look].cat;
  if (typeof st.askCustom === 'string') st.askCustom = st.askCustom.trim() ? [st.askCustom] : [];
  if (!Array.isArray(st.askCustom)) st.askCustom = [];
  if (saved?.closing && !st.tx.close) st.tx = { ...st.tx, close: saved.closing };
  if (!TEMPLATE_BY_ID[st.kind]) st.kind = 'custom';
  if (WAX_COLORS.every(c => c.hex !== st.sealColor && c.id !== st.sealColor) && !safeHex(st.sealColor)) st.sealColor = '';
  if (!/^@/.test(st.sealEmblem) && Array.from(st.sealEmblem || '').length > 4) st.sealEmblem = '';
  for (const k of ['theme', 'hemi', 'phone', 'toPhone', 'closing']) delete st[k];
  return st;
}

let state;
let lastUrl = '';
let lastMessage = '';
let previewMode = 'card';

// Converts the form state into the compact invitation that travels in the link.
export function toInvite(st) {
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  let start = new Date(`${st.date}T${st.allDay ? '00:00' : st.time || '19:00'}`);
  if (Number.isNaN(start.getTime())) start = new Date();
  let end;
  if (!st.allDay && st.endTime) {
    end = new Date(`${st.date}T${st.endTime}`);
    if (end <= start) end = new Date(end.getTime() + 864e5); // ends after midnight
  }
  const d = {};
  for (const [k, v] of Object.entries(st.mods)) {
    if (k === 'link') { if (v?.u) d.link = { l: v.l?.trim(), u: v.u.trim() }; }
    else if (typeof v === 'string' && v.trim()) d[k] = v.trim();
  }
  const dl = {};
  for (const [k, v] of Object.entries(st.dl || {})) if (k in d && v?.trim()) dl[k] = v.trim();
  // An emptied line is kept as a single space so it survives the trip (and hides that line).
  const tx = {};
  for (const [k, v] of Object.entries(st.tx || {})) if (typeof v === 'string') tx[k] = v.trim() || ' ';
  const pick = (v, def = 'look') => (v && v !== def ? v : undefined);
  return {
    v: 2, id: st.id, k: st.kind, to: st.to.trim(), from: st.from.trim(), title: st.title.trim(), msg: st.msg.trim(),
    s: start.getTime(), e: end?.getTime(), ad: st.allDay, tz,
    loc: st.loc.trim(), addr: st.addr.trim(),
    th: st.look, fn: st.font || undefined,
    bs: pick(st.bs), bc: st.bc?.length ? st.bc : undefined, pp: pick(st.pp), dc: pick(st.dc), ds: pick(st.ds), dv: pick(st.dv),
    w: pick(st.wrap, 'auto'), sc: st.sealColor, sf: st.sealFace, se: st.sealEmblem.trim(),
    d, dl, q: st.asks, qc: st.askCustom.map(q => q.trim()).filter(Boolean),
    cf: st.custom.filter(c => c.l || c.v).map(c => ({ i: c.i, l: c.l.trim(), v: c.v.trim() })),
    tx, rm: Number(st.remind) || 0,
  };
}

const defaultSmsText = st =>
  `${st.to ? `Hey ${st.to}! ` : ''}I made you a little something 💌 Tap to open your invitation:`;

const optionBtn = (action, id, label, on, extra = '') =>
  `<button type="button" class="opt ${on ? 'on' : ''}" data-action="${action}" data-id="${esc(id)}" ${extra}>${label}</button>`;

// ── Step 1: occasion & lettering ─────────────────────────────────────
function renderTemplates() {
  $('#templates').innerHTML = TEMPLATES.map(t => `
    <button type="button" class="template ${state.kind === t.id ? 'on' : ''}" data-action="template" data-id="${t.id}">
      <span class="template-icon">${t.icon}</span>${esc(t.label)}
    </button>`).join('');
  const occFont = FONTS[TEMPLATE_BY_ID[state.kind]?.font] || FONTS.storybook;
  const fontBtn = (id, f, label) => `<button type="button" class="font-option ${state.font === id ? 'on' : ''}" data-action="font" data-id="${id}">
    <span class="font-sample" style="font-family:${f.display}">${esc(state.title || 'Aa')}</span><small style="font-family:${f.body}">${esc(label)}</small></button>`;
  $('#fonts').innerHTML = fontBtn('', occFont, `Occasion’s pick · ${occFont.name}`)
    + Object.entries(FONTS).map(([id, f]) => fontBtn(id, f, f.name)).join('');
}

// ── Step 3: the look ─────────────────────────────────────────────────
function swatch(theme) {
  const light = (luminance(theme.bg[0]) + luminance(theme.bg[1])) / 2 > 0.45;
  return `<button type="button" class="swatch ${light ? 'light' : ''} ${state.look === theme.id ? 'on' : ''}" data-action="look" data-id="${theme.id}"
    style="--sw1:${theme.bg[0]};--sw2:${theme.bg[1]};--swa:${theme.accent};--swc:${theme.card}" title="${esc(theme.tagline)}">
    <span class="swatch-card"><span class="swatch-glyph">${theme.glyph}</span></span>
    <span class="swatch-name">${esc(theme.name)}<small>${esc(theme.tagline)}</small></span></button>`;
}

function renderLook() {
  const look = THEMES[state.look];
  $('#look-tabs').innerHTML = LOOK_CATEGORIES.map(c =>
    `<button type="button" class="tab ${state.lookTab === c.id ? 'on' : ''}" data-action="look-tab" data-id="${c.id}">${c.icon} ${esc(c.label)}${look.cat === c.id ? ' •' : ''}</button>`).join('');
  $('#themes').innerHTML = Object.values(THEMES).filter(t => t.cat === state.lookTab).map(swatch).join('');

  const inv = toInvite(state);
  $('#scenes').innerHTML = SCENES.map(s => {
    const label = s.id === 'look' ? `Look’s pick` : s.label;
    const css = backdropCss(look, { ...inv, bs: s.id });
    return `<button type="button" class="scene ${state.bs === s.id ? 'on' : ''}" data-action="scene" data-id="${s.id}" title="${esc(label)}">
      <span class="scene-art" style="${esc(`background:${css}`)}"></span><span>${esc(label)}</span></button>`;
  }).join('');
  const [c1, c2] = state.bc;
  $('#bg-colors').innerHTML = `
    ${optionBtn('bg-colors', 'look', 'Look’s colors', !state.bc.length)}
    <label class="opt color-pair ${state.bc.length ? 'on' : ''}">Custom
      <input type="color" data-bg-color="0" value="${esc(c1 || look.bg[0])}" aria-label="Background color 1">
      <input type="color" data-bg-color="1" value="${esc(c2 || look.bg[1])}" aria-label="Background color 2">
    </label>`;

  const paperNow = resolvePaper(inv, look);
  $('#papers').innerHTML = PAPERS.map(p => `<button type="button" class="paper-option ${state.pp === p.id ? 'on' : ''}" data-action="paper" data-id="${p.id}">
    <span class="paper-art" data-paper="${p.id === 'look' ? paperNow : p.id}" style="--card:${look.card}"${look.dark ? ' data-dark' : ''}></span>${esc(p.label)}</button>`).join('');
  $('#corners').innerHTML = CORNER_OPTIONS.map(o => optionBtn('corners', o.id, esc(o.label), state.dc === o.id)).join('');
  $('#sides').innerHTML = SIDE_OPTIONS.map(o => optionBtn('sides', o.id, esc(o.label), state.ds === o.id)).join('');
  $('#rules').innerHTML = RULE_OPTIONS.map(o => optionBtn('rules', o.id, esc(o.label), state.dv === o.id)).join('');
}

// ── Step 4: delivery & seal ──────────────────────────────────────────
const emblemArt = s => (s.startsWith('@')
  ? `<svg viewBox="16 16 68 68" aria-hidden="true"><g fill="currentColor">${SVG_EMBLEMS[s.slice(1)].replace(/#000/g, '#fff').replace(/stroke='#fff'/g, "stroke='currentColor'")}</g></svg>`
  : esc(s));

function renderDelivery() {
  const inv = toInvite(state);
  const look = resolveTheme(inv);
  const themeWrap = WRAPPERS[resolveWrapper({}, look)];
  const wrapBtn = (id, icon, label) => `<button type="button" class="wrap-option ${state.wrap === id ? 'on' : ''}" data-action="wrap" data-id="${id}">
    <span class="wrap-icon">${icon}</span>${esc(label)}</button>`;
  $('#wrappers').innerHTML = wrapBtn('auto', themeWrap.icon, `Look’s pick (${themeWrap.label.toLowerCase()})`)
    + Object.entries(WRAPPERS).map(([id, w]) => wrapBtn(id, w.icon, w.label)).join('');

  const lookWax = WAX_BY_ID[look.wax] || WAX_COLORS[0];
  const dot = (value, hex, name, cls = '') => `<button type="button" class="color-dot ${cls} ${state.sealColor === value ? 'on' : ''}" data-action="seal-color" data-id="${value}"
    style="--dot:${hex}" title="${esc(name)}" aria-label="${esc(name)}"></button>`;
  const custom = safeHex(state.sealColor);
  $('#seal-colors').innerHTML = dot('', lookWax.hex, `Look’s pick (${lookWax.name})`, 'look-pick')
    + WAX_COLORS.map(c => dot(c.id, c.hex, c.name, c.metal ? 'metal' : '')).join('')
    + `<label class="color-dot custom ${custom ? 'on' : ''}" title="Any color" style="--dot:${custom || '#fff'}">
        <input type="color" id="seal-custom" value="${custom || '#7a4fd1'}" aria-label="Pick any wax color"></label>`;

  const lookFace = FACE_FINISHES.find(f => f.id === look.waxFace) || FACE_FINISHES[0];
  const faceDot = (f, value, name, cls = '') => `<button type="button" class="face-dot ${cls} ${state.sealFace === value ? 'on' : ''}" data-action="seal-face" data-id="${value}"
    style="--f1:${f.stops?.[0] || 'transparent'};--f2:${f.stops?.[1] || 'transparent'};--f3:${f.stops?.[2] || 'transparent'}" title="${esc(name)}" aria-label="${esc(name)}">${f.stops ? '' : '⌾'}</button>`;
  const customFace = safeHex(state.sealFace);
  $('#seal-faces').innerHTML = faceDot(lookFace, '', `Look’s pick (${lookFace.name})`, 'look-pick')
    + FACE_FINISHES.map(f => faceDot(f, f.id, f.name)).join('')
    + `<label class="face-dot custom ${customFace ? 'on' : ''}" title="Any color" style="--f2:${customFace || '#fff'}">
        <input type="color" id="face-custom" value="${customFace || '#e8c547'}" aria-label="Pick any emblem color"></label>`;

  $('#emblem-tabs').innerHTML = EMBLEM_GROUPS.map(g =>
    `<button type="button" class="tab small ${state.emblemTab === g.id ? 'on' : ''}" data-action="emblem-tab" data-id="${g.id}">${esc(g.label)}</button>`).join('');
  const group = EMBLEM_GROUPS.find(g => g.id === state.emblemTab) || EMBLEM_GROUPS[0];
  const emblemBtn = (value, art, title) => `<button type="button" class="emblem ${state.sealEmblem === value ? 'on' : ''}" data-action="emblem" data-value="${esc(value)}" title="${esc(title)}">${art}</button>`;
  $('#seal-emblems').innerHTML = emblemBtn('', emblemArt(look.seal), `Look’s pick`)
    + group.items.map(e => emblemBtn(e.s, emblemArt(e.s), e.name)).join('');
  renderSealPreview(inv, look);
}

function renderSealPreview(inv = toInvite(state), look = resolveTheme(inv)) {
  $('#seal-preview').innerHTML = sealHtml(inv, look, 'big');
}

// ── Step 5: details ──────────────────────────────────────────────────
function moduleEditor(m) {
  const v = state.mods[m.id];
  let input;
  if (m.type === 'link') {
    input = `<div class="row"><input data-mod-link="l" value="${esc(v?.l)}" placeholder="Button label (e.g. Our tickets)">
      <input type="url" data-mod-link="u" value="${esc(v?.u)}" placeholder="${esc(m.placeholder)}"></div>`;
  } else if (m.type === 'textarea') {
    input = `<textarea data-mod-input="${m.id}" rows="2" placeholder="${esc(m.placeholder)}">${esc(v)}</textarea>`;
  } else if (m.type === 'date') {
    input = `<input type="date" data-mod-input="${m.id}" value="${esc(v)}">`;
  } else {
    const chips = (m.options || []).map(o =>
      `<button type="button" class="chip ${v === o ? 'on' : ''}" data-action="chip" data-id="${m.id}" data-value="${esc(o)}">${esc(o)}</button>`).join('');
    input = `${chips ? `<div class="chip-row">${chips}</div>` : ''}
      <input data-mod-input="${m.id}" value="${esc(v)}" placeholder="${esc(m.placeholder || 'Or write your own')}">`;
  }
  const labelEditable = !['link', 'rsvpby'].includes(m.id);
  return `<div class="module" data-mod="${m.id}">
    <div class="module-head"><span>${m.icon} ${labelEditable
      ? `<input class="label-input" data-mod-label="${m.id}" value="${esc(state.dl[m.id] || '')}" placeholder="${esc(m.label)}" aria-label="Label for ${esc(m.label)}">`
      : esc(m.label)}</span>
      <button type="button" class="icon-btn" data-action="remove-mod" data-id="${m.id}" aria-label="Remove ${esc(m.label)}">✕</button></div>
    ${input}</div>`;
}

function renderModules() {
  const active = MODULES.filter(m => m.id in state.mods);
  $('#modules').innerHTML = active.map(moduleEditor).join('');
  $('#module-picker').innerHTML = MODULES.filter(m => !(m.id in state.mods)).map(m =>
    `<button type="button" class="chip add" data-action="add-mod" data-id="${m.id}">+ ${m.icon} ${esc(m.label)}</button>`).join('');
}

function renderCustom() {
  $('#custom').innerHTML = state.custom.map((c, i) => `
    <div class="custom-row">
      <input class="emoji-input" data-custom="${i}" data-key="i" value="${esc(c.i)}" maxlength="4" aria-label="Icon">
      <input data-custom="${i}" data-key="l" value="${esc(c.l)}" placeholder="Label (e.g. Secret password)">
      <input data-custom="${i}" data-key="v" value="${esc(c.v)}" placeholder="Value (e.g. “Moonbeam”)">
      <button type="button" class="icon-btn" data-action="remove-custom" data-index="${i}" aria-label="Remove field">✕</button>
    </div>`).join('');
}

// ── Step 6: questions ────────────────────────────────────────────────
function renderAsks() {
  $('#asks').innerHTML = QUESTIONS.map(q =>
    `<button type="button" class="chip ${state.asks.includes(q.id) ? 'on' : ''}" data-action="ask" data-id="${q.id}">${esc(q.q)}</button>`).join('');
  $('#own-asks').innerHTML = state.askCustom.map((q, i) => `
    <div class="ask-row"><input data-own-ask="${i}" value="${esc(q)}" placeholder="e.g. Sweet or savory?" aria-label="Your question ${i + 1}">
      <button type="button" class="icon-btn" data-action="remove-ask" data-index="${i}" aria-label="Remove question">✕</button></div>`).join('');
}

// ── Step 7: wording ──────────────────────────────────────────────────
const WORDING_ICONS = { 'On the outside': '✉️', 'On the card': '💌', 'Reply buttons': '🔘', 'After they answer': '💬' };
function renderWording() {
  const inv = toInvite(state);
  const defaults = wordsFor({ ...inv, tx: {} });
  let group = '';
  let html = '';
  for (const f of WORDING) {
    if (f.group !== group) {
      html += `${group ? '</div></section>' : ''}<section class="wording-block">
        <h3 class="wording-title"><span aria-hidden="true">${WORDING_ICONS[f.group] || '✦'}</span>${esc(f.group)}</h3><div class="wording-group">`;
      group = f.group;
    }
    const own = typeof state.tx[f.key] === 'string';
    const value = own ? state.tx[f.key] : defaults[f.key];
    const multiline = f.key === 'moon' || f.key === 'greet';
    const field = multiline
      ? `<textarea data-tx="${f.key}" rows="2" placeholder="(hidden)">${esc(value)}</textarea>`
      : `<input data-tx="${f.key}" value="${esc(value)}" placeholder="(hidden)">`;
    html += `<label class="${own ? 'edited' : ''}">${esc(f.label)}${own ? ` <button type="button" class="reset-line" data-action="reset-line" data-id="${f.key}" title="Back to the default">↺ default</button>` : ''}${field}</label>`;
  }
  $('#wording').innerHTML = `${html}</div></section>`;
}

// Shows or hides a line's "↺ default" button without re-rendering (which would steal focus).
function markEdited(label, key) {
  const own = key in state.tx;
  label.classList.toggle('edited', own);
  const btn = label.querySelector('.reset-line');
  if (own && !btn) label.querySelector('[data-tx]').insertAdjacentHTML('beforebegin', ` <button type="button" class="reset-line" data-action="reset-line" data-id="${key}" title="Back to the default">↺ default</button>`);
  if (!own && btn) btn.remove();
}

// Refreshes wording fields the sender hasn't touched (their defaults depend on names, date, occasion).
function syncWordingDefaults() {
  const defaults = wordsFor({ ...toInvite(state), tx: {} });
  for (const el of document.querySelectorAll('[data-tx]')) {
    if (typeof state.tx[el.dataset.tx] !== 'string' && el !== document.activeElement) el.value = defaults[el.dataset.tx];
  }
}

function syncForm() {
  for (const el of document.querySelectorAll('#form [data-bind]')) {
    const key = el.dataset.bind;
    if (el.type === 'checkbox') el.checked = !!state[key];
    else el.value = state[key] ?? '';
  }
  $('[data-bind="smsText"]').placeholder = defaultSmsText(state);
  for (const el of document.querySelectorAll('[data-bind="time"], [data-bind="endTime"]')) el.disabled = state.allDay;
}

function renderAll() {
  renderTemplates();
  renderLook();
  renderDelivery();
  renderModules();
  renderCustom();
  renderAsks();
  renderWording();
  syncForm();
  refresh();
}

let previewTimer;
let lastPreviewTheme;
function refresh() {
  clearTimeout(previewTimer);
  previewTimer = setTimeout(() => {
    const inv = toInvite(state);
    const theme = resolveTheme(inv);
    const words = wordsFor(inv);
    const stage = $('#preview');
    applyTheme(stage, theme, inv);
    $('#preview-card').innerHTML = previewMode === 'wrapper' ? wrapperHtml(inv, theme, words) : renderCard(inv, theme, words);
    for (const b of document.querySelectorAll('[data-action=preview-mode]')) b.classList.toggle('on', b.dataset.mode === previewMode);
    if (lastPreviewTheme !== theme.id) {
      particles($('#preview-sky'), theme, 10);
      lastPreviewTheme = theme.id;
    }
  }, 80);
  store.set(DRAFT_KEY, state);
  if (lastUrl) {
    lastUrl = '';
    $('#result').hidden = true;
  }
}

// ── Actions ───────────────────────────────────────────────────────────
function applyTemplate(t) {
  const prev = TEMPLATE_BY_ID[state.kind];
  if (!state.title || state.title === prev?.title) state.title = t.title;
  state.kind = t.id;
  // Keep details the sender has edited; swap out the previous template's defaults.
  const mods = {};
  for (const [k, v] of Object.entries(state.mods)) {
    const filled = typeof v === 'string' ? v.trim() : v?.u || v?.l;
    if (filled && JSON.stringify(v) !== JSON.stringify(prev?.mods[k])) mods[k] = v;
  }
  for (const [k, v] of Object.entries(t.mods)) if (!(k in mods)) mods[k] = structuredClone(v);
  state.mods = mods;
  state.asks = [...new Set([...state.asks.filter(a => !prev?.asks.includes(a)), ...t.asks])];
  renderAll();
}

async function createLink() {
  if (!state.date) {
    toast('Pick a date first 📅');
    $('[data-bind="date"]').focus();
    return;
  }
  const btn = $('[data-action=create]');
  btn.disabled = true;
  btn.textContent = '✨ Sealing…';
  try {
    const code = await encodeInvite(toInvite(state));
    const longUrl = `${location.origin}${location.pathname}#i=${code}`;
    const url = await shortenUrl(longUrl);
    lastUrl = url;
    lastMessage = `${state.smsText.trim() || defaultSmsText(state)} ${url}`;
    $('#result').hidden = false;
    $('#result-message').value = lastMessage;
    $('#result-url').value = url;
    $('#open-link').href = longUrl;
    $('#share-btn').hidden = !navigator.share;
    $('#result-note').textContent = url === longUrl
      ? 'The link is long because the whole invitation lives inside it (we couldn’t reach the link shortener). It works just the same.'
      : 'Paste it into a text to them. When they answer, their reply opens in their messages, ready to send back to you.';
    $('#result').scrollIntoView({ behavior: 'smooth', block: 'center' });
    toast('Sealed with a little magic ✨');
  } finally {
    btn.disabled = false;
    btn.textContent = '✨ Seal my invitation';
  }
}

function onClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  switch (action) {
    case 'template': applyTemplate(TEMPLATE_BY_ID[id]); break;
    case 'font': state.font = id; renderTemplates(); refresh(); break;
    case 'look-tab': state.lookTab = id; renderLook(); break;
    case 'look': state.look = id; renderLook(); renderDelivery(); refresh(); break;
    case 'scene': state.bs = id; renderLook(); refresh(); break;
    case 'bg-colors': state.bc = []; renderLook(); refresh(); break;
    case 'paper': state.pp = id; renderLook(); previewMode = 'card'; refresh(); break;
    case 'corners': state.dc = id; renderLook(); previewMode = 'card'; refresh(); break;
    case 'sides': state.ds = id; renderLook(); previewMode = 'card'; refresh(); break;
    case 'rules': state.dv = id; renderLook(); previewMode = 'card'; refresh(); break;
    case 'wrap': state.wrap = id; previewMode = 'wrapper'; renderDelivery(); refresh(); break;
    case 'seal-color': state.sealColor = id; previewMode = 'wrapper'; renderDelivery(); refresh(); break;
    case 'seal-face': state.sealFace = id; previewMode = 'wrapper'; renderDelivery(); refresh(); break;
    case 'emblem-tab': state.emblemTab = id; renderDelivery(); break;
    case 'emblem': state.sealEmblem = btn.dataset.value; previewMode = 'wrapper'; renderDelivery(); syncForm(); refresh(); break;
    case 'preview-mode': previewMode = btn.dataset.mode; refresh(); break;
    case 'open': playOpening(btn, () => { previewMode = 'card'; refresh(); }); break;
    case 'add-mod':
      state.mods[id] = MODULE_BY_ID[id].type === 'link' ? { l: '', u: '' } : '';
      renderModules(); refresh();
      $(`[data-mod="${id}"] [data-mod-input], [data-mod="${id}"] [data-mod-link]`)?.focus();
      break;
    case 'remove-mod': delete state.mods[id]; delete state.dl[id]; renderModules(); refresh(); break;
    case 'chip': {
      state.mods[id] = state.mods[id] === btn.dataset.value ? '' : btn.dataset.value;
      const mod = btn.closest('.module');
      mod.querySelector('[data-mod-input]').value = state.mods[id];
      for (const c of mod.querySelectorAll('.chip')) c.classList.toggle('on', c.dataset.value === state.mods[id]);
      refresh();
      break;
    }
    case 'ask':
      state.asks = state.asks.includes(id) ? state.asks.filter(a => a !== id) : [...state.asks, id];
      renderAsks(); refresh();
      break;
    case 'add-ask':
      state.askCustom.push('');
      renderAsks();
      document.querySelector(`[data-own-ask="${state.askCustom.length - 1}"]`)?.focus();
      break;
    case 'remove-ask': state.askCustom.splice(Number(btn.dataset.index), 1); renderAsks(); refresh(); break;
    case 'add-custom':
      state.custom.push({ i: '✦', l: '', v: '' });
      renderCustom(); refresh();
      document.querySelector(`[data-custom="${state.custom.length - 1}"][data-key="l"]`)?.focus();
      break;
    case 'remove-custom': state.custom.splice(Number(btn.dataset.index), 1); renderCustom(); refresh(); break;
    case 'reset-line': delete state.tx[id]; renderWording(); refresh(); break;
    case 'reset-wording': state.tx = {}; renderWording(); refresh(); break;
    case 'create': createLink(); break;
    case 'copy-message': copyText(lastMessage).then(() => toast('Message copied — paste it in a text 📋')); break;
    case 'copy': copyText(lastUrl).then(() => toast('Link copied 📋')); break;
    case 'share':
      navigator.share({ title: state.title || 'An invitation', text: state.smsText.trim() || defaultSmsText(state), url: lastUrl }).catch(() => {});
      break;
    case 'toggle-preview': document.body.classList.toggle('show-preview'); break;
    case 'reset':
      if (confirm('Start a brand-new invitation? This clears the current one.')) {
        state = blankState();
        lastUrl = '';
        $('#result').hidden = true;
        renderAll();
        scrollTo({ top: 0, behavior: 'smooth' });
      }
      break;
  }
}

function onInput(e) {
  const el = e.target;
  if (el.dataset.bind) {
    const key = el.dataset.bind;
    state[key] = el.type === 'checkbox' ? el.checked : el.value;
    if (key === 'allDay') syncForm();
    if (key === 'to') $('[data-bind="smsText"]').placeholder = defaultSmsText(state);
    if (['to', 'from', 'date', 'allDay'].includes(key)) syncWordingDefaults();
    if (key === 'title') for (const s of document.querySelectorAll('.font-sample')) s.textContent = state.title || 'Aa';
    if (key === 'sealEmblem') {
      previewMode = 'wrapper';
      for (const b of document.querySelectorAll('[data-action=emblem]')) b.classList.toggle('on', b.dataset.value === el.value);
      renderSealPreview();
    }
  } else if (el.dataset.modInput) {
    const id = el.dataset.modInput;
    state.mods[id] = el.value;
    for (const c of el.closest('.module').querySelectorAll('.chip')) c.classList.toggle('on', c.dataset.value === el.value);
  } else if (el.dataset.modLabel) {
    state.dl[el.dataset.modLabel] = el.value;
  } else if (el.dataset.modLink) {
    state.mods.link = { ...state.mods.link, [el.dataset.modLink]: el.value };
  } else if (el.id === 'seal-custom') {
    state.sealColor = el.value;
    previewMode = 'wrapper';
    if (e.type === 'change') renderDelivery();
    else renderSealPreview();
  } else if (el.id === 'face-custom') {
    state.sealFace = el.value;
    previewMode = 'wrapper';
    if (e.type === 'change') renderDelivery();
    else renderSealPreview();
  } else if (el.dataset.bgColor) {
    const look = THEMES[state.look];
    const bc = state.bc.length ? [...state.bc] : [...look.bg];
    bc[Number(el.dataset.bgColor)] = el.value;
    state.bc = bc;
    if (e.type === 'change') renderLook();
  } else if (el.dataset.ownAsk) {
    state.askCustom[Number(el.dataset.ownAsk)] = el.value;
  } else if (el.dataset.tx) {
    const key = el.dataset.tx;
    const def = wordsFor({ ...toInvite(state), tx: {} })[key];
    if (el.value === def) delete state.tx[key];
    else state.tx[key] = el.value;
    markEdited(el.closest('label'), key);
  } else if (el.dataset.custom) {
    state.custom[Number(el.dataset.custom)][el.dataset.key] = el.value;
  } else {
    return;
  }
  refresh();
}

export function showBuilder() {
  state = normalize(store.get(DRAFT_KEY));
  document.documentElement.removeAttribute('style');
  document.documentElement.removeAttribute('data-theme');
  document.documentElement.removeAttribute('data-font');
  $('#sky').replaceChildren();
  $('#invite').hidden = true;
  $('#builder').hidden = false;
  document.title = 'Moonpost — whimsical invitations';
  if (!showBuilder.bound) {
    $('#builder').addEventListener('click', onClick);
    $('#form').addEventListener('input', onInput);
    $('#form').addEventListener('change', onInput);
    showBuilder.bound = true;
  }
  renderAll();
}

