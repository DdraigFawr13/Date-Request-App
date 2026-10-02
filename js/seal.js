// The wax seal: an SVG drawing with an irregular wax puddle, a raised rim, a
// stamped recess and the emblem, either pressed into the wax or filled with a
// metallic/colored finish and lit with a bevel filter.

import { esc } from './util.js';
import { safeHex } from './decor.js';

export const WAX_COLORS = [
  { id: 'scarlet', name: 'Classic red', hex: '#8f1d1d' },
  { id: 'burgundy', name: 'Burgundy', hex: '#5a1426' },
  { id: 'rose', name: 'Dusty rose', hex: '#b0607a' },
  { id: 'copper', name: 'Copper', hex: '#9c4f27', metal: true },
  { id: 'gold', name: 'Antique gold', hex: '#b08630', metal: true },
  { id: 'bronze', name: 'Bronze', hex: '#76532a', metal: true },
  { id: 'forest', name: 'Forest', hex: '#22432d' },
  { id: 'sage', name: 'Sage', hex: '#6c8160' },
  { id: 'teal', name: 'Deep teal', hex: '#1d5f5c' },
  { id: 'navy', name: 'Navy', hex: '#1b2a4e' },
  { id: 'royal', name: 'Royal blue', hex: '#2a3e8c' },
  { id: 'purple', name: 'Royal purple', hex: '#45215f' },
  { id: 'lavender', name: 'Lavender', hex: '#8873b5' },
  { id: 'black', name: 'Raven black', hex: '#1c191d' },
  { id: 'silver', name: 'Silver', hex: '#9da2a8', metal: true },
  { id: 'ivory', name: 'Ivory', hex: '#e6dcc6' },
];
export const WAX_BY_ID = Object.fromEntries(WAX_COLORS.map(c => [c.id, c]));

// Finishes for the emblem. 'pressed' leaves it as an impression in the wax.
export const FACE_FINISHES = [
  { id: 'pressed', name: 'Pressed into the wax' },
  { id: 'gold', name: 'Gold leaf', stops: ['#fff3b8', '#d8ad45', '#8a6514'] },
  { id: 'silver', name: 'Silver', stops: ['#ffffff', '#c3c8ce', '#6b7078'] },
  { id: 'copper', name: 'Copper', stops: ['#ffd3ad', '#c46f3a', '#6e3215'] },
  { id: 'rosegold', name: 'Rose gold', stops: ['#ffe4df', '#d5938b', '#8a4b4c'] },
  { id: 'bronze', name: 'Bronze', stops: ['#f2d79e', '#a57d3f', '#5a4019'] },
  { id: 'pearl', name: 'Pearl', stops: ['#ffffff', '#f1ebe0', '#b9ae9c'] },
  { id: 'black', name: 'Jet black', stops: ['#5b5660', '#1d1b20', '#000000'] },
];
export const FACE_BY_ID = Object.fromEntries(FACE_FINISHES.map(f => [f.id, f]));

// Emblems drawn as SVG (white = raised, black = cut away). Referenced as '@id'.
const LEAVES = side => Array.from({ length: 6 }, (_, i) => {
  const a = (side < 0 ? 200 - i * 22 : -20 + i * 22) * Math.PI / 180;
  const x = 50 + 22 * Math.cos(a), y = 54 + 22 * Math.sin(a);
  const rot = (a * 180 / Math.PI) + (side < 0 ? -60 : 60);
  return `<ellipse cx='${x.toFixed(1)}' cy='${y.toFixed(1)}' rx='3' ry='6.5' transform='rotate(${rot.toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})'/>`;
}).join('');
const SWORD = rot => `<g transform='rotate(${rot} 50 50)'><path d='M48.4 20 L50 14 L51.6 20 L52 62 L48 62Z'/><rect x='41' y='61' width='18' height='4' rx='1.5'/><rect x='48.3' y='65' width='3.4' height='11'/><circle cx='50' cy='78.5' r='2.8'/></g>`;

export const SVG_EMBLEMS = {
  crown: `<path d='M29 64 L26 38 L39 50 L50 31 L61 50 L74 38 L71 64Z'/><rect x='29' y='66' width='42' height='8' rx='1.5'/>
    <circle cx='26' cy='35' r='3.4'/><circle cx='50' cy='28' r='3.6'/><circle cx='74' cy='35' r='3.4'/>
    <g fill='#000'><circle cx='40' cy='70' r='1.8'/><circle cx='50' cy='70' r='1.8'/><circle cx='60' cy='70' r='1.8'/></g>`,
  shield: `<path d='M50 26 C58 30 66 30 73 28 V48 C73 63 63 71 50 77 C37 71 27 63 27 48 V28 C34 30 42 30 50 26Z'/>
    <path fill='#000' d='M47 35 H53 V46 H63 V52 H53 V68 H47 V52 H37 V46 H47Z'/>`,
  swords: SWORD(38) + SWORD(-38),
  castle: `<path d='M25 77 V40 H29 V35 H33 V40 H36 V35 H40 V48 H43 V30 H46 V25 H50 V30 H54 V25 H57 V30 V48 H60 V35 H64 V40 H67 V35 H71 V40 H75 V77Z'/>
    <path fill='#000' d='M44 77 V64 C44 58 56 58 56 64 V77Z'/><rect fill='#000' x='48' y='36' width='4' height='8' rx='2'/><rect fill='#000' x='30' y='50' width='3' height='7' rx='1.5'/><rect fill='#000' x='67' y='50' width='3' height='7' rx='1.5'/>`,
  laurel: `${LEAVES(-1)}${LEAVES(1)}<path d='M50 76 L46 82 M50 76 L54 82' stroke='#fff' stroke-width='2.4' stroke-linecap='round'/>`,
  key: `<circle cx='50' cy='30' r='10'/><circle fill='#000' cx='50' cy='30' r='5'/><rect x='47.5' y='38' width='5' height='40' rx='1.5'/>
    <rect x='52' y='62' width='9' height='4.5'/><rect x='52' y='70' width='6' height='4.5'/>`,
  chalice: `<path d='M33 28 H67 C67 44 60 54 52 56 V68 C58 69 62 72 63 76 H37 C38 72 42 69 48 68 V56 C40 54 33 44 33 28Z'/><path fill='#000' d='M38 33 H62 C61 41 57 47 50 49 C43 47 39 41 38 33Z' opacity='.0'/>`,
  fleur: `<path d='M50 22 C56 30 58 38 54 48 C60 44 70 42 74 50 C76 56 70 60 66 56 C70 52 64 48 58 54 C56 56 54 58 54 60 H46 C46 58 44 56 42 54 C36 48 30 52 34 56 C30 60 24 56 26 50 C30 42 40 44 46 48 C42 38 44 30 50 22Z'/>
    <rect x='38' y='61' width='24' height='5' rx='1.5'/><path d='M46 66 C44 72 40 76 36 78 H46 L50 72 L54 78 H64 C60 76 56 72 54 66Z'/>`,
  moonstar: `<path d='M44 24 A27 27 0 1 0 72 58 A21 21 0 1 1 44 24Z'/><path d='M64 30 L66 37 L73 39 L66 41 L64 48 L62 41 L55 39 L62 37Z'/>`,
  cat: `<path d='M40 77 C33 77 31 70 33 62 C35 54 39 50 41 46 C39 42 38 36 39 29 L44 34.5 C47 33.6 51 33.6 54 34.5 L59 29 C60 36 59 42 57 46 C61 52 64 60 64 68 C64 72 66 74.5 70 72.5 C74 70.5 73.5 64.5 70.5 62.5 C75 62 78.5 68 74.5 74 C70.5 79 63 78.5 60.5 77Z'/>`,
  catface: `<path d='M28 42 L30 22 L44 33 C48 32 52 32 56 33 L70 22 L72 42 C76 48 76 58 71 64 C64 73 36 73 29 64 C24 58 24 48 28 42Z'/>
    <g fill='#000'><ellipse cx='40' cy='49' rx='3.6' ry='5'/><ellipse cx='60' cy='49' rx='3.6' ry='5'/><path d='M46.5 57 H53.5 L50 61Z'/>
    <path d='M50 61 C49 64 45 65 43 63 M50 61 C51 64 55 65 57 63' stroke='#000' stroke-width='1.6' fill='none' stroke-linecap='round'/></g>`,
  paw: `<g transform='translate(50 52) scale(2.6)'><ellipse cx='0' cy='4' rx='5.2' ry='4.4'/><ellipse cx='-6' cy='-3' rx='2.1' ry='2.7' transform='rotate(-20 -6 -3)'/>
    <ellipse cx='-2.2' cy='-6.6' rx='2.1' ry='2.8'/><ellipse cx='2.2' cy='-6.6' rx='2.1' ry='2.8'/><ellipse cx='6' cy='-3' rx='2.1' ry='2.7' transform='rotate(20 6 -3)'/></g>`,
};

// The picker, grouped. `s` is stored in the link: text, or '@id' for an SVG emblem.
export const EMBLEM_GROUPS = [
  { id: 'regal', label: 'Regal', items: [
    { s: '@crown', name: 'Crown' }, { s: '@fleur', name: 'Fleur-de-lis' }, { s: '@shield', name: 'Shield' },
    { s: '@swords', name: 'Crossed swords' }, { s: '@castle', name: 'Castle' }, { s: '@laurel', name: 'Laurel wreath' },
    { s: '@key', name: 'Key' }, { s: '@chalice', name: 'Chalice' }, { s: '♞', name: 'Knight' }, { s: '✠', name: 'Cross' },
    { s: '🦁', name: 'Lion' }, { s: '🐉', name: 'Dragon' }, { s: '🦅', name: 'Eagle' }, { s: '🦄', name: 'Unicorn' },
  ] },
  { id: 'love', label: 'Love', items: [
    { s: '♥︎', name: 'Heart' }, { s: '∞', name: 'Infinity' }, { s: '❦', name: 'Floral heart' }, { s: '🌹', name: 'Rose' },
    { s: '❀', name: 'Blossom' }, { s: '🕊️', name: 'Dove' }, { s: '💍', name: 'Ring' },
  ] },
  { id: 'sky', label: 'Celestial', items: [
    { s: '@moonstar', name: 'Moon & star' }, { s: '☾', name: 'Crescent' }, { s: '✦', name: 'Star' }, { s: '☀︎', name: 'Sun' },
    { s: '✺', name: 'Sunburst' }, { s: '⛤', name: 'Pentacle' }, { s: '❄', name: 'Snowflake' },
  ] },
  { id: 'nature', label: 'Nature', items: [
    { s: '☘︎', name: 'Clover' }, { s: '🍂', name: 'Leaf' }, { s: '🍄', name: 'Mushroom' }, { s: '🐝', name: 'Bee' },
    { s: '🦋', name: 'Butterfly' }, { s: '🦉', name: 'Owl' }, { s: '🐚', name: 'Shell' }, { s: '🌾', name: 'Wheat' }, { s: '🍓', name: 'Strawberry' },
  ] },
  { id: 'cats', label: 'Cats', items: [
    { s: '@cat', name: 'Sitting cat' }, { s: '@catface', name: 'Cat face' }, { s: '@paw', name: 'Paw print' },
    { s: '🐈‍⬛', name: 'Prowling cat' }, { s: '🧶', name: 'Yarn' }, { s: '🐟', name: 'Fish' },
  ] },
];

// ── Resolving what to draw ───────────────────────────────────────────
export function sealColor(inv, look) {
  if (WAX_BY_ID[inv.sc]) return WAX_BY_ID[inv.sc].hex;
  if (safeHex(inv.sc)) return inv.sc;
  return WAX_BY_ID[look.wax]?.hex || '#8f1d1d';
}

export function sealFace(inv, look) {
  const id = inv.sf || look.waxFace || 'pressed';
  if (FACE_BY_ID[id]) return FACE_BY_ID[id];
  if (safeHex(id)) return { id: 'custom', stops: [shade(id, 0.45), id, shade(id, -0.45)] };
  return FACE_BY_ID.pressed;
}

export function sealEmblem(inv, look) {
  const custom = String(inv.se || '').trim();
  if (custom.startsWith('@')) return SVG_EMBLEMS[custom.slice(1)] ? custom : look.seal;
  return Array.from(custom).slice(0, 4).join('') || look.seal;
}

// Lightens (amt > 0) or darkens (amt < 0) a hex color.
export function shade(hex, amt) {
  const n = parseInt(safeHex(hex, '#888888').slice(1), 16);
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (t - v) * p));
  return `#${c.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

let uidCounter = 0;

// The seal as SVG. Everything from the link is escaped or validated.
export function sealSvg(inv, look) {
  const id = `s${(++uidCounter).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const wax = sealColor(inv, look);
  const metal = WAX_COLORS.some(c => c.hex === wax && c.metal);
  const face = sealFace(inv, look);
  const emblem = sealEmblem(inv, look);
  const seed = [...emblem].reduce((a, ch) => a + ch.codePointAt(0), 7) % 97;

  let art;
  if (emblem.startsWith('@')) art = `<g fill='#fff'>${SVG_EMBLEMS[emblem.slice(1)]}</g>`;
  else {
    const chars = Array.from(emblem.replace(/︎/g, ''));
    const long = chars.length > 1;
    const size = long ? (chars.length > 2 ? 21 : 27) : 42;
    art = `<text x='50' y='52' text-anchor='middle' dominant-baseline='central' fill='#fff' filter='url(#${id}w)'
      font-family="'Cinzel Decorative', 'Cormorant Garamond', serif" font-weight='700' font-size='${size}'>${esc(emblem)}</text>`;
  }

  const light = shade(wax, metal ? 0.55 : 0.32), dark = shade(wax, -0.45), deep = shade(wax, -0.25);
  const emblemLayer = face.id === 'pressed'
    ? `<rect width='100' height='100' mask='url(#${id}m)' fill='${shade(wax, 0.4)}' opacity='.75' transform='translate(.9 1)'/>
       <rect width='100' height='100' mask='url(#${id}m)' fill='${shade(wax, -0.32)}'/>`
    : `<rect width='100' height='100' mask='url(#${id}m)' fill='${shade(wax, -0.55)}' opacity='.6' transform='translate(.8 1.1)'/>
       <g filter='url(#${id}b)'><rect width='100' height='100' mask='url(#${id}m)' fill='url(#${id}f)'/></g>`;

  return `<svg class="wax-svg" viewBox="-12 -12 124 124" aria-hidden="true" focusable="false">
  <defs>
    <radialGradient id="${id}g" cx="36%" cy="30%" r="75%"><stop offset="0" stop-color="${light}"/><stop offset=".5" stop-color="${wax}"/><stop offset="1" stop-color="${dark}"/></radialGradient>
    <radialGradient id="${id}i" cx="56%" cy="60%" r="60%"><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".38"/></radialGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="1">${(face.stops || []).map((c, i) => `<stop offset="${[0.05, 0.5, 0.95][i]}" stop-color="${c}"/>`).join('')}</linearGradient>
    <filter id="${id}d" x="-30%" y="-30%" width="160%" height="160%">
      <feTurbulence type="fractalNoise" baseFrequency=".05" numOctaves="2" seed="${seed}"/>
      <feDisplacementMap in="SourceGraphic" scale="10" xChannelSelector="R" yChannelSelector="G"/>
      <feDropShadow dx="0" dy="2.2" stdDeviation="2.2" flood-opacity=".45"/>
    </filter>
    <filter id="${id}w"><feFlood flood-color="#fff"/><feComposite in2="SourceAlpha" operator="in"/></filter>
    <filter id="${id}b" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur"/>
      <feSpecularLighting in="blur" surfaceScale="3.5" specularConstant=".95" specularExponent="16" lighting-color="#fff" result="spec">
        <feDistantLight azimuth="225" elevation="42"/></feSpecularLighting>
      <feComposite in="spec" in2="SourceAlpha" operator="in" result="specIn"/>
      <feComposite in="SourceGraphic" in2="specIn" operator="arithmetic" k1="0" k2="1" k3=".75" k4="0"/>
    </filter>
    <filter id="${id}h"><feGaussianBlur stdDeviation="3"/></filter>
    <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#000"/>${art}</mask>
  </defs>
  <g filter="url(#${id}d)"><circle cx="50" cy="50" r="47" fill="${deep}"/><circle cx="48" cy="47" r="44" fill="url(#${id}g)"/></g>
  <circle cx="50" cy="50" r="36" fill="url(#${id}g)"/>
  <circle cx="50" cy="50" r="36" fill="none" stroke="${dark}" stroke-width="1.6" opacity=".55"/>
  <circle cx="50" cy="50" r="33.6" fill="none" stroke="${light}" stroke-width=".9" opacity=".55"/>
  <circle cx="50" cy="50" r="31.5" fill="${shade(wax, -0.1)}"/>
  <circle cx="50" cy="50" r="31.5" fill="url(#${id}i)"/>
  ${emblemLayer}
  <ellipse cx="34" cy="26" rx="15" ry="7" fill="#fff" opacity="${metal ? 0.38 : 0.26}" transform="rotate(-32 34 26)" filter="url(#${id}h)"/>
  <ellipse cx="29" cy="24" rx="4" ry="1.6" fill="#fff" opacity=".55" transform="rotate(-38 29 24)"/>
</svg>`;
}

export function sealHtml(inv, look, cls = '') {
  return `<span class="wax ${cls}" aria-hidden="true">${sealSvg(inv, look)}</span>`;
}

// A seal that can crack in two when the invitation is opened.
export function breakableSealHtml(inv, look, cls = '') {
  return `<span class="wax breakable ${cls}" aria-hidden="true"><span class="half l">${sealSvg(inv, look)}</span><span class="half r">${sealSvg(inv, look)}</span></span>`;
}
