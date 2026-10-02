// The recipient's side: an envelope (or scroll, bottle…) to open, the themed
// card, and RSVP buttons that add the event to a calendar and text the answer back.

import { resolveTheme } from './occasions.js';
import { QUESTION_BY_ID } from './modules.js';
import { decodeInvite } from './codec.js';
import { loadThemeFonts } from './fonts.js';
import { downloadIcs, googleUrl, isPast, outlookUrl } from './calendar.js';
import { ICONS, applyTheme, cardOpen, esc, formatWhen, particles, renderCard, sectionRule, wordsFor } from './render.js';
import { $, copyText, own, smsHref, store, toast } from './util.js';
import { playOpening, wrapperHtml } from './wrappers.js';

// `preview` is the sender watching their own invitation from the builder:
// nothing is remembered and no reply goes anywhere.
let inv, theme, url, words, preview;
const responseKey = () => `moonpost:rsvp:${inv.id || inv.s}`;
const savedAnswer = () => (preview ? null : store.get(responseKey()));
const ANSWER_WORDS = { yes: 'yes', maybe: 'maybe', no: 'no' };

function questions() {
  const qs = (inv.q || []).map(id => own(QUESTION_BY_ID, id)?.q).filter(Boolean);
  const theirOwn = Array.isArray(inv.qc) ? inv.qc : [inv.qc];
  for (const q of theirOwn) if (typeof q === 'string' && q.trim()) qs.push(q.trim());
  return qs;
}

// The reply that goes back by text. Its first line, "👥 Party of" and the
// "— name" sign-off are read back by the sender's reply log (builder.js).
export function replyText(invite, kind, { answers = [], note = '', name = '', party = 1 } = {}, qs = []) {
  const title = invite.title || 'your invitation';
  const { date } = formatWhen(invite);
  const lines = {
    yes: [`✨ Yes! I’d love to come to “${title}” on ${date}.`],
    maybe: [`🌙 I’d love to join “${title}” — could we find another time?`],
    no: [`💌 Thank you so much for the invitation to “${title}”. Sadly I can’t make it this time.`],
  }[kind];
  if (invite.hc && kind === 'yes') lines.push(`👥 Party of ${party}`);
  qs.forEach((q, i) => { if (answers[i]?.trim()) lines.push(`${q} ${answers[i].trim()}`); });
  if (note.trim()) lines.push(note.trim());
  if (invite.hc && name.trim()) lines.push(`— ${name.trim()}`);
  return lines.join('\n');
}

function calendarButtons() {
  return `<p class="sub">Add it to your calendar</p>
    <div class="btn-row">
      <button type="button" class="btn" data-action="ics">${ICONS.date} Apple / iPhone</button>
      <a class="btn" href="${esc(googleUrl(inv, url))}" target="_blank" rel="noopener">${ICONS.date} Google</a>
      <a class="btn" href="${esc(outlookUrl(inv, url))}" target="_blank" rel="noopener">${ICONS.date} Outlook</a>
      <button type="button" class="btn ghost" data-action="ics">${ICONS.download} .ics file</button>
    </div>`;
}

// For a group invitation: who's answering, and how many they're bringing.
function guestFields(kind) {
  if (!inv.hc) return '';
  const party = kind === 'yes'
    ? `<label>How many of you, including you?<input type="number" data-party min="1" max="${inv.hc}" value="1" inputmode="numeric"></label>
       <p class="hint">Up to ${inv.hc}.</p>`
    : '';
  return `<label>Your name<input data-name autocomplete="name" placeholder="So they know who’s answering"></label>${party}`;
}

function replyControls(kind) {
  const who = inv.from ? esc(inv.from) : 'them';
  const qs = kind === 'yes' ? questions() : [];
  const fields = qs.map((q, i) => `<label>${esc(q)}<input data-answer="${i}"></label>`).join('');
  const notePlaceholder = { yes: 'Anything else to add? (optional)', maybe: 'When works better for you?', no: 'Add a note (optional)' }[kind];
  return `${guestFields(kind)}${fields}<label>${kind === 'maybe' ? 'Suggest a time' : 'A note'}<textarea data-note rows="2" placeholder="${notePlaceholder}"></textarea></label>
    <div class="btn-row">
      <a id="reply-send" class="btn primary" data-action="send-reply">${ICONS.message} Text ${who} my answer</a>
      <button type="button" id="reply-copy" class="btn" data-action="copy-reply">${ICONS.copy} Copy my reply</button>
    </div>
    <p class="hint">“Text” opens your messages with the reply written for you — just pick ${who}. Or copy it and send it however you usually chat.</p>`;
}

function renderPanel(kind, { focus = true } = {}) {
  const panel = $('#rsvp-panel');
  const heading = `<h2 class="panel-title" id="rsvp-heading" tabindex="-1">${esc(words[`${kind}H`])}</h2>${words[`${kind}P`] ? `<p>${esc(words[`${kind}P`])}</p>` : ''}`;
  panel.innerHTML = `${sectionRule(inv, theme)}${heading}${replyControls(kind)}${kind === 'yes' ? `${sectionRule(inv, theme, true)}${calendarButtons()}` : ''}`;
  panel.hidden = false;
  for (const b of document.querySelectorAll('[data-r]')) {
    b.classList.toggle('chosen', b.dataset.r === kind);
    b.setAttribute('aria-pressed', String(b.dataset.r === kind));
  }

  const update = () => {
    const answers = [...panel.querySelectorAll('[data-answer]')].map(i => i.value);
    const note = panel.querySelector('[data-note]').value;
    const name = panel.querySelector('[data-name]')?.value || '';
    const raw = Number(panel.querySelector('[data-party]')?.value) || 1;
    const party = Math.min(Math.max(1, Math.round(raw)), inv.hc || 1);
    const text = replyText(inv, kind, { answers, note, name, party }, kind === 'yes' ? questions() : []);
    $('#reply-send').href = smsHref(inv.ph, text);
    $('#reply-copy').dataset.text = text;
  };
  panel.dataset.kind = kind;
  panel.oninput = update;
  update();
  if (focus) {
    panel.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    $('#rsvp-heading').focus({ preventScroll: true });
  }
}

function rememberAnswer() {
  const kind = $('#rsvp-panel')?.dataset.kind;
  if (kind && !preview) store.set(responseKey(), { r: kind, at: Date.now() });
}

function celebrate() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const burst = document.createElement('div');
  burst.className = 'burst';
  burst.setAttribute('aria-hidden', 'true');
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

// Once the evening is over there's nothing left to answer.
function pastSection(saved) {
  const { date } = formatWhen(inv);
  return `
        <h2 class="panel-title">${inv.ad ? 'This day has come and gone' : 'This evening has already passed'} 🌙</h2>
        <p class="hint">It was on ${esc(date)}.${saved?.r ? ` You answered “${esc(ANSWER_WORDS[saved.r] || saved.r)}”.` : ''} We hope it was magical.</p>`;
}

function respondSection(saved) {
  return `
        ${words.ask ? `<h2 class="panel-title">${esc(words.ask)}</h2>` : ''}
        ${saved ? `<p class="hint">You answered “${esc(ANSWER_WORDS[saved.r] || saved.r)}” earlier — you can change it anytime.</p>` : ''}
        <div class="rsvp-buttons" role="group" aria-label="Your answer">
          <button type="button" class="btn primary big" data-r="yes" aria-pressed="false">${esc(words.yes)}</button>
          <button type="button" class="btn" data-r="maybe" aria-pressed="false">${esc(words.maybe)}</button>
          <button type="button" class="btn ghost" data-r="no" aria-pressed="false">${esc(words.no)}</button>
        </div>
        <div id="rsvp-panel" role="region" aria-labelledby="rsvp-heading" hidden></div>`;
}

const previewBanner = () => (preview
  ? '<p class="preview-banner" role="note">👀 Preview: this is exactly what they’ll see. Nothing you tap here is sent.</p>'
  : '');

function showCard(root, { animate }) {
  const saved = savedAnswer();
  const past = isPast(inv);
  root.innerHTML = `${previewBanner()}
    <div class="invite-wrap ${animate ? 'reveal' : ''}">
      ${renderCard(inv, theme, words)}
      ${cardOpen(inv, theme, 'section', 'respond')}
        ${past ? pastSection(saved) : respondSection(saved)}
      </div></section>
      ${preview ? '' : `<p class="made-with"><a href="${esc(location.pathname)}">Make your own Moonpost ☾</a></p>`}
    </div>`;
  if (saved?.r && !past) renderPanel(saved.r, { focus: false });
  // Move keyboard and screen-reader focus from the (now gone) wrapper to the card.
  const title = root.querySelector('.card .title');
  title?.setAttribute('tabindex', '-1');
  if (animate) title?.focus({ preventScroll: true });
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
    // An answer only counts once they actually send or copy it.
    case 'send-reply':
      if (preview) { e.preventDefault(); toast('In the real invitation, this opens their messages 💬'); break; }
      rememberAnswer();
      break;
    case 'copy-reply': rememberAnswer(); copyText(btn.dataset.text).then(() => toast('Reply copied 📋')); break;
  }
}

export async function showInvite(code, { preview: isPreview = false } = {}) {
  const root = $('#invite');
  preview = isPreview;
  $('#builder').hidden = true;
  $('#builder-sky').hidden = true;
  root.hidden = false;
  document.body.classList.remove('show-preview');
  document.body.classList.toggle('previewing', preview);
  try {
    inv = await decodeInvite(code);
    resolveTheme(inv); wordsFor(inv); // fail here, not halfway through drawing the page
  } catch {
    root.innerHTML = `<div class="card lost"><h1 class="title">This invitation lost its way 🌫️</h1>
      <p>The link may have been cut off when it was sent. Ask the sender to send it again, or
      <a href="${esc(location.pathname)}">make your own</a>.</p></div>`;
    return;
  }
  // The link they'd keep in their calendar is the real one, not the preview.
  url = location.href.replace(/&preview$/, '');
  theme = resolveTheme(inv);
  words = wordsFor(inv);
  loadThemeFonts(theme);
  applyTheme(document.documentElement, theme, inv);
  particles($('#sky'), theme);
  document.title = `${inv.title || 'An invitation'}${inv.from ? ` — from ${inv.from}` : ''}`;
  if (!showInvite.bound) {
    root.addEventListener('click', onClick);
    // Inside the builder's "see it as they will" frame, Escape closes the frame.
    addEventListener('keydown', e => {
      if (preview && e.key === 'Escape' && parent !== window) parent.postMessage({ moonpost: 'close-preview' }, location.origin);
    });
    showInvite.bound = true;
  }
  if (savedAnswer()) showCard(root, { animate: false });
  else root.innerHTML = previewBanner() + wrapperHtml(inv, theme, words);
}
