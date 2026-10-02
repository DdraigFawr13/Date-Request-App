// How an invitation arrives: the "wrapper" the recipient taps to open
// (envelope, scroll, bottle…), dressed in the look's colors and pattern, and
// closed with the wax seal.

import { esc } from './util.js';
import { cornerSvg, patternCss } from './decor.js';
import { breakableSealHtml, shade } from './seal.js';
import {
  bottleBack, bottleFront, bowHalf, bowKnot, chestBase, chestLid, chestLining, chestPlate, corkArt, envelopeFlap,
  envelopeFront, giftTag, pageHtml, rolledNote, sprig, tissue, treasure,
} from './wrapper-art.js';

export const WRAPPERS = {
  envelope: { label: 'Envelope', icon: '✉️', openMs: 1750 },
  scroll: { label: 'Scroll', icon: '📜', openMs: 2150 },
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
    '--sprig': look.accent2,
    '--gem': look.accent,
  };
  return Object.entries(vars).map(([k, v]) => `${k}:${v}`).join(';');
}

const sparks = () => `<span class="sparks">${Array.from({ length: 14 }, (_, i) => {
  const a = (i / 14) * Math.PI * 2, d = 70 + (i % 3) * 30;
  return `<i style="--dx:${(Math.cos(a) * d).toFixed(0)}px;--dy:${(Math.sin(a) * d).toFixed(0)}px;--delay:${(i % 4) * 30}ms">${i % 3 ? '✦' : '✧'}</i>`;
}).join('')}</span>`;

// ── The scroll: parchment rolled on dowels with turned, gilded finials ──
let svgId = 0;
const FINIAL = `<circle cx='21.5' cy='26' r='5.6'/><rect x='14' y='22.6' width='4.5' height='6.8' rx='1'/>
  <path d='M15 26 C15 16.5 7.5 15 4.2 21.6 C3.2 23.6 3.2 28.4 4.2 30.4 C7.5 37 15 35.5 15 26Z'/>
  <path d='M4.5 23.8 L0.8 26 L4.5 28.2Z'/><circle cx='1.2' cy='26' r='1.7'/>
  <rect x='25' y='15.5' width='3' height='21' rx='1.2'/><rect x='29' y='12.5' width='9' height='27' rx='2'/>`;
const ROLL_END = x => `<ellipse cx='${x}' cy='26' rx='6' ry='23' fill='#ead6a8' stroke='#8a6a38' stroke-width='.8'/>
  <g fill='none' stroke='#a7834b' stroke-width='.7'><ellipse cx='${x}' cy='26' rx='4.2' ry='16.5'/><ellipse cx='${x}' cy='26.5' rx='2.7' ry='10.5'/><ellipse cx='${x}' cy='27' rx='1.3' ry='4.8'/></g>`;

function rollSvg(withTassels) {
  const id = `sr${++svgId}`;
  const gold = `url(#${id}g)`;
  return `<svg class="roll-art" viewBox="0 0 320 52" preserveAspectRatio="none" aria-hidden="true">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5e3d0c"/><stop offset=".22" stop-color="#c9962e"/><stop offset=".42" stop-color="#fff3c4"/><stop offset=".56" stop-color="#e2b24e"/><stop offset=".82" stop-color="#a37218"/><stop offset="1" stop-color="#5a3a0a"/></linearGradient>
      <linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#94733f"/><stop offset=".16" stop-color="#e3cb98"/><stop offset=".4" stop-color="#fbf0d6"/><stop offset=".6" stop-color="#f1deb4"/><stop offset=".86" stop-color="#c4a265"/><stop offset="1" stop-color="#83632f"/></linearGradient>
      <linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3d2208"/><stop offset=".45" stop-color="#b97c3e"/><stop offset=".6" stop-color="#8a5a2b"/><stop offset="1" stop-color="#3a1f07"/></linearGradient>
    </defs>
    <rect x="10" y="21" width="300" height="10" rx="3" fill="url(#${id}w)"/>
    <rect x="40" y="3" width="240" height="46" rx="3" fill="url(#${id}p)"/>
    <g fill="${gold}" opacity=".9"><rect x="47" y="3" width="2.2" height="46"/><rect x="51" y="3" width=".9" height="46"/><rect x="270.8" y="3" width="2.2" height="46"/><rect x="268.1" y="3" width=".9" height="46"/></g>
    <rect x="40" y="9" width="240" height="3.5" rx="1.7" fill="#fff" opacity=".35"/>
    ${ROLL_END(40)}${ROLL_END(280)}
    <g fill="${gold}">${FINIAL}<g transform="translate(320 0) scale(-1 1)">${FINIAL}</g></g>
  </svg>${withTassels ? `<span class="tassel l">${tasselSvg()}</span><span class="tassel r">${tasselSvg()}</span>` : ''}`;
}

function tasselSvg() {
  const id = `st${++svgId}`;
  const fringe = [5, 7.5, 10, 12, 14, 16.5, 19].map(x => `<path d='M${x} 32 L${(x - 12) * 1.25 + 12} 66'/>`).join('');
  return `<svg viewBox="0 0 24 70" aria-hidden="true">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#6e4a0c"/><stop offset=".4" stop-color="#fff1c4"/><stop offset=".6" stop-color="#d8ad45"/><stop offset="1" stop-color="#6e4a0c"/></linearGradient>
      <linearGradient id="${id}r" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".45" stop-color="#fff" stop-opacity=".25"/><stop offset=".6" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
    </defs>
    <path d="M12 0 V15" stroke="#c9962e" stroke-width="1.5"/>
    <ellipse cx="12" cy="17.5" rx="3.8" ry="3.4" fill="url(#${id}g)"/>
    <path d="M7.6 22.5 C7.6 20.4 16.4 20.4 16.4 22.5 L17.6 29 H6.4Z" fill="url(#${id}g)"/>
    <rect x="6" y="29" width="12" height="2.6" rx="1" fill="#8a6514"/>
    <path d="M6.4 31.6 C5 42 3.6 54 2.6 66.5 Q12 69.5 21.4 66.5 C20.4 54 19 42 17.6 31.6Z" style="fill:var(--ribbon)"/>
    <g stroke="#000" stroke-opacity=".22" stroke-width=".6">${fringe}</g>
    <path d="M6.4 31.6 C5 42 3.6 54 2.6 66.5 Q12 69.5 21.4 66.5 C20.4 54 19 42 17.6 31.6Z" fill="url(#${id}r)"/>
  </svg>`;
}

const scrollPage = (glyph, look) => {
  const corner = cornerSvg('filigree', '#a07a22', look.accent);
  return `<span class="scroll-frame"></span>
    ${['tl', 'tr', 'bl', 'br'].map(p => `<span class="scroll-corner ${p}">${corner}</span>`).join('')}
    <span class="scroll-text">
      <span class="scroll-roundel"><span>${glyph}</span></span>
      <span class="letter-lines"></span>
      <span class="scroll-flourish"></span>
    </span>`;
};

const PARTS = {
  envelope: (seal, glyph, look) => `
    <span class="env-back"></span>
    <span class="env-liner"></span>
    <span class="env-letter">${pageHtml(glyph, look)}</span>
    <span class="env-front">${envelopeFront()}</span>
    <span class="env-flap"><span class="flap-out">${envelopeFlap()}</span><span class="flap-in"></span></span>
    <span class="env-sprig">${sprig()}</span>
    <span class="seal-spot">${seal}${sparks()}</span>`,
  scroll: (seal, glyph, look) => `
    <span class="scroll-paper">${scrollPage(glyph, look)}</span>
    <span class="scroll-roll top">${rollSvg(false)}</span>
    <span class="scroll-roll bottom">${rollSvg(true)}</span>
    <span class="scroll-ribbon"></span>
    <span class="ribbon-tail l"></span><span class="ribbon-tail r"></span>
    <span class="seal-spot">${seal}${sparks()}</span>`,
  bottle: seal => `
    <span class="bottle-waves back"></span>
    <span class="bottle-body">
      <span class="bottle-glass">${bottleBack()}</span>
      <span class="bottle-note">${rolledNote()}</span>
      <span class="bottle-glass front">${bottleFront()}</span>
      <span class="bottle-cork">${corkArt()}</span>
      <span class="seal-spot">${seal}${sparks()}</span>
    </span>
    <span class="bottle-waves front"></span>
    <span class="bottle-glints"><i></i><i></i><i></i></span>`,
  chest: (seal, glyph, look) => `
    <span class="chest-rays"></span>
    <span class="chest-glow"></span>
    <span class="chest-lining">${chestLining()}</span>
    <span class="chest-letter">${pageHtml(glyph, look)}</span>
    <span class="chest-treasure">${treasure()}</span>
    <span class="chest-base">${chestBase()}</span>
    <span class="chest-lid">${chestLid()}</span>
    <span class="chest-plate">${chestPlate()}</span>
    <span class="seal-spot">${seal}${sparks()}</span>`,
  gift: (seal, glyph, look) => `
    <span class="gift-glow"></span>
    <span class="gift-letter">${pageHtml(glyph, look)}</span>
    <span class="gift-tissue">${tissue()}</span>
    <span class="gift-box"><span class="ribbon-v"></span><span class="ribbon-h"></span></span>
    <span class="gift-lid"><span class="ribbon-v"></span>
      <span class="gift-bow"><span class="bow-half l">${bowHalf()}</span><span class="bow-half r">${bowHalf()}</span><span class="knot">${bowKnot()}</span>
        <span class="gift-tag">${giftTag(glyph)}</span></span></span>
    <span class="seal-spot">${seal}${sparks()}</span>`,
};

export function wrapperHtml(inv, look, words) {
  const type = resolveWrapper(inv, look);
  const seal = breakableSealHtml(inv, look, 'wrap-seal');
  return `
    <div class="wrapper-stage">
      ${words.for ? `<p class="wrapper-to">${esc(words.for)}</p>` : ''}
      <button type="button" class="wrapper ${type}" data-action="open" data-wrap="${type}" aria-label="Open the invitation" style="${esc(materials(look))}">
        ${PARTS[type](seal, esc(look.glyph), look)}
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
