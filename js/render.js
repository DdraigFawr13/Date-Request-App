// Renders an invitation card. Shared by the builder's live preview and the
// recipient's view. Every user-supplied string goes through esc() because the
// data arrives from a URL anyone could craft.

import { THEMES, MONTH_MOONS, moonPhase, partsInTz, sabbatOn } from './themes.js';
import { MODULES } from './modules.js';

export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

export const safeUrl = u => (/^https?:\/\//i.test(u || '') ? u : '');

export function applyTheme(el, theme) {
  const vars = {
    '--bg1': theme.bg[0], '--bg2': theme.bg[1], '--card': theme.card, '--ink': theme.ink,
    '--accent': theme.accent, '--accent2': theme.accent2, '--on-accent': theme.onAccent,
    '--font-display': theme.display, '--font-body': theme.body,
  };
  for (const [k, v] of Object.entries(vars)) el.style.setProperty(k, v);
  el.dataset.theme = theme.id;
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

export function moonLine(inv) {
  const { month, day } = partsInTz(inv.s, inv.tz);
  const phase = moonPhase(inv.s);
  const monthMoon = MONTH_MOONS[month - 1];
  const text = phase.name === 'Full Moon'
    ? `${phase.emoji} Beneath the full ${monthMoon}`
    : `${phase.emoji} ${phase.name}, in the month of the ${monthMoon}`;
  const sabbat = sabbatOn(month, day, inv.h);
  return { text, sabbat: sabbat ? THEMES[sabbat].name : null };
}

export const mapUrl = inv =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent([inv.loc, inv.addr].filter(Boolean).join(', '))}`;

export function renderCard(inv, theme) {
  const when = formatWhen(inv);
  const moon = moonLine(inv);
  const place = inv.loc || inv.addr;

  const details = MODULES
    .filter(m => inv.d?.[m.id] && !['link', 'rsvpby'].includes(m.id))
    .map(m => `<li class="detail"><span class="detail-icon">${m.icon}</span><span><b>${esc(m.label)}</b>${esc(inv.d[m.id])}</span></li>`);
  for (const c of inv.cf || []) {
    if (c.l || c.v) details.push(`<li class="detail"><span class="detail-icon">${esc(c.i || '✦')}</span><span><b>${esc(c.l)}</b>${esc(c.v)}</span></li>`);
  }

  const link = inv.d?.link;
  const linkHref = safeUrl(link?.u);

  return `
  <article class="card">
    <div class="card-badge">${esc(theme.glyph)} ${esc(theme.name)} <span>· ${esc(theme.tagline)}</span></div>
    ${inv.to ? `<p class="dear">Dear ${esc(inv.to)},</p>` : ''}
    <p class="greeting">${esc(theme.greeting)}</p>
    <h1 class="title">${esc(inv.title || 'A little bit of magic')}</h1>
    ${inv.msg ? `<p class="message">${esc(inv.msg)}</p>` : ''}
    <div class="divider" aria-hidden="true">${esc(theme.divider)}</div>
    <ul class="when">
      <li><span class="detail-icon">📅</span><span>${esc(when.date)}</span></li>
      <li><span class="detail-icon">🕰️</span><span>${esc(when.time)}</span></li>
      ${place ? `<li><span class="detail-icon">📍</span><span>${inv.loc ? `<b class="plain">${esc(inv.loc)}</b>` : ''}${inv.addr ? `<a href="${esc(mapUrl(inv))}" target="_blank" rel="noopener">${esc(inv.addr)}</a>` : ''}</span></li>` : ''}
      <li class="moon"><span>${esc(moon.text)}</span></li>
      ${moon.sabbat ? `<li class="sabbat-day">✨ It falls on ${esc(moon.sabbat)} itself ✨</li>` : ''}
    </ul>
    ${details.length ? `<div class="divider small" aria-hidden="true">${esc(theme.divider)}</div><ul class="details">${details.join('')}</ul>` : ''}
    ${linkHref ? `<a class="btn link-btn" href="${esc(linkHref)}" target="_blank" rel="noopener">🔗 ${esc(link.l || 'More info')}</a>` : ''}
    ${inv.d?.rsvpby ? `<p class="rsvp-by">⏳ Kindly reply by ${esc(formatShortDate(inv.d.rsvpby))}</p>` : ''}
    <p class="closing">${esc(inv.cl || theme.closing)}${inv.from ? `<span class="signature">${esc(inv.from)}</span>` : ''}</p>
  </article>`;
}
