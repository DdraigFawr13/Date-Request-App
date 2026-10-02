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

// ── Owl post ─────────────────────────────────────────────────────────
// A Eurasian eagle-owl on a branch, a letter in its beak. The folded wings sit
// behind its flanks (only their edges show) so they can open out and beat as
// it takes off.
const OWL_BODY = 'M100 30 C131 30 153 41 160 64 C166 84 163 104 165 124 C168 152 160 180 146 197 C134 211 118 218 100 218 C82 218 66 211 54 197 C40 180 32 152 35 124 C37 104 34 84 40 64 C47 41 69 30 100 30Z';
const OWL_DISC = 'M100 68 C93 54 70 50 56 61 C42 73 44 101 58 112 C70 121 89 119 100 109 C111 119 130 121 142 112 C156 101 158 73 144 61 C130 50 107 54 100 68Z';

// Seeded noise so every owl is drawn the same.
const rnd = seed => () => ((seed = (seed * 16807) % 2147483647) / 2147483647);

export function owlBody() {
  const id = nextId('ow'), r = rnd(7);
  const ref = s => `url(#${id}${s})`;
  // Breast: long dark shaft streaks with fine wavy cross-barring.
  const streaks = [];
  for (let row = 0; row < 9; row++) {
    for (let c = -4; c <= 4; c++) {
      const x = 100 + c * 9.5 + (row % 2 ? 4.7 : 0) + (r() - 0.5) * 3, y = 112 + row * 11 + (r() - 0.5) * 3, len = 6 + r() * 6;
      streaks.push(`<path d="M${x.toFixed(1)} ${y.toFixed(1)} c-.8 ${(len * 0.4).toFixed(1)} -.9 ${(len * 0.8).toFixed(1)} 0 ${len.toFixed(1)} c.7 -${(len * 0.2).toFixed(1)} .8 -${(len * 0.6).toFixed(1)} 0 -${len.toFixed(1)}Z"/>`);
    }
  }
  const bars = Array.from({ length: 22 }, (_, i) => {
    const y = 108 + i * 4.8;
    return `M50 ${y.toFixed(1)} q6 1.6 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0`;
  }).join(' ');
  // Head: fine, mottled streaks fanning back from the brow.
  const crown = Array.from({ length: 60 }, () => {
    const x = 48 + r() * 104, y = 32 + r() * 30, l = 2 + r() * 3.5, a = (x - 100) * 0.014;
    return `M${x.toFixed(1)} ${y.toFixed(1)} q${(Math.sin(a) * l + 0.8).toFixed(1)} ${(l * 0.5).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)} ${(Math.cos(a) * l).toFixed(1)}`;
  }).join(' ');
  // Feather tips breaking up the silhouette along the lower flanks.
  const fringe = side => Array.from({ length: 11 }, (_, i) => {
    const t = i / 10, y = 120 + t * 82, x = side < 0 ? 36 + t * t * 24 : 164 - t * t * 24;
    return `M${(x - side * 3).toFixed(1)} ${(y - 6).toFixed(1)} q${side * 3} 3 ${side * 2.4} 7`;
  }).join(' ');
  const rays = cx => Array.from({ length: 22 }, (_, i) => {
    const a = (i / 22) * Math.PI * 2;
    return `M${(cx + Math.cos(a) * 16).toFixed(1)} ${(86 + Math.sin(a) * 16).toFixed(1)} L${(cx + Math.cos(a) * 34).toFixed(1)} ${(86 + Math.sin(a) * 34).toFixed(1)}`;
  }).join(' ');
  const fibres = Array.from({ length: 24 }, (_, i) => {
    const a = (i / 24) * Math.PI * 2;
    return `M${(Math.cos(a) * 7).toFixed(1)} ${(Math.sin(a) * 7).toFixed(1)} L${(Math.cos(a) * 12.6).toFixed(1)} ${(Math.sin(a) * 12.6).toFixed(1)}`;
  }).join(' ');
  const eye = x => `<g transform="translate(${x} 86)">
      <circle r="16.2" fill="#1a0e06"/>
      <circle r="13.4" fill="${ref('i')}"/>
      <path d="${fibres}" stroke="#8a3c02" stroke-width=".5" opacity=".45"/>
      <circle r="13.4" fill="none" stroke="#5a2400" stroke-width="1.1" opacity=".75"/>
      <circle r="6.6" fill="#050302"/>
      <ellipse cx="-3" cy="-5" rx="8.5" ry="5" fill="${ref('c')}"/>
      <circle cx="-4.4" cy="-4.6" r="2.3" fill="#fff" opacity=".95"/><circle cx="4.6" cy="4" r=".9" fill="#fff" opacity=".55"/>
      <path d="M-16.5 -2.5 Q0 -21 16.5 -2.5 Q0 -13.5 -16.5 -2.5Z" fill="#24140a"/>
      <circle class="owl-lid" r="16.4" fill="#9b6b40"/>
    </g>`;
  const tuft = (x, s) => `<g transform="translate(${x} 52) scale(${s} 1)">
      <path d="M-6 8 C-10 -4 -16 -18 -24 -32 C-14 -28 -6 -20 -2 -10 C-2 -20 -4 -30 -6 -40 C2 -30 8 -16 10 -2 C12 -8 14 -14 14 -20 C18 -10 18 0 14 8Z" fill="#7a5130"/>
      <path d="M-4 6 C-8 -6 -14 -18 -20 -28 M0 2 C0 -12 -2 -26 -5 -36 M8 0 C10 -6 12 -12 13 -17" stroke="#24140a" stroke-width=".9" fill="none" opacity=".75"/>
      <path d="M-2 6 C-5 -6 -10 -16 -15 -24 M3 2 C3 -10 1 -22 -2 -32" stroke="#e0b880" stroke-width=".6" fill="none" opacity=".45"/>
    </g>`;
  // Feathered feet; the toes curl over the branch, with dark hooked talons.
  const foot = x => `<g transform="translate(${x} 205)">
      <ellipse rx="13" ry="8" fill="${ref('f')}"/>
      <path d="M-11 -2 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0 q3 -4 6 0" stroke="#a5824e" stroke-width=".6" fill="none" opacity=".7"/>
      ${[-7.5, 0, 7.5].map(dx => `<path d="M${dx} 3 C${dx * 1.1} 8 ${dx * 1.05} 11 ${dx * 0.92} 13.5" stroke="${ref('f')}" stroke-width="6.2" stroke-linecap="round" fill="none"/>
      <path d="M${dx - 2} 5 q2 1.5 4 0 M${dx - 2} 8.5 q2 1.5 4 0" stroke="#a5824e" stroke-width=".5" fill="none" opacity=".7"/>`).join('')}
      <path d="M-6.9 14 q-.2 4.4 -3.6 6 M0 14.5 q.6 4.4 -2.6 6.4 M6.9 14 q1.6 3.8 -.6 6.2" stroke="#120d09" stroke-width="2.1" stroke-linecap="round" fill="none"/>
      <path d="M-7.2 15 q-.3 2.6 -2 3.8 M-.3 15.5 q.2 2.6 -1.4 4" stroke="#8d8378" stroke-width=".5" fill="none"/>
    </g>`;
  return svg('0 0 200 232', `
    <defs>
      <radialGradient id="${id}b" cx="50%" cy="32%" r="72%"><stop offset="0" stop-color="#c4915a"/><stop offset=".5" stop-color="#9b6b40"/><stop offset="1" stop-color="#5a3a20"/></radialGradient>
      <radialGradient id="${id}r" cx="50%" cy="26%" r="80%"><stop offset="0" stop-color="#f0d7a6"/><stop offset=".6" stop-color="#d4a86c"/><stop offset="1" stop-color="#a77a48"/></radialGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#160c04" stop-opacity=".7"/><stop offset=".2" stop-color="#160c04" stop-opacity=".1"/><stop offset=".42" stop-color="#fff3d8" stop-opacity=".1"/><stop offset=".6" stop-color="#160c04" stop-opacity="0"/><stop offset=".82" stop-color="#160c04" stop-opacity=".15"/><stop offset="1" stop-color="#160c04" stop-opacity=".75"/></linearGradient>
      <linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset=".8" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
      <radialGradient id="${id}d" cx="50%" cy="48%" r="58%"><stop offset="0" stop-color="#e7c995"/><stop offset=".6" stop-color="#c99a62"/><stop offset="1" stop-color="#8e6236"/></radialGradient>
      <radialGradient id="${id}i" cx="45%" cy="42%" r="62%"><stop offset="0" stop-color="#ffd04a"/><stop offset=".45" stop-color="#ff9d12"/><stop offset=".85" stop-color="#d9620a"/><stop offset="1" stop-color="#8a3402"/></radialGradient>
      <radialGradient id="${id}c" cx="40%" cy="35%" r="60%"><stop offset="0" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}k" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a342e"/><stop offset=".4" stop-color="#6e655b"/><stop offset="1" stop-color="#16120e"/></linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e3c792"/><stop offset="1" stop-color="#b8935a"/></linearGradient>
      <clipPath id="${id}cb"><path d="${OWL_BODY}"/></clipPath>
      <clipPath id="${id}cr"><path d="M100 104 C128 104 146 124 148 156 C150 190 128 214 100 214 C72 214 50 190 52 156 C54 124 72 104 100 104Z"/></clipPath>
      <clipPath id="${id}cd"><path d="${OWL_DISC}"/></clipPath>
      <filter id="${id}m" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".07 .32" numOctaves="3" seed="21"/>
        <feColorMatrix values="0 0 0 0 .13  0 0 0 0 .07  0 0 0 0 .02  0 0 0 3.2 -1.55"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="${id}l" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".14 .4" numOctaves="2" seed="5"/>
        <feColorMatrix values="0 0 0 0 .96  0 0 0 0 .84  0 0 0 0 .62  0 0 0 3 -1.75"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="${id}g" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency="1.1" numOctaves="2" seed="3"/>
        <feColorMatrix values="0 0 0 0 .1  0 0 0 0 .06  0 0 0 0 .02  0 0 0 1 -.4"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <path d="M86 192 L80 228 L92 226 L100 230 L108 226 L120 228 L114 192Z" fill="#5e3d22"/>
    <path d="M85 202 H115 M83 212 H117 M82 221 H118" stroke="#c8975e" stroke-width="2.2" opacity=".5"/>
    ${tuft(62, 1)}${tuft(138, -1)}
    <path d="${OWL_BODY}" fill="${ref('b')}"/>
    <g clip-path="${ref('cb')}">
      <rect width="200" height="232" filter="${ref('m')}"/>
      <rect width="200" height="232" filter="${ref('l')}" opacity=".7"/>
      <path d="${crown}" stroke="#24140a" stroke-width=".7" stroke-linecap="round" fill="none" opacity=".4"/>
      <path d="${crown}" stroke="#f0d3a0" stroke-width=".5" stroke-linecap="round" fill="none" opacity=".3" transform="translate(1.4 .6)"/>
      <g clip-path="${ref('cr')}">
        <path d="M100 104 C128 104 146 124 148 156 C150 190 128 214 100 214 C72 214 50 190 52 156 C54 124 72 104 100 104Z" fill="${ref('r')}"/>
        <path d="${bars}" fill="none" stroke="#6a4424" stroke-width=".45" opacity=".3"/>
        <g fill="#2e1a0b" opacity=".62">${streaks.join('')}</g>
        <path d="M100 104 C128 104 146 124 148 156 C150 190 128 214 100 214 C72 214 50 190 52 156 C54 124 72 104 100 104Z" fill="none" stroke="#5a3a20" stroke-width="8" opacity=".35" style="filter:blur(3px)"/>
      </g>
      <path d="M84 112 C90 120 110 120 116 112 C112 128 88 128 84 112Z" fill="#f4ead8" opacity=".85"/>
      <path d="${fringe(-1)} ${fringe(1)}" stroke="#3a2412" stroke-width="1" fill="none" opacity=".55"/>
      <rect width="200" height="232" fill="${ref('s')}"/>
      <rect width="200" height="232" fill="${ref('v')}"/>
    </g>
    <path d="${fringe(-1)} ${fringe(1)}" stroke="#7a5230" stroke-width="1.6" stroke-linecap="round" fill="none" transform="translate(0 2)"/>
    <path d="${OWL_DISC}" fill="${ref('d')}"/>
    <g clip-path="${ref('cd')}">
      <path d="${rays(76)} ${rays(124)}" stroke="#6e4422" stroke-width=".45" opacity=".3"/>
      <rect width="200" height="232" filter="${ref('g')}" opacity=".6"/>
    </g>
    <path d="${OWL_DISC}" fill="none" stroke="#2a170a" stroke-width="4.5" stroke-linejoin="round" opacity=".55" style="filter:blur(1.2px)"/>
    <path d="${OWL_DISC}" fill="none" stroke="#24140a" stroke-width="1.6" stroke-linejoin="round" stroke-dasharray="1.4 .9"/>
    <path d="M100 110 C95 96 90 80 82 70 C78 64 70 64 64 68 C72 60 92 60 100 74 C108 60 128 60 136 68 C130 64 122 64 118 70 C110 80 105 96 100 110Z" fill="#ead6b0" opacity=".9"/>
    <path d="M98 76 C94 72 86 70 80 72 M102 76 C106 72 114 70 120 72" stroke="#a07a4c" stroke-width=".6" fill="none" opacity=".8"/>
    ${eye(76)}${eye(124)}
    <path d="M100 96 C95.6 96 94 101 95.5 107 C97 112.5 100 118 100 118 C100 118 103 112.5 104.5 107 C106 101 104.4 96 100 96Z" fill="${ref('k')}"/>
    <path d="M98 99 C97.4 103 98 108 99.4 112" fill="none" stroke="#b9b0a5" stroke-width=".8" opacity=".55"/>
    <path d="M100 92 l-6 9 M100 92 l6 9 M100 93 l-3 10 M100 93 l3 10" stroke="#efe6d6" stroke-width=".7" opacity=".7"/>
    ${foot(84)}${foot(116)}`, 'owl-art', 'xMidYMid meet');
}

// A folded wing. It sits behind the owl's flank; opened, it shows the barred
// flight feathers.
const WING = 'M42 2 C24 8 10 34 8 70 C6 98 12 122 26 140 C34 120 46 92 52 62 C56 40 54 14 42 2Z';
export function owlWing() {
  const id = nextId('owg'), r = rnd(11);
  const primaries = [[46, 56, 28, 139], [45, 54, 22, 133], [44, 52, 16, 123], [43, 50, 11, 109], [42, 48, 8, 93], [41, 46, 7, 78]];
  const feather = ([x1, y1, x2, y2]) => {
    const d = `M${x1} ${y1} Q${(x1 + x2) / 2 + 5} ${(y1 + y2) / 2} ${x2} ${y2}`;
    return `<path d="${d}" stroke="#2c1a0c" stroke-width="10.5" stroke-linecap="round" fill="none"/>
      <path d="${d}" stroke="#7e5531" stroke-width="8.6" stroke-linecap="round" fill="none"/>
      <path d="${d}" stroke="#d6ad74" stroke-width="8" stroke-dasharray="2.6 5.4" fill="none" opacity=".75"/>
      <path d="${d}" stroke="#1e1208" stroke-width=".5" fill="none" opacity=".6"/>`;
  };
  const spots = Array.from({ length: 40 }, () => `<ellipse cx="${(8 + r() * 46).toFixed(1)}" cy="${(8 + r() * 52).toFixed(1)}" rx="${(1 + r() * 1.4).toFixed(1)}" ry="${(0.7 + r()).toFixed(1)}"/>`).join('');
  return svg('0 0 60 142', `
    <defs>
      <linearGradient id="${id}g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#9d6d42"/><stop offset=".5" stop-color="#76502e"/><stop offset="1" stop-color="#3f2814"/></linearGradient>
      <clipPath id="${id}c"><path d="${WING}"/></clipPath>
    </defs>
    <path d="${WING}" fill="url(#${id}g)"/>
    <g clip-path="url(#${id}c)">
      ${primaries.slice().reverse().map(feather).join('')}
      <path d="M0 0 H60 V56 C40 62 20 56 0 66Z" fill="url(#${id}g)"/>
      <g fill="#e2bf88" opacity=".55">${spots}</g>
      <path d="M0 66 C20 56 40 62 60 56" fill="none" stroke="#1e1208" stroke-width="1.4" opacity=".45"/>
      <path d="M60 0 V142 H44 C50 100 56 60 50 0Z" fill="#000" opacity=".25"/>
    </g>
    <path d="${WING}" fill="none" stroke="#1e1208" stroke-opacity=".6" stroke-width=".8"/>`, 'owl-wing-art');
}

// A gnarled, mossy branch for the owl to perch on.
export function branch() {
  const w = nextId('brw'), g = nextId('brg'), m = nextId('brm');
  const BR = 'M0 22 C40 16 80 20 120 17 C170 13 220 17 260 15 C290 14 316 18 340 14 V31 C316 33 290 30 260 32 C220 34 170 33 120 34 C80 35 40 33 0 38Z';
  const leaf = (x, y, rot, s = 1) => `<g transform="translate(${x} ${y}) rotate(${rot}) scale(${s})"><path d="M0 0 C6 -7 18 -7 26 0 C18 7 6 7 0 0Z"/><path d="M1 0 H24" stroke="#000" stroke-opacity=".25" stroke-width=".6"/></g>`;
  return svg('0 0 340 46', `
    <defs>
      <linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#93765a"/><stop offset=".3" stop-color="#6b5038"/><stop offset=".7" stop-color="#433020"/><stop offset="1" stop-color="#20160d"/></linearGradient>
      ${WOOD_GRAIN(w)}
      <filter id="${m}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".18 .5" numOctaves="2" seed="8"/>
        <feColorMatrix values="0 0 0 0 .38  0 0 0 0 .5  0 0 0 0 .22  0 0 0 3.4 -1.9"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <path d="M250 18 C266 8 278 4 292 2 M270 9 C276 4 278 0 278 0" stroke="#4e3824" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    <path d="M60 32 C52 38 48 42 40 46" stroke="#3e2c1c" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    <path d="${BR}" fill="url(#${g})"/>
    <path d="${BR}" fill="#000" filter="url(#${w})" opacity=".85"/>
    <path d="M0 22 C40 16 80 20 120 17 C170 13 220 17 260 15 C290 14 316 18 340 14 V22 C300 22 260 21 200 22 C140 23 60 24 0 28Z" filter="url(#${m})"/>
    <ellipse cx="176" cy="25" rx="5" ry="3" fill="#2a1d12"/><ellipse cx="176" cy="24.4" rx="3" ry="1.6" fill="#7a5c40"/>
    <path d="M24 21 C64 15 104 19 144 16" stroke="#e6d4b8" stroke-width=".9" opacity=".3" fill="none"/>
    <g fill="#c9c3a0" opacity=".55"><circle cx="40" cy="26" r="2"/><circle cx="44" cy="27.5" r="1.3"/><circle cx="232" cy="22" r="1.8"/><circle cx="300" cy="22" r="1.4"/></g>
    <g style="fill:var(--sprig)">${leaf(292, 2, -20, 0.8)}${leaf(276, 6, -150, 0.7)}${leaf(42, 44, 150, 0.7)}${leaf(300, 16, 10, 0.75)}</g>`, 'branch-art');
}

// ── Pop-up book ──────────────────────────────────────────────────────
export function bookCover() {
  const g = nextId('cg'), gr = nextId('cgr'), l = nextId('cl');
  const fleuron = (x, y, sx, sy) => `<path transform="translate(${x} ${y}) scale(${sx} ${sy})" d="M0 0 C8 0 14 4 16 12 C10 8 5 8 2 12 C2 6 1 3 0 0Z M0 0 C0 8 4 14 12 16 C8 10 8 5 12 2 C6 2 3 1 0 0Z"/>`;
  return svg('0 0 150 200', `
    <defs>${goldGrad(g, true, ANTIQUE)}
      <linearGradient id="${l}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
      <filter id="${gr}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="3" seed="3"/>
        <feColorMatrix values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1.3 -.55"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <rect width="150" height="200" rx="4" style="fill:var(--leather)"/>
    <rect width="150" height="200" rx="4" fill="#000" filter="url(#${gr})" opacity=".55"/>
    <rect width="150" height="200" rx="4" fill="url(#${l})"/>
    <rect width="15" height="200" fill="#000" opacity=".28"/>
    <path d="M15 0 V200" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/><path d="M17 0 V200" stroke="#fff" stroke-opacity=".12"/>
    <g fill="url(#${g})">${[26, 64, 136, 174].map(y => `<rect x="1" y="${y}" width="13" height="3" rx="1.5"/>`).join('')}</g>
    <g fill="none" stroke="url(#${g})">
      <rect x="25" y="11" width="115" height="178" rx="2" stroke-width="2"/>
      <rect x="30" y="16" width="105" height="168" rx="1.5" stroke-width=".7"/>
      <circle cx="82.5" cy="100" r="30" stroke-width="2"/><circle cx="82.5" cy="100" r="25" stroke-width=".7"/>
      <path d="M82.5 46 V64 M82.5 136 V154 M50 100 H38 M115 100 H127" stroke-width=".8"/>
    </g>
    <g fill="url(#${g})">${fleuron(30, 16, 1, 1)}${fleuron(135, 16, -1, 1)}${fleuron(30, 184, 1, -1)}${fleuron(135, 184, -1, -1)}
      <path d="M82.5 40 l3 4 l-3 4 l-3 -4z M82.5 152 l3 4 l-3 4 l-3 -4z"/></g>
    <g fill="url(#${g})" opacity=".95"><path d="M150 0 V22 L128 0Z"/><path d="M150 200 V178 L128 200Z"/></g>
    <path d="M150 0 V22 L128 0Z M150 200 V178 L128 200Z" fill="#000" filter="url(#${gr})" opacity=".4"/>
    <rect x=".5" y=".5" width="149" height="199" rx="4" fill="none" stroke="#000" stroke-opacity=".35"/>`, 'cover-art');
}

// Paper-cut scenery that stands up out of the book: a little paper theatre.
// The backdrop: a night (or day) sky with punched-through stars and clouds.
export function popSky() {
  const id = nextId('ps'), r = rnd(5);
  const ARCH = 'M4 220 V70 C4 30 46 4 100 4 C154 4 196 30 196 70 V220Z';
  const stars = Array.from({ length: 22 }, () => {
    const x = 20 + r() * 160, y = 16 + r() * 120, s = 0.6 + r() * 1.3;
    return `<path transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${s.toFixed(2)})" d="M0 -3 L.8 -.8 L3 0 L.8 .8 L0 3 L-.8 .8 L-3 0 L-.8 -.8Z"/>`;
  }).join('');
  const cloud = (y, fill, shift) => `<path transform="translate(${shift} 0)" d="M-10 220 V${y} C10 ${y - 14} 26 ${y - 12} 36 ${y - 4} C44 ${y - 18} 66 ${y - 18} 74 ${y - 6} C86 ${y - 16} 104 ${y - 14} 110 ${y - 2} C122 ${y - 14} 144 ${y - 14} 152 ${y - 4} C162 ${y - 12} 184 ${y - 10} 210 ${y} V220Z" style="fill:${fill}" stroke="#fff" stroke-opacity=".7" stroke-width="1"/>`;
  return svg('0 0 200 220', `
    <defs>
      <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb, var(--bg1) 85%, #000)"/><stop offset=".7" style="stop-color:color-mix(in srgb, var(--bg2) 80%, var(--accent))"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--bg2) 60%, #fff)"/></linearGradient>
      ${goldGrad(`${id}g`)}
      <filter id="${id}b"><feGaussianBlur stdDeviation="1.2"/></filter>
    </defs>
    <path d="${ARCH}" fill="url(#${id}s)"/>
    <g fill="#fff4cf" filter="url(#${id}b)" opacity=".9">${stars}</g>
    <g fill="#fffaf0">${stars}</g>
    ${cloud(186, 'color-mix(in srgb, var(--card) 75%, var(--bg2))', -6)}
    ${cloud(200, 'color-mix(in srgb, var(--card) 92%, var(--bg2))', 14)}
    <path d="${ARCH}" fill="none" stroke="url(#${id}g)" stroke-width="3"/>
    <path d="${ARCH}" fill="none" stroke="#000" stroke-opacity=".25" stroke-width="1" transform="translate(0 1.5)"/>`, 'pop-art', 'none');
}

// The theatre's front: a patterned, gilt-edged frame with an arched opening.
export function popFrame() {
  const id = nextId('pf');
  const OUT = 'M0 160 V40 C0 14 30 0 100 0 C170 0 200 14 200 40 V160Z';
  const IN = 'M24 160 V58 C24 34 52 22 100 22 C148 22 176 34 176 58 V160Z';
  return svg('0 0 200 160', `
    <defs>${goldGrad(`${id}g`)}
      <pattern id="${id}p" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M7 2 l2 5 l-2 5 l-2 -5z" style="fill:var(--sprig)" opacity=".55"/><circle cx="0" cy="0" r="1.2" style="fill:var(--sprig)" opacity=".5"/><circle cx="14" cy="14" r="1.2" style="fill:var(--sprig)" opacity=".5"/></pattern>
      <linearGradient id="${id}l" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".25"/></linearGradient>
    </defs>
    <path d="${OUT} ${IN}" fill-rule="evenodd" style="fill:var(--liner)"/>
    <path d="${OUT} ${IN}" fill-rule="evenodd" fill="url(#${id}p)"/>
    <path d="${OUT} ${IN}" fill-rule="evenodd" fill="url(#${id}l)"/>
    <path d="${IN}" fill="none" stroke="#000" stroke-opacity=".35" stroke-width="5" style="filter:blur(2px)"/>
    <g fill="none" stroke="url(#${id}g)"><path d="${OUT}" stroke-width="3"/><path d="${IN}" stroke-width="2.4"/>
      <path d="M8 160 V42 C8 20 36 8 100 8 C164 8 192 20 192 42 V160" stroke-width=".8"/></g>
    <g transform="translate(100 11)"><circle r="8" fill="url(#${id}g)"/><circle r="5.6" style="fill:var(--liner)"/></g>
    <g fill="url(#${id}g)">${[[12, 150], [188, 150]].map(([x, y]) => `<rect x="${x - 6}" y="${y - 2}" width="12" height="12" rx="1"/><rect x="${x - 4}" y="${y - 70}" width="8" height="68" rx="1" opacity=".55"/>`).join('')}</g>`, 'pop-art', 'none');
}

// A scalloped velvet valance with gold fringe, hung inside the arch.
export function popValance() {
  const id = nextId('pv');
  const scallops = Array.from({ length: 6 }, (_, i) => `Q${12 + i * 25} 34 ${25 + i * 25} 18`).join(' ');
  return svg('0 0 150 36', `
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb, var(--ribbon) 55%, #000)"/><stop offset=".6" style="stop-color:var(--ribbon)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--ribbon) 70%, #000)"/></linearGradient>${goldGrad(`${id}g`)}</defs>
    <path d="M0 0 H150 V18 ${Array.from({ length: 6 }, (_, i) => `Q${138 - i * 25} 34 ${125 - i * 25} 18`).join(' ')} Z" fill="url(#${id})"/>
    <path d="M0 18 ${scallops}" fill="none" stroke="url(#${id}g)" stroke-width="2"/>
    <path d="M0 18 ${scallops}" fill="none" stroke="#e8c76a" stroke-width="3" stroke-dasharray=".6 1.4" transform="translate(0 2.4)"/>
    ${Array.from({ length: 7 }, (_, i) => `<path d="M${i * 25} 18 v8" stroke="url(#${id}g)" stroke-width="1.2"/><ellipse cx="${i * 25}" cy="28" rx="1.8" ry="3" fill="url(#${id}g)"/>`).join('')}`, 'pop-art', 'none');
}

// One velvet curtain (the right one is mirrored in CSS).
export function popCurtain() {
  const id = nextId('pc');
  return svg('0 0 60 160', `
    <defs>
      <pattern id="${id}p" width="10" height="160" patternUnits="userSpaceOnUse">
        <rect width="10" height="160" style="fill:var(--ribbon)"/>
        <rect width="10" height="160" fill="url(#${id}f)"/></pattern>
      <linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".5"/><stop offset=".35" stop-color="#fff" stop-opacity=".18"/><stop offset=".55" stop-color="#fff" stop-opacity=".05"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></linearGradient>
      <linearGradient id="${id}v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></linearGradient>
      ${goldGrad(`${id}g`)}
    </defs>
    <path d="M0 0 H60 C58 50 60 110 58 152 Q44 158 30 154 Q14 158 0 154Z" fill="url(#${id}p)"/>
    <path d="M0 0 H60 C58 50 60 110 58 152 Q44 158 30 154 Q14 158 0 154Z" fill="url(#${id}v)"/>
    <path d="M0 154 Q14 158 30 154 Q44 158 58 152" fill="none" stroke="url(#${id}g)" stroke-width="2.4"/>
    <path d="M0 156 Q14 160 30 156 Q44 160 58 154" fill="none" stroke="#e8c76a" stroke-width="3" stroke-dasharray=".6 1.2"/>`, 'pop-art', 'none');
}

// A stand of paper trees for one side of the spread.
export function popTrees() {
  const leafy = (x, y, s, shade) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2" y="-6" width="4" height="16" fill="#6a4c32"/>
    <path d="M0 -40 C12 -40 20 -30 18 -20 C24 -14 22 -2 12 0 C8 4 -8 4 -12 0 C-22 -2 -24 -14 -18 -20 C-20 -30 -12 -40 0 -40Z" style="fill:color-mix(in srgb, var(--tree) ${shade}%, #000)" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>
    <path d="M-10 -26 C-6 -32 2 -34 6 -32" stroke="#fff" stroke-opacity=".35" stroke-width="1.6" fill="none"/></g>`;
  const pine = (x, y, s, shade) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-2" y="2" width="4" height="8" fill="#6a4c32"/>
    <path d="M0 -44 L12 -24 H6 L16 -8 H8 L20 6 H-20 L-8 -8 H-16 L-6 -24 H-12Z" style="fill:color-mix(in srgb, var(--tree) ${shade}%, #000)" stroke="#fff" stroke-opacity=".6" stroke-width="1"/></g>`;
  return svg('0 0 100 90', `
    <path d="M0 90 V70 C20 60 50 62 70 70 C84 66 96 68 100 72 V90Z" style="fill:color-mix(in srgb, var(--tree) 60%, #000)" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>
    ${pine(24, 70, 1.15, 50)}${leafy(62, 74, 1, 64)}${pine(86, 80, 0.8, 58)}
    <path d="M0 90 V80 C20 74 44 76 60 82 C74 78 90 80 100 84 V90Z" style="fill:var(--tree)" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>`, 'pop-art', 'xMidYMax meet');
}

// Flowers and grass along the front edge, with footlights between.
export function popFront() {
  const flower = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-14" stroke="#4d6b36" stroke-width="1.6"/>
    <g style="fill:var(--gem)" stroke="#fff" stroke-opacity=".6" stroke-width=".6">${[0, 72, 144, 216, 288].map(r => `<ellipse transform="rotate(${r} 0 -18)" cy="-22" rx="3" ry="4.4"/>`).join('')}</g>
    <circle cy="-18" r="2.4" fill="#f2c84b"/></g>`;
  return svg('0 0 200 40', `
    <path d="M0 40 V30 C10 22 20 26 30 30 C44 22 56 24 66 32 V40Z M134 40 V32 C146 22 160 24 172 30 C182 24 192 24 200 30 V40Z" style="fill:var(--tree)" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>
    <rect x="62" y="31" width="76" height="9" rx="1.5" style="fill:color-mix(in srgb, var(--liner) 70%, #000)"/>
    <rect x="62" y="31" width="76" height="2" fill="#e8c76a"/>
    ${flower(18, 30, 0.9)}${flower(40, 32, 0.75)}${flower(160, 31, 0.85)}${flower(184, 30, 0.7)}`, 'pop-art', 'xMidYMax meet');
}

// ── Telegram (a vintage typewriter) ──────────────────────────────────
const CHROME = ['#5d656c', '#c9d0d6', '#ffffff', '#9aa3ab', '#6b737a', '#3a4046'];
export function typewriterBody() {
  const e = nextId('te'), c = nextId('tc'), k = nextId('tk'), sh = nextId('ts'), gd = nextId('tg'), gr = nextId('tgr');
  const rows = [['1234567890', 84, 6.2, 17], ['QWERTYUIOP', 100, 6.6, 18], ['ASDFGHJKL', 117, 7, 19.2], ['ZXCVBNM,.', 134, 7.4, 20.4]];
  let n = 0;
  const keys = rows.map(([chars, y, r, dx], ri) => [...chars].map((ch, i) => {
    const x = 150 + (i - (chars.length - 1) / 2) * dx + ri * 2;
    return `<g transform="translate(${x.toFixed(1)} ${y})"><g class="tw-key k${(n++ * 7) % 6}">
      <ellipse cy="2.4" rx="${r + 1.2}" ry="${r * 0.55}" fill="#000" opacity=".35"/>
      <circle r="${r + 1.3}" fill="url(#${c})"/><circle r="${r}" fill="#15100d"/><circle r="${r - 0.9}" fill="url(#${k})"/>
      <text y="${(r * 0.36).toFixed(1)}" text-anchor="middle" font-size="${(r * 0.95).toFixed(1)}" fill="#efe6d2" font-family="'Courier New', monospace" font-weight="700">${ch === ',' ? ',' : ch}</text></g></g>`;
  }).join('')).join('');
  const bars = Array.from({ length: 23 }, (_, i) => {
    const a = Math.PI * (0.08 + (i / 22) * 0.84);
    return `M${(150 - Math.cos(a) * 12).toFixed(1)} ${(46 - Math.sin(a) * 4).toFixed(1)} L${(150 - Math.cos(a) * 36).toFixed(1)} ${(46 - Math.sin(a) * 30).toFixed(1)}`;
  }).join(' ');
  return svg('0 0 300 170', `
    <defs>
      <linearGradient id="${e}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb, var(--machine) 72%, #fff)"/><stop offset=".3" style="stop-color:var(--machine)"/><stop offset=".75" style="stop-color:color-mix(in srgb, var(--machine) 80%, #000)"/><stop offset="1" style="stop-color:color-mix(in srgb, var(--machine) 55%, #000)"/></linearGradient>
      ${goldGrad(c, true, CHROME)}${goldGrad(gd, false)}
      <radialGradient id="${k}" cx="40%" cy="30%" r="70%"><stop offset="0" stop-color="#4a4440"/><stop offset=".7" stop-color="#1c1714"/><stop offset="1" stop-color="#0c0908"/></radialGradient>
      <linearGradient id="${sh}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".45"/><stop offset=".18" stop-color="#000" stop-opacity="0"/><stop offset=".42" stop-color="#fff" stop-opacity=".16"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
      ${WEAR(gr)}
    </defs>
    <ellipse cx="150" cy="164" rx="150" ry="7" fill="#000" opacity=".35" style="filter:blur(3px)"/>
    <path d="M40 8 H260 C270 8 274 14 276 22 L296 140 C298 152 292 160 280 160 H20 C8 160 2 152 4 140 L24 22 C26 14 30 8 40 8Z" fill="url(#${e})"/>
    <path d="M40 8 H260 C270 8 274 14 276 22 L296 140 C298 152 292 160 280 160 H20 C8 160 2 152 4 140 L24 22 C26 14 30 8 40 8Z" fill="url(#${sh})"/>
    <path d="M40 8 H260 C270 8 274 14 276 22 L296 140 C298 152 292 160 280 160 H20 C8 160 2 152 4 140 L24 22 C26 14 30 8 40 8Z" fill="#000" filter="url(#${gr})" opacity=".35"/>
    <path d="M40 8 H260 C270 8 274 14 276 22 L281.5 52 H18.5 L24 22 C26 14 30 8 40 8Z" fill="#fff" opacity=".07"/>
    <path d="M19 52.5 H281" stroke="#fff" stroke-opacity=".28" stroke-width="1"/><path d="M19 54 H281" stroke="#000" stroke-opacity=".35" stroke-width="1.4"/>
    <path d="M60 160 L120 8 H150 L90 160Z" fill="#fff" opacity=".05"/><path d="M98 160 L158 8 H166 L106 160Z" fill="#fff" opacity=".06"/>
    <rect x="14" y="157" width="34" height="7" rx="3" fill="#111"/><rect x="252" y="157" width="34" height="7" rx="3" fill="#111"/>
    <path d="M44 12 H256 C264 12 268 17 270 24 L289 138 C290 148 286 154 278 154 H22 C14 154 10 148 11 138 L30 24 C32 17 36 12 44 12Z" fill="none" stroke="url(#${gd})" stroke-width=".8" opacity=".85"/>
    <path d="M104 8 A46 40 0 0 0 196 8Z" fill="#0f0b09"/>
    <path d="${bars}" stroke="url(#${c})" stroke-width="1.3" stroke-linecap="round"/>
    <path class="tw-bar" d="M150 46 L150 14" stroke="#e8edf0" stroke-width="2" stroke-linecap="round"/>
    <path d="M104 8 A46 40 0 0 0 196 8" fill="none" stroke="url(#${c})" stroke-width="1.6"/>
    ${[70, 230].map(x => `<circle cx="${x}" cy="24" r="17" fill="url(#${c})"/><circle cx="${x}" cy="24" r="14.5" style="fill:color-mix(in srgb, var(--machine) 80%, #000)"/><circle cx="${x}" cy="24" r="4" fill="url(#${c})"/>
      <path d="M${x - 11} 18 A12 12 0 0 1 ${x + 6} 13" fill="none" stroke="#fff" stroke-opacity=".25" stroke-width="2"/>`).join('')}
    <rect x="34" y="56" width="232" height="16" rx="3" fill="#000" opacity=".25"/>
    <rect x="36" y="56" width="228" height="14" rx="3" fill="url(#${c})"/>
    <path d="M48 63 H122 M178 63 H252" stroke="url(#${gd})" stroke-width="1.2"/>
    <path d="M48 66 H122 M178 66 H252" stroke="url(#${gd})" stroke-width=".5"/>
    ${keys}
    <rect x="86" y="146" width="128" height="8" rx="4" fill="url(#${c})"/>
    <rect x="88" y="147" width="124" height="2" rx="1" fill="#fff" opacity=".45"/>`, 'tw-body-art');
}

export function typewriterCarriage() {
  const r = nextId('tr'), c = nextId('tcc');
  const knob = x => `<rect x="${x - 10}" y="3" width="20" height="28" rx="5" fill="url(#${c})"/>
    <path d="${Array.from({ length: 7 }, (_, i) => `M${x - 8 + i * 2.7} 5 V29`).join(' ')}" stroke="#3a4046" stroke-width=".6" opacity=".55"/>`;
  return svg('0 0 300 40', `
    <defs>
      <linearGradient id="${r}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4a4a4a"/><stop offset=".3" stop-color="#1a1a1a"/><stop offset=".45" stop-color="#5a5a5a"/><stop offset=".6" stop-color="#151515"/><stop offset="1" stop-color="#050505"/></linearGradient>
      ${goldGrad(c, true, CHROME)}
    </defs>
    <rect x="18" y="26" width="264" height="7" rx="3" fill="url(#${c})"/>
    <rect x="34" y="4" width="232" height="26" rx="12" fill="url(#${r})"/>
    <path d="M22 8 C14 4 8 -4 2 -6" stroke="url(#${c})" stroke-width="4" stroke-linecap="round" fill="none"/>
    ${knob(22)}${knob(278)}
    <path d="M60 34 H240" stroke="url(#${c})" stroke-width="2"/>
    <rect x="102" y="31" width="14" height="6" rx="3" fill="#1a1a1a"/><rect x="184" y="31" width="14" height="6" rx="3" fill="#1a1a1a"/>`, 'tw-carriage-art');
}

// ── Treasure map ─────────────────────────────────────────────────────
const PARCHMENT = ['#c9a86a', '#e9d4a2', '#f3e4bd', '#ead6a8', '#d7ba80', '#b8945a'];
const INK = '#4e3017';
// Points along the dotted trail, with the direction at each.
function trail() {
  const segs = [[[52, 150], [70, 130], [84, 160], [108, 146]], [[108, 146], [132, 132], [118, 104], [146, 100]], [[146, 100], [174, 96], [182, 130], [210, 118]]];
  const pts = [];
  for (const [p0, p1, p2, p3] of segs) for (let i = 0; i < 9; i++) {
    const t = i / 9, u = 1 - t;
    const at = k => u * u * u * p0[k] + 3 * u * u * t * p1[k] + 3 * u * t * t * p2[k] + t * t * t * p3[k];
    const d = k => 3 * u * u * (p1[k] - p0[k]) + 6 * u * t * (p2[k] - p1[k]) + 3 * t * t * (p3[k] - p2[k]);
    pts.push([at(0), at(1), Math.atan2(d(1), d(0)) * 180 / Math.PI]);
  }
  return pts;
}

function parchment(id, w, h) {
  const g = `${id}g`, v = `${id}v`, n = `${id}n`, s = `${id}s`;
  return { defs: `${goldGrad(g, false, PARCHMENT)}
      <radialGradient id="${v}" cx="50%" cy="50%" r="72%"><stop offset=".55" stop-color="#5a3510" stop-opacity="0"/><stop offset=".85" stop-color="#5a3510" stop-opacity=".35"/><stop offset="1" stop-color="#3a1f06" stop-opacity=".8"/></radialGradient>
      <filter id="${n}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".04 .06" numOctaves="4" seed="11"/>
        <feColorMatrix values="0 0 0 0 .4  0 0 0 0 .25  0 0 0 0 .08  0 0 0 1.6 -.7"/><feComposite in2="SourceGraphic" operator="in"/></filter>
      <filter id="${s}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="2"/>
        <feColorMatrix values="0 0 0 0 .3  0 0 0 0 .2  0 0 0 0 .1  0 0 0 1 -.5"/><feComposite in2="SourceGraphic" operator="in"/></filter>`,
  base: `<rect width="${w}" height="${h}" fill="url(#${g})"/><rect width="${w}" height="${h}" filter="url(#${n})" opacity=".55"/>`,
  top: `<rect width="${w}" height="${h}" filter="url(#${s})" opacity=".45"/><rect width="${w}" height="${h}" fill="url(#${v})"/>` };
}

// Foxing (age spots) and a coffee-ring stain, scattered the same way each time.
function foxing(w, h, seed) {
  const r = rnd(seed);
  const spots = Array.from({ length: Math.round(w * h / 1500) }, () =>
    `<circle cx="${(r() * w).toFixed(1)}" cy="${(r() * h).toFixed(1)}" r="${(0.4 + r() * 1.6).toFixed(1)}" opacity="${(0.08 + r() * 0.18).toFixed(2)}"/>`).join('');
  return `<g fill="#6b3d12">${spots}</g>`;
}

export function mapArt(glyph = '✦') {
  const id = nextId('ma'), p = parchment(id, 300, 200), land = `${id}l`, isl = `${id}i`, r = rnd(13);
  const ISLAND = 'M44 120 C40 96 58 78 82 74 C96 52 126 40 150 48 C176 38 214 48 226 70 C250 80 258 108 244 128 C246 152 222 170 196 164 C176 180 140 178 120 166 C96 176 62 166 56 146 C44 142 40 130 44 120Z';
  const ISLE = 'M252 150 C256 140 272 138 280 146 C288 154 280 166 268 166 C256 168 248 160 252 150Z';
  const ISLE2 = 'M16 64 C20 56 34 54 40 60 C46 67 40 76 29 76 C19 76 13 71 16 64Z';
  const about = (s, cx, cy) => `transform="translate(${cx} ${cy}) scale(${s}) translate(${-cx} ${-cy})"`;
  const waterlines = [[1.05, 0.5, '2 1.6'], [1.1, 0.32, '1.5 2.2'], [1.16, 0.2, '1 3']].map(([s, o, d]) =>
    `<use href="#${isl}" ${about(s, 150, 110)} fill="none" stroke="${INK}" stroke-width=".7" stroke-dasharray="${d}" opacity="${o}"/>`).join('');
  const rhumbs = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `M262 44 L${(262 + Math.cos(a) * 420).toFixed(0)} ${(44 + Math.sin(a) * 420).toFixed(0)}`;
  }).join(' ');
  const tree = (x, y) => `<path d="M${x} ${y} l-3.5 0 l3.5 -8 l3.5 8z M${x} ${y} v2.5"/>`;
  const trees = [[96, 128], [104, 134], [88, 136], [112, 126], [100, 122], [180, 146], [188, 140], [196, 148], [172, 152], [204, 144],
    [214, 92], [222, 98], [206, 86], [70, 104], [78, 98], [62, 110]].map(([x, y]) => tree(x + (r() - 0.5) * 2, y)).join('');
  const peaks = [[112, 86, 10, 16], [124, 84, 12, 22], [138, 86, 13, 26], [154, 86, 11, 20], [166, 88, 9, 14], [130, 96, 8, 12], [148, 97, 8, 12]];
  const mountains = peaks.map(([x, y, w, h]) => `<path d="M${x - w} ${y} L${x} ${y - h} L${x + w} ${y}" fill="#efdfb2" stroke="${INK}" stroke-width="1.1" stroke-linejoin="round"/>
      <path d="${Array.from({ length: 4 }, (_, k) => `M${(x + 1 + k * w / 5).toFixed(1)} ${(y - h + 3 + k * h / 5).toFixed(1)} l${(w / 6).toFixed(1)} ${(h / 2.4).toFixed(1)}`).join(' ')}" stroke="${INK}" stroke-width=".5" opacity=".75"/>`).join('');
  const houses = [[82, 150], [90, 154], [76, 156]].map(([x, y]) => `<path d="M${x - 3} ${y} v-4 l3 -3 l3 3 v4z" fill="#f3e4bd" stroke="${INK}" stroke-width=".6"/>`).join('');
  const waves = [[24, 128], [270, 100], [140, 22], [90, 192], [236, 186], [12, 150], [200, 26], [110, 14], [290, 128], [60, 30]].map(([x, y]) => `<path d="M${x} ${y} q3 -3 6 0 t6 0"/>`).join('');
  const dashes = trail().map(([x, y, a], i) => `<rect class="map-dash" style="--i:${i}" x="-2.6" y="-.9" width="5.2" height="1.8" rx=".9" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})"/>`).join('');
  const star = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2 - Math.PI / 2, rr = i % 4 === 0 ? 18 : i % 2 ? 7 : 11, b1 = a - 0.26, b2 = a + 0.26, k = i % 2 ? 2.4 : 3.6;
    return `<path d="M0 0 L${(Math.cos(b1) * k).toFixed(1)} ${(Math.sin(b1) * k).toFixed(1)} L${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)} Z" fill="${INK}"/>
      <path d="M0 0 L${(Math.cos(b2) * k).toFixed(1)} ${(Math.sin(b2) * k).toFixed(1)} L${(Math.cos(a) * rr).toFixed(1)} ${(Math.sin(a) * rr).toFixed(1)} Z" fill="#f3e4bd" stroke="${INK}" stroke-width=".45"/>`;
  }).join('');
  return svg('0 0 300 200', `
    <defs>${p.defs}
      <radialGradient id="${land}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#f1e2b6"/><stop offset=".8" stop-color="#e2cb94"/><stop offset="1" stop-color="#d2b77c"/></radialGradient>
      <path id="${isl}" d="${ISLAND}"/>
    </defs>
    ${p.base}
    <path d="${rhumbs}" stroke="${INK}" stroke-width=".35" opacity=".22"/>
    <g fill="none" stroke="${INK}">${waterlines}
      <path d="${ISLE}" stroke-width="5" opacity=".08"/><path d="${ISLE2}" stroke-width="5" opacity=".08"/>
      <path d="${ISLE}" ${about(1.12, 268, 153)} stroke-width=".6" stroke-dasharray="1.6 1.8" opacity=".35"/>
      <path d="${ISLE2}" ${about(1.14, 29, 66)} stroke-width=".6" stroke-dasharray="1.6 1.8" opacity=".35"/>
    </g>
    <use href="#${isl}" fill="url(#${land})" stroke="${INK}" stroke-width="1.5"/>
    <use href="#${isl}" fill="none" stroke="#fff6dc" stroke-width=".8" opacity=".55" ${about(0.97, 150, 110)}/>
    <path d="${ISLE}" fill="url(#${land})" stroke="${INK}" stroke-width="1.2"/>
    <path d="${ISLE2}" fill="url(#${land})" stroke="${INK}" stroke-width="1.2"/>
    ${mountains}
    <g fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M150 98 C156 110 146 118 158 128 S180 144 188 165" stroke-width="1.1"/><path d="M152 100 C158 112 148 120 160 130 S182 146 190 164" stroke-width=".4" opacity=".7"/>
      <ellipse cx="200" cy="70" rx="9" ry="4.5" stroke-width=".9"/><path d="M195 70 h4 M201 72 h4" stroke-width=".5"/>
      <g stroke-width=".7" opacity=".8">${waves}</g>
      <path d="M14 186 q6 -11 12 0 q6 -11 12 0 q6 -11 12 0" stroke-width="1.3"/>
      <path d="M17 183 l1 -2 M29 183 l1 -2 M41 183 l1 -2" stroke-width=".6"/>
      <path d="M50 186 q3 -13 10 -12 q5 1 3 6 l-4 -1" stroke-width="1.3"/>
      <path d="M56 176 l-2 -4 l3 1" stroke-width=".8"/>
    </g>
    <circle cx="59.6" cy="177" r=".8" fill="${INK}"/>
    <g fill="#f3e4bd" stroke="${INK}" stroke-width=".8">${trees}</g>
    ${houses}
    <g transform="translate(228 104)" fill="none" stroke="${INK}" stroke-linecap="round">
      <path d="M0 10 C1 4 0 -2 -2 -6" stroke-width="1.2"/>
      <path d="M-2 -6 C-8 -9 -12 -6 -14 -2 M-2 -6 C-6 -12 -2 -16 3 -15 M-2 -6 C4 -10 9 -8 10 -3 M-2 -6 C-3 -12 -8 -14 -11 -12" stroke-width="1"/>
    </g>
    <g transform="translate(36 112)" stroke="${INK}" stroke-width=".8" stroke-linejoin="round">
      <path d="M-13 0 H13 C11 4 8 6 5 6 H-6 C-9 6 -12 4 -13 0Z" fill="#a8824a"/>
      <path d="M-4 0 V-19 M5 0 V-15" fill="none"/>
      <path d="M-4 -18 C1 -16 2 -9 -1 -5 H-4Z M-5 -17 C-10 -14 -10 -8 -7 -5 H-5Z M5 -14 C9 -12 10 -7 7 -4 H5Z" fill="#f3e4bd"/>
      <path d="M-4 -19 l5 1.5 l-5 1.5Z" fill="#9b2316" stroke="none"/>
      <path d="M-18 7 q4 -2 8 0 t8 0 t8 0 t8 0" fill="none" stroke-width=".6"/>
    </g>
    <g transform="translate(262 44)">
      <circle r="22" fill="#f3e4bd" fill-opacity=".5" stroke="${INK}" stroke-width=".7"/><circle r="19.5" fill="none" stroke="${INK}" stroke-width=".4" stroke-dasharray="1 1.6"/>
      ${star}<circle r="1.6" fill="#f3e4bd" stroke="${INK}" stroke-width=".5"/>
      <path d="M0 -31 C-2 -28 -3 -26 0 -24 C3 -26 2 -28 0 -31Z M-3 -27 C-6 -28 -6 -25 -3 -25 M3 -27 C6 -28 6 -25 3 -25" fill="${INK}" stroke="${INK}" stroke-width=".4"/>
    </g>
    <g transform="translate(46 22)">
      <path d="M-36 -10 H36 C40 -10 42 -6 40 -2 C38 2 40 6 44 6 C40 12 36 12 36 10 H-36 C-36 12 -40 12 -44 6 C-40 6 -38 2 -40 -2 C-42 -6 -40 -10 -36 -10Z" fill="#f6ead0" stroke="${INK}" stroke-width=".9"/>
      <path d="M-32 -7 H32 M-32 7 H32" stroke="${INK}" stroke-width=".4" opacity=".6"/>
      <text y="3.2" text-anchor="middle" font-size="10" style="fill:var(--accent);font-family:var(--font-display)">${glyph}</text>
      <path d="M-26 0 H-12 M12 0 H26" stroke="${INK}" stroke-width=".6"/><circle cx="-10" r=".9" fill="${INK}"/><circle cx="10" r=".9" fill="${INK}"/>
    </g>
    <text x="70" y="196" font-size="6.4" font-family="Georgia, serif" font-style="italic" fill="${INK}" opacity=".85">Here be dragons</text>
    <g fill="${INK}" opacity=".85">${dashes}</g>
    <g transform="translate(214 116)" fill="none" stroke-linecap="round">
      <circle class="map-ring" pathLength="1" r="11" stroke="#9b2316" stroke-width="1" transform="rotate(-100)"/>
      <path class="map-x1" pathLength="1" d="M-6 -6 L6 6" stroke="#9b2316" stroke-width="3.2"/>
      <path class="map-x2" pathLength="1" d="M6 -6 L-6 6" stroke="#9b2316" stroke-width="3.2"/>
    </g>
    ${foxing(300, 200, 3)}
    <circle cx="94" cy="58" r="14" fill="none" stroke="#7a4a1a" stroke-width="2.2" opacity=".1"/>
    ${p.top}`, 'map-art');
}

// The back of a folded panel: plain old parchment, foxed and stained.
export function mapBack() {
  const id = nextId('mb'), p = parchment(id, 100, 200);
  return svg('0 0 100 200', `<defs>${p.defs}</defs>${p.base}
    <circle cx="70" cy="150" r="18" fill="none" stroke="#7a4a1a" stroke-width="2.5" opacity=".14"/>
    <path d="M30 40 C40 34 60 36 70 44" fill="none" stroke="${INK}" stroke-width=".6" opacity=".12"/>
    ${foxing(100, 200, 9)}
    ${p.top}`, 'map-art');
}

// Waxed twine tied around the folded map.
export function twine() {
  const id = nextId('tw');
  return svg('0 0 20 200', `
    <defs><pattern id="${id}" width="6" height="5" patternUnits="userSpaceOnUse" patternTransform="rotate(-30)">
      <rect width="6" height="5" fill="#c9a46a"/><rect width="6" height="1.6" fill="#7a5a2c"/><rect y="2.4" width="6" height=".7" fill="#f0d9a8" opacity=".6"/></pattern></defs>
    <rect x="3" width="5" height="200" rx="2" fill="url(#${id})"/><rect x="11" width="5" height="200" rx="2" fill="url(#${id})"/>
    <rect x="3" width="5" height="200" rx="2" fill="none" stroke="#5a3e18" stroke-width=".6"/><rect x="11" width="5" height="200" rx="2" fill="none" stroke="#5a3e18" stroke-width=".6"/>`, 'twine-art');
}
