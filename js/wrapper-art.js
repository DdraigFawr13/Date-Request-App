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
// A tawny owl on a branch, a letter in its beak. The wings are separate so
// they can unfold and beat as it takes off.
export function owlBody() {
  const b = nextId('ob'), br = nextId('obr'), sh = nextId('osh'), fd = nextId('ofd'), ir = nextId('oir'), bk = nextId('obk'),
    cl = nextId('ocl'), dc = nextId('odc'), sc = nextId('osc'), tx = nextId('otx');
  const BODY = 'M100 22 C134 22 156 46 158 80 C162 120 166 160 150 190 C138 210 120 218 100 218 C80 218 62 210 50 190 C34 160 38 120 42 80 C44 46 66 22 100 22Z';
  const DISC = 'M100 66 C92 52 70 50 56 62 C44 74 46 100 60 110 C72 119 90 116 100 108 C110 116 128 119 140 110 C154 100 156 74 144 62 C130 50 108 52 100 66Z';
  const streaks = [];
  for (let r = 0; r < 8; r++) {
    for (let c = -3; c <= 3; c++) {
      const x = 100 + c * 11 + (r % 2 ? 5.5 : 0), y = 116 + r * 12;
      streaks.push(`<path d="M${x} ${y} c-1.8 3.5 -1.8 7 0 9.5 c1.8 -2.5 1.8 -6 0 -9.5Z"/><path d="M${x - 3.5} ${y + 6.5} q3.5 1.6 7 0" fill="none" stroke="#7a5230" stroke-width=".6" opacity=".6"/>`);
    }
  }
  const rays = cx => Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `M${(cx + Math.cos(a) * 17).toFixed(1)} ${(84 + Math.sin(a) * 17).toFixed(1)} L${(cx + Math.cos(a) * 31).toFixed(1)} ${(84 + Math.sin(a) * 31).toFixed(1)}`;
  }).join(' ');
  const eye = x => `<g transform="translate(${x} 84)">
      <circle r="15.5" fill="#24150b"/>
      <circle r="12.6" fill="url(#${ir})"/>
      <circle r="12.6" fill="none" stroke="#6b3a06" stroke-width=".8" opacity=".6"/>
      <circle r="6.4" fill="#0a0604"/>
      <circle cx="-4" cy="-4.4" r="2.7" fill="#fff" opacity=".92"/><circle cx="3.8" cy="3.4" r="1.1" fill="#fff" opacity=".5"/>
      <path d="M-15.5 -1 Q0 -19 15.5 -1 Q0 -12 -15.5 -1Z" fill="#3a2312" opacity=".85"/>
      <circle class="owl-lid" r="16" fill="#8a6038"/>
    </g>`;
  const foot = x => `<g transform="translate(${x} 206)">
      <ellipse rx="11" ry="7" fill="#d9c294"/>
      <path d="M-8 2 C-10 8 -9 12 -7 15 M-3 3 C-3 9 -2 13 0 16 M3 3 C4 9 4 12 3 15 M8 2 C10 7 10 10 8 13" stroke="#cfb47a" stroke-width="4.4" stroke-linecap="round" fill="none"/>
      <path d="M-8 2 C-10 8 -9 12 -7 15 M-3 3 C-3 9 -2 13 0 16 M3 3 C4 9 4 12 3 15 M8 2 C10 7 10 10 8 13" stroke="#8a6f3c" stroke-width=".6" stroke-dasharray="1.2 1.4" fill="none" opacity=".7"/>
      <path d="M-7 15 q1.5 3.5 -1.8 5 M0 16 q1.5 3.5 -1.8 5 M3 15 q2 3 0 5 M8 13 q2.2 3 .2 5" stroke="#1d140c" stroke-width="1.7" stroke-linecap="round" fill="none"/>
    </g>`;
  return svg('0 0 200 232', `
    <defs>
      <radialGradient id="${b}" cx="50%" cy="34%" r="70%"><stop offset="0" stop-color="#b98a5c"/><stop offset=".55" stop-color="#8d6139"/><stop offset="1" stop-color="#583821"/></radialGradient>
      <radialGradient id="${br}" cx="50%" cy="30%" r="75%"><stop offset="0" stop-color="#f3e3c2"/><stop offset=".7" stop-color="#dcbf8f"/><stop offset="1" stop-color="#b8915e"/></radialGradient>
      <linearGradient id="${sh}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#1e1208" stop-opacity=".55"/><stop offset=".22" stop-color="#1e1208" stop-opacity="0"/><stop offset=".62" stop-color="#fff" stop-opacity=".06"/><stop offset=".8" stop-color="#1e1208" stop-opacity="0"/><stop offset="1" stop-color="#1e1208" stop-opacity=".6"/></linearGradient>
      <radialGradient id="${fd}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#f4e6c8"/><stop offset=".65" stop-color="#e2c79a"/><stop offset="1" stop-color="#b48a58"/></radialGradient>
      <radialGradient id="${ir}" cx="45%" cy="40%" r="60%"><stop offset="0" stop-color="#ffe07a"/><stop offset=".55" stop-color="#f4a015"/><stop offset="1" stop-color="#a95205"/></radialGradient>
      <linearGradient id="${bk}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5c5248"/><stop offset=".45" stop-color="#9a8f80"/><stop offset="1" stop-color="#2e2822"/></linearGradient>
      <clipPath id="${cl}"><ellipse cx="100" cy="160" rx="43" ry="56"/></clipPath>
      <clipPath id="${dc}"><path d="${DISC}"/></clipPath>
      <pattern id="${sc}" width="9" height="8" patternUnits="userSpaceOnUse">
        <path d="M0 8 Q4.5 1 9 8" fill="none" stroke="#f0d3a2" stroke-width=".8" opacity=".5"/>
        <path d="M-4.5 4 Q0 -3 4.5 4 M4.5 4 Q9 -3 13.5 4" fill="none" stroke="#2f1b0c" stroke-width=".7" opacity=".4"/></pattern>
      <filter id="${tx}" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".9 .5" numOctaves="2" seed="7"/>
        <feColorMatrix values="0 0 0 0 .2  0 0 0 0 .12  0 0 0 0 .05  0 0 0 1.2 -.45"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    </defs>
    <path d="M84 196 L78 230 L90 228 L100 232 L110 228 L122 230 L116 196Z" fill="#6b4728"/>
    <path d="M86 206 H114 M84 216 H116 M82 225 H118" stroke="#d8b483" stroke-width="2.4" opacity=".55"/>
    <path d="M58 48 C52 32 49 16 44 6 C60 13 72 26 80 38Z" fill="#7a5232"/>
    <path d="M142 48 C148 32 151 16 156 6 C140 13 128 26 120 38Z" fill="#7a5232"/>
    <path d="M56 40 C52 28 50 18 47 10 M144 40 C148 28 150 18 153 10" stroke="#2f1b0c" stroke-width=".9" opacity=".6" fill="none"/>
    <path d="${BODY}" fill="url(#${b})"/>
    <path d="${BODY}" fill="url(#${sc})"/>
    <g clip-path="url(#${cl})">
      <ellipse cx="100" cy="160" rx="43" ry="56" fill="url(#${br})"/>
      <g fill="#5e3b1f" opacity=".72">${streaks.join('')}</g>
    </g>
    <path d="${BODY}" fill="url(#${sh})"/>
    <path d="${DISC}" fill="url(#${fd})"/>
    <g clip-path="url(#${dc})"><path d="${rays(78)} ${rays(122)}" stroke="#8a6238" stroke-width=".7" opacity=".45"/></g>
    <path d="${DISC}" fill="none" stroke="#4a2c14" stroke-width="2.6" stroke-linejoin="round"/>
    <path d="${DISC}" fill="none" stroke="#f5e4c0" stroke-width=".8" opacity=".6" transform="translate(0 1.5)"/>
    <path d="M100 108 C94 92 90 76 86 66 Q100 58 114 66 C110 76 106 92 100 108Z" fill="#f6ead2" opacity=".85"/>
    ${eye(78)}${eye(122)}
    <path d="M100 96 C94.5 96 92.6 102 94.6 109 C96.6 115 100 121 100 121 C100 121 103.4 115 105.4 109 C107.4 102 105.5 96 100 96Z" fill="url(#${bk})"/>
    <path d="M97.5 99 C96.5 104 97.5 110 99.5 115" fill="none" stroke="#d8cdbd" stroke-width=".9" opacity=".6"/>
    ${foot(82)}${foot(118)}
    <path d="${BODY}" filter="url(#${tx})" opacity=".55"/>`, 'owl-art', 'xMidYMid meet');
}

const WING = 'M44 2 C22 8 8 36 6 74 C4 102 12 124 28 138 C34 118 46 92 54 62 C59 40 58 14 44 2Z';
export function owlWing() {
  const g = nextId('owg'), c = nextId('owc');
  const primaries = [[48, 58, 30, 137], [47, 56, 23, 131], [46, 54, 16, 121], [45, 52, 10, 106], [44, 50, 7, 90]];
  const feather = ([x1, y1, x2, y2]) => {
    const d = `M${x1} ${y1} Q${(x1 + x2) / 2 + 4} ${(y1 + y2) / 2} ${x2} ${y2}`;
    return `<path d="${d}" stroke="#4e321b" stroke-width="10" stroke-linecap="round" fill="none"/>
      <path d="${d}" stroke="#8d6239" stroke-width="8" stroke-linecap="round" fill="none"/>
      <path d="${d}" stroke="#dcb987" stroke-width="7.4" stroke-dasharray="3 5.5" fill="none" opacity=".7"/>
      <path d="${d}" stroke="#2e1d10" stroke-width=".6" fill="none" opacity=".55"/>`;
  };
  const coverts = [];
  for (let r = 0; r < 7; r++) for (let c2 = 0; c2 < 6; c2++) {
    const x = 8 + c2 * 8.5 + (r % 2 ? 4 : 0), y = 14 + r * 6.5;
    coverts.push(`M${x} ${y} q4.2 5.5 8.5 0`);
  }
  return svg('0 0 60 140', `
    <defs>
      <linearGradient id="${g}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a0724a"/><stop offset=".5" stop-color="#7a5331"/><stop offset="1" stop-color="#4a301b"/></linearGradient>
      <clipPath id="${c}"><path d="${WING}"/></clipPath>
    </defs>
    <path d="${WING}" fill="url(#${g})"/>
    <g clip-path="url(#${c})">
      ${primaries.slice().reverse().map(feather).join('')}
      <path d="M2 0 H60 V58 C40 64 20 58 2 66Z" fill="url(#${g})"/>
      <path d="${coverts.join(' ')}" fill="none" stroke="#e2c08e" stroke-width=".8" opacity=".55"/>
      <path d="${coverts.join(' ')}" fill="none" stroke="#2a1809" stroke-width=".7" opacity=".35" transform="translate(0 1.4)"/>
      <path d="M2 66 C20 58 40 64 60 58" fill="none" stroke="#2a1809" stroke-width="1.2" opacity=".5"/>
      <path d="M60 0 V140 H44 C50 100 56 60 50 0Z" fill="#000" opacity=".22"/>
    </g>
    <path d="${WING}" fill="none" stroke="#2e1d10" stroke-opacity=".55" stroke-width=".8"/>`, 'owl-wing-art');
}

// A mossy branch for the owl to perch on.
export function branch() {
  const w = nextId('brw'), g = nextId('brg');
  const leaf = (x, y, r, s = 1) => `<path transform="translate(${x} ${y}) rotate(${r}) scale(${s})" d="M0 0 C6 -7 18 -7 26 0 C18 7 6 7 0 0Z"/>`;
  return svg('0 0 340 46', `
    <defs>
      <linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8a6a4a"/><stop offset=".35" stop-color="#6a4c32"/><stop offset="1" stop-color="#2f2014"/></linearGradient>
      ${WOOD_GRAIN(w)}
    </defs>
    <path d="M0 22 C60 14 120 18 180 16 C240 14 290 20 340 14 V30 C290 34 240 30 180 32 C120 34 60 32 0 38Z" fill="url(#${g})"/>
    <path d="M0 22 C60 14 120 18 180 16 C240 14 290 20 340 14 V30 C290 34 240 30 180 32 C120 34 60 32 0 38Z" fill="#000" filter="url(#${w})" opacity=".8"/>
    <path d="M250 18 C266 8 278 4 292 2 M270 9 C276 4 278 0 278 0" stroke="#5a4029" stroke-width="3.2" stroke-linecap="round" fill="none"/>
    <path d="M60 32 C52 38 48 42 40 46" stroke="#4e3824" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    <path d="M30 22 C70 15 110 19 150 17" stroke="#d8c3a4" stroke-width="1" opacity=".35" fill="none"/>
    <g fill="#6f8b4a" opacity=".85"><ellipse cx="128" cy="18" rx="9" ry="2.2"/><ellipse cx="214" cy="16" rx="7" ry="2"/></g>
    <g style="fill:var(--sprig)" stroke="#000" stroke-opacity=".2" stroke-width=".5">
      ${leaf(292, 2, -20, 0.8)}${leaf(276, 6, -150, 0.7)}${leaf(42, 44, 150, 0.7)}${leaf(300, 16, 10, 0.75)}</g>`, 'branch-art');
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

// Paper-cut scenery that stands up out of the book.
export function popHills() {
  const tree = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><rect x="-1.5" y="-4" width="3" height="10" fill="#6a4c32"/>
    <circle cy="-12" r="10" style="fill:color-mix(in srgb, var(--sprig) 62%, #000)" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>
    <path d="M-5 -16 a6 6 0 0 1 7 -3" stroke="#fff" stroke-opacity=".35" stroke-width="1.4" fill="none"/></g>`;
  const pine = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 -30 L10 -10 H5 L13 4 H-13 L-5 -10 H-10Z" style="fill:color-mix(in srgb, var(--sprig) 55%, #000)" stroke="#fff" stroke-opacity=".55" stroke-width="1"/><rect x="-1.5" y="4" width="3" height="6" fill="#6a4c32"/></g>`;
  return svg('0 0 200 90', `
    <path d="M0 90 V52 C30 30 60 34 82 50 C104 30 140 22 166 44 C182 36 194 38 200 42 V90Z" style="fill:color-mix(in srgb, var(--sprig) 72%, #000)" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>
    ${pine(24, 46, 0.8)}${pine(178, 42, 0.9)}${tree(150, 40, 0.8)}
    <path d="M0 90 V66 C24 52 52 56 70 66 C96 52 126 52 150 66 C170 58 188 60 200 64 V90Z" style="fill:var(--sprig)" stroke="#fff" stroke-opacity=".6" stroke-width="1"/>
    <path d="M0 90 V66 C24 52 52 56 70 66 C96 52 126 52 150 66 C170 58 188 60 200 64 V90Z" fill="#fff" opacity=".12"/>
    ${tree(40, 66, 0.9)}${tree(168, 66, 1)}${pine(58, 70, 0.7)}`, 'pop-art', 'xMidYMax meet');
}

export function popFront() {
  const flower = (x, y, s) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 0 V-14" stroke="#4d6b36" stroke-width="1.6"/>
    <g style="fill:var(--gem)" stroke="#fff" stroke-opacity=".6" stroke-width=".6">${[0, 72, 144, 216, 288].map(r => `<ellipse transform="rotate(${r} 0 -18)" cy="-22" rx="3" ry="4.4"/>`).join('')}</g>
    <circle cy="-18" r="2.4" fill="#f2c84b"/></g>`;
  return svg('0 0 200 40', `
    <path d="M0 40 V30 C10 22 20 26 30 30 C44 22 56 24 66 32 V40Z M134 40 V32 C146 22 160 24 172 30 C182 24 192 24 200 30 V40Z" fill="#5d7d3e" stroke="#fff" stroke-opacity=".55" stroke-width="1"/>
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

export function mapArt() {
  const id = nextId('ma'), p = parchment(id, 300, 200), land = `${id}l`;
  const ISLAND = 'M44 120 C40 96 58 78 82 74 C96 52 126 40 150 48 C176 38 214 48 226 70 C250 80 258 108 244 128 C246 152 222 170 196 164 C176 180 140 178 120 166 C96 176 62 166 56 146 C44 142 40 130 44 120Z';
  const ISLE = 'M252 150 C256 140 272 138 280 146 C288 154 280 166 268 166 C256 168 248 160 252 150Z';
  const ISLE2 = 'M18 40 C22 30 38 28 44 36 C50 44 42 54 30 52 C20 52 15 48 18 40Z';
  const tree = (x, y) => `<path d="M${x} ${y} l-3.5 0 l3.5 -8 l3.5 8z M${x} ${y} v2.5"/>`;
  const trees = [[96, 128], [104, 134], [88, 136], [112, 126], [180, 146], [188, 140], [196, 148], [172, 152], [214, 92], [222, 98]].map(([x, y]) => tree(x, y)).join('');
  const waves = [[24, 80], [270, 100], [140, 22], [90, 190], [236, 186], [12, 130], [200, 26]].map(([x, y]) => `<path d="M${x} ${y} q3 -3 6 0 t6 0"/>`).join('');
  const dashes = trail().map(([x, y, a], i) => `<rect class="map-dash" style="--i:${i}" x="-2.6" y="-.9" width="5.2" height="1.8" rx=".9" transform="translate(${x.toFixed(1)} ${y.toFixed(1)}) rotate(${a.toFixed(0)})"/>`).join('');
  const star = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2 - Math.PI / 2, r = i % 2 ? 9 : 17, b1 = a - 0.32, b2 = a + 0.32;
    return `<path d="M0 0 L${(Math.cos(b1) * 4).toFixed(1)} ${(Math.sin(b1) * 4).toFixed(1)} L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)} Z" fill="${INK}"/>
      <path d="M0 0 L${(Math.cos(b2) * 4).toFixed(1)} ${(Math.sin(b2) * 4).toFixed(1)} L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)} Z" fill="#f3e4bd" stroke="${INK}" stroke-width=".5"/>`;
  }).join('');
  return svg('0 0 300 200', `
    <defs>${p.defs}
      <radialGradient id="${land}" cx="50%" cy="45%" r="60%"><stop offset="0" stop-color="#efdfb2"/><stop offset="1" stop-color="#ddc690"/></radialGradient></defs>
    ${p.base}
    <g fill="none" stroke="${INK}">
      <path d="${ISLAND}" stroke-width="14" opacity=".06"/><path d="${ISLAND}" stroke-width="7" opacity=".1"/>
      <path d="${ISLE}" stroke-width="7" opacity=".1"/><path d="${ISLE2}" stroke-width="7" opacity=".1"/>
    </g>
    <path d="${ISLAND}" fill="url(#${land})" stroke="${INK}" stroke-width="1.4"/>
    <path d="${ISLE}" fill="url(#${land})" stroke="${INK}" stroke-width="1.2"/>
    <path d="${ISLE2}" fill="url(#${land})" stroke="${INK}" stroke-width="1.2"/>
    <g fill="none" stroke="${INK}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M118 88 L130 68 L142 88 M134 88 L148 60 L162 88 M156 88 L166 74 L176 88" stroke-width="1.2"/>
      <path d="M132 76 l4 8 M136 72 l5 12 M151 68 l5 14 M155 66 l6 18 M169 79 l3 7" stroke-width=".5" opacity=".7"/>
      <ellipse cx="200" cy="72" rx="9" ry="4.5" stroke-width=".9"/><path d="M195 72 h4 M201 74 h4" stroke-width=".5"/>
      <path d="M70 100 C80 104 86 100 92 108" stroke-width=".8" stroke-dasharray="1 2"/>
      <g stroke-width=".7" opacity=".8">${waves}</g>
      <path d="M14 182 q6 -10 12 0 q6 -10 12 0 q6 -10 12 0" stroke-width="1.2"/>
      <path d="M50 182 q4 -12 10 -10 q4 2 2 6" stroke-width="1.2"/>
    </g>
    <g fill="#f3e4bd" stroke="${INK}" stroke-width=".8">${trees}</g>
    <circle cx="58" cy="168" r=".9" fill="${INK}"/>
    <g transform="translate(36 108)" stroke="${INK}" stroke-width=".8" stroke-linejoin="round">
      <path d="M-10 0 H10 L7 5 H-7Z" fill="#a8824a"/><path d="M-1 0 V-15" fill="none"/>
      <path d="M-1 -14 C5 -12 6 -6 2 -2 H-1Z M-2 -13 C-7 -10 -8 -5 -5 -2 H-2Z" fill="#f3e4bd"/></g>
    <g transform="translate(262 44)">
      <circle r="21" fill="none" stroke="${INK}" stroke-width=".6"/><circle r="18.5" fill="none" stroke="${INK}" stroke-width=".4" stroke-dasharray="1 1.6"/>
      ${star}<circle r="1.6" fill="#f3e4bd" stroke="${INK}" stroke-width=".5"/>
      <text y="-23.5" text-anchor="middle" font-size="7" font-family="Georgia, serif" font-weight="700" fill="${INK}">N</text>
    </g>
    <text x="70" y="192" font-size="6.4" font-family="Georgia, serif" font-style="italic" fill="${INK}" opacity=".85">Here be dragons</text>
    <g fill="${INK}" opacity=".85">${dashes}</g>
    <g transform="translate(214 116)"><g class="map-x">
      <circle class="map-ring" r="11" fill="none" stroke="#9b2316" stroke-width="1" stroke-dasharray="2 2.4"/>
      <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#9b2316" stroke-width="3.2" stroke-linecap="round"/>
      <path d="M-6 -6 L6 6 M6 -6 L-6 6" stroke="#d2563f" stroke-width="1" stroke-linecap="round" opacity=".6"/>
    </g></g>
    ${p.top}`, 'map-art');
}

// The back of a folded panel: plain old parchment with a faint stain.
export function mapBack() {
  const id = nextId('mb'), p = parchment(id, 100, 200);
  return svg('0 0 100 200', `<defs>${p.defs}</defs>${p.base}
    <circle cx="70" cy="150" r="18" fill="none" stroke="#7a4a1a" stroke-width="2.5" opacity=".14"/>
    <path d="M30 40 C40 34 60 36 70 44" fill="none" stroke="${INK}" stroke-width=".6" opacity=".12"/>
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
