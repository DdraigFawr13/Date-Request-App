// The sender's side: a form that builds the invitation, a live preview, and the
// "seal & send" step that produces a shareable link.

import { THEMES, resolveTheme } from './themes.js';
import { MODULES, MODULE_BY_ID, QUESTIONS, TEMPLATES } from './modules.js';
import { encodeInvite } from './codec.js';
import { applyTheme, esc, particles, renderCard } from './render.js';
import { SEAL_EMBLEMS, WAX_COLORS, WRAPPERS, playOpening, resolveWrapper, sealHtml, wrapperHtml } from './wrappers.js';
import { $, copyText, randomId, smsHref, store, toast } from './util.js';

const DRAFT_KEY = 'moonpost:draft';

function isoDate(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function blankState() {
  const nextWeek = new Date(Date.now() + 7 * 864e5);
  return {
    id: randomId(), kind: 'custom', to: '', from: '', title: '', msg: '',
    date: isoDate(nextWeek), time: '19:00', endTime: '21:00', allDay: false, loc: '', addr: '',
    theme: 'auto', hemi: 'N', wrap: 'auto', sealColor: '', sealEmblem: '', mods: {}, asks: [], askCustom: '', custom: [],
    closing: '', phone: '', remind: 60, toPhone: '', smsText: '',
  };
}

let state;
let lastUrl = '';
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
  return {
    v: 1, id: st.id, k: st.kind, to: st.to.trim(), from: st.from.trim(), title: st.title.trim(), msg: st.msg.trim(),
    s: start.getTime(), e: end?.getTime(), ad: st.allDay, tz,
    loc: st.loc.trim(), addr: st.addr.trim(), th: st.theme, h: st.hemi === 'S' ? 'S' : undefined,
    w: st.wrap === 'auto' ? undefined : st.wrap, sc: st.sealColor, se: st.sealEmblem.trim(),
    d, q: st.asks, qc: st.askCustom.trim(),
    cf: st.custom.filter(c => c.l || c.v).map(c => ({ i: c.i, l: c.l.trim(), v: c.v.trim() })),
    cl: st.closing.trim(), ph: st.phone.trim(), rm: Number(st.remind) || 0,
  };
}

const defaultSmsText = st =>
  `${st.to ? `Hey ${st.to}! ` : ''}I made you a little something 💌 Tap to open your invitation:`;

// ── Rendering ─────────────────────────────────────────────────────────
function renderTemplates() {
  $('#templates').innerHTML = TEMPLATES.map(t => `
    <button type="button" class="template ${state.kind === t.id ? 'on' : ''}" data-action="template" data-id="${t.id}">
      <span class="template-icon">${t.icon}</span>${esc(t.label)}
    </button>`).join('');
}

function swatch(theme, extra = '') {
  return `<button type="button" class="swatch ${state.theme === theme.id ? 'on' : ''}" data-action="theme" data-id="${theme.id}"
    style="--sw1:${theme.bg[0]};--sw2:${theme.bg[1]};--swa:${theme.accent}" title="${esc(theme.tagline)}">
    <span class="swatch-glyph">${theme.glyph}</span><span class="swatch-name">${esc(theme.name)}${extra}</span></button>`;
}

function renderThemes() {
  const auto = resolveTheme({ ...toInvite(state), th: 'auto' });
  const group = g => Object.values(THEMES).filter(t => t.group === g).map(t => swatch(t)).join('');
  $('#themes').innerHTML = `
    <button type="button" class="swatch auto ${state.theme === 'auto' ? 'on' : ''}" data-action="theme" data-id="auto"
      style="--sw1:${auto.bg[0]};--sw2:${auto.bg[1]};--swa:${auto.accent}">
      <span class="swatch-glyph">☸</span>
      <span class="swatch-name">Follow the Wheel of the Year <small>Your date falls in <b>${esc(auto.name)}</b> season — ${esc(auto.tagline.toLowerCase())}</small></span>
    </button>
    <p class="sub">Wheel of the Year</p><div class="swatch-grid">${group('wheel')}</div>
    <p class="sub">Occasions</p><div class="swatch-grid">${group('occasion')}</div>`;
}

function renderLook() {
  const inv = toInvite(state);
  const theme = resolveTheme(inv);
  const themeWrap = WRAPPERS[resolveWrapper({}, theme)];
  const wrapBtn = (id, icon, label) => `<button type="button" class="wrap-option ${state.wrap === id ? 'on' : ''}" data-action="wrap" data-id="${id}">
    <span class="wrap-icon">${icon}</span>${esc(label)}</button>`;
  $('#wrappers').innerHTML = wrapBtn('auto', themeWrap.icon, `Theme’s pick (${themeWrap.label.toLowerCase()})`)
    + Object.entries(WRAPPERS).map(([id, w]) => wrapBtn(id, w.icon, w.label)).join('');

  const colorBtn = (hex, name) => `<button type="button" class="color-dot ${state.sealColor === hex ? 'on' : ''}" data-action="seal-color" data-hex="${hex}"
    style="--dot:${hex || theme.accent}" title="${esc(name)}" aria-label="${esc(name)} wax"></button>`;
  const custom = state.sealColor && !WAX_COLORS.some(c => c.hex === state.sealColor);
  $('#seal-colors').innerHTML = colorBtn('', `Theme color (${theme.name})`)
    + WAX_COLORS.map(c => colorBtn(c.hex, c.name)).join('')
    + `<label class="color-dot custom ${custom ? 'on' : ''}" title="Any color" style="--dot:${custom ? state.sealColor : '#fff'}">
        <input type="color" id="seal-custom" value="${custom ? state.sealColor : '#7a4fd1'}" aria-label="Pick any wax color"></label>`;

  const emblemBtn = (value, label, title) => `<button type="button" class="emblem ${state.sealEmblem === value ? 'on' : ''}" data-action="emblem" data-value="${esc(value)}" title="${esc(title)}">${esc(label)}</button>`;
  $('#seal-emblems').innerHTML = emblemBtn('', theme.seal, `Theme emblem (${theme.name})`)
    + SEAL_EMBLEMS.map(e => emblemBtn(e.s, e.s, e.name)).join('');
  renderSealPreview(inv, theme);
}

function renderSealPreview(inv = toInvite(state), theme = resolveTheme(inv)) {
  $('#seal-preview').innerHTML = sealHtml(inv, theme, 'big');
}

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
  return `<div class="module" data-mod="${m.id}">
    <div class="module-head"><span>${m.icon} ${esc(m.label)}</span>
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

function renderAsks() {
  $('#asks').innerHTML = QUESTIONS.map(q =>
    `<button type="button" class="chip ${state.asks.includes(q.id) ? 'on' : ''}" data-action="ask" data-id="${q.id}">${esc(q.q)}</button>`).join('');
}

function syncForm() {
  for (const el of document.querySelectorAll('#form [data-bind]')) {
    const key = el.dataset.bind;
    if (el.type === 'checkbox') el.checked = !!state[key];
    else if (el.type === 'radio') el.checked = state[key] === el.value;
    else el.value = state[key] ?? '';
  }
  $('[data-bind="smsText"]').placeholder = defaultSmsText(state);
  for (const el of document.querySelectorAll('[data-bind="time"], [data-bind="endTime"]')) el.disabled = state.allDay;
}

function renderAll() {
  renderTemplates();
  renderThemes();
  renderLook();
  renderModules();
  renderCustom();
  renderAsks();
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
    const stage = $('#preview');
    applyTheme(stage, theme);
    $('#preview-card').innerHTML = previewMode === 'wrapper' ? wrapperHtml(inv, theme) : renderCard(inv, theme);
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
  const prev = TEMPLATES.find(x => x.id === state.kind);
  if (!state.title || state.title === prev?.title) state.title = t.title;
  state.kind = t.id;
  state.theme = t.theme;
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
  const code = await encodeInvite(toInvite(state));
  lastUrl = `${location.origin}${location.pathname}#i=${code}`;
  const body = `${state.smsText.trim() || defaultSmsText(state)} ${lastUrl}`;
  $('#result').hidden = false;
  $('#result-url').value = lastUrl;
  $('#send-sms').href = smsHref(state.toPhone, body);
  $('#open-link').href = lastUrl;
  $('#share-btn').hidden = !navigator.share;
  $('#result-note').textContent = state.phone
    ? 'When they reply, their RSVP will arrive as a text to you.'
    : 'Tip: add your mobile number in step 6 so they can text their RSVP straight back to you.';
  $('#result').scrollIntoView({ behavior: 'smooth', block: 'center' });
  toast('Sealed with a little magic ✨');
}

function onClick(e) {
  const btn = e.target.closest('[data-action]');
  if (!btn) return;
  const { action, id } = btn.dataset;
  switch (action) {
    case 'template': applyTemplate(TEMPLATES.find(t => t.id === id)); break;
    case 'theme': state.theme = id; renderThemes(); renderLook(); refresh(); break;
    case 'wrap': state.wrap = id; previewMode = 'wrapper'; renderLook(); refresh(); break;
    case 'seal-color': state.sealColor = btn.dataset.hex; previewMode = 'wrapper'; renderLook(); refresh(); break;
    case 'emblem': state.sealEmblem = btn.dataset.value; previewMode = 'wrapper'; renderLook(); syncForm(); refresh(); break;
    case 'preview-mode': previewMode = btn.dataset.mode; refresh(); break;
    case 'open': playOpening(btn, () => { previewMode = 'card'; refresh(); }); break;
    case 'add-mod':
      state.mods[id] = MODULE_BY_ID[id].type === 'link' ? { l: '', u: '' } : '';
      renderModules(); refresh();
      $(`[data-mod="${id}"] input, [data-mod="${id}"] textarea`)?.focus();
      break;
    case 'remove-mod': delete state.mods[id]; renderModules(); refresh(); break;
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
    case 'add-custom':
      state.custom.push({ i: '✦', l: '', v: '' });
      renderCustom(); refresh();
      document.querySelector(`[data-custom="${state.custom.length - 1}"][data-key="l"]`)?.focus();
      break;
    case 'remove-custom': state.custom.splice(Number(btn.dataset.index), 1); renderCustom(); refresh(); break;
    case 'create': createLink(); break;
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
    if (el.type === 'checkbox') state[key] = el.checked;
    else if (el.type === 'radio') { if (el.checked) state[key] = el.value; }
    else state[key] = el.value;
    if (key === 'allDay') syncForm();
    if (key === 'to') $('[data-bind="smsText"]').placeholder = defaultSmsText(state);
    if (['date', 'hemi'].includes(key)) { renderThemes(); renderLook(); }
    if (key === 'sealEmblem') {
      previewMode = 'wrapper';
      for (const b of document.querySelectorAll('[data-action=emblem]')) b.classList.toggle('on', b.dataset.value === el.value);
      renderSealPreview();
    }
  } else if (el.dataset.modInput) {
    const id = el.dataset.modInput;
    state.mods[id] = el.value;
    for (const c of el.closest('.module').querySelectorAll('.chip')) c.classList.toggle('on', c.dataset.value === el.value);
  } else if (el.dataset.modLink) {
    state.mods.link = { ...state.mods.link, [el.dataset.modLink]: el.value };
  } else if (el.id === 'seal-custom') {
    state.sealColor = el.value;
    previewMode = 'wrapper';
    if (e.type === 'change') renderLook();
    else renderSealPreview();
  } else if (el.dataset.custom) {
    state.custom[Number(el.dataset.custom)][el.dataset.key] = el.value;
  } else {
    return;
  }
  refresh();
}

export function showBuilder() {
  const saved = store.get(DRAFT_KEY);
  state = { ...blankState(), ...(saved && typeof saved === 'object' ? saved : {}) };
  document.documentElement.removeAttribute('style');
  document.documentElement.removeAttribute('data-theme');
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
