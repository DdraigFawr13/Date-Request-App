// Visual dressing drawn entirely in code (so nothing bloats the link):
// background scenes, repeating patterns, paper textures, corner & side
// ornaments and the script flourishes between sections.

import { esc } from './util.js';

const HEX = /^#[0-9a-f]{6}$/i;
export const safeHex = (c, fallback) => (HEX.test(c || '') ? c : fallback);

export function luminance(hex) {
  const n = parseInt(safeHex(hex, '#888888').slice(1), 16);
  const ch = [n >> 16, (n >> 8) & 255, n & 255].map(v => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

// Lightens (amt > 0) or darkens (amt < 0) a hex color.
export function shade(hex, amt) {
  const n = parseInt(safeHex(hex, '#888888').slice(1), 16);
  const t = amt < 0 ? 0 : 255, p = Math.abs(amt);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map(v => Math.round(v + (t - v) * p));
  return `#${c.map(v => v.toString(16).padStart(2, '0')).join('')}`;
}

export const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};

// Nudges `color` lighter or darker until it reads against `bg` (WCAG ratio `min`).
export function readableOn(color, bg, min) {
  const away = luminance(bg) > 0.35 ? -1 : 1;
  let c = color;
  for (let i = 1; i <= 8 && contrast(c, bg) < min; i++) c = shade(color, away * i * 0.12);
  return c;
}

const svgUrl = svg => `url("data:image/svg+xml,${encodeURIComponent(svg.replace(/\s+/g, ' '))}")`;
const svgTile = (w, h, body) => `<svg xmlns='http://www.w3.org/2000/svg' width='${w}' height='${h}' viewBox='0 0 ${w} ${h}'>${body}</svg>`;

// ── Repeating patterns (fg = motif color, fg2 = secondary, o = opacity) ──
const PAW = (x, y, r = 0, s = 1) => `<g transform='translate(${x} ${y}) rotate(${r}) scale(${s})'>
  <ellipse cx='0' cy='4' rx='5.2' ry='4.4'/><ellipse cx='-6' cy='-3' rx='2.1' ry='2.7' transform='rotate(-20 -6 -3)'/>
  <ellipse cx='-2.2' cy='-6.6' rx='2.1' ry='2.8'/><ellipse cx='2.2' cy='-6.6' rx='2.1' ry='2.8'/>
  <ellipse cx='6' cy='-3' rx='2.1' ry='2.7' transform='rotate(20 6 -3)'/></g>`;
const DAMASK = (x, y, s = 1) => `<g transform='translate(${x} ${y}) scale(${s})'>
  <path d='M0 -16 C3 -10 9 -8 13 -8 C9 -6 5 -2 4 4 C3 9 2 12 0 16 C-2 12 -3 9 -4 4 C-5 -2 -9 -6 -13 -8 C-9 -8 -3 -10 0 -16Z'/>
  <circle cx='0' cy='-20' r='1.8'/><circle cx='0' cy='20' r='1.8'/>
  <path d='M-13 -8 C-18 -10 -19 -4 -15 -3' fill='none' stroke-width='1.2'/><path d='M13 -8 C18 -10 19 -4 15 -3' fill='none' stroke-width='1.2'/></g>`;
const SPARKLE = (x, y, s) => `<path transform='translate(${x} ${y}) scale(${s})' d='M0 -6 C0.8 -1.2 1.2 -0.8 6 0 C1.2 0.8 0.8 1.2 0 6 C-0.8 1.2 -1.2 0.8 -6 0 C-1.2 -0.8 -0.8 -1.2 0 -6Z'/>`;
const FLOWER = (x, y, s = 1) => `<g transform='translate(${x} ${y}) scale(${s})'>${[0, 72, 144, 216, 288].map(a =>
  `<ellipse cx='0' cy='-4.5' rx='3' ry='4.5' transform='rotate(${a})'/>`).join('')}<circle r='2.2' fill-opacity='1' style='fill:var(--c2)'/></g>`;
const LEAF = (x, y, r, s = 1) => `<g transform='translate(${x} ${y}) rotate(${r}) scale(${s})'><path d='M0 -9 C6 -4 6 4 0 9 C-6 4 -6 -4 0 -9Z'/><path d='M0 -8 L0 8' fill='none' stroke-width='0.7' stroke-opacity='.5'/></g>`;
const HEART = (x, y, s = 1, r = 0) => `<path transform='translate(${x} ${y}) rotate(${r}) scale(${s})' d='M0 5 C-7 0 -7 -6 -3.5 -6 C-1.5 -6 0 -4.5 0 -3 C0 -4.5 1.5 -6 3.5 -6 C7 -6 7 0 0 5Z'/>`;
const FLAKE = (x, y, s = 1) => `<g transform='translate(${x} ${y}) scale(${s})' fill='none' stroke-width='1' stroke-linecap='round'>${[0, 60, 120].map(a =>
  `<path transform='rotate(${a})' d='M0 -6 V6 M-2 -4.5 L0 -3 L2 -4.5 M-2 4.5 L0 3 L2 4.5'/>`).join('')}</g>`;

const DIE = (x, y, r, pips) => `<g transform='translate(${x} ${y}) rotate(${r})'><rect x='-10' y='-10' width='20' height='20' rx='4.5' fill='none' stroke-width='1.6'/>${pips.map(([px, py]) => `<circle cx='${px}' cy='${py}' r='1.9'/>`).join('')}</g>`;
const MARTINI = (x, y, r, s = 1) => `<g transform='translate(${x} ${y}) rotate(${r}) scale(${s})' fill='none' stroke-width='1.4' stroke-linecap='round' stroke-linejoin='round'><path d='M-8 -9 H8 L0 0Z M0 0 V9 M-5 9 H5'/><circle cx='-2' cy='-5' r='1.6' style='fill:var(--c2)' stroke='none'/><path d='M-2 -5 L4 -12'/></g>`;
const COUPE = (x, y, r, s = 1) => `<g transform='translate(${x} ${y}) rotate(${r}) scale(${s})' fill='none' stroke-width='1.4' stroke-linecap='round'><path d='M-8 -6 C-8 2 8 2 8 -6Z M0 -2 V9 M-5 9 H5'/></g>`;
const NOTE = (x, y, r, s = 1) => `<g transform='translate(${x} ${y}) rotate(${r}) scale(${s})'><ellipse cx='-3' cy='6' rx='3.6' ry='2.6' transform='rotate(-20 -3 6)'/><path d='M0 6 V-9 C3 -7 7 -6 8 -2' fill='none' stroke-width='1.5'/></g>`;

// A bat: rounded body and head, pointed ears, wings with a raised leading edge
// and a scalloped trailing edge. Drawn at roughly 42 × 20 units.
export const BAT_PATH = 'M3 -2.6 C5.5 -6.8 9 -9.6 12.6 -9.4 C15.6 -9.2 18.4 -7.2 21.4 -4.4 C19 -3.6 17.8 -1.6 17.6 1.2 C16 -0.4 13.9 -0.5 12.7 2.6 C11.3 0.8 9.2 0.6 7.8 3.6 C6.4 2.2 4.8 2.4 3.2 4.6 Z '
  + 'M-3 -2.6 C-5.5 -6.8 -9 -9.6 -12.6 -9.4 C-15.6 -9.2 -18.4 -7.2 -21.4 -4.4 C-19 -3.6 -17.8 -1.6 -17.6 1.2 C-16 -0.4 -13.9 -0.5 -12.7 2.6 C-11.3 0.8 -9.2 0.6 -7.8 3.6 C-6.4 2.2 -4.8 2.4 -3.2 4.6 Z '
  + 'M0 -6.4 C2.3 -6.4 3.6 -4.4 3.6 -1.4 C3.6 2.6 2 6.4 0 7.6 C-2 6.4 -3.6 2.6 -3.6 -1.4 C-3.6 -4.4 -2.3 -6.4 0 -6.4 Z '
  + 'M-2.7 -5 L-2.4 -9.4 L-0.8 -6.2 Z M2.7 -5 L2.4 -9.4 L0.8 -6.2 Z';
const BAT = (x, y, r, s = 1) => `<path transform='translate(${x} ${y}) rotate(${r}) scale(${s})' d='${BAT_PATH}'/>`;
const WEB = (x, y, s = 1) => `<g transform='translate(${x} ${y}) scale(${s})' fill='none' stroke-width='0.8'>${[0, 45, 90, 135].map(a => `<path transform='rotate(${a})' d='M-14 0 H14'/>`).join('')}
  ${[5, 9.5, 14].map(r => `<path d='${Array.from({ length: 9 }, (_, i) => { const a = i * Math.PI / 4; return `${i ? 'Q0 0 ' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`; }).join(' ').replace(/Q0 0 /g, (m, off) => 'L')}'/>`).join('')}</g>`;

export const PATTERNS = {
  damask: { label: 'Damask', size: [56, 64], draw: () => DAMASK(28, 18, 1) + DAMASK(0, 50, 0.8) + DAMASK(56, 50, 0.8) },
  stars: { label: 'Stars', size: [90, 90], draw: () => SPARKLE(20, 22, 0.9) + SPARKLE(66, 60, 0.6) + SPARKLE(70, 14, 0.35)
    + `<circle cx='45' cy='40' r='1'/><circle cx='10' cy='70' r='1.3'/><circle cx='84' cy='86' r='0.8'/><circle cx='35' cy='82' r='0.7'/><circle cx='56' cy='8' r='0.9'/>` },
  snow: { label: 'Snowfall', size: [80, 80], draw: () => FLAKE(18, 20, 1.1) + FLAKE(60, 56, 0.8) + `<circle cx='54' cy='16' r='1.4'/><circle cx='22' cy='64' r='1.1'/><circle cx='74' cy='34' r='0.9'/>` },
  blossoms: { label: 'Blossoms', size: [70, 70], draw: () => FLOWER(18, 18, 1) + FLOWER(52, 50, 0.75) + LEAF(46, 18, 40, 0.6) + LEAF(14, 52, -30, 0.6) },
  leaves: { label: 'Leaves', size: [70, 70], draw: () => LEAF(16, 18, 30) + LEAF(50, 30, -40, 0.8) + LEAF(30, 54, 100, 0.9) + LEAF(62, 62, 10, 0.6) },
  hearts: { label: 'Hearts', size: [60, 60], draw: () => HEART(15, 16, 1.1, -12) + HEART(45, 44, 0.8, 14) },
  paws: { label: 'Paw prints', size: [80, 80], draw: () => PAW(20, 22, -20, 0.9) + PAW(58, 58, 25, 0.75) },
  waves: { label: 'Waves', size: [60, 30], draw: () => `<path d='M0 10 C10 4 20 4 30 10 S50 16 60 10' fill='none' stroke-width='1.4'/><path d='M0 24 C10 18 20 18 30 24 S50 30 60 24' fill='none' stroke-width='1' stroke-opacity='.6'/>` },
  stone: { label: 'Castle stone', size: [80, 48], draw: () => `<g fill='none' stroke-width='1.6'><path d='M0 0 H80 M0 24 H80 M0 48 H80 M20 0 V24 M60 0 V24 M0 24 V48 M40 24 V48 M80 24 V48'/></g>
    <rect x='22' y='2' width='36' height='20' fill-opacity='.25'/><rect x='2' y='26' width='36' height='20' fill-opacity='.12'/>` },
  gingham: { label: 'Gingham', size: [24, 24], draw: () => `<rect x='0' y='0' width='12' height='24' fill-opacity='.45'/><rect x='0' y='0' width='24' height='12' fill-opacity='.45'/>` },
  plaid: { label: 'Plaid', size: [48, 48], draw: () => `<rect x='0' y='8' width='48' height='10' fill-opacity='.5'/><rect x='8' y='0' width='10' height='48' fill-opacity='.5'/>
    <rect x='0' y='32' width='48' height='2' style='fill:var(--c2)'/><rect x='32' y='0' width='2' height='48' style='fill:var(--c2)'/>` },
  cocktails: { label: 'Cocktails', size: [80, 80], draw: () => MARTINI(20, 22, -10) + COUPE(58, 58, 12, 0.9) + `<circle cx='62' cy='16' r='1.2'/><circle cx='16' cy='64' r='1'/>` },
  dice: { label: 'Dice', size: [80, 80], draw: () => DIE(22, 22, -12, [[-5, -5], [0, 0], [5, 5]]) + DIE(58, 56, 18, [[-5, -5], [5, -5], [0, 0], [-5, 5], [5, 5]]) },
  checker: { label: 'Checkerboard', size: [40, 40], draw: () => `<rect width='20' height='20' fill-opacity='.55'/><rect x='20' y='20' width='20' height='20' fill-opacity='.55'/>` },
  disco: { label: 'Disco tiles', size: [36, 36], draw: () => `<rect x='1' y='1' width='16' height='16' fill-opacity='.5'/><rect x='19' y='1' width='16' height='16' fill-opacity='.2'/><rect x='1' y='19' width='16' height='16' fill-opacity='.25'/><rect x='19' y='19' width='16' height='16' fill-opacity='.6'/>${SPARKLE(27, 27, 0.5)}` },
  notes: { label: 'Music notes', size: [80, 80], draw: () => NOTE(20, 24, -10) + NOTE(58, 58, 12, 0.85) + `<circle cx='60' cy='18' r='1.2'/><circle cx='20' cy='62' r='1'/>` },
  lace: { label: 'Lace', size: [40, 40], draw: () => `<g fill='none' stroke-width='1'><circle cx='20' cy='20' r='9'/><circle cx='20' cy='20' r='5'/><circle cx='0' cy='0' r='9'/><circle cx='40' cy='0' r='9'/><circle cx='0' cy='40' r='9'/><circle cx='40' cy='40' r='9'/></g>
    <circle cx='20' cy='20' r='1.6'/><circle cx='20' cy='6' r='1.1'/><circle cx='20' cy='34' r='1.1'/><circle cx='6' cy='20' r='1.1'/><circle cx='34' cy='20' r='1.1'/>` },
  bats: { label: 'Bats', size: [110, 100], draw: () => BAT(30, 26, -8, 1.9) + BAT(80, 70, 10, 1.45) + `<circle cx='88' cy='20' r='1.4'/><circle cx='20' cy='78' r='1.2'/>` },
  webs: { label: 'Spiderwebs', size: [80, 80], draw: () => WEB(22, 22, 1) + WEB(62, 60, 0.75) },
  stripes: { label: 'Stripes', size: [28, 28], draw: () => `<path d='M-7 7 L7 -7 M0 28 L28 0 M21 35 L35 21' stroke-width='6' stroke-linecap='square' fill='none'/>` },
  confetti: { label: 'Confetti', size: [70, 70], draw: () => `<rect x='10' y='12' width='8' height='3' rx='1' transform='rotate(30 14 13)'/><circle cx='50' cy='16' r='2.5' style='fill:var(--c2)'/>
    <rect x='40' y='48' width='8' height='3' rx='1' transform='rotate(-40 44 49)' style='fill:var(--c2)'/><circle cx='18' cy='52' r='2'/><path d='M60 34 l3 5 l-6 0z'/>` },
};

// Colors for drawing a pattern over a given base color.
function patternSvg(id, fg, fg2, opacity) {
  const p = PATTERNS[id];
  if (!p) return '';
  const [w, h] = p.size;
  return svgUrl(svgTile(w, h, `<g fill='${fg}' stroke='${fg}' stroke-width='0' opacity='${opacity}'>${p.draw().replace(/var\(--c2\)/g, fg2)}</g>`));
}

export function patternCss(id, fg, fg2, opacity = 1) {
  const p = PATTERNS[id];
  return p ? `${patternSvg(id, fg, fg2, opacity)} 0 0 / ${p.size[0]}px ${p.size[1]}px repeat` : 'none';
}

// ── Background scenes ────────────────────────────────────────────────
export const SCENES = [
  { id: 'look', label: 'Look’s pick' },
  { id: 'plain', label: 'Plain glow' },
  { id: 'moonlit', label: 'Moonlit' },
  { id: 'velvet', label: 'Velvet curtain' },
  { id: 'haunted', label: 'Haunted night' },
  { id: 'bokeh', label: 'Bokeh lights' },
  { id: 'neon', label: 'Neon grid' },
  { id: 'sunburst', label: 'Sunburst' },
  ...Object.entries(PATTERNS).map(([id, p]) => ({ id, label: p.label })),
];

function backdropColors(look, inv) {
  const custom = Array.isArray(inv.bc) ? inv.bc : [];
  const c1 = safeHex(custom[0], look.bg[0]);
  return [c1, safeHex(custom[1], custom[0] ? c1 : look.bg[1])];
}

// Whether text sitting directly on the background should be light.
export function backdropIsDark(look, inv = {}) {
  const [c1, c2] = backdropColors(look, inv);
  return (luminance(c1) + luminance(c2)) / 2 < 0.35;
}

export function backdropCss(look, inv = {}) {
  const [c1, c2] = backdropColors(look, inv);
  let scene = SCENES.some(s => s.id === inv.bs) ? inv.bs : 'look';
  if (scene === 'look') scene = look.scene || 'plain';
  const dark = (luminance(c1) + luminance(c2)) / 2 < 0.35;
  const glow = dark ? 'rgba(255,255,255,.10)' : 'rgba(255,255,255,.45)';
  const base = `radial-gradient(120% 70% at 50% 0%, ${glow}, transparent 60%), linear-gradient(160deg, ${c1}, ${c2})`;
  const motif = dark ? '#ffffff' : look.accent2;
  const vignette = `radial-gradient(140% 100% at 50% 40%, transparent 55%, rgba(0,0,0,${dark ? 0.45 : 0.12}))`;
  if (scene === 'plain') return `${vignette}, ${base}`;
  if (scene === 'moonlit') {
    return `radial-gradient(circle at 78% 14%, #fffbe8 0 34px, rgba(255,250,220,.35) 36px, rgba(255,250,220,.08) 90px, transparent 160px), `
      + `${patternCss('stars', '#ffffff', look.accent, 0.5)}, ${vignette}, linear-gradient(170deg, ${c1}, ${c2})`;
  }
  if (scene === 'velvet') {
    return `linear-gradient(to bottom, rgba(0,0,0,.35), transparent 18%), `
      + `repeating-linear-gradient(90deg, rgba(0,0,0,.32) 0, rgba(255,255,255,.07) 22px, rgba(0,0,0,.22) 46px, rgba(255,255,255,.04) 64px, rgba(0,0,0,.32) 80px), ${vignette}, linear-gradient(170deg, ${c1}, ${c2})`;
  }
  if (scene === 'haunted') {
    const sil = '#08050c';
    const bats = svgTile(400, 160, `<g fill='${sil}'>${BAT(300, 40, -12, 1.5)}${BAT(250, 62, 8, 1.1)}${BAT(338, 78, 16, 0.9)}${BAT(210, 30, -6, 0.75)}${BAT(120, 54, 10, 0.6)}</g>`);
    const yard = svgTile(400, 160, `<g fill='${sil}'>
      <path d='M0 160 V112 C50 96 110 104 160 116 C220 130 290 94 400 108 V160Z'/>
      <g stroke='${sil}' stroke-linecap='round' fill='none'><path d='M70 118 C72 96 68 78 60 60' stroke-width='7'/><path d='M66 92 C54 84 44 82 32 72' stroke-width='3.5'/><path d='M64 78 C74 68 86 66 98 56' stroke-width='3'/><path d='M61 66 C58 54 62 44 70 34' stroke-width='2.5'/><path d='M38 76 C34 70 34 64 28 60 M90 62 C94 54 102 52 106 46' stroke-width='1.6'/></g>
      <rect x='238' y='104' width='18' height='26' rx='9'/><rect x='272' y='112' width='14' height='20' rx='7'/><path d='M318 96 h4 v8 h8 v4 h-8 v22 h-4 v-22 h-8 v-4 h8z'/>
      <path d='M150 126 v-14 l3 -4 l3 4 v14 M166 128 v-14 l3 -4 l3 4 v14 M182 128 v-14 l3 -4 l3 4 v14 M198 126 v-14 l3 -4 l3 4 v14' stroke='${sil}' stroke-width='3'/><path d='M146 118 H210' stroke='${sil}' stroke-width='2.5'/></g>`);
    return `${svgUrl(bats)} center 6% / min(100%, 640px) auto no-repeat, `
      + `linear-gradient(to top, rgba(180, 160, 200, 0.28), transparent 18%), `
      + `${svgUrl(yard)} center bottom / max(100%, 520px) auto no-repeat, `
      + `radial-gradient(circle at 74% 18%, #fff3d6 0 46px, rgba(255, 214, 150, 0.55) 48px, rgba(255, 170, 80, 0.18) 110px, transparent 200px), `
      + `${patternCss('stars', '#ffffff', look.accent, 0.35)}, linear-gradient(175deg, ${c1}, ${c2})`;
  }
  if (scene === 'bokeh') {
    const dot = (x, y, r, c, o) => `radial-gradient(circle at ${x}% ${y}%, ${c}${o} 0, ${c}${o} ${r - 4}px, transparent ${r}px)`;
    return [dot(12, 18, 46, look.accent, '55'), dot(78, 12, 30, look.accent2, '66'), dot(64, 40, 58, look.accent, '33'), dot(22, 62, 34, look.accent2, '44'),
      dot(86, 72, 50, look.accent, '44'), dot(40, 88, 28, '#ffffff', '22'), dot(50, 24, 18, '#ffffff', '33'), vignette, `linear-gradient(170deg, ${c1}, ${c2})`].join(', ');
  }
  if (scene === 'neon') {
    return `linear-gradient(to bottom, ${c1} 0%, transparent 58%), `
      + `repeating-linear-gradient(90deg, ${look.accent2}55 0 1.5px, transparent 1.5px 44px) 0 100% / 100% 42% no-repeat, `
      + `repeating-linear-gradient(0deg, ${look.accent}66 0 1.5px, transparent 1.5px 26px) 0 100% / 100% 42% no-repeat, `
      + `radial-gradient(80% 30% at 50% 58%, ${look.accent}88, transparent 70%), linear-gradient(180deg, ${c1}, ${c2})`;
  }
  if (scene === 'sunburst') {
    return `repeating-conic-gradient(from 0deg at 50% 30%, rgba(255,255,255,${dark ? 0.06 : 0.22}) 0 7deg, transparent 7deg 18deg), `
      + `radial-gradient(circle at 50% 30%, rgba(255,255,255,${dark ? 0.18 : 0.5}), transparent 45%), ${vignette}, linear-gradient(170deg, ${c1}, ${c2})`;
  }
  return `${vignette}, ${patternCss(scene, motif, look.accent, dark ? 0.1 : 0.22)}, ${base}`;
}

// ── Neon glow ─────────────────────────────────────────────────────────
export const GLOW_COLORS = [
  { hex: '#ff3fd8', name: 'Hot pink' }, { hex: '#2ee6ff', name: 'Electric blue' }, { hex: '#7dff3a', name: 'Lime' },
  { hex: '#b14cff', name: 'Ultraviolet' }, { hex: '#ff8a1f', name: 'Tangerine' }, { hex: '#ffe62e', name: 'Lemon' },
  { hex: '#ff2e4d', name: 'Red' }, { hex: '#ffffff', name: 'White' },
];
// The glow color for an invite: '' = the look's own, 'none' = off, or a color.
export function resolveGlow(inv, look) {
  if (inv.gl === 'none') return null;
  return safeHex(inv.gl) || look.glow || null;
}

// ── Paper textures (drawn by CSS; see [data-paper] in styles.css) ────
export const PAPERS = [
  { id: 'look', label: 'Look’s pick' },
  { id: 'smooth', label: 'Smooth card' },
  { id: 'cotton', label: 'Handmade cotton' },
  { id: 'parchment', label: 'Aged parchment' },
  { id: 'linen', label: 'Linen weave' },
  { id: 'watercolor', label: 'Watercolor wash' },
  { id: 'marble', label: 'Marble' },
  { id: 'kraft', label: 'Kraft paper' },
  { id: 'vellum', label: 'Vellum' },
  { id: 'silk', label: 'Silk' },
  { id: 'leather', label: 'Leather' },
  { id: 'speckled', label: 'Speckled' },
  { id: 'glitter', label: 'Shimmer' },
];
export const resolvePaper = (inv, look) =>
  (PAPERS.some(p => p.id === inv.pp && p.id !== 'look') ? inv.pp : look.paper || 'smooth');

// ── Corner ornaments (drawn in the top-left corner, mirrored to the others) ──
const CORNERS = {
  filigree: `<g fill='none' stroke-width='1.3' stroke-linecap='round'>
    <path d='M5 76 V24 C5 13 13 5 24 5 H76'/><path d='M12 58 C12 32 32 12 58 12' stroke-width='0.9'/>
    <path d='M58 12 C66 12 69 19 65 22 C61 25 57 20 61 18'/><path d='M12 58 C12 66 19 69 22 65 C25 61 20 57 18 61'/>
    <path d='M20 20 C28 20 31 27 27 30 C23 33 19 28 23 26' stroke-width='1.1'/><path d='M20 20 C20 28 27 31 30 27' stroke-width='1.1'/></g>
    <circle cx='76' cy='5' r='1.8'/><circle cx='5' cy='76' r='1.8'/><path d='M14 14 l3 -3 l3 3 l-3 3z'/>`,
  gothic: `<g fill='none' stroke-width='1.3'><path d='M4 78 V4 H78'/><path d='M10 60 V10 H60' stroke-width='0.8'/>
    <circle cx='24' cy='17' r='6'/><circle cx='31' cy='24' r='6'/><circle cx='24' cy='31' r='6'/><circle cx='17' cy='24' r='6'/></g>
    <path d='M24 18 l2.5 6 l-2.5 6 l-2.5 -6z'/><path d='M60 10 l4 -4 l4 4 l-4 4z'/><path d='M10 60 l-4 4 l4 4 l4 -4z'/>
    <path d='M78 4 l-6 -2.5 v5z'/><path d='M4 78 l-2.5 -6 h5z'/>`,
  floral: `<g fill='none' stroke-width='1.2' stroke-linecap='round'><path d='M8 76 C8 40 18 18 40 10 C52 6 64 6 76 8'/><path d='M8 50 C14 46 16 40 14 34' /><path d='M50 8 C46 14 40 16 34 14'/></g>
    <path d='M18 30 C24 26 26 20 24 14 C18 18 16 24 18 30Z'/><path d='M30 18 C26 24 20 26 14 24 C18 18 24 16 30 18Z' fill-opacity='.8'/>
    <path d='M8 62 C12 58 12 54 10 50 C6 54 6 58 8 62Z'/><path d='M62 8 C58 12 54 12 50 10 C54 6 58 6 62 8Z'/>
    ${[0, 72, 144, 216, 288].map(a => `<ellipse cx='14' cy='9' rx='2.6' ry='4' transform='rotate(${a} 14 14)'/>`).join('')}<circle cx='14' cy='14' r='2.3' style='fill:var(--c2)'/>`,
  deco: `<g fill='none' stroke-width='1.3'><path d='M4 70 V4 H70'/><path d='M11 50 V11 H50'/><path d='M18 32 V18 H32'/></g>
    <g stroke-width='0.9'>${[12, 28, 45, 62, 78].map(a => `<path d='M4 4 L${4 + 26 * Math.cos(a * Math.PI / 180)} ${4 + 26 * Math.sin(a * Math.PI / 180)}'/>`).join('')}</g>
    <path d='M70 4 l4 -3 l4 3 l-4 3z'/><path d='M4 70 l-3 4 l3 4 l3 -4z'/>`,
  celestial: `<path d='M24 8 A16 16 0 1 0 40 30 A12 12 0 1 1 24 8Z' transform='translate(-6 -2)'/>
    ${SPARKLE(52, 12, 0.8)}${SPARKLE(12, 52, 0.8)}${SPARKLE(40, 38, 0.5)}
    <g fill='none' stroke-width='1' stroke-dasharray='1 4' stroke-linecap='round'><path d='M6 76 C6 36 36 6 76 6'/></g><circle cx='68' cy='22' r='1.2'/><circle cx='22' cy='68' r='1.2'/>`,
  web: `<g fill='none' stroke-linecap='round'><path d='M2 2 L82.0 2.0 M2 2 L75.9 32.6 M2 2 L58.6 58.6 M2 2 L32.6 75.9 M2 2 L2.0 82.0' stroke-width='0.9'/><path d='M18.0 2.0 Q14.6 4.5 16.8 8.1 Q12.6 9.1 13.3 13.3 Q9.1 12.6 8.1 16.8 Q4.5 14.6 2.0 18.0' stroke-width='0.90'/><path d='M32.0 2.0 Q25.5 6.7 29.7 13.5 Q22.0 15.3 23.2 23.2 Q15.3 22.0 13.5 29.7 Q6.7 25.5 2.0 32.0' stroke-width='0.82'/><path d='M47.0 2.0 Q37.3 9.0 43.6 19.2 Q31.9 22.0 33.8 33.8 Q22.0 31.9 19.2 43.6 Q9.0 37.3 2.0 47.0' stroke-width='0.74'/><path d='M62.0 2.0 Q49.1 11.4 57.4 25.0 Q41.9 28.7 44.4 44.4 Q28.7 41.9 25.0 57.4 Q11.4 49.1 2.0 62.0' stroke-width='0.66'/><path d='M76.0 2.0 Q60.1 13.5 70.4 30.3 Q51.2 34.9 54.3 54.3 Q34.9 51.2 30.3 70.4 Q13.5 60.1 2.0 76.0' stroke-width='0.58'/>
    <path d='M46 46 V64' stroke-width='0.7'/></g>
    <g transform='translate(46 68)'><ellipse rx='3.2' ry='3.8'/><circle cy='-4.4' r='2.2'/><g fill='none' stroke-width='0.9' stroke-linecap='round'><path d='M-2.6 -1 L-6.5 -4 M-2.8 1 L-7 0.5 M-2.6 2.6 L-6 5.5 M2.6 -1 L6.5 -4 M2.8 1 L7 0.5 M2.6 2.6 L6 5.5'/></g></g>`,
  paws: `${PAW(14, 15, 135, 1.35)}${PAW(36, 33, 135, 1.1)}${PAW(54, 55, 140, 0.85)}`,
};
// One corner ornament as SVG markup (for use outside the card, e.g. the scroll).
export function cornerSvg(id, color, color2) {
  return `<svg viewBox='0 0 80 80' aria-hidden='true'><g fill='${color}' stroke='${color}'>${(CORNERS[id] || '').replace(/var\(--c2\)/g, color2)}</g></svg>`;
}

export const CORNER_OPTIONS = [
  { id: 'look', label: 'Look’s pick' }, { id: 'none', label: 'None' },
  { id: 'filigree', label: 'Filigree' }, { id: 'gothic', label: 'Gothic' }, { id: 'floral', label: 'Floral vine' },
  { id: 'deco', label: 'Art deco' }, { id: 'celestial', label: 'Celestial' }, { id: 'web', label: 'Spiderweb' }, { id: 'paws', label: 'Paw prints' },
];

// ── Side borders ─────────────────────────────────────────────────────
export const SIDE_OPTIONS = [
  { id: 'look', label: 'Look’s pick' }, { id: 'none', label: 'None' }, { id: 'frame', label: 'Double frame' },
  { id: 'vine', label: 'Climbing vine' }, { id: 'pearls', label: 'Pearls' }, { id: 'lace', label: 'Lace' }, { id: 'stitch', label: 'Stitching' }, { id: 'paws', label: 'Paw trail' },
];
const SIDE_TILES = {
  vine: [24, 60, `<g fill='none' stroke-width='1.2'><path d='M12 0 C4 15 20 30 12 45 C8 52 10 56 12 60'/></g>${LEAF(17, 14, 50, 0.6)}${LEAF(7, 40, -50, 0.6)}<circle cx='12' cy='30' r='1.4'/>`],
  pearls: [12, 16, `<circle cx='6' cy='8' r='2.6'/>`],
  lace: [20, 18, `<path d='M2 0 Q20 9 2 18' fill='none' stroke-width='1.2'/><path d='M2 3 Q13 9 2 15' fill='none' stroke-width='0.7'/><circle cx='5' cy='9' r='1.5'/><circle cx='14' cy='9' r='1'/>`],
  paws: [24, 64, `${PAW(9, 16, -8, 0.55)}${PAW(15, 46, 8, 0.55)}`],
};

export const resolveDecor = (inv, look) => ({
  corners: CORNER_OPTIONS.some(o => o.id === inv.dc && o.id !== 'look') ? inv.dc : look.corners || 'none',
  sides: SIDE_OPTIONS.some(o => o.id === inv.ds && o.id !== 'look') ? inv.ds : look.sides || 'none',
});

// Ornament markup for a card. Colors are the look's own (safe constants).
export function decorHtml(inv, look) {
  const { corners, sides } = resolveDecor(inv, look);
  const color = look.accent2, color2 = look.accent;
  let out = '';
  if (CORNERS[corners]) {
    const svg = `<svg viewBox='0 0 80 80' aria-hidden='true'><g fill='${color}' stroke='${color}'>${CORNERS[corners].replace(/var\(--c2\)/g, color2)}</g></svg>`;
    out += ['tl', 'tr', 'bl', 'br'].map(p => `<span class="corner ${p}">${svg}</span>`).join('');
  }
  if (sides === 'frame' || sides === 'stitch') out += `<span class="side-frame ${sides}"></span>`;
  else if (SIDE_TILES[sides]) {
    const [w, h, body] = SIDE_TILES[sides];
    const bg = `${svgUrl(svgTile(w, h, `<g fill='${color}' stroke='${color}'>${body}</g>`))} center top / ${w}px ${h}px repeat-y`;
    const style = esc(`background:${bg}`);
    out += `<span class="side l" style="${style}"></span><span class="side r" style="${style}"></span>`;
  }
  return out;
}

// ── Script rules between sections ────────────────────────────────────
export const RULE_OPTIONS = [
  { id: 'look', label: 'Look’s pick' }, { id: 'swash', label: 'Script swash' }, { id: 'flourish', label: 'Flourish' },
  { id: 'vine', label: 'Vine' }, { id: 'rule', label: 'Fine rule' }, { id: 'emoji', label: 'Look’s emoji' }, { id: 'none', label: 'None' },
];
const RULES = {
  swash: `<g fill='none' stroke-linecap='round'><path d='M30 14 C60 4 82 6 100 12 C118 18 140 20 170 10' stroke-width='1.1'/>
    <path d='M44 12 C66 6 84 8 100 13 C116 18 134 18 156 12' stroke-width='0.5' stroke-opacity='.6'/></g><circle cx='26' cy='15' r='1.6'/><circle cx='174' cy='9' r='1.6'/>`,
  flourish: `<g fill='none' stroke-linecap='round' stroke-width='1'>
    <path d='M92 12 C80 12 74 4 64 6 C56 8 58 18 64 17 C70 16 68 9 63 11'/><path d='M64 6 C46 2 30 14 12 12'/>
    <path d='M108 12 C120 12 126 20 136 18 C144 16 142 6 136 7 C130 8 132 15 137 13'/><path d='M136 18 C154 22 170 10 188 12'/></g>
    <path d='M100 7 l4 5 l-4 5 l-4 -5z'/><circle cx='12' cy='12' r='1.3'/><circle cx='188' cy='12' r='1.3'/>`,
  vine: `<g fill='none' stroke-linecap='round' stroke-width='1'><path d='M16 12 C40 4 60 20 84 12 C92 9 96 10 100 12 C104 14 108 15 116 12 C140 4 160 20 184 12'/></g>
    ${LEAF(46, 9, 70, 0.55)}${LEAF(70, 16, 110, 0.55)}${LEAF(130, 8, 70, 0.55)}${LEAF(154, 16, 110, 0.55)}<circle cx='100' cy='12' r='2.4'/>`,
};

export function ruleHtml(id, look, glyphHtml) {
  if (id === 'none') return '';
  if (id === 'emoji') return `<div class="divider" aria-hidden="true">${glyphHtml.emoji}</div>`;
  if (id === 'rule') return `<div class="rule fine" aria-hidden="true"><span></span><i>${glyphHtml.glyph}</i><span></span></div>`;
  const body = RULES[id] || RULES.swash;
  return `<div class="rule" aria-hidden="true"><svg viewBox='0 0 200 24'><g fill='${look.accent2}' stroke='${look.accent2}'>${body}</g></svg></div>`;
}
export const resolveRule = (inv, look) =>
  (RULE_OPTIONS.some(o => o.id === inv.dv && o.id !== 'look') ? inv.dv : look.rule || 'swash');
