// Hand-drawn SVG detail for the envelope, bottle, treasure chest and gift box.
// Colors come from the wrapper's CSS custom properties (--paper, --ribbon…)
// or are fixed materials (gold, glass, wood), so nothing here is user input.

import { cornerSvg } from './decor.js';

let uid = 0;
const nextId = p => `${p}${++uid}`;

const GOLD = ['#5e3d0c', '#c9962e', '#fff3c4', '#e2b24e', '#a37218', '#5a3a0a'];
// Antique gold: the same banding, toned down and worn, for heavy old metal.
const ANTIQUE = ['#3f2a08', '#94702a', '#d9bf7a', '#b08a3a', '#7a5a1c', '#3a2706'];
const goldGrad = (id, vertical = true, stops = GOLD) => `<linearGradient id="${id}" x1="0" y1="0" x2="${vertical ? 0 : 1}" y2="${vertical ? 1 : 0}">
  ${stops.map((c, i) => `<stop offset="${[0, 0.22, 0.42, 0.56, 0.82, 1][i]}" stop-color="${c}"/>`).join('')}</linearGradient>`;
// Streaky wood grain and a worn-metal speckle, both as SVG filters.
const WOOD_GRAIN = id => `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .42" numOctaves="3" seed="4"/>
  <feColorMatrix values="0 0 0 0 .18  0 0 0 0 .09  0 0 0 0 .02  0 0 0 1.1 -.35"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
const WEAR = id => `<filter id="${id}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".55" numOctaves="2" seed="9"/>
  <feColorMatrix values="0 0 0 0 .12  0 0 0 0 .08  0 0 0 0 .02  0 0 0 1.4 -.6"/><feComposite in2="SourceGraphic" operator="in"/></filter>`;
const svg = (viewBox, body, cls = '', ratio = 'none') =>
  `<svg class="${cls}" viewBox="${viewBox}" preserveAspectRatio="${ratio}" aria-hidden="true" focusable="false">${body}</svg>`;

// ── A letter page: gilded frame, filigree corners, roundel and script lines ──
export function pageHtml(glyph, look, cls = '') {
  const corner = cornerSvg('filigree', '#a07a22', look.accent);
  return `<span class="page ${cls}">
    <span class="page-frame"></span>
    ${['tl', 'tr', 'bl', 'br'].map(p => `<span class="page-corner ${p}">${corner}</span>`).join('')}
    <span class="page-roundel"><span>${glyph}</span></span>
    <span class="letter-lines"></span>
    <span class="page-flourish"></span>
  </span>`;
}

// ── Envelope ─────────────────────────────────────────────────────────
export function envelopeFront() {
  const g = nextId('eg'), p = nextId('ep'), l = nextId('el');
  return svg('0 0 300 198', `
    <defs>${goldGrad(g)}
      <linearGradient id="${l}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".22"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".16"/></linearGradient>
      <linearGradient id="${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--paper)"/><stop offset="1" style="stop-color:var(--paper-dark)"/></linearGradient></defs>
    <path d="M0 0 L150 112 L300 0 V198 H0Z" fill="url(#${p})"/>
    <path d="M0 0 L150 112 L0 198Z" fill="#000" opacity=".05"/>
    <path d="M300 0 L150 112 L300 198Z" fill="#000" opacity=".08"/>
    <path d="M0 198 L136 106 Q150 96 164 106 L300 198" fill="none" stroke="#000" stroke-opacity=".16" stroke-width="3"/>
    <path d="M0 198 L136 104 Q150 94 164 104 L300 198Z" fill="url(#${p})"/>
    <path d="M0 198 L136 104 Q150 94 164 104 L300 198Z" fill="#fff" opacity=".12"/>
    <path d="M0 0 L150 112 L300 0 V198 H0Z" fill="url(#${l})"/>
    <path d="M0 0 L150 112 L300 0" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="5" style="filter:blur(2px)"/>
    <g fill="none" stroke="url(#${g})">
      <path d="M16 198 L139 115 Q150 107 161 115 L284 198" stroke-width="1.6"/>
      <path d="M32 198 L141 124 Q150 118 159 124 L268 198" stroke-width=".7"/>
      <path d="M5 6 V193 H295 V6" stroke-width="1" opacity=".75"/>
    </g>`, 'env-front-art');
}

export function envelopeFlap() {
  const g = nextId('fg'), p = nextId('fp'), l = nextId('fl');
  return svg('0 0 300 119', `
    <defs>${goldGrad(g)}
      <linearGradient id="${l}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".12"/></linearGradient>
      <linearGradient id="${p}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:var(--paper)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--paper-dark) 70%, var(--paper))"/></linearGradient></defs>
    <path d="M0 0 H300 L163 111 Q150 121 137 111Z" fill="url(#${p})"/>
    <path d="M0 0 H300 L163 111 Q150 121 137 111Z" fill="none" stroke="#000" stroke-opacity=".12" stroke-width="1.5"/>
    <path d="M0 0 H300 L163 111 Q150 121 137 111Z" fill="url(#${l})"/>
    <g fill="none" stroke="url(#${g})">
      <path d="M13 5 H287 L159 104 Q150 111 141 104Z" stroke-width="1.6"/>
      <path d="M27 10 H273 L157 96 Q150 101 143 96Z" stroke-width=".7"/>
    </g>
    <g fill="url(#${g})">${[60, 105, 150, 195, 240].map(x => `<path d="M${x} 5 l3 3 l-3 3 l-3 -3z"/>`).join('')}</g>`, 'flap-art');
}

// A botanical sprig tucked under the seal.
export function sprig() {
  const leaf = (x, y, r, s = 1) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 C6 -6 16 -6 22 0 C16 6 6 6 0 0Z"/>`;
  const side = `<path d="M60 30 C44 28 30 22 14 12" fill="none" stroke="#8a6a2e" stroke-width="1.2"/>
    <g style="fill:var(--sprig)">${leaf(44, 26, 200, 0.9)}${leaf(34, 21, 160, 0.85)}${leaf(26, 17, 205, 0.75)}${leaf(18, 13, 165, 0.7)}</g>
    <g style="fill:var(--gem)"><circle cx="40" cy="31" r="2.6"/><circle cx="35" cy="34" r="2.2"/><circle cx="22" cy="21" r="2"/></g>`;
  return svg('0 0 120 60', `${side}<g transform="translate(120 0) scale(-1 1)">${side}</g>
    <g fill="#fff" opacity=".45"><circle cx="39.3" cy="30.2" r=".8"/><circle cx="80.7" cy="30.2" r=".8"/></g>`, 'sprig-art', 'xMidYMid meet');
}

// ── Message in a bottle ──────────────────────────────────────────────
const BOTTLE_PATH = 'M36 20 H64 V25 H62 V50 C62 58 86 62 86 78 V146 C86 154 80 158 72 158 H28 C20 158 14 154 14 146 V78 C14 62 38 58 38 50 V25 H36Z';

export function bottleBack() {
  const t = nextId('bt'), b = nextId('bb'), n = nextId('bn');
  return svg('0 0 100 161', `
    <defs>
      <linearGradient id="${t}" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stop-color="#0c3f3a" stop-opacity=".78"/><stop offset=".1" stop-color="#1f6f66" stop-opacity=".5"/>
        <stop offset=".32" stop-color="#8fd9ca" stop-opacity=".16"/><stop offset=".62" stop-color="#a8e6d9" stop-opacity=".12"/>
        <stop offset=".88" stop-color="#1d6a62" stop-opacity=".5"/><stop offset="1" stop-color="#0a3833" stop-opacity=".82"/></linearGradient>
      <radialGradient id="${b}" cx="50%" cy="40%" r="60%"><stop offset="0" stop-color="#9fe3d6" stop-opacity=".35"/><stop offset="1" stop-color="#0b3a35" stop-opacity=".7"/></radialGradient>
      <filter id="${n}"><feTurbulence type="fractalNoise" baseFrequency="1.4" numOctaves="2"/><feColorMatrix values="0 0 0 0 .62  0 0 0 0 .5  0 0 0 0 .32  0 0 0 .8 0"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <path d="${BOTTLE_PATH}" fill="url(#${t})"/>
    <path d="M16 146 C30 136 46 140 58 136 C70 132 80 138 84 144 V146 C84 153 79 156 72 156 H28 C21 156 16 153 16 146Z" fill="#d9b97f"/>
    <path d="M16 146 C30 136 46 140 58 136 C70 132 80 138 84 144 V146 C84 153 79 156 72 156 H28 C21 156 16 153 16 146Z" filter="url(#${n})" opacity=".55"/>
    <path d="M16 146 C30 139 46 142 58 138 C70 135 80 140 84 145" fill="none" stroke="#f6e7c4" stroke-width=".7" opacity=".55"/>
    <path transform="translate(70 145) rotate(-20)" d="M0 -5 L1.4 -1.6 L5 -1.2 L2.2 1 L3 4.6 L0 2.6 L-3 4.6 L-2.2 1 L-5 -1.2 L-1.4 -1.6Z" fill="#c8684a"/>
    <path transform="translate(70 145) rotate(-20)" d="M0 -3.4 L0.8 -1 L2.6 -0.7" fill="none" stroke="#f0a487" stroke-width=".5" opacity=".7"/>
    <path transform="translate(26 146) rotate(10)" d="M-4 2 C-4 -3 4 -3 4 2Z" fill="#ead2c2"/>
    <path transform="translate(26 146) rotate(10)" d="M0 2 V-1.5 M-2 2 L-1.2 -1 M2 2 L1.2 -1" stroke="#b9917f" stroke-width=".4"/>
    <ellipse cx="50" cy="152" rx="35" ry="5.5" fill="url(#${b})"/>`, 'bottle-art');
}

export function bottleFront() {
  const h = nextId('bh'), r = nextId('br'), bl = nextId('bf');
  return svg('0 0 100 161', `
    <defs>
      <linearGradient id="${h}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".45" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${r}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".25" stop-color="#fff" stop-opacity=".55"/><stop offset=".8" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <filter id="${bl}"><feGaussianBlur stdDeviation=".6"/></filter>
    </defs>
    <path d="${BOTTLE_PATH}" fill="#2a7f74" fill-opacity=".12"/>
    <path d="${BOTTLE_PATH}" fill="none" stroke="#062a26" stroke-opacity=".45" stroke-width=".9"/>
    <path d="M15.4 80 C15.4 66 37 62 39.2 51 V26" fill="none" stroke="#e8fff9" stroke-opacity=".35" stroke-width=".6"/>
    <path d="M18.5 84 C19 74 26 68 33 64 L35 66 C29 70 23.5 76 23 86 V140 C23 143 20 143 19.5 140Z" fill="url(#${r})" filter="url(#${bl})"/>
    <rect x="27" y="92" width="2.2" height="40" rx="1.1" fill="url(#${h})" opacity=".55"/>
    <path d="M79.5 86 C80.5 100 80.5 124 79.5 142" fill="none" stroke="#e8fff9" stroke-opacity=".28" stroke-width="1.6" stroke-linecap="round" filter="url(#${bl})"/>
    <ellipse cx="26" cy="74" rx="2.6" ry="1.2" fill="#fff" opacity=".8" transform="rotate(-38 26 74)"/>
    <path d="M41.5 28 V48" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round" filter="url(#${bl})"/>
    <path d="M16 150 C30 156 70 156 84 150" fill="none" stroke="#e8fff9" stroke-opacity=".45" stroke-width="1.1"/>
    <path d="M18 154.5 C34 158.5 66 158.5 82 154.5" fill="none" stroke="#062a26" stroke-opacity=".35" stroke-width="1"/>
    <rect x="35" y="20" width="30" height="5.2" rx="2.2" fill="#9fdccf" fill-opacity=".38" stroke="#062a26" stroke-opacity=".35" stroke-width=".6"/>
    <rect x="36.5" y="20.8" width="27" height="1.3" rx=".6" fill="#fff" opacity=".55"/>
    <g fill="none" stroke="#7a5428" stroke-width="1.6"><path d="M37 37 Q50 40 63 37"/><path d="M37 40.5 Q50 43.5 63 40.5"/><path d="M37 44 Q50 47 63 44"/></g>
    <g fill="none" stroke="#c49a5e" stroke-width=".45" stroke-dasharray="1.2 .8"><path d="M37 36.6 Q50 39.6 63 36.6"/><path d="M37 40.1 Q50 43.1 63 40.1"/><path d="M37 43.6 Q50 46.6 63 43.6"/></g>
    <path d="M63 41 C70 44 72 52 68 60 M63 42 C68 48 66 56 61 62" fill="none" stroke="#7a5428" stroke-width="1.3" stroke-linecap="round"/>
    <path d="M68 60 l-1.2 3 M61 62 l-1.6 2.6" stroke="#a37a46" stroke-width=".7" stroke-linecap="round"/>`, 'bottle-art');
}

export function corkArt() {
  const ck = nextId('ck');
  return svg('0 0 26 20', `
    <defs><linearGradient id="${ck}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7d5226"/><stop offset=".45" stop-color="#d6a86c"/><stop offset="1" stop-color="#7a4f22"/></linearGradient></defs>
    <path d="M1 3 H25 L23.5 20 H2.5Z" fill="url(#${ck})"/>
    <ellipse cx="13" cy="3" rx="12" ry="2.6" fill="#c89a60" stroke="#8a5e2c" stroke-width=".5"/>
    <g fill="#6a4318" opacity=".45"><circle cx="6" cy="9" r=".7"/><circle cx="16" cy="12" r=".8"/><circle cx="10" cy="16" r=".6"/><circle cx="20" cy="8" r=".6"/><circle cx="12" cy="7" r=".5"/></g>`, 'cork-art');
}

// The rolled note inside the bottle, tied with a ribbon.
export function rolledNote() {
  const rn = nextId('rn');
  return svg('0 0 40 100', `
    <defs><linearGradient id="${rn}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#b8955c"/><stop offset=".35" stop-color="#f6e7c6"/><stop offset=".6" stop-color="#fbf1d8"/><stop offset="1" stop-color="#c9a86b"/></linearGradient></defs>
    <rect x="6" y="6" width="28" height="88" rx="3" fill="url(#${rn})"/>
    <ellipse cx="20" cy="6" rx="14" ry="3.5" fill="#efdcb2" stroke="#a7834b" stroke-width=".6"/>
    <ellipse cx="20" cy="6" rx="7" ry="1.6" fill="none" stroke="#a7834b" stroke-width=".5"/>
    <rect x="5" y="44" width="30" height="7" style="fill:var(--ribbon)"/>
    <rect x="5" y="44" width="30" height="2" fill="#fff" opacity=".25"/>
    <path d="M18.5 50 L11 64 L14.8 62.6 L15.6 66.8 L21 51Z M21.5 50 L29 64 L25.2 62.6 L24.4 66.8 L19 51Z" style="fill:var(--ribbon)"/>
    <ellipse cx="14.5" cy="47.5" rx="5.5" ry="3.2" transform="rotate(-18 14.5 47.5)" style="fill:var(--ribbon)"/>
    <ellipse cx="25.5" cy="47.5" rx="5.5" ry="3.2" transform="rotate(18 25.5 47.5)" style="fill:var(--ribbon)"/>
    <ellipse cx="14.5" cy="47.5" rx="2.6" ry="1.3" transform="rotate(-18 14.5 47.5)" fill="#000" opacity=".25"/>
    <ellipse cx="25.5" cy="47.5" rx="2.6" ry="1.3" transform="rotate(18 25.5 47.5)" fill="#000" opacity=".25"/>
    <circle cx="20" cy="48" r="2.6" style="fill:var(--ribbon)"/><circle cx="19.4" cy="47.3" r="1" fill="#fff" opacity=".35"/>`, 'note-art', 'xMidYMid meet');
}

// ── Treasure chest ───────────────────────────────────────────────────
const RIVET = (x, y, r = 2.6) => `<circle cx="${x}" cy="${y}" r="${r}" fill="#7a5413"/><circle cx="${x - 0.6}" cy="${y - 0.7}" r="${r * 0.65}" fill="#ffe9a8"/>`;

export function chestBase() {
  const w = nextId('cw'), g = nextId('cg'), v = nextId('cv'), gr = nextId('cgr'), wr = nextId('cwr');
  const planks = [30, 60, 90, 120];
  const grain = planks.flatMap(y => [y - 18, y - 9].map(gy =>
    `<path d="M0 ${gy} C70 ${gy - 3} 140 ${gy + 3} 210 ${gy} S300 ${gy - 2} 320 ${gy}"/>`)).join('') + `<path d="M0 141 C90 138 200 144 320 140"/>`;
  const bracket = `<path d="M0 154 V104 Q8 108 12 120 Q16 134 30 139 Q42 142 50 154Z"/>`;
  return svg('0 0 320 154', `
    <defs>${goldGrad(g, true, ANTIQUE)}${WOOD_GRAIN(gr)}${WEAR(wr)}
      <linearGradient id="${w}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8f5a2b"/><stop offset="1" stop-color="#5e3415"/></linearGradient>
      <radialGradient id="${v}" cx="50%" cy="40%" r="75%"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></radialGradient></defs>
    <rect width="320" height="154" rx="6" fill="url(#${w})"/>
    <rect width="320" height="154" rx="6" fill="#000" filter="url(#${gr})" opacity=".6"/>
    <g fill="none" stroke="#000" stroke-opacity=".16" stroke-width=".8">${grain}</g>
    <g stroke="#2e1704" stroke-width="2.2" opacity=".7">${planks.map(y => `<path d="M0 ${y} H320"/>`).join('')}</g>
    <g stroke="#d49a5a" stroke-width=".8" opacity=".3">${planks.map(y => `<path d="M0 ${y + 1.8} H320"/>`).join('')}</g>
    <rect width="320" height="154" rx="6" fill="url(#${v})"/>
    <g fill="url(#${g})">
      <rect y="0" width="320" height="7"/><rect y="145" width="320" height="9" rx="2"/>
      <rect x="42" width="20" height="154"/><rect x="258" width="20" height="154"/>
      ${bracket}<g transform="translate(320 0) scale(-1 1)">${bracket}</g>
      <g transform="translate(0 154) scale(1 -1)">${bracket}<g transform="translate(320 0) scale(-1 1)">${bracket}</g></g>
    </g>
    <g fill="#000" filter="url(#${wr})" opacity=".55">
      <rect y="0" width="320" height="7"/><rect y="145" width="320" height="9" rx="2"/>
      <rect x="42" width="20" height="154"/><rect x="258" width="20" height="154"/>
      ${bracket}<g transform="translate(320 0) scale(-1 1)">${bracket}</g>
      <g transform="translate(0 154) scale(1 -1)">${bracket}<g transform="translate(320 0) scale(-1 1)">${bracket}</g></g>
    </g>
    <g stroke="#6e4a0c" stroke-width=".8" opacity=".7"><path d="M42 0 V154 M62 0 V154 M258 0 V154 M278 0 V154"/></g>
    ${[20, 52, 86, 120].map(y => RIVET(52, y) + RIVET(268, y)).join('')}
    ${RIVET(12, 142)}${RIVET(308, 142)}${RIVET(12, 12)}${RIVET(308, 12)}
    <rect width="320" height="154" rx="6" fill="none" stroke="#2e1704" stroke-width="3"/>`, 'chest-art');
}

export function chestLid() {
  const w = nextId('lw'), g = nextId('lg'), c = nextId('lc'), gr = nextId('lgr'), wr = nextId('lwr');
  const dome = 'M0 99 V40 C0 10 60 0 160 0 C260 0 320 10 320 40 V99Z';
  return svg('0 0 320 99', `
    <defs>${goldGrad(g, true, ANTIQUE)}${WOOD_GRAIN(gr)}${WEAR(wr)}
      <linearGradient id="${w}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#a06a35"/><stop offset=".5" stop-color="#7d4a20"/><stop offset="1" stop-color="#5e3415"/></linearGradient>
      <clipPath id="${c}"><path d="${dome}"/></clipPath></defs>
    <path d="${dome}" fill="url(#${w})"/>
    <path d="${dome}" fill="#000" filter="url(#${gr})" opacity=".6"/>
    <g clip-path="url(#${c})">
      <g fill="none" stroke="#2e1704" stroke-width="2" opacity=".6"><path d="M0 70 C80 62 240 62 320 70"/><path d="M0 46 C90 30 230 30 320 46"/><path d="M30 22 C110 8 210 8 290 22"/></g>
      <g fill="none" stroke="#000" stroke-opacity=".15" stroke-width=".8"><path d="M0 82 C90 76 230 76 320 82"/><path d="M0 58 C90 46 230 46 320 58"/><path d="M10 34 C100 20 220 20 310 34"/></g>
      <path d="M40 12 C80 4 120 2 160 2" stroke="#fff" stroke-opacity=".25" stroke-width="3" fill="none" stroke-linecap="round"/>
      <g fill="url(#${g})"><rect x="42" width="20" height="99"/><rect x="258" width="20" height="99"/><rect y="86" width="320" height="13"/></g><g fill="#000" filter="url(#${wr})" opacity=".55"><rect x="42" width="20" height="99"/><rect x="258" width="20" height="99"/><rect y="86" width="320" height="13"/></g>
      <g stroke="#6e4a0c" stroke-width=".8" opacity=".7"><path d="M42 0 V99 M62 0 V99 M258 0 V99 M278 0 V99 M0 86 H320"/></g>
    </g>
    ${[24, 50, 74].map(y => RIVET(52, y) + RIVET(268, y)).join('')}
    ${[100, 220].map(x => `<ellipse cx="${x}" cy="92.5" rx="5" ry="4" style="fill:var(--gem)"/><ellipse cx="${x - 1.5}" cy="91.2" rx="1.6" ry="1.1" fill="#fff" opacity=".7"/>`).join('')}
    <path d="${dome}" fill="none" stroke="#2e1704" stroke-width="3"/>`, 'chest-art');
}

// The underside of the lid, seen once it has swung open: wood frame, gold straps, tufted velvet.
export function chestLining() {
  const w = nextId('iw'), g = nextId('ig'), v = nextId('iv'), gr = nextId('igr'), wr = nextId('iwr');
  const shape = 'M0 128 V30 C0 12 60 2 160 2 C260 2 320 12 320 30 V128Z';
  const inner = 'M14 118 V36 C14 22 70 14 160 14 C250 14 306 22 306 36 V118Z';
  const tufts = [];
  for (let y = 34; y < 118; y += 20) for (let x = 30 + ((y / 20) % 2) * 16; x < 300; x += 32) tufts.push([x, y]);
  return svg('0 0 320 128', `
    <defs>${goldGrad(g, true, ANTIQUE)}${WOOD_GRAIN(gr)}${WEAR(wr)}
      <linearGradient id="${w}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a2a10"/><stop offset="1" stop-color="#7d4a20"/></linearGradient>
      <radialGradient id="${v}" cx="50%" cy="80%" r="80%"><stop offset="0" style="stop-color:color-mix(in srgb, var(--gem) 85%, #fff)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--gem) 45%, #000)"/></radialGradient></defs>
    <path d="${shape}" fill="url(#${w})"/>
    <path d="${inner}" fill="url(#${v})"/>
    <g fill="#fff" opacity=".1">${tufts.map(([x, y]) => `<ellipse cx="${x}" cy="${y - 6}" rx="11" ry="5"/>`).join('')}</g>
    <g fill="#000" opacity=".16">${tufts.map(([x, y]) => `<ellipse cx="${x}" cy="${y + 1}" rx="6" ry="4"/>`).join('')}</g>
    <g fill="url(#${g})">${tufts.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2"/>`).join('')}</g>
    <path d="${inner}" fill="none" stroke="url(#${g})" stroke-width="3"/>
    <g fill="url(#${g})"><rect x="42" y="4" width="20" height="124"/><rect x="258" y="4" width="20" height="124"/><rect y="118" width="320" height="10"/></g>
    <g stroke="#6e4a0c" stroke-width=".8" opacity=".7"><path d="M42 4 V128 M62 4 V128 M258 4 V128 M278 4 V128"/></g>
    ${[30, 62, 94].map(y => RIVET(52, y) + RIVET(268, y)).join('')}
    <path d="${shape}" fill="none" stroke="#2e1704" stroke-width="3"/>`, 'lining-art');
}

export function chestPlate() {
  const g = nextId('pg');
  return svg('0 0 80 96', `
    <defs>${goldGrad(g, false, ANTIQUE)}</defs>
    <path d="M40 2 C52 2 60 8 66 4 C70 14 78 18 78 30 C78 44 70 50 70 62 C70 78 56 90 40 94 C24 90 10 78 10 62 C10 50 2 44 2 30 C2 18 10 14 14 4 C20 8 28 2 40 2Z" fill="url(#${g})" stroke="#6e4a0c" stroke-width="1.5"/>
    <path d="M40 9 C50 9 56 13 61 11 C64 19 70 22 70 31 C70 43 63 49 63 60 C63 73 52 83 40 87 C28 83 17 73 17 60 C17 49 10 43 10 31 C10 22 16 19 19 11 C24 13 30 9 40 9Z" fill="none" stroke="#8a6514" stroke-width=".8"/>
    <g fill="none" stroke="#8a6514" stroke-width=".9" stroke-linecap="round"><path d="M20 30 C24 24 30 26 28 31 C27 34 23 33 24 30"/><path d="M60 30 C56 24 50 26 52 31 C53 34 57 33 56 30"/><path d="M30 78 C34 82 46 82 50 78"/></g>
    ${RIVET(14, 26, 2.2)}${RIVET(66, 26, 2.2)}${RIVET(40, 84, 2.2)}`, 'plate-art', 'xMidYMid meet');
}

export function treasure() {
  const coin = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse rx="9" ry="3.6" fill="#8a6514"/><ellipse cy="-1" rx="9" ry="3.6" fill="#e9bf55"/><ellipse cy="-1" rx="6" ry="2.2" fill="none" stroke="#b8861f" stroke-width=".7"/></g>`;
  const coins = [[40, 52], [58, 50], [76, 53], [96, 49], [118, 51], [140, 48], [162, 52], [182, 49], [200, 52],
    [52, 44], [70, 42], [90, 41], [112, 40], [134, 41], [156, 42], [176, 44], [64, 35], [86, 33], [108, 31], [130, 32], [152, 34], [100, 25], [122, 24]];
  return svg('0 0 240 60', `
    <path d="M20 60 C40 30 80 18 120 16 C160 18 200 30 220 60Z" fill="#b8861f"/>
    ${coins.map(([x, y], i) => coin(x, y, i % 3 ? 1 : 0.9)).join('')}
    <path d="M150 30 l7 -8 l8 0 l7 8 l-11 11z" style="fill:var(--gem)"/><path d="M150 30 h22 l-11 11z" fill="#000" opacity=".2"/><path d="M157 22 l3 8 h-10z" fill="#fff" opacity=".45"/>
    <path d="M70 26 l5 -6 l6 0 l5 6 l-8 8z" fill="#3fa7d6"/><path d="M70 26 h16 l-8 8z" fill="#000" opacity=".2"/>
    <circle cx="190" cy="40" r="4" fill="#f6efe6"/><circle cx="196" cy="44" r="3.6" fill="#f6efe6"/><circle cx="184" cy="45" r="3.4" fill="#f6efe6"/>`, 'treasure-art', 'xMidYMax meet');
}

// ── Gift box ─────────────────────────────────────────────────────────
// Half a bow (left loop + tail); the right half is the same, mirrored in CSS.
export function bowHalf() {
  const g = nextId('bw'), i = nextId('bi'), t = nextId('bt'), f = nextId('bs');
  return svg('0 0 80 92', `
    <defs>
      <linearGradient id="${g}" x1="0" y1="0" x2=".3" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb, var(--ribbon) 70%, #fff)"/><stop offset=".45" style="stop-color:var(--ribbon)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--ribbon) 62%, #000)"/></linearGradient>
      <radialGradient id="${i}" cx="62%" cy="58%" r="60%"><stop offset="0" style="stop-color:color-mix(in srgb, var(--ribbon) 40%, #000)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--ribbon) 75%, #000)"/></radialGradient>
      <linearGradient id="${t}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:color-mix(in srgb, var(--ribbon) 65%, #000)"/><stop offset=".5" style="stop-color:var(--ribbon)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--ribbon) 70%, #000)"/></linearGradient>
      <filter id="${f}"><feGaussianBlur stdDeviation="1.6"/></filter>
    </defs>
    <path d="M78 50 C70 62 60 74 48 90 L57 85 L60 92 C70 78 78 64 82 52Z" fill="url(#${t})"/>
    <path d="M80 46 C64 20 30 6 14 16 C2 24 6 46 24 52 C40 57 62 52 80 46Z" fill="url(#${g})"/>
    <path d="M80 46 C66 32 42 22 28 27 C19 31 21 42 31 46 C45 50 64 48 80 46Z" fill="url(#${i})"/>
    <path d="M80 46 C70 40 56 38 44 42" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="2" filter="url(#${f})"/>
    <path d="M72 38 C58 22 36 13 20 19" fill="none" stroke="#fff" stroke-opacity=".38" stroke-width="4" stroke-linecap="round" filter="url(#${f})"/>
    <path d="M60 24 C50 18 38 15 28 17" fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="1" stroke-linecap="round"/>
    <path d="M10 30 C10 40 16 48 24 52" fill="none" stroke="#000" stroke-opacity=".2" stroke-width="2.5" filter="url(#${f})"/>`, 'bow-art', 'xMidYMid meet');
}

export function bowKnot() {
  return svg('0 0 30 26', `
    <rect x="2" y="2" width="26" height="22" rx="8" style="fill:var(--ribbon)"/>
    <path d="M8 4 C10 12 10 16 8 22 M22 4 C20 12 20 16 22 22" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1.2"/>
    <rect x="6" y="5" width="18" height="5" rx="2.5" fill="#fff" opacity=".3"/>`, 'knot-art', 'xMidYMid meet');
}

export function giftTag(glyph) {
  const g = nextId('tg');
  return svg('0 0 44 74', `
    <defs>${goldGrad(g)}</defs>
    <path d="M22 0 C20 10 26 16 22 26" fill="none" stroke="#c9962e" stroke-width="1.2"/>
    <path d="M8 26 H36 L41 33 V66 Q41 71 36 71 H8 Q3 71 3 66 V33Z" fill="#fbf2dc" stroke="#b8955c" stroke-width=".8"/>
    <path d="M10 30 H34 L37 35 V64 Q37 67 34 67 H10 Q7 67 7 64 V35Z" fill="none" stroke="url(#${g})" stroke-width="1"/>
    <circle cx="22" cy="31" r="2" fill="#fff" stroke="#c9962e" stroke-width=".8"/>
    <text x="22" y="52" text-anchor="middle" dominant-baseline="central" font-size="14" style="fill:var(--accent)">${glyph}</text>`, 'tag-art', 'xMidYMid meet');
}

export function tissue() {
  return svg('0 0 200 50', `
    <path d="M0 50 L10 20 L22 34 L34 8 L48 30 L60 12 L74 28 L88 4 L102 26 L116 10 L130 30 L144 6 L158 28 L172 14 L186 30 L200 18 V50Z" style="fill:color-mix(in srgb, var(--gem) 35%, #fff)"/>
    <path d="M6 50 L18 26 L30 40 L44 18 L58 36 L72 20 L86 38 L100 14 L114 34 L128 18 L142 36 L156 16 L170 36 L184 22 L196 50Z" fill="#fff" opacity=".85"/>
    <path d="M34 8 L40 30 M88 4 L92 26 M144 6 L146 28" stroke="#000" stroke-opacity=".08" stroke-width="1"/>`, 'tissue-art');
}
