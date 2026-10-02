// Renders an invitation card. Shared by the builder's live preview and the
// recipient's view. Every user-supplied string goes through esc() because the
// data arrives from a URL anyone could craft.

import { THEMES, MONTH_MOONS, moonPhase, partsInTz, sabbatOn } from './themes.js';
import { wording } from './occasions.js';
import { MODULES } from './modules.js';
import { backdropCss, foilCss, luminance, readableButton, resolveGlow, textOnBackdrop, decorHtml, resolvePaper, resolveRule, ruleHtml } from './decor.js';
import { sealHtml } from './seal.js';
import { esc, escEmoji } from './util.js';

export { esc };

export const safeUrl = u => (/^https?:\/\//i.test(u || '') ? u : '');

export function applyTheme(el, theme, inv = {}) {
  const vars = {
    '--bg1': theme.bg[0], '--bg2': theme.bg[1], '--card': theme.card, '--ink': theme.ink,
    '--accent': theme.accent, '--accent2': theme.accent2, '--on-accent': readableButton(theme).ink,
    '--font-display': theme.display, '--font-body': theme.body,
    '--backdrop': backdropCss(theme, inv),
    '--on-bg': textOnBackdrop(theme, inv),
    '--on-bg-glow': luminance(textOnBackdrop(theme, inv)) > 0.5 ? 'rgba(0, 0, 0, 0.55)' : 'rgba(255, 255, 255, 0.7)',
    '--btn': readableButton(theme).bg,
  };
  const glow = resolveGlow(inv, theme);
  vars['--glow'] = glow || 'transparent';
  el.dataset.glow = glow ? 'on' : '';
  vars['--foil'] = theme.foil ? foilCss(theme.foil.stops) : 'none';
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  el.dataset.theme = theme.id;
  el.dataset.font = theme.fontId || '';
}

// Fills `el` with drifting theme particles (emoji, stars, leaves…).
export function particles(el, theme, count = 16) {
  el.replaceChildren();
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) count = Math.min(count, 6);
  for (let i = 0; i < count; i++) {
    const s = document.createElement('span');
    s.className = 'particle';
    s.textContent = theme.particles[i % theme.particles.length];
    s.style.left = `${(i * 61.8) % 100}%`;
    s.style.fontSize = `${0.9 + ((i * 7) % 10) / 8}rem`;
    s.style.animationDuration = `${14 + ((i * 13) % 16)}s`;
    s.style.animationDelay = `${-((i * 17) % 30)}s`;
    s.style.setProperty('--drift', `${((i % 5) - 2) * 30}px`);
    el.append(s);
  }
}

export function formatWhen(inv) {
  const localTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tz = inv.tz || localTz;
  const date = new Intl.DateTimeFormat(undefined, { timeZone: tz, weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }).format(inv.s);
  if (inv.ad) return { date, time: 'All day' };
  const showTz = tz !== localTz;
  const t = (ms, withTz) => new Intl.DateTimeFormat(undefined, {
    timeZone: tz, hour: 'numeric', minute: '2-digit', ...(withTz ? { timeZoneName: 'short' } : {}),
  }).format(ms);
  return { date, time: inv.e ? `${t(inv.s)} – ${t(inv.e, showTz)}` : t(inv.s, showTz) };
}

export function formatShortDate(isoDate) {
  const [y, m, d] = isoDate.split('-').map(Number);
  if (!y || !m || !d) return isoDate;
  return new Intl.DateTimeFormat(undefined, { weekday: 'short', month: 'short', day: 'numeric' }).format(new Date(y, m - 1, d));
}

// The default moon line, e.g. "🌕 Beneath the full Hunter’s Moon".
export function moonLine(inv) {
  const { month, day } = partsInTz(inv.s, inv.tz);
  const phase = moonPhase(inv.s);
  const monthMoon = MONTH_MOONS[month - 1];
  const text = phase.name === 'Full Moon'
    ? `${phase.emoji} Beneath the full ${monthMoon}`
    : `${phase.emoji} ${phase.name}, in the month of the ${monthMoon}`;
  const sabbat = sabbatOn(month, day);
  return sabbat ? `${text}\n✨ It falls on ${THEMES[sabbat].name} itself ✨` : text;
}

// The invitation's full wording, including the computed moon line.
export const wordsFor = inv => wording(inv, { moon: moonLine(inv) });

// Fine line-art icons that match the gilded ornaments.
const icon = d => `<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${d}</svg>`;
export const ICONS = {
  date: icon('<rect x="3.5" y="5" width="17" height="15.5" rx="2"/><path d="M3.5 9.5h17M8 3v4M16 3v4"/><path d="M8 13.5h.01M12 13.5h.01M16 13.5h.01M8 17h.01M12 17h.01" stroke-width="2.2"/>'),
  time: icon('<circle cx="12" cy="12" r="8.5"/><path d="M12 7v5l3.2 2"/>'),
  place: icon('<path d="M12 21s-6.5-6.2-6.5-11a6.5 6.5 0 0 1 13 0c0 4.8-6.5 11-6.5 11z"/><circle cx="12" cy="10" r="2.4"/>'),
  by: icon('<path d="M7 3h10M7 21h10"/><path d="M8 3c0 5 8 5.5 8 9s-8 4-8 9M16 3c0 5-8 5.5-8 9s8 4 8 9"/>'),
  message: icon('<path d="M4.5 5.5h15a1.5 1.5 0 0 1 1.5 1.5v9a1.5 1.5 0 0 1-1.5 1.5H10l-4.5 3.5V17.5h-1A1.5 1.5 0 0 1 3 16V7a1.5 1.5 0 0 1 1.5-1.5z"/>'),
  copy: icon('<rect x="8.5" y="8.5" width="11.5" height="12" rx="1.6"/><path d="M15.5 8.5V5.6A1.6 1.6 0 0 0 13.9 4H5.6A1.6 1.6 0 0 0 4 5.6v8.3a1.6 1.6 0 0 0 1.6 1.6h2.9"/>'),
  download: icon('<path d="M12 4v11M7.5 10.5 12 15l4.5-4.5M5 19.5h14"/>'),
  link: icon('<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>'),
};
const medal = inner => `<span class="detail-icon">${inner}</span>`;

// The paper, ornaments and body wrapper shared by every card on the page.
export function cardOpen(inv, theme, tag = 'article', cls = '') {
  const foil = theme.foil ? ` data-foil="${theme.foil.id}"${theme.foil.title ? ' data-foil-title' : ''}` : '';
  return `<${tag} class="card ${cls}" data-paper="${esc(resolvePaper(inv, theme))}"${theme.dark ? ' data-dark' : ''}${foil}>
    ${decorHtml(inv, theme)}<div class="card-body">`;
}

// A script line between sections, in the invitation's chosen style.
export function sectionRule(inv, theme, small = false) {
  const html = ruleHtml(resolveRule(inv, theme), theme, { emoji: esc(theme.divider), glyph: esc(theme.glyph) });
  return small ? html.replace(/class="(rule|divider)/, 'class="$1 small') : html;
}

// Titles with long words shrink a little so a word never splits across lines.
const longestWord = t => Math.max(0, ...String(t || '').split(/\s+/).map(w => [...w].length));

export const mapUrl = inv =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([inv.loc, inv.addr].filter(Boolean).join(', '))}`;

export function detailLabel(inv, m) {
  const custom = inv.dl?.[m.id];
  return typeof custom === 'string' && custom.trim() ? custom.trim() : m.label;
}

export function renderCard(inv, theme, words = wordsFor(inv)) {
  const when = formatWhen(inv);
  const place = inv.loc || inv.addr;
  const divide = (small = false) => sectionRule(inv, theme, small);

  const details = MODULES
    .filter(m => inv.d?.[m.id] && !['link', 'rsvpby'].includes(m.id))
    .map(m => `<li class="detail">${medal(m.icon)}<span><b>${esc(detailLabel(inv, m))}</b>${esc(inv.d[m.id])}</span></li>`);
  for (const c of inv.cf || []) {
    if (c.l || c.v) details.push(`<li class="detail">${medal(esc(c.i || '✦'))}<span><b>${esc(c.l)}</b>${esc(c.v)}</span></li>`);
  }

  const link = inv.d?.link;
  const linkHref = safeUrl(link?.u);

  return `
  ${cardOpen(inv, theme)}
      ${words.badge ? `<div class="card-badge">${esc(words.badge)}</div>` : ''}
      ${words.dear ? `<p class="dear">${escEmoji(words.dear)}</p>` : ''}
      ${words.greet ? `<p class="greeting">${escEmoji(words.greet)}</p>` : ''}
      <h1 class="title${longestWord(inv.title) > 10 ? ' long-words' : longestWord(inv.title) > 7 ? ' longish-words' : ''}">${esc(inv.title || 'A little bit of magic')}</h1>
      ${inv.msg ? `<p class="message">${esc(inv.msg)}</p>` : ''}
      ${divide()}
      <ul class="when">
        <li>${medal(ICONS.date)}<span>${esc(when.date)}</span></li>
        <li>${medal(ICONS.time)}<span>${esc(when.time)}</span></li>
        ${place ? `<li>${medal(ICONS.place)}<span>${inv.loc ? `<b class="plain">${esc(inv.loc)}</b>` : ''}${inv.addr ? `<a href="${esc(mapUrl(inv))}" target="_blank" rel="noopener">${esc(inv.addr)}</a>` : ''}</span></li>` : ''}
        ${words.moon.trim() ? `<li class="moon"><span>${escEmoji(words.moon.trim())}</span></li>` : ''}
      </ul>
      ${details.length ? `${divide(true)}<ul class="details">${details.join('')}</ul>` : ''}
      ${linkHref ? `<a class="btn link-btn" href="${esc(linkHref)}" target="_blank" rel="noopener">${ICONS.link} ${esc(link.l || 'More info')}</a>` : ''}
      ${inv.d?.rsvpby ? `<p class="rsvp-by">${ICONS.by} ${esc(words.by)} ${esc(formatShortDate(inv.d.rsvpby))}</p>` : ''}
      ${divide(true)}
      <p class="closing">${escEmoji(words.close)}${inv.from ? `<span class="signature">${esc(inv.from)}</span>` : ''}</p>
      ${sealHtml(inv, theme, 'card-seal')}
    </div>
  </article>`;
}
