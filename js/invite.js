// The recipient's side: an envelope (or scroll, bottle…) to open, the themed
// card, and RSVP buttons that add the event to a calendar and text the answer back.

import { resolveTheme } from './themes.js';
import { QUESTION_BY_ID } from './modules.js';
import { decodeInvite } from './codec.js';
import { downloadIcs, googleUrl, outlookUrl } from './calendar.js';
import { applyTheme, esc, formatWhen, particles, renderCard } from './render.js';
import { $, copyText, smsHref, store, toast } from './util.js';
import { playOpening, wrapperHtml } from './wrappers.js';

let inv, theme, url;
const responseKey = () => `moonpost:rsvp:${inv.id || inv.s}`;

function questions() {
  const qs = (inv.q || []).map(id => QUESTION_BY_ID[id]?.q).filter(Boolean);
  if (inv.qc) qs.push(inv.qc);
  return qs;
}

function replyText(kind, answers = [], note = '') {
  const title = inv.title || 'your invitation';
  const { date } = formatWhen(inv);
  const lines = {
    yes: [`✨ Yes! I’d love to come to “${title}” on ${date}.`],
    maybe: [`🌙 I’d love to join “${title}” — could we find another time?`],
    no: [`💌 Thank you so much for the invitation to “${title}”. Sadly I can’t make it this time.`],
  }[kind];
  questions().forEach((q, i) => { if (answers[i]?.trim()) lines.push(`${q} ${answers[i].trim()}`); });
  if (note.trim()) lines.push(note.trim());
  return lines.join('\n');
}

function calendarButtons() {
  return `<p class="sub">Add it to your calendar</p>
    <div class="btn-row">
      <button type="button" class="btn" data-action="ics">🍎 Apple / iPhone</button>
      <a class="btn" href="${esc(googleUrl(inv, url))}" target="_blank" rel="noopener">📆 Google</a>
      <a class="btn" href="${esc(outlookUrl(inv, url))}" target="_blank" rel="noopener">📧 Outlook</a>
      <button type="button" class="btn ghost" data-action="ics">⬇ .ics file</button>
    </div>`;
}

function replyControls(kind) {
  const who = inv.from ? esc(inv.from) : 'them';
  const qs = kind === 'yes' ? questions() : [];
  const fields = qs.map((q, i) => `<label>${esc(q)}<input data-answer="${i}"></label>`).join('');
  const notePlaceholder = { yes: 'Anything else to add? (optional)', maybe: 'When works better for you?', no: 'Add a note (optional)' }[kind];
  const send = inv.ph
    ? `<a id="reply-send" class="btn primary">💬 Text ${who} my answer</a>`
    : `<button type="button" id="reply-send" class="btn primary" data-action="copy-reply">📋 Copy my reply</button>`;
  return `${fields}<label>${kind === 'maybe' ? 'Suggest a time' : 'A note'}<textarea data-note rows="2" placeholder="${notePlaceholder}"></textarea></label>
    <div class="btn-row">${send}</div>
    ${inv.ph ? '' : `<p class="hint">Copy this and send it to ${who} however you usually chat.</p>`}`;
}

function renderPanel(kind, { scroll = true } = {}) {
  const panel = $('#rsvp-panel');
  const heading = {
    yes: `<h2 class="panel-title">Hooray! ✨</h2><p>${inv.from ? `${esc(inv.from)} will be` : 'They’ll be'} so happy.</p>`,
    maybe: `<h2 class="panel-title">Another time? 🌙</h2><p>No worries — suggest what works for you.</p>`,
    no: `<h2 class="panel-title">Maybe next time 💌</h2><p>It’s kind to let them know.</p>`,
  }[kind];
  panel.innerHTML = `${heading}${replyControls(kind)}${kind === 'yes' ? calendarButtons() : ''}`;
  panel.hidden = false;
  for (const b of document.querySelectorAll('[data-r]')) b.classList.toggle('chosen', b.dataset.r === kind);

  const update = () => {
    const answers = [...panel.querySelectorAll('[data-answer]')].map(i => i.value);
    const note = panel.querySelector('[data-note]').value;
    const text = replyText(kind, answers, note);
    const send = $('#reply-send');
    if (inv.ph) send.href = smsHref(inv.ph, text);
    send.dataset.text = text;
    store.set(responseKey(), { r: kind, at: Date.now() });
  };
  panel.oninput = update;
  update();
  if (scroll) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const burst = document.createElement('div');
  burst.className = 'burst';
  for (let i = 0; i < 28; i++) {
    const s = document.createElement('span');
    s.textContent = theme.particles[i % theme.particles.length];
    const angle = (i / 28) * Math.PI * 2;
    const dist = 120 + (i % 4) * 50;
    s.style.setProperty('--x', `${Math.cos(angle) * dist}px`);
    s.style.setProperty('--y', `${Math.sin(angle) * dist}px`);
    s.style.animationDelay = `${(i % 5) * 40}ms`;
    burst.append(s);
  }
  document.body.append(burst);
  setTimeout(() => burst.remove(), 1800);
}

function showCard(root, { animate }) {
  const saved = store.get(responseKey());
  root.innerHTML = `
    <div class="invite-wrap ${animate ? 'reveal' : ''}">
      ${renderCard(inv, theme)}
      <section class="respond card">
        <h2 class="panel-title">Will you join${inv.from ? ` ${esc(inv.from)}` : ''}?</h2>
        ${saved ? `<p class="hint">You answered “${{ yes: 'yes', maybe: 'maybe', no: 'no' }[saved.r] || saved.r}” earlier — you can change it anytime.</p>` : ''}
        <div class="rsvp-buttons">
          <button type="button" class="btn primary big" data-r="yes">${esc(theme.yes)}</button>
          <button type="button" class="btn" data-r="maybe">Maybe — another time?</button>
          <button type="button" class="btn ghost" data-r="no">Sadly, I can’t</button>
        </div>
        <div id="rsvp-panel" hidden></div>
      </section>
      <p class="made-with"><a href="${esc(location.pathname)}">Make your own Moonpost ☾</a></p>
    </div>`;
  if (saved?.r) renderPanel(saved.r, { scroll: false });
}

function onClick(e) {
  const btn = e.target.closest('[data-action], [data-r]');
  if (!btn) return;
  const root = $('#invite');
  if (btn.dataset.r) {
    if (btn.dataset.r === 'yes') celebrate();
    renderPanel(btn.dataset.r);
    return;
  }
  switch (btn.dataset.action) {
    case 'open': playOpening(btn, () => showCard(root, { animate: true })); break;
    case 'ics': downloadIcs(inv, url); break;
    case 'copy-reply': copyText(btn.dataset.text).then(() => toast('Reply copied 📋')); break;
  }
}

export async function showInvite(code) {
  const root = $('#invite');
  $('#builder').hidden = true;
  root.hidden = false;
  document.body.classList.remove('show-preview');
  try {
    inv = await decodeInvite(code);
  } catch {
    root.innerHTML = `<div class="card lost"><h1 class="title">This invitation lost its way 🌫️</h1>
      <p>The link may have been cut off when it was sent. Ask the sender to send it again, or
      <a href="${esc(location.pathname)}">make your own</a>.</p></div>`;
    return;
  }
  url = location.href;
  theme = resolveTheme(inv);
  applyTheme(document.documentElement, theme);
  particles($('#sky'), theme);
  document.title = `${inv.title || 'An invitation'}${inv.from ? ` — from ${inv.from}` : ''}`;
  if (!showInvite.bound) {
    root.addEventListener('click', onClick);
    showInvite.bound = true;
  }
  if (store.get(responseKey())) showCard(root, { animate: false });
  else root.innerHTML = wrapperHtml(inv, theme);
}
