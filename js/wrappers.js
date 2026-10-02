// How an invitation arrives: the "wrapper" the recipient taps to open
// (envelope, scroll, bottle…), dressed in the look's colors and pattern, and
// closed with the wax seal.

import { esc, escEmoji, own } from './util.js';
import { cornerSvg, patternCss } from './decor.js';
import { breakableSealHtml, shade } from './seal.js';
import {
  bookCover, bottleBack, popCurtain, popFrame, popSky, popTrees, popValance, bottleFront, bowHalf, bowKnot, branch, chestBase, chestLid, chestLining, chestPlate, corkArt,
  envelopeFlap, envelopeFront, giftTag, mapArt, mapBack, owlBody, owlWing, pageHtml, popFront, rolledNote,
  sprig, tissue, treasure, twine, typewriterBody, typewriterCarriage,
} from './wrapper-art.js';

export const WRAPPERS = {
  envelope: { label: 'Envelope', icon: '✉️', openMs: 1750 },
  scroll: { label: 'Scroll', icon: '📜', openMs: 2150 },
  bottle: { label: 'Message in a bottle', icon: '🍾', openMs: 1900 },
  chest: { label: 'Treasure chest', icon: '🧰', openMs: 1900 },
  gift: { label: 'Gift box', icon: '🎁', openMs: 1850 },
  book: { label: 'Pop-up book', icon: '📖', openMs: 2950 },
  owl: { label: 'Owl post', icon: '🦉', openMs: 2400 },
  telegram: { label: 'Telegram', icon: '⌨️', openMs: 2950 },
  map: { label: 'Treasure map', icon: '🗺️', openMs: 3000 },
};

export function resolveWrapper(inv, look) {
  return own(WRAPPERS, inv.w) ? inv.w : look.wrap || 'envelope';
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
    '--leather': shade(look.dark ? look.accent : mix(look.accent, look.ink, 0.35), -0.42),
    '--machine': shade(mix(look.accent, '#2a2a2a', 0.35), look.dark ? -0.2 : -0.1),
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
    <filter id="${id}a" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".035 .12" numOctaves="3" seed="${svgId}"/>
      <feColorMatrix values="0 0 0 0 .42  0 0 0 0 .28  0 0 0 0 .1  0 0 0 1.3 -.55"/><feComposite in2="SourceGraphic" operator="in"/></filter>
    <rect x="40" y="3" width="240" height="46" rx="3" fill="#000" filter="url(#${id}a)" opacity=".5"/>
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

// A mini envelope (the owl carries one in its beak).
const miniEnvelope = (seal, glyph, look) => `
    <span class="env-back"></span>
    <span class="env-liner"></span>
    <span class="env-letter">${pageHtml(glyph, look)}</span>
    <span class="env-front">${envelopeFront()}</span>
    <span class="env-flap"><span class="flap-out">${envelopeFlap()}</span><span class="flap-in"></span></span>
    <span class="seal-spot">${seal}${sparks()}</span>`;

// The lines the typewriter taps out (who it's for, the title, then STOP), and
// when each character strikes. Typing fits a fixed window so the opening
// always ends on time.
function telegram(inv, words) {
  const lines = [words.for, inv.title || 'A little bit of magic'].map(t => String(t || '').trim().toUpperCase()).filter(Boolean);
  lines.push('STOP');
  const texts = lines.slice(0, 3).map(t => {
    const chars = [...t];
    if (chars.length <= 22) return chars;
    const cut = chars.slice(0, 22).join('');
    return [...(cut.lastIndexOf(' ') > 8 ? cut.slice(0, cut.lastIndexOf(' ')) : cut)];
  });
  const total = texts.reduce((n, c) => n + c.length, 0);
  const step = Math.min(0.055, 1.15 / total), cr = 0.18;
  let t = 0.55, seed = 7;
  const rand = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  const sched = texts.map(chars => {
    const line = { chars, start: t, dur: chars.length * step };
    t += line.dur + cr;
    return line;
  });
  const text = sched.map(({ chars, start }) => `<span class="tw-line">${chars.map((ch, k) =>
    `<i style="--d:${(start + k * step).toFixed(3)}s;--o:${(0.72 + rand() * 0.28).toFixed(2)};--j:${((rand() - 0.5) * 0.08).toFixed(3)}em">${ch === ' ' ? '&nbsp;' : esc(ch)}</i>`).join('')}</span>`).join('');
  // Nested wrappers: each line slides the carriage left as it types and
  // returns it; each return feeds the paper up a line.
  const open = (cls, style) => `<span class="${cls}" style="${style}">`;
  const moves = sched.map(({ chars, start, dur }) => open('tw-move', `--s:${start.toFixed(3)}s;--t:${dur.toFixed(3)}s;--dx:${(chars.length / 22 * 15).toFixed(1)}%`)).join('');
  const feeds = sched.slice(0, -1).map(({ start, dur }) => open('tw-feed', `--f:${(start + dur + 0.05).toFixed(3)}s`)).join('');
  const dings = sched.map(({ start, dur }) => `<span class="tw-ding" style="--f:${(start + dur).toFixed(3)}s"></span>`).join('');
  return { text, moves, feeds, dings, close: n => '</span>'.repeat(n), lines: sched.length,
    strike: `--step:${step.toFixed(3)}s;--count:${total}` };
}

// Deckled, torn edges for a map panel (folds stay straight), as clip-path
// points in percent. Mirrored for the panel's back face.
function tornEdges(seed, { left = false, right = false }) {
  const rand = () => ((seed = (seed * 16807 + 11) % 2147483647) / 2147483647);
  const pts = [], steps = 14;
  for (let i = 0; i <= steps; i++) pts.push([i / steps * 100, rand() * 1.8]);
  if (right) for (let i = 1; i < steps; i++) pts.push([100 - rand() * 3, i / steps * 100]);
  for (let i = steps; i >= 0; i--) pts.push([i / steps * 100, 100 - rand() * 1.8]);
  if (left) for (let i = steps - 1; i > 0; i--) pts.push([rand() * 3, i / steps * 100]);
  return pts;
}
const polygon = (pts, mirror = false) => `polygon(${pts.map(([x, y]) => `${(mirror ? 100 - x : x).toFixed(1)}% ${y.toFixed(1)}%`).join(',')})`;

// A solid domed lid built as a closed 3D box: front and back panels, a
// rounded top of angled planks and arched end caps. Every face is wood
// outside and velvet inside, so it reads as solid from any angle as it
// swings. Sizes are fractions of the chest width (--w).
const LID = { depth: 0.3, front: 0.11, rise: 0.15 };
function solidLid() {
  const { depth: D, front: F, rise: R } = LID, H = F + R;
  // Side profile (z back from the front, height up from the rim), front to back.
  const prof = [[0, 0], [0, F], [-0.045, F + R * 0.6], [-0.15, H], [-0.255, F + R * 0.6], [-D, F], [-D, 0]];
  const w = v => `calc(var(--w) * ${v.toFixed(4)})`;
  const faces = [];
  for (let i = 0; i < prof.length - 1; i++) {
    const [z1, y1] = prof[i], [z2, y2] = prof[i + 1], dz = z2 - z1, dy = y2 - y1, L = Math.hypot(dz, dy);
    const phi = Math.atan2(-dz, dy) * 180 / Math.PI, zm = (z1 + z2) / 2, ym = (y1 + y2) / 2;
    const kind = i === 0 ? 'front' : i === prof.length - 2 ? 'back' : 'top';
    const shade = kind === 'front' ? 1 : kind === 'back' ? 0.6 : [1.12, 1, 0.82, 0.7][i - 1];
    faces.push(`<span class="lf ${kind}" style="height:${w(L)};transform:translate3d(0, ${w(H - ym - L / 2)}, ${w(zm)}) rotateX(${phi.toFixed(2)}deg);--b:${shade}"><span class="o"></span><span class="i"></span></span>`);
  }
  const clip = prof.map(([z, y]) => `${(-z / D * 100).toFixed(1)}% ${((H - y) / H * 100).toFixed(1)}%`).join(',');
  const side = cls => `<span class="lid-cap ${cls}" style="width:${w(D)};height:${w(H)};clip-path:polygon(${clip})"></span>`;
  return faces.join('') + side('l') + side('r');
}

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
    <span class="chest-glow"></span>
    <span class="chest-motes"><i></i><i></i><i></i><i></i><i></i><i></i></span>
    <span class="chest-letter">${pageHtml(glyph, look)}</span>
    <span class="chest-mouth"></span>
    <span class="chest-treasure">${treasure()}</span>
    <span class="chest-base">${chestBase()}</span>
    <span class="chest-lid">${solidLid()}</span>
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
  book: (seal, glyph, look) => `
    <span class="book-stage">
      <span class="book-shadow"></span>
      <span class="book-tilt">
        <span class="book-spread">
          <span class="book-back"></span>
          <span class="book-edge r"></span><span class="book-edge l"></span><span class="book-side"></span>
          <span class="book-leaf r"><span class="leaf-lines"></span></span>
          <span class="book-cover">
            <span class="cover-out">${bookCover()}<span class="cover-roundel"><span>${glyph}</span></span></span>
            <span class="cover-in"><span class="book-leaf l"><span class="leaf-lines"></span></span></span>
            <span class="book-clasp"><span class="book-strap"></span><span class="seal-spot">${seal}${sparks()}</span></span>
          </span>
        </span>
      </span>
      <span class="book-ribbon"></span>
      <span class="book-popup">
        <span class="pop pop-sky">${popSky()}<span class="pop-moon"><span>${glyph}</span></span></span>
        <span class="pop pop-letter"><span class="pop-glow"></span>${pageHtml(glyph, look)}</span>
        <span class="pop pop-theatre">
          <span class="curtain l">${popCurtain()}</span><span class="curtain r">${popCurtain()}</span>
          <span class="pop-frame">${popFrame()}</span>
          <span class="pop-valance">${popValance()}</span>
        </span>
        <span class="pop pop-trees l">${popTrees()}</span>
        <span class="pop pop-trees r">${popTrees()}</span>
        <span class="pop pop-front">${popFront()}<span class="footlights"><i></i><i></i><i></i><i></i><i></i></span></span>
        <span class="pop-stars"><i>✦</i><i>✧</i><i>✦</i><i>✧</i><i>✦</i></span>
      </span>
    </span>
`,
  owl: (seal, glyph, look) => `
    <span class="owl-branch">${branch()}</span>
    <span class="owl-bird">
      <span class="owl-body">${owlBody()}</span>
      <span class="owl-wing l">${owlWing()}</span>
      <span class="owl-wing r">${owlWing()}</span>
    </span>
    <span class="owl-mail">${miniEnvelope(seal, glyph, look)}</span>
    <span class="owl-feathers"><i></i><i></i><i></i></span>`,
  telegram: (seal, glyph, look, { inv, words }) => {
    const tg = telegram(inv, words);
    return `
    <span class="tw-carriage">${tg.moves}
      <span class="tw-plate"></span>
      <span class="tw-paper">${tg.feeds}<span class="tw-head">✦ Telegram ✦</span><span class="tw-text">${tg.text}</span>${tg.close(tg.lines - 1)}</span>
      <span class="tw-platen">${typewriterCarriage()}</span>
    ${tg.close(tg.lines)}</span>
    <span class="tw-body" style="${tg.strike}">${typewriterBody()}</span>
    ${tg.dings}
    <span class="seal-spot">${seal}${sparks()}</span>`;
  },
  map: (seal, glyph) => {
    const art = () => `<span class="map-third">${mapArt(glyph)}</span>`;
    const face = (cls, inner, clip) => `<span class="map-face ${cls}"><span class="map-paper" style="clip-path:${clip}">${inner}</span></span>`;
    const c = tornEdges(1, {}), l = tornEdges(2, { left: true }), r = tornEdges(3, { right: true });
    return `
    <span class="map-panel c">${face('front', art(), polygon(c))}</span>
    <span class="map-panel r">${face('front', art(), polygon(r))}${face('back', mapBack(), polygon(r, true))}</span>
    <span class="map-panel l">${face('front', art(), polygon(l))}${face('back', mapBack(), polygon(l, true))}</span>
    <span class="map-twine v">${twine()}</span><span class="map-twine h">${twine()}</span>
    <span class="seal-spot">${seal}${sparks()}</span>`;
  },
};

export function wrapperHtml(inv, look, words) {
  const type = resolveWrapper(inv, look);
  const seal = breakableSealHtml(inv, look, 'wrap-seal');
  return `
    <div class="wrapper-stage">
      ${words.for ? `<p class="wrapper-to">${esc(words.for)}</p>` : ''}
      <button type="button" class="wrapper ${type}" data-action="open" data-wrap="${type}" aria-label="Open the invitation" style="${esc(materials(look))}">
        ${PARTS[type](seal, esc(look.glyph), look, { inv, words })}
        <span class="twinkles"><i>✦</i><i>✧</i><i>✦</i></span>
      </button>
      ${words.tap ? `<p class="wrapper-hint">${escEmoji(words.tap)}</p>` : ''}
      ${words.fromLine ? `<p class="wrapper-from">${escEmoji(words.fromLine)}</p>` : ''}
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
