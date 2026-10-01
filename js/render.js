// Renders an invitation card. Shared by the builder's live preview and the
// recipient's view. Every user-supplied string goes through esc() because the
// data arrives from a URL anyone could craft.

import { THEMES, MONTH_MOONS, moonPhase, partsInTz, sabbatOn } from './themes.js';
import { wording } from './occasions.js';
import { MODULES } from './modules.js';
import { backdropCss, backdropIsDark, decorHtml, resolvePaper, resolveRule, ruleHtml } from './decor.js';
import { sealHtml } from './seal.js';
import { esc } from './util.js';

export { esc };

export const safeUrl = u => (/^https?:\/\//i.test(u || '') ? u : '');

export function applyTheme(el, theme, inv = {}) {
  const vars = {
    '--bg1': theme.bg[0], '--bg2': theme.bg[1], '--card': theme.card, '--ink': theme.ink,
    '--accent': theme.accent, '--accent2': theme.accent2, '--on-accent': theme.onAccent,
    '--font-display': theme.display, '--font-body': theme.body,
    '--backdrop': backdropCss(theme, inv),
    '--on-bg': backdropIsDark(theme, inv) ? '#ffffff' : theme.ink,
    '--on-bg-glow': backdropIsDark(theme, inv) ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.75)',
  };
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

export const mapUrl = inv =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([inv.loc, inv.addr].filter(Boolean).join(', '))}`;

export function detailLabel(inv, m) {
  const custom = inv.dl?.[m.id];
  return typeof custom === 'string' && custom.trim() ? custom.trim() : m.label;
}

export function renderCard(inv, theme, words = wordsFor(inv)) {
  const when = formatWhen(inv);
  const place = inv.loc || inv.addr;
  const rule = resolveRule(inv, theme);
  const glyphs = { emoji: esc(theme.divider), glyph: esc(theme.glyph) };
  const divide = (small = false) => {
    const html = ruleHtml(rule, theme, glyphs);
    return small ? html.replace(/class="(rule|divider)/, 'class="$1 small') : html;
  };

  const details = MODULES
    .filter(m => inv.d?.[m.id] && !['link', 'rsvpby'].includes(m.id))
    .map(m => `<li class="detail"><span class="detail-icon">${m.icon}</span><span><b>${esc(detailLabel(inv, m))}</b>${esc(inv.d[m.id])}</span></li>`);
  for (const c of inv.cf || []) {
    if (c.l || c.v) details.push(`<li class="detail"><span class="detail-icon">${esc(c.i || '✦')}</span><span><b>${esc(c.l)}</b>${esc(c.v)}</span></li>`);
  }

  const link = inv.d?.link;
  const linkHref = safeUrl(link?.u);

  return `
  <article class="card" data-paper="${esc(resolvePaper(inv, theme))}"${theme.dark ? ' data-dark' : ''}>
    ${decorHtml(inv, theme)}
    <div class="card-body">
      ${words.badge ? `<div class="card-badge">${esc(words.badge)}</div>` : ''}
      ${words.dear ? `<p class="dear">${esc(words.dear)}</p>` : ''}
      ${words.greet ? `<p class="greeting">${esc(words.greet)}</p>` : ''}
      <h1 class="title">${esc(inv.title || 'A little bit of magic')}</h1>
      ${inv.msg ? `<p class="message">${esc(inv.msg)}</p>` : ''}
      ${divide()}
      <ul class="when">
        <li><span class="detail-icon">📅</span><span>${esc(when.date)}</span></li>
        <li><span class="detail-icon">🕰️</span><span>${esc(when.time)}</span></li>
        ${place ? `<li><span class="detail-icon">📍</span><span>${inv.loc ? `<b class="plain">${esc(inv.loc)}</b>` : ''}${inv.addr ? `<a href="${esc(mapUrl(inv))}" target="_blank" rel="noopener">${esc(inv.addr)}</a>` : ''}</span></li>` : ''}
        ${words.moon.trim() ? `<li class="moon"><span>${esc(words.moon.trim())}</span></li>` : ''}
      </ul>
      ${details.length ? `${divide(true)}<ul class="details">${details.join('')}</ul>` : ''}
      ${linkHref ? `<a class="btn link-btn" href="${esc(linkHref)}" target="_blank" rel="noopener">🔗 ${esc(link.l || 'More info')}</a>` : ''}
      ${inv.d?.rsvpby ? `<p class="rsvp-by">⏳ ${esc(words.by)} ${esc(formatShortDate(inv.d.rsvpby))}</p>` : ''}
      ${divide(true)}
      <p class="closing">${esc(words.close)}${inv.from ? `<span class="signature">${esc(inv.from)}</span>` : ''}</p>
      ${sealHtml(inv, theme, 'card-seal')}
    </div>
  </article>`;
}
