// How an invitation arrives: the "wrapper" the recipient taps to open
// (envelope, scroll, bottle…) and the wax seal that closes it.

import { esc } from './util.js';

export const WRAPPERS = {
  envelope: { label: 'Envelope', icon: '✉️', openMs: 900 },
  scroll: { label: 'Scroll', icon: '📜', openMs: 1500 },
  bottle: { label: 'Message in a bottle', icon: '🍾', openMs: 1500 },
  chest: { label: 'Treasure chest', icon: '🧰', openMs: 1400 },
  gift: { label: 'Gift box', icon: '🎁', openMs: 1300 },
};

export const WAX_COLORS = [
  { id: 'crimson', name: 'Crimson', hex: '#9e1b32' },
  { id: 'oxblood', name: 'Oxblood', hex: '#5c0f1a' },
  { id: 'rose', name: 'Rose', hex: '#d0708f' },
  { id: 'copper', name: 'Copper', hex: '#b5652b' },
  { id: 'gold', name: 'Gold', hex: '#c9a227' },
  { id: 'forest', name: 'Forest', hex: '#2f5d3a' },
  { id: 'teal', name: 'Sea glass', hex: '#2a8c86' },
  { id: 'midnight', name: 'Midnight', hex: '#1f2f6b' },
  { id: 'lavender', name: 'Lavender', hex: '#8e72c9' },
  { id: 'black', name: 'Raven', hex: '#231d22' },
  { id: 'pearl', name: 'Pearl', hex: '#e6dfd1' },
];

// ︎ asks for the plain-text form of a symbol rather than a color emoji.
export const SEAL_EMBLEMS = [
  { s: '☾', name: 'Crescent moon' }, { s: '✦', name: 'Star' }, { s: '♥︎', name: 'Heart' },
  { s: '⛤', name: 'Pentacle' }, { s: '⚜︎', name: 'Fleur-de-lis' }, { s: '❀', name: 'Blossom' },
  { s: '☀︎', name: 'Sun' }, { s: '♛', name: 'Crown' }, { s: '☘︎', name: 'Clover' },
  { s: '✺', name: 'Sunburst' }, { s: '∞', name: 'Infinity' }, { s: '🐝', name: 'Bee' },
  { s: '🦉', name: 'Owl' }, { s: '🍄', name: 'Mushroom' }, { s: '🦋', name: 'Butterfly' }, { s: '🌹', name: 'Rose' },
];

const HEX = /^#[0-9a-f]{6}$/i;

export function resolveWrapper(inv, theme) {
  return WRAPPERS[inv.w] ? inv.w : theme.wrap || 'envelope';
}

export function sealColor(inv, theme) {
  return HEX.test(inv.sc || '') ? inv.sc : theme.accent;
}

export function sealEmblem(inv, theme) {
  const custom = Array.from(String(inv.se || '').trim()).slice(0, 4).join('');
  return custom || theme.seal;
}

export function sealHtml(inv, theme, cls = '') {
  const emblem = sealEmblem(inv, theme);
  const long = Array.from(emblem.replace(/︎/g, '')).length > 1;
  return `<span class="wax ${cls}" style="--wax:${sealColor(inv, theme)}" aria-hidden="true">
    <span class="wax-puddle"></span><span class="wax-face${long ? ' long' : ''}"><span>${esc(emblem)}</span></span></span>`;
}

const PARTS = {
  envelope: (seal, glyph) => `
    <span class="env-back"></span>
    <span class="env-letter"><span>${glyph}</span></span>
    <span class="env-front"></span>
    <span class="env-flap"></span>
    ${seal}`,
  scroll: (seal, glyph) => `
    <span class="scroll-paper"><span class="scroll-text">${glyph}</span></span>
    <span class="scroll-rod top"></span>
    <span class="scroll-rod bottom"></span>
    <span class="scroll-ribbon"></span>
    ${seal}`,
  bottle: seal => `
    <span class="bottle-waves back"></span>
    <span class="bottle-body">
      <span class="bottle-note"></span>
      <span class="bottle-glass"></span>
      <span class="bottle-neck"></span>
      <span class="bottle-cork"></span>
      ${seal}
    </span>
    <span class="bottle-waves front"></span>`,
  chest: seal => `
    <span class="chest-glow"></span>
    <span class="chest-base"></span>
    <span class="chest-lid"></span>
    ${seal}`,
  gift: (seal, glyph) => `
    <span class="gift-letter"><span>${glyph}</span></span>
    <span class="gift-box"></span>
    <span class="gift-lid"><span class="gift-bow"></span></span>
    ${seal}`,
};

export function wrapperHtml(inv, theme) {
  const type = resolveWrapper(inv, theme);
  const seal = sealHtml(inv, theme, 'wrap-seal');
  return `
    <div class="wrapper-stage">
      <p class="wrapper-to">${inv.to ? `For ${esc(inv.to)}` : 'For you'}</p>
      <button type="button" class="wrapper ${type}" data-action="open" data-wrap="${type}" aria-label="Open the invitation">
        ${PARTS[type](seal, esc(theme.glyph))}
      </button>
      <p class="wrapper-hint">Tap to open ✨</p>
      ${inv.from ? `<p class="wrapper-from">from ${esc(inv.from)}</p>` : ''}
    </div>`;
}

// Plays the opening animation, then calls `done`.
export function playOpening(btn, done) {
  if (btn.classList.contains('opening')) return;
  btn.classList.add('opening');
  const ms = matchMedia('(prefers-reduced-motion: reduce)').matches ? 150 : WRAPPERS[btn.dataset.wrap]?.openMs || 900;
  setTimeout(done, ms);
}
