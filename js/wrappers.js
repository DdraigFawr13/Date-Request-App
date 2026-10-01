// How an invitation arrives: the "wrapper" the recipient taps to open
// (envelope, scroll, bottle…), dressed in the look's colors and pattern, and
// closed with the wax seal.

import { esc } from './util.js';
import { patternCss } from './decor.js';
import { breakableSealHtml, shade } from './seal.js';

export const WRAPPERS = {
  envelope: { label: 'Envelope', icon: '✉️', openMs: 1750 },
  scroll: { label: 'Scroll', icon: '📜', openMs: 1900 },
  bottle: { label: 'Message in a bottle', icon: '🍾', openMs: 1900 },
  chest: { label: 'Treasure chest', icon: '🧰', openMs: 1900 },
  gift: { label: 'Gift box', icon: '🎁', openMs: 1850 },
};

export function resolveWrapper(inv, look) {
  return WRAPPERS[inv.w] ? inv.w : look.wrap || 'envelope';
}

// Mixes two hex colors (t = share of b).
function mix(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const ch = s => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t);
  return `#${[16, 8, 0].map(s => ch(s).toString(16).padStart(2, '0')).join('')}`;
}

// Material colors for a look, as CSS custom properties.
function materials(look) {
  const paper = look.dark ? mix(look.bg[1], look.accent2, 0.18) : mix(look.card, look.accent2, 0.22);
  const vars = {
    '--paper': paper,
    '--paper-dark': shade(paper, -0.18),
    '--liner': look.dark ? shade(look.accent, -0.35) : look.accent,
    '--liner-pattern': patternCss(look.pattern, look.dark ? look.accent2 : '#ffffff', look.accent2, 0.55),
    '--wrap-paper': look.dark ? shade(look.bg[1], 0.08) : mix(look.accent2, look.card, 0.35),
    '--wrap-pattern': patternCss(look.pattern, look.dark ? look.accent2 : '#ffffff', look.accent, look.dark ? 0.55 : 0.6),
    '--ribbon': look.accent,
  };
  return Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');
}

const sparks = () => `<span class="sparks">${Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2, d = 70 + (i % 3) * 30;
  return `<i style="--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;--delay:${(i % 4) * 30}ms">${i % 3 ? '✦' : '✧'}</i>`;
}).join('')}</span>`;

const letter = glyph => `<span class="letter-glyph">${glyph}</span><span class="letter-lines"></span>`;

const PARTS = {
  envelope: (seal, glyph) => `
    <span class="env-back"></span>
    <span class="env-liner"></span>
    <span class="env-letter">${letter(glyph)}</span>
    <span class="env-front"></span>
    <span class="env-flap"><span class="flap-out"></span><span class="flap-in"></span></span>
    <span class="seal-spot">${seal}${sparks()}</span>`,
  scroll: (seal, glyph) => `
    <span class="scroll-paper"><span class="scroll-text">${letter(glyph)}</span></span>
    <span class="scroll-rod top"></span>
    <span class="scroll-rod bottom"></span>
    <span class="scroll-ribbon"></span>
    <span class="seal-spot">${seal}${sparks()}</span>`,
  bottle: (seal, glyph) => `
    <span class="bottle-waves back"></span>
    <span class="bottle-body">
      <span class="bottle-note"><span class="note-glyph">${glyph}</span></span>
      <span class="bottle-glass"></span>
      <span class="bottle-neck"></span>
      <span class="bottle-cork"></span>
      <span class="seal-spot">${seal}${sparks()}</span>
    </span>
    <span class="bottle-waves front"></span>`,
  chest: (seal, glyph) => `
    <span class="chest-rays"></span>
    <span class="chest-glow"></span>
    <span class="chest-letter">${letter(glyph)}</span>
    <span class="chest-base"><span class="chest-bands"></span></span>
    <span class="chest-lid"><span class="chest-bands"></span></span>
    <span class="chest-plate"></span>
    <span class="seal-spot">${seal}${sparks()}</span>`,
  gift: (seal, glyph) => `
    <span class="gift-glow"></span>
    <span class="gift-letter">${letter(glyph)}</span>
    <span class="gift-box"><span class="ribbon-v"></span></span>
    <span class="gift-lid"><span class="ribbon-v"></span><span class="ribbon-h"></span>
      <span class="gift-bow"><span class="loop l"></span><span class="loop r"></span><span class="knot"></span></span></span>
    <span class="seal-spot">${seal}${sparks()}</span>`,
};

export function wrapperHtml(inv, look, words) {
  const type = resolveWrapper(inv, look);
  const seal = breakableSealHtml(inv, look, 'wrap-seal');
  return `
    <div class="wrapper-stage">
      ${words.for ? `<p class="wrapper-to">${esc(words.for)}</p>` : ''}
      <button type="button" class="wrapper ${type}" data-action="open" data-wrap="${type}" aria-label="Open the invitation" style="${esc(materials(look))}">
        ${PARTS[type](seal, esc(look.glyph))}
        <span class="twinkles"><i>✦</i><i>✧</i><i>✦</i></span>
      </button>
      ${words.tap ? `<p class="wrapper-hint">${esc(words.tap)}</p>` : ''}
      ${words.fromLine ? `<p class="wrapper-from">${esc(words.fromLine)}</p>` : ''}
    </div>`;
}

// Plays the opening animation, then calls `done`.
export function playOpening(btn, done) {
  if (btn.classList.contains('opening')) return;
  btn.classList.add('opening');
  btn.closest('.wrapper-stage')?.classList.add('opening');
  const ms = matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : WRAPPERS[btn.dataset.wrap]?.openMs || 1500;
  setTimeout(done, ms);
}
