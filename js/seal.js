// The wax seal: an SVG drawing with an irregular wax puddle, a raised rim, a
// stamped recess and the emblem, either pressed into the wax or filled with a
// metallic/colored finish and lit with a bevel filter.

import { esc, own } from './util.js';
import { BAT_PATH, safeHex, shade } from './decor.js';

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
  bat: `<path transform='translate(50 53) scale(1.75)' d='${BAT_PATH}'/>`,
  pumpkin: `<path d='M47 30 C46 24 48 20 53 17 L55 20 C52 22 51 26 52 30Z'/>
    <ellipse cx='36' cy='53' rx='15' ry='21'/><ellipse cx='64' cy='53' rx='15' ry='21'/><ellipse cx='50' cy='53' rx='16' ry='23'/>
    <g fill='#000'><path d='M36 46 L43 46 L39.5 39Z'/><path d='M57 46 L64 46 L60.5 39Z'/><path d='M47.5 53 L52.5 53 L50 48.5Z'/>
    <path d='M32 58 C38 68 62 68 68 58 L63 60 L60 56 L56 61 L50 57 L44 61 L40 56 L37 60Z'/></g>
    <g fill='none' stroke='#000' stroke-width='1.2' opacity='.35'><path d='M43 32 C40 44 40 62 43 74'/><path d='M57 32 C60 44 60 62 57 74'/></g>`,
  brokenheart: `<path d='M50 76 C30 62 22 52 22 41 C22 32 29 26 37 26 C43 26 47 29 50 33 L46 42 L53 49 L48 58 L54 66Z'/>
    <path d='M52 76 L58 66 L52 58 L57 49 L50 42 L53 33 C56 29 60 26 64 26 C72 26 78 32 78 41 C78 52 70 62 52 76Z' transform='translate(2 0)'/>`,
  wizardhat: `<path d='M20 70 C32 64 68 64 80 70 C70 76 30 76 20 70Z'/><path d='M32 68 C38 52 44 36 54 22 C58 17 66 18 70 24 C64 24 60 28 60 34 C62 46 66 58 68 68Z'/>
    <g fill='#000'><path d='M33 62 C44 59 56 59 67 62 L68 66 C56 63 44 63 32 66Z'/><path d='M50 48 l1.6 3.4 3.6 .5 -2.6 2.5 .6 3.6 -3.2 -1.7 -3.2 1.7 .6 -3.6 -2.6 -2.5 3.6 -.5Z'/><circle cx='58' cy='38' r='1.6'/><circle cx='45' cy='56' r='1.2'/></g>`,
  wand: `<rect x='47.5' y='38' width='5' height='46' rx='2' transform='rotate(30 50 62)'/><path transform='translate(-2 8)' d='M62 18 L65.5 27 L75 28 L67.8 34.3 L70 43.6 L62 38.6 L54 43.6 L56.2 34.3 L49 28 L58.5 27Z'/>
    <circle cx='30' cy='30' r='2.4'/><circle cx='78' cy='52' r='2'/><circle cx='40' cy='20' r='1.6'/>`,
  dragon: `<path d='M29 85 C27 74 30 64 33 56 C36 48 38 42 43 36 C40 30 34 24 22 20 C33 19 42 23 48 29 C55 27.5 61 29 66 32.5 C73 35 80 38 86 41 C89 42.5 89.5 46 87 47.6 L74 50.2 L83 53.8 C81.5 58.5 75 62.5 67.5 62.3 C60 62 54.5 64.5 50.5 69.5 C47 74 45.5 79.5 45.5 85Z'/>
    <path d='M49 30 C47 22 43 15 35 10 C45 12 52 19 54 28.5Z'/>
    <path d='M35.5 47 C30 45.5 25 46.5 21 49.5 C26 50 30 51.5 33.5 54Z M32.5 60 C27 59 22 60.5 18.5 64 C23.5 64 27.5 65.5 31 68Z M31.5 72.5 C26 72.5 21.5 74.5 18.5 78.5 C23 78 27 79 30.5 81Z'/>
    <g fill='#000'><path d='M58.5 38.2 C61.5 35.8 66.8 36.2 69 39.2 C65.6 40.8 61.6 40.8 58.5 38.2Z'/><ellipse cx='82' cy='43.4' rx='1.6' ry='1.1'/>
      <path d='M74 50.2 L64 51.3 L74 52.4Z'/></g>`,
  acorn: `<path d='M33 48 C33 66 42 78 50 82 C58 78 67 66 67 48Z'/><path d='M28 48 C28 32 72 32 72 48 C60 52 40 52 28 48Z'/><rect x='48' y='24' width='4' height='12' rx='2'/>
    <g fill='#000' opacity='.55'><circle cx='38' cy='42' r='1.4'/><circle cx='46' cy='39' r='1.4'/><circle cx='54' cy='39' r='1.4'/><circle cx='62' cy='42' r='1.4'/><circle cx='42' cy='46' r='1.2'/><circle cx='50' cy='44' r='1.2'/><circle cx='58' cy='46' r='1.2'/></g>`,
  teacup: `<path d='M26 46 H66 C66 62 58 72 46 72 C34 72 26 62 26 46Z'/><path d='M66 50 C76 48 80 56 74 62 C71 65 66 64 63 63' fill='none' stroke='#fff' stroke-width='4.5'/>
    <ellipse cx='46' cy='76' rx='26' ry='4.5'/><g fill='none' stroke='#fff' stroke-width='2.4' stroke-linecap='round'><path d='M38 40 C34 34 42 30 38 24'/><path d='M50 40 C46 34 54 30 50 22'/></g>
    <path d='M40 56 C44 52 48 52 52 56 C48 60 44 60 40 56Z' fill='#000' opacity='.5'/>`,
  constellation: `<g fill='none' stroke='#fff' stroke-width='1.8'><path d='M24 64 L36 44 L52 50 L64 30 L78 40 L70 62 L52 50'/></g>
    <circle cx='24' cy='64' r='4'/><circle cx='36' cy='44' r='3.2'/><circle cx='52' cy='50' r='4.4'/><circle cx='64' cy='30' r='3.6'/><circle cx='78' cy='40' r='3'/><circle cx='70' cy='62' r='3.6'/>`,
  die: `<g transform='rotate(-10 50 52)'><rect x='28' y='30' width='44' height='44' rx='10'/>
    <g fill='#000'><circle cx='39' cy='41' r='4.2'/><circle cx='61' cy='41' r='4.2'/><circle cx='50' cy='52' r='4.2'/><circle cx='39' cy='63' r='4.2'/><circle cx='61' cy='63' r='4.2'/></g></g>`,
  masks: `<g transform='translate(61 44) rotate(14) scale(1.35)'><path d='M0 -13 C8.5 -13 12 -8 12 -1 C12 9 6 15 0 15 C-6 15 -12 9 -12 -1 C-12 -8 -8.5 -13 0 -13Z'/>
      <g fill='#000'><path d='M-8.5 -5 Q-5.5 -1 -2.5 -5 Q-5.5 -3.2 -8.5 -5Z M2.5 -5 Q5.5 -1 8.5 -5 Q5.5 -3.2 2.5 -5Z M-6 9.5 Q0 2.5 6 9.5 Q0 6.5 -6 9.5Z'/></g></g>
    <g transform='translate(39 56) rotate(-14) scale(1.35)'><path d='M0 -13 C8.5 -13 12 -8 12 -1 C12 9 6 15 0 15 C-6 15 -12 9 -12 -1 C-12 -8 -8.5 -13 0 -13Z' stroke='#000' stroke-width='1.4'/>
      <g fill='#000'><path d='M-8.5 -3 Q-5.5 -8 -2.5 -3 Q-5.5 -5 -8.5 -3Z M2.5 -3 Q5.5 -8 8.5 -3 Q5.5 -5 2.5 -3Z M-6.5 3.5 Q0 12 6.5 3.5 Q0 7 -6.5 3.5Z'/></g></g>
    <path d='M22 74 C30 70 34 76 42 72 M66 60 C72 64 78 60 82 66' fill='none' stroke-width='2.4' stroke-linecap='round'/>`,
  note: `<g transform='rotate(-8 50 52)'><ellipse cx='36' cy='70' rx='9.5' ry='6.8' transform='rotate(-22 36 70)'/><ellipse cx='68' cy='62' rx='9.5' ry='6.8' transform='rotate(-22 68 62)'/>
    <rect x='43' y='28' width='4.2' height='42'/><rect x='75' y='20' width='4.2' height='42'/><path d='M43 28 L79.2 20 V30 L43 38Z'/></g>`,
  pansy: `<g transform='translate(50 52)'><ellipse cx='-10' cy='-14' rx='13' ry='15' transform='rotate(-20 -10 -14)'/><ellipse cx='10' cy='-14' rx='13' ry='15' transform='rotate(20 10 -14)'/>
    <ellipse cx='-16' cy='3' rx='12' ry='10' transform='rotate(-15 -16 3)'/><ellipse cx='16' cy='3' rx='12' ry='10' transform='rotate(15 16 3)'/>
    <path d='M0 0 C14 0 22 10 18 20 C14 28 -14 28 -18 20 C-22 10 -14 0 0 0Z'/>
    <g fill='none' stroke='#000' stroke-width='1.6' stroke-linecap='round' opacity='.75'><path d='M0 6 V16 M-4 6 L-8 14 M4 6 L8 14 M-6 2 L-14 6 M6 2 L14 6'/></g>
    <circle cy='3' r='3.6' fill='#000'/></g>`,
  lips: `<g transform='translate(50 54)'><path d='M-30 -2 C-24 -12 -16 -18 -8 -16 C-4 -15 -2 -12 0 -10 C2 -12 4 -15 8 -16 C16 -18 24 -12 30 -2 C24 -1 18 0 0 2 C-18 0 -24 -1 -30 -2Z'/>
    <path d='M-30 1 C-22 4 -14 5 0 5 C14 5 22 4 30 1 C24 14 14 20 0 20 C-14 20 -24 14 -30 1Z'/>
    <path d='M-26 1 C-14 3.5 14 3.5 26 1' fill='none' stroke='#000' stroke-width='2.2' stroke-linecap='round'/>
    <g fill='none' stroke='#000' stroke-width='1' opacity='.45' stroke-linecap='round'><path d='M-14 10 l2 6 M-6 11 l1 7 M4 11 l-1 7 M12 10 l-2 6 M-12 -8 l2 -5 M10 -8 l-2 -5'/></g></g>`,
  // Bottom's ass's head (A Midsummer Night's Dream), crowned with Titania's flowers.
  donkey: `<path d='M46 37 C40 26 37 14 39 5 C45 11 51 23 52 35Z'/><path d='M53 35 C53 22 57 12 63 7 C63 17 61 28 58 37Z'/>
    <path d='M35 88 C33 72 35 54 43 42 C49 34 56 33 61 37 C67 43 74 52 80 60 C84 66 82 74 75 76 C70 77 66 75 62 72 C58 70 56 75 57 88Z'/>
    <path d='M42 41 Q34 42 36 49 Q30 53 34 59 Q29 64 34 69 Q30 75 34 79 Q32 85 36 88 L40 88 C38 72 39 56 45 43Z'/>
    <g fill='#000'><path d='M44 33 C41 25 40 17 41 10 C44 16 47 24 48 32Z' opacity='.45'/><path d='M55 33 C56 24 58 17 61 12 C60 20 59 27 57 34Z' opacity='.45'/>
      <ellipse cx='60' cy='48' rx='2.6' ry='2' transform='rotate(20 60 48)'/><path d='M57 45.5 C59 44 62 44.5 63.5 46.5' fill='none' stroke='#000' stroke-width='1'/>
      <ellipse cx='76.5' cy='65.5' rx='2.2' ry='1.4' transform='rotate(-35 76.5 65.5)'/><path d='M69 73 C72 74.5 75.5 74 78 71.5' fill='none' stroke='#000' stroke-width='1.2'/>
      <path d='M48 70 C52 66 54 60 52 54' fill='none' stroke='#000' stroke-width='1' opacity='.5'/></g>
    ${[[43.5, 37.5, 5], [51, 33.5, 5.4], [59, 35, 4.6]].map(([x, y, r]) => `<g transform='translate(${x} ${y})'>${[0, 72, 144, 216, 288].map(a => `<ellipse cy='${-r * 0.55}' rx='${r * 0.38}' ry='${r * 0.55}' transform='rotate(${a})'/>`).join('')}<circle r='${r * 0.32}' fill='#000'/></g>`).join('')}`,
  chip: `<rect x='32' y='34' width='36' height='36' rx='4'/><g>${[39, 46, 54, 61].map(v => `<rect x='${v - 1.5}' y='24' width='3' height='9' rx='1'/><rect x='${v - 1.5}' y='71' width='3' height='9' rx='1'/><rect x='22' y='${v - 1.5}' width='9' height='3' rx='1'/><rect x='69' y='${v - 1.5}' width='9' height='3' rx='1'/>`).join('')}</g>
    <g fill='none' stroke='#000' stroke-width='1.6' stroke-linecap='round' opacity='.6'><rect x='40' y='42' width='20' height='20' rx='2'/><path d='M44 52 H50 L53 48 H56 M50 52 L53 56'/></g>`,
  ring: `<path fill-rule='evenodd' d='M50 32 C66 32 77 41 77 53 C77 65 66 74 50 74 C34 74 23 65 23 53 C23 41 34 32 50 32Z M50 40 C61 40 68 46 68 53 C68 60 61 66 50 66 C39 66 32 60 32 53 C32 46 39 40 50 40Z'/>
    <path d='M27 50 C30 41 40 36 50 36 C60 36 70 41 73 50' fill='none' stroke='#000' stroke-width='1.3' stroke-dasharray='3 1.2 1.4 1.2 2 1.6' opacity='.55'/>
    <path d='M28 57 C32 66 41 70 50 70 C59 70 68 66 72 57' fill='none' stroke='#000' stroke-width='1.3' stroke-dasharray='2 1.4 3 1.2 1.2 1.4' opacity='.45'/>`,
  leaf: `<path d='M50 16 C67 28 72 52 50 80 C28 52 33 28 50 16Z'/><path d='M50 80 C50 86 46 90 41 89 C44 87 46 85 46 82' fill='none' stroke='#000' stroke-width='2' opacity='.6'/>
    <g fill='none' stroke='#000' stroke-width='1.4' opacity='.55' stroke-linecap='round'><path d='M50 22 V76'/><path d='M50 34 L41 28 M50 34 L59 28 M50 46 L39 39 M50 46 L61 39 M50 58 L40 52 M50 58 L60 52 M50 68 L43 63 M50 68 L57 63'/></g>`,
  tree: `<path d='M47 86 C48 76 48 66 46 56 C40 52 32 50 26 44 C34 46 40 47 45 49 C42 42 36 36 34 28 C40 34 44 40 47 46 C47 38 46 30 49 22 C50 30 51 38 51 46 C54 40 58 34 64 28 C62 36 56 42 53 49 C58 47 64 46 72 44 C66 50 58 52 52 56 C50 66 50 76 51 86Z'/>
    ${[[30, 18], [40, 12], [50, 9], [60, 12], [70, 18], [24, 27], [76, 27]].map(([x, y]) => `<path transform='translate(${x} ${y}) scale(.5)' d='M0 -6 L1.6 -1.6 L6 0 L1.6 1.6 L0 6 L-1.6 1.6 L-6 0 L-1.6 -1.6Z'/>`).join('')}
    <path d='M40 86 H58' stroke='#000' stroke-width='1.5' opacity='.4'/>`,
  mask: `<path d='M18 46 C24 38 36 36 50 42 C64 36 76 38 82 46 C82 56 76 64 66 64 C58 64 54 58 50 56 C46 58 42 64 34 64 C24 64 18 56 18 46Z'/>
    <g fill='#000'><path d='M27 49 C30 44 38 44 42 49 C38 53 30 53 27 49Z'/><path d='M58 49 C62 44 70 44 73 49 C70 53 62 53 58 49Z'/></g>
    <path d='M80 44 C86 34 86 22 80 12 C78 22 76 32 76 42Z'/><path d='M76 42 C80 32 82 22 80 12' fill='none' stroke='#000' stroke-width='.8' opacity='.5'/><path d='M19 52 C13 60 12 68 15 78 L19 77 C17 69 18 62 22 56Z' fill-opacity='.85'/>`,
  bow: `<path d='M50 50 C40 40 26 32 20 38 C14 44 16 58 22 62 C28 66 40 60 50 54Z'/><path d='M50 50 C60 40 74 32 80 38 C86 44 84 58 78 62 C72 66 60 60 50 54Z'/>
    <path d='M46 54 C42 64 36 76 30 84 L38 84 C42 76 46 66 49 58Z'/><path d='M54 54 C58 64 64 76 70 84 L62 84 C58 76 54 66 51 58Z'/>
    <rect x='44' y='45' width='12' height='12' rx='4'/>
    <g fill='none' stroke='#000' stroke-width='1.3' opacity='.45' stroke-linecap='round'><path d='M46 50 C38 44 30 40 25 44 M54 50 C62 44 70 40 75 44 M24 52 C30 56 38 56 44 53 M76 52 C70 56 62 56 56 53'/></g>`,
  paw: `<g transform='translate(50 52) scale(2.6)'><ellipse cx='0' cy='4' rx='5.2' ry='4.4'/><ellipse cx='-6' cy='-3' rx='2.1' ry='2.7' transform='rotate(-20 -6 -3)'/>
    <ellipse cx='-2.2' cy='-6.6' rx='2.1' ry='2.8'/><ellipse cx='2.2' cy='-6.6' rx='2.1' ry='2.8'/><ellipse cx='6' cy='-3' rx='2.1' ry='2.7' transform='rotate(20 6 -3)'/></g>`,

  // ── Drawn emblems for the earlier looks (romance, the sabbats, nature, parties) ──
  heart: `<path d='M50 79 C38 69 21 57 21 41 C21 31 29 23 39 23 C45 23 48 27 50 31 C52 27 55 23 61 23 C71 23 79 31 79 41 C79 57 62 69 50 79Z'/>
    <path d='M29 41 C29 35 33 30 39 30' fill='none' stroke='#000' stroke-width='2' stroke-linecap='round' opacity='.35'/>`,
  rose: `<g transform='translate(50 40)'><path d='M-21 2 C-23 -12 -12 -22 0 -22 C12 -22 23 -12 21 2 C19 14 9 21 0 21 C-9 21 -19 14 -21 2Z'/>
    <g fill='none' stroke='#000' stroke-width='1.8' stroke-linecap='round' opacity='.7'><path d='M-3 -6 C-1 -10 6 -9 6 -4 C6 1 -1 3 -5 0 C-9 -4 -6 -13 2 -14 C10 -15 15 -7 13 0'/>
    <path d='M-16 4 C-10 13 9 14 16 5'/><path d='M-18 -6 C-14 -1 -9 1 -4 1'/><path d='M18 -8 C15 -3 12 -1 8 0'/></g></g>
    <path d='M49 61 C48 69 49 77 51 87' stroke='#fff' stroke-width='3.4' fill='none' stroke-linecap='round'/>
    <path d='M49 71 C40 65 32 67 28 73 C36 75 43 75 49 71Z'/><path d='M50 77 C58 71 66 71 71 76 C64 80 57 80 50 77Z'/>`,
  blossom: `<g transform='translate(50 51)'>${[0, 72, 144, 216, 288].map(a => `<path transform='rotate(${a})' d='M0 -4 C-13 -12 -13 -28 -5 -31 L0 -26 L5 -31 C13 -28 13 -12 0 -4Z'/>`).join('')}
    <circle r='6.5' fill='#000' opacity='.5'/><g fill='#000' opacity='.45'>${[36, 108, 180, 252, 324].map(a => `<circle cx='${(11 * Math.sin(a * Math.PI / 180)).toFixed(1)}' cy='${(-11 * Math.cos(a * Math.PI / 180)).toFixed(1)}' r='1.6'/>`).join('')}</g></g>`,
  snowflake: `<g transform='translate(50 50)' stroke='#fff' stroke-linecap='round' fill='none'>${[0, 60, 120, 180, 240, 300].map(a => `<g transform='rotate(${a})'><path d='M0 0 V-31' stroke-width='4'/><path d='M0 -13 L-8 -20 M0 -13 L8 -20 M0 -23 L-5 -28 M0 -23 L5 -28' stroke-width='3'/></g>`).join('')}</g>
    <circle cx='50' cy='50' r='6'/><circle cx='50' cy='50' r='2.4' fill='#000' opacity='.45'/>`,
  holly: `${[-52, 52].map(a => `<g transform='translate(50 60) rotate(${a})'><path d='M0 0 L-6 -4 L-11 -2 L-10 -10 L-14 -14 L-9 -18 L-11 -26 L-5 -26 L0 -35 L5 -26 L11 -26 L9 -18 L14 -14 L10 -10 L11 -2 L6 -4Z'/><path d='M0 -2 V-30' stroke='#000' stroke-width='1.4' opacity='.5'/></g>`).join('')}
    <g stroke='#000' stroke-width='1.2' stroke-opacity='.45'><circle cx='43' cy='60' r='7'/><circle cx='57' cy='60' r='7'/><circle cx='50' cy='50' r='7'/></g>
    <g fill='#000' opacity='.35'><circle cx='41' cy='58' r='1.6'/><circle cx='55' cy='58' r='1.6'/><circle cx='48' cy='48' r='1.6'/></g>`,
  sun: `<circle cx='50' cy='50' r='15'/>${[...Array(12)].map((_, i) => `<path transform='rotate(${i * 30} 50 50)' d='M50 ${i % 2 ? 23 : 15} L54.5 32 L45.5 32Z'/>`).join('')}
    <g fill='#000' opacity='.45'><circle cx='45' cy='47' r='1.8'/><circle cx='55' cy='47' r='1.8'/></g><path d='M44 54 Q50 59 56 54' fill='none' stroke='#000' stroke-width='1.8' stroke-linecap='round' opacity='.45'/>`,
  flame: `<path d='M50 84 C34 84 26 72 28 60 C30 50 38 44 40 33 C46 39 47 47 46 52 C52 46 55 34 50 16 C62 25 73 42 72 58 C72 74 64 84 50 84Z'/>
    <path d='M50 80 C42 80 38 74 40 66 C42 60 46 58 48 51 C52 58 59 62 59 70 C59 76 55 80 50 80Z' fill='#000' opacity='.4'/>`,
  wheat: `${[-18, 0, 18].map(a => `<g transform='rotate(${a} 50 86)'><path d='M50 86 V44' stroke='#fff' stroke-width='2.4'/>${[0, 1, 2, 3, 4].map(i => { const y = 22 + i * 7.5; return `<ellipse cx='45.6' cy='${y}' rx='3.1' ry='6' transform='rotate(-28 45.6 ${y})'/><ellipse cx='54.4' cy='${y}' rx='3.1' ry='6' transform='rotate(28 54.4 ${y})'/>`; }).join('')}<ellipse cx='50' cy='16' rx='3' ry='6'/></g>`).join('')}
    <path d='M42 70 C46 73 54 73 58 70' fill='none' stroke='#fff' stroke-width='3'/>`,
  mapleleaf: `<path d='M50 14 L55 27 L62 22 L60 37 L71 30 L69 39 L81 37 L75 47 L79 51 L64 59 L66 65 L53 61 L52 66 L48 66 L47 61 L34 65 L36 59 L21 51 L25 47 L19 37 L31 39 L29 30 L40 37 L38 22 L45 27Z'/>
    <path d='M50 64 C50 72 51 80 54 86' stroke='#fff' stroke-width='3' fill='none' stroke-linecap='round'/>
    <path d='M50 62 V22 M50 52 L71 36 M50 52 L29 36 M50 58 L67 56 M50 58 L33 56' fill='none' stroke='#000' stroke-width='1.4' opacity='.5' stroke-linecap='round'/>`,
  egg: `<path d='M50 17 C64 17 74 42 74 58 C74 74 63 84 50 84 C37 84 26 74 26 58 C26 42 36 17 50 17Z'/>
    <g fill='none' stroke='#000' stroke-width='2' opacity='.5' stroke-linejoin='round' stroke-linecap='round'><path d='M28 50 L34 44 L40 50 L45 44 L50 50 L55 44 L60 50 L66 44 L72 50'/><path d='M27 65 Q33 61 39 65 T51 65 T63 65 T74 65'/></g>
    <g fill='#000' opacity='.45'><circle cx='43' cy='33' r='2'/><circle cx='50' cy='29' r='2'/><circle cx='57' cy='33' r='2'/><circle cx='40' cy='75' r='1.6'/><circle cx='50' cy='77' r='1.6'/><circle cx='60' cy='75' r='1.6'/></g>`,
  candle: `<rect x='41' y='42' width='18' height='38' rx='2'/><ellipse cx='50' cy='81' rx='22' ry='4.5'/>
    <path d='M50 16 C57 25 59 32 54 38 C52 41 48 41 46 38 C41 32 43 25 50 16Z'/><rect x='49.2' y='38' width='1.6' height='5' fill='#000' opacity='.6'/>
    <path d='M41 46 C45 47 45 54 47 54 C49 54 49 47 52 47 C55 47 55 51 59 50' fill='none' stroke='#000' stroke-width='1.4' opacity='.45'/>
    <g stroke='#fff' stroke-width='2.2' stroke-linecap='round'><path d='M33 22 L37 26 M67 22 L63 26 M29 34 H35 M65 34 H71'/></g>`,
  crescent: `<path d='M56 18 A32 32 0 1 0 76 72 A26 26 0 1 1 56 18Z'/>
    ${[[70, 28, 1], [80, 44, 0.7], [64, 44, 0.55]].map(([x, y, k]) => `<path transform='translate(${x} ${y}) scale(${k})' d='M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z'/>`).join('')}`,
  strawberry: `<path d='M50 85 C36 77 26 61 28 47 C30 37 40 33 50 35 C60 33 70 37 72 47 C74 61 64 77 50 85Z'/>
    <g fill='#000' opacity='.5'>${[[40, 48], [50, 46], [60, 48], [36, 59], [46, 58], [56, 58], [64, 60], [42, 69], [52, 69], [60, 70], [48, 78]].map(([x, y]) => `<ellipse cx='${x}' cy='${y}' rx='1.3' ry='2'/>`).join('')}</g>
    <path d='M50 37 L39 27 L45 35 L33 33 L44 39 L50 41 L56 39 L67 33 L55 35 L61 27Z' stroke='#000' stroke-width='1.2' stroke-opacity='.5'/>
    <path d='M50 31 C50 25 52 21 56 17' stroke='#fff' stroke-width='3' fill='none' stroke-linecap='round'/>`,
  compass: `<circle cx='50' cy='50' r='29' fill='none' stroke='#fff' stroke-width='3'/>
    <path d='M50 44 L64 36 L56 50 L64 64 L50 56 L36 64 L44 50 L36 36Z'/>
    <path d='M50 13 L56 44 L87 50 L56 56 L50 87 L44 56 L13 50 L44 44Z'/>
    <path d='M50 13 L56 44 L50 50Z M87 50 L56 56 L50 50Z M50 87 L44 56 L50 50Z M13 50 L44 44 L50 50Z' fill='#000' opacity='.35'/>
    <circle cx='50' cy='50' r='3' fill='#000' opacity='.6'/>`,
  mushroom: `<path d='M17 55 C17 34 32 22 50 22 C68 22 83 34 83 55 C70 59 30 59 17 55Z'/>
    <path d='M40 57 C40 67 38 76 36 82 H64 C62 76 60 67 60 57Z'/>
    <g fill='#000' opacity='.5'><circle cx='35' cy='38' r='5'/><circle cx='54' cy='31' r='4'/><circle cx='67' cy='44' r='5'/><circle cx='47' cy='47' r='3'/><circle cx='25' cy='49' r='2.6'/></g>
    <path d='M24 56 C40 62 60 62 76 56' fill='none' stroke='#000' stroke-width='1.4' opacity='.45'/><path d='M28 85 H72' stroke='#fff' stroke-width='3' stroke-linecap='round'/>`,
  shell: `<path d='M50 78 L21 50 C21 30 35 19 50 19 C65 19 79 30 79 50Z'/><path d='M37 72 L50 78 L63 72 L66 84 H34Z'/>
    <g fill='none' stroke='#000' stroke-width='1.6' opacity='.5' stroke-linecap='round'>${[-56, -40, -24, -8, 8, 24, 40, 56].map(a => `<path d='M50 76 L${(50 + 28 * Math.sin(a * Math.PI / 180)).toFixed(1)} ${(48 - 28 * Math.cos(a * Math.PI / 180)).toFixed(1)}'/>`).join('')}</g>`,
  star: `<path d='${[...Array(10)].map((_, i) => { const r = i % 2 ? 13 : 33, a = (i * 36 - 90) * Math.PI / 180; return `${i ? 'L' : 'M'}${(50 + r * Math.cos(a)).toFixed(1)} ${(53 + r * Math.sin(a)).toFixed(1)}`; }).join(' ')}Z'/>
    <path d='${[0, 1, 2, 3, 4].map(i => { const a = (i * 72 - 90) * Math.PI / 180, b = (i * 72 - 54) * Math.PI / 180; return `M50 53 L${(50 + 33 * Math.cos(a)).toFixed(1)} ${(53 + 33 * Math.sin(a)).toFixed(1)} L${(50 + 13 * Math.cos(b)).toFixed(1)} ${(53 + 13 * Math.sin(b)).toFixed(1)}Z`; }).join(' ')}' fill='#000' opacity='.3'/>`,
  martini: `<path d='M23 26 H77 L50 55Z'/><rect x='48.5' y='54' width='3' height='24'/><ellipse cx='50' cy='79' rx='15' ry='3.6'/>
    <path d='M30 32 H70' stroke='#000' stroke-width='1.6' opacity='.5'/><path d='M72 13 L60 34' stroke='#fff' stroke-width='2.2' stroke-linecap='round'/>
    <circle cx='58' cy='38' r='5' fill='#000' opacity='.55'/>`,
  cake: `<ellipse cx='50' cy='82' rx='33' ry='4.5'/><rect x='23' y='58' width='54' height='23' rx='3'/><rect x='32' y='40' width='36' height='19' rx='3'/>
    <g fill='none' stroke='#000' stroke-width='1.6' opacity='.5'><path d='M23 64 Q27 69 31 64 T39 64 T47 64 T55 64 T63 64 T71 64 T77 64'/><path d='M32 46 Q36 51 40 46 T48 46 T56 46 T64 46 T68 46'/></g>
    ${[40, 50, 60].map(x => `<rect x='${x - 1.5}' y='27' width='3' height='12'/><path d='M${x} 17 C${x + 3.5} 21 ${x + 3} 25 ${x} 25 C${x - 3} 25 ${x - 3.5} 21 ${x} 17Z'/>`).join('')}`,
  hibiscus: `<g transform='translate(47 53)'>${[0, 72, 144, 216, 288].map(a => `<path transform='rotate(${a})' d='M0 0 C-15 -6 -19 -27 -7 -31 C-2 -32.5 2 -32.5 7 -31 C19 -27 15 -6 0 0Z'/>`).join('')}
    <g fill='none' stroke='#000' stroke-width='1.2' opacity='.4'>${[0, 72, 144, 216, 288].map(a => `<path transform='rotate(${a})' d='M0 -3 V-22 M0 -9 L-5 -18 M0 -9 L5 -18'/>`).join('')}</g><circle r='5' fill='#000' opacity='.45'/></g>
    <path d='M47 53 L75 25' stroke='#000' stroke-width='2.2' opacity='.6'/><g><circle cx='76' cy='24' r='2.4'/><circle cx='79.5' cy='28' r='2'/><circle cx='72' cy='20.5' r='2'/></g>`,
  discoball: `<path d='M50 10 V24' stroke='#fff' stroke-width='2'/><circle cx='50' cy='52' r='28'/>
    <g fill='none' stroke='#000' stroke-width='1.2' opacity='.45'>${[-20, -12, -4, 4, 12, 20].map(dy => { const w = Math.sqrt(28 * 28 - dy * dy); return `<path d='M${(50 - w).toFixed(1)} ${52 + dy} H${(50 + w).toFixed(1)}'/>`; }).join('')}
    ${[9, 18, 25].map(rx => `<ellipse cx='50' cy='52' rx='${rx}' ry='28'/>`).join('')}<path d='M50 24 V80'/></g>
    <g fill='#000' opacity='.28'><rect x='56' y='56' width='8' height='8'/><rect x='38' y='64' width='9' height='8'/><rect x='64' y='40' width='7' height='8'/><rect x='30' y='44' width='7' height='8'/></g>
    ${[[82, 24, 0.9], [19, 74, 0.7], [84, 76, 0.5]].map(([x, y, k]) => `<path transform='translate(${x} ${y}) scale(${k})' d='M0 -8 L2 -2 L8 0 L2 2 L0 8 L-2 2 L-8 0 L-2 -2Z'/>`).join('')}`,
  mug: `<path d='M27 40 H64 V70 C64 77 58 82 51 82 H40 C33 82 27 77 27 70Z'/><path d='M64 46 C77 44 79 61 66 64' fill='none' stroke='#fff' stroke-width='5'/>
    <path d='M45.5 72 C39 67 35 63 35 58.5 C35 55.5 37 53 40.5 53 C42.5 53 44.5 54 45.5 56 C46.5 54 48.5 53 50.5 53 C54 53 56 55.5 56 58.5 C56 63 52 67 45.5 72Z' fill='#000' opacity='.5'/>
    <g fill='none' stroke='#fff' stroke-width='2.6' stroke-linecap='round'><path d='M38 33 C34 27 42 23 38 15'/><path d='M50 33 C46 27 54 23 50 15'/></g>`,
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
    { s: '@heart', name: 'Heart' }, { s: '∞', name: 'Infinity' }, { s: '❦', name: 'Floral heart' }, { s: '@rose', name: 'Rose' },
    { s: '@blossom', name: 'Blossom' }, { s: '🕊️', name: 'Dove' }, { s: '💍', name: 'Ring' },
  ] },
  { id: 'sky', label: 'Celestial', items: [
    { s: '@moonstar', name: 'Moon & star' }, { s: '@crescent', name: 'Crescent' }, { s: '@star', name: 'Star' }, { s: '@sun', name: 'Sun' },
    { s: '✺', name: 'Sunburst' }, { s: '⛤', name: 'Pentacle' }, { s: '@snowflake', name: 'Snowflake' }, { s: '@candle', name: 'Candle' }, { s: '@flame', name: 'Flame' },
  ] },
  { id: 'magic', label: 'Magic', items: [
    { s: '@wizardhat', name: 'Wizard’s hat' }, { s: '@wand', name: 'Wand' }, { s: '@dragon', name: 'Dragon' }, { s: '@constellation', name: 'Constellation' },
    { s: '@moonstar', name: 'Moon & star' }, { s: '🔮', name: 'Crystal ball' }, { s: '🧪', name: 'Potion' }, { s: '📜', name: 'Scroll' },
  ] },
  { id: 'nature', label: 'Nature', items: [
    { s: '@acorn', name: 'Acorn' }, { s: '@teacup', name: 'Teacup' }, { s: '☘︎', name: 'Clover' },
 { s: '@mapleleaf', name: 'Maple leaf' }, { s: '@mushroom', name: 'Mushroom' }, { s: '🐝', name: 'Bee' },
    { s: '🦋', name: 'Butterfly' }, { s: '🦉', name: 'Owl' }, { s: '@shell', name: 'Shell' }, { s: '@wheat', name: 'Wheat' }, { s: '@strawberry', name: 'Strawberry' },
    { s: '@holly', name: 'Holly' }, { s: '@egg', name: 'Painted egg' }, { s: '@compass', name: 'Compass' },
  ] },
  { id: 'stage', label: 'Stage', items: [
    { s: '@masks', name: 'Theatre masks' }, { s: '@lips', name: 'Kiss' }, { s: '@note', name: 'Music notes' }, { s: '@donkey', name: 'Donkey head' }, { s: '@pansy', name: 'Pansy' }, { s: '♪', name: 'Note' },
    { s: '@star', name: 'Star of the show' }, { s: '🎟️', name: 'Ticket' }, { s: '🎤', name: 'Microphone' }, { s: '🎻', name: 'Violin' }, { s: '@rose', name: 'Rose' },
  ] },
  { id: 'worlds', label: 'Worlds', items: [
    { s: '@ring', name: 'The ring' }, { s: '@leaf', name: 'Elven leaf' }, { s: '@tree', name: 'White tree' }, { s: '@chip', name: 'Microchip' },
    { s: '🗡️', name: 'Sword' }, { s: '🏔️', name: 'Mountain' }, { s: '🤖', name: 'Robot' }, { s: '⚡', name: 'Lightning' },
  ] },
  { id: 'afterdark', label: 'After dark', items: [
    { s: '@lips', name: 'Kiss' }, { s: '@mask', name: 'Masquerade mask' }, { s: '@bow', name: 'Satin bow' }, { s: '🗝️', name: 'Key' },
    { s: '🥂', name: 'Champagne' }, { s: '@rose', name: 'Rose' }, { s: '♠', name: 'Spade' },
  ] },
  { id: 'party', label: 'Party', items: [
    { s: '@martini', name: 'Martini' }, { s: '🥂', name: 'Cheers' }, { s: '@die', name: 'Die' }, { s: '♫', name: 'Music' },
    { s: '@discoball', name: 'Disco ball' }, { s: '@cake', name: 'Cake' }, { s: '🎈', name: 'Balloon' }, { s: '@star', name: 'Star' },
    { s: '♠︎', name: 'Spade' }, { s: '@hibiscus', name: 'Hibiscus' }, { s: '@mug', name: 'Cozy mug' },
  ] },
  { id: 'dark', label: 'Dark', items: [
    { s: '@bat', name: 'Bat' }, { s: '@pumpkin', name: 'Jack-o’-lantern' }, { s: '@brokenheart', name: 'Broken heart' }, { s: '☠︎', name: 'Skull' }, { s: '🥀', name: 'Wilted rose' },
    { s: '🕷️', name: 'Spider' }, { s: '💋', name: 'Kiss' }, { s: '⛓️', name: 'Chain' },
    { s: '🔥', name: 'Flame' }, { s: '✝︎', name: 'Cross' },
  ] },
  { id: 'cats', label: 'Cats', items: [
    { s: '@cat', name: 'Sitting cat' }, { s: '@catface', name: 'Cat face' }, { s: '@paw', name: 'Paw print' },
    { s: '🐈‍⬛', name: 'Prowling cat' }, { s: '🧶', name: 'Yarn' }, { s: '🐟', name: 'Fish' },
  ] },
];

// ── Resolving what to draw ───────────────────────────────────────────
export function sealColor(inv, look) {
  if (own(WAX_BY_ID, inv.sc)) return WAX_BY_ID[inv.sc].hex;
  if (safeHex(inv.sc)) return inv.sc;
  return WAX_BY_ID[look.wax]?.hex || '#8f1d1d';
}

export function sealFace(inv, look) {
  const id = inv.sf || look.waxFace || 'pressed';
  if (own(FACE_BY_ID, id)) return FACE_BY_ID[id];
  if (safeHex(id)) return { id: 'custom', stops: [shade(id, 0.45), id, shade(id, -0.45)] };
  return FACE_BY_ID.pressed;
}

export function sealEmblem(inv, look) {
  const custom = String(inv.se || '').trim();
  if (custom.startsWith('@')) return own(SVG_EMBLEMS, custom.slice(1)) ? custom : look.seal;
  return Array.from(custom).slice(0, 4).join('') || look.seal;
}

export { shade };


// The seal as SVG. Everything from the link is escaped or validated.
// A small seeded random generator, so each emblem always pours the same puddle.
function seeded(seed) {
  let t = seed * 2654435761 >>> 0;
  return () => ((t = (t ^ (t << 13)) >>> 0, t = (t ^ (t >>> 17)) >>> 0, t = (t ^ (t << 5)) >>> 0) % 10000) / 10000;
}

// An irregular puddle of wax: a wobbly circle with a couple of soft bulges,
// smoothed into curves.
function puddlePath(seed) {
  const rnd = seeded(seed + 11);
  const n = 22, pts = [];
  const bulges = [rnd() * Math.PI * 2, rnd() * Math.PI * 2];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    let r = 44 + (rnd() - 0.5) * 3.2;
    for (const b of bulges) {
      const diff = ((a - b + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      r += 2.6 * Math.exp(-(diff * diff) / 0.08);
    }
    pts.push([50 + Math.cos(a) * r, 50 + Math.sin(a) * r]);
  }
  const p = i => pts[(i + n) % n];
  let d = `M${p(0)[0].toFixed(1)} ${p(0)[1].toFixed(1)}`;
  for (let i = 0; i < n; i++) {
    const [p0, p1, p2, p3] = [p(i - 1), p(i), p(i + 1), p(i + 2)];
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return `${d}Z`;
}

let uidCounter = 0;

// The seal as SVG, lit like real wax: the shape is drawn once as colors and
// once as a height map (puddle, raised rim, pressed face, emblem in relief,
// fine grain). Soft matte lighting from the upper left turns the height map
// into shading that is blended over the colors.
export function sealSvg(inv, look) {
  const id = `s${(++uidCounter).toString(36)}${Math.random().toString(36).slice(2, 6)}`;
  const wax = sealColor(inv, look);
  const metal = WAX_COLORS.some(c => c.hex === wax && c.metal);
  const face = sealFace(inv, look);
  const emblem = sealEmblem(inv, look);
  const seed = [...emblem].reduce((a, ch) => a + ch.codePointAt(0), 7) % 97;
  const puddle = puddlePath(seed);

  let art;
  if (emblem.startsWith('@')) art = `<g fill='#fff'>${SVG_EMBLEMS[emblem.slice(1)]}</g>`;
  else {
    const chars = Array.from(emblem.replace(/︎/g, ''));
    const long = chars.length > 1;
    const size = long ? (chars.length > 2 ? 21 : 27) : 42;
    art = `<text x='50' y='52' text-anchor='middle' dominant-baseline='central' fill='#fff' filter='url(#${id}w)'
      font-family="'Cinzel Decorative', 'Cormorant Garamond', serif" font-weight='700' font-size='${size}'>${esc(emblem)}</text>`;
  }

  // Colors stay nearly flat; the lighting does the shading, as on real wax.
  const edge = shade(wax, -0.12), faceColor = shade(wax, -0.04);
  const emblemColor = face.id === 'pressed'
    ? `fill='${shade(wax, -0.2)}'`
    : `fill='url(#${id}f)'`;
  const ring = 'M50 12.6 A37.4 37.4 0 1 1 49.99 12.6 Z M50 18.4 A31.6 31.6 0 1 0 50.01 18.4 Z';

  return `<svg class="wax-svg" viewBox="-12 -12 124 124" aria-hidden="true" focusable="false" style="isolation:isolate">
  <defs>
    <radialGradient id="${id}g" cx="50%" cy="50%" r="55%"><stop offset=".55" stop-color="${wax}"/><stop offset="1" stop-color="${edge}"/></radialGradient>
    <linearGradient id="${id}f" x1="0" y1="0" x2="1" y2="1">${(face.stops || []).map((c, i) => `<stop offset="${[0.05, 0.5, 0.95][i]}" stop-color="${c}"/>`).join('')}</linearGradient>
    <clipPath id="${id}c"><path d="${puddle}"/></clipPath>
    <filter id="${id}w"><feFlood flood-color="#fff"/><feComposite in2="SourceAlpha" operator="in"/></filter>
    <filter id="${id}s" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.4"/></filter>
    <filter id="${id}l" x="-5%" y="-5%" width="110%" height="110%" color-interpolation-filters="sRGB">
      <feGaussianBlur in="SourceAlpha" stdDeviation="1.15" result="h"/>
      <feTurbulence type="fractalNoise" baseFrequency="1.3" numOctaves="2" seed="${seed}" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 .04 0" result="grain"/>
      <feComposite in="h" in2="grain" operator="arithmetic" k2="1" k3="1" result="hg"/>
      <feDiffuseLighting in="hg" surfaceScale="${metal ? 4.5 : 5.5}" diffuseConstant="1.05" lighting-color="#fff">
        <feDistantLight azimuth="225" elevation="34"/>
      </feDiffuseLighting>
    </filter>
    <filter id="${id}m2" x="-10%" y="-10%" width="120%" height="120%">
      <feGaussianBlur in="SourceAlpha" stdDeviation=".8" result="b"/>
      <feSpecularLighting in="b" surfaceScale="2.5" specularConstant="${face.id === 'pressed' ? 0 : 0.45}" specularExponent="22" lighting-color="#fff" result="sp">
        <feDistantLight azimuth="225" elevation="40"/></feSpecularLighting>
      <feComposite in="sp" in2="SourceAlpha" operator="in" result="spi"/>
      <feComposite in="SourceGraphic" in2="spi" operator="arithmetic" k2="1" k3=".6"/>
    </filter>
    <mask id="${id}m" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#000"/>${art}</mask>
    <mask id="${id}x" maskUnits="userSpaceOnUse" x="0" y="0" width="100" height="100"><rect width="100" height="100" fill="#fff"/><g filter="url(#${id}k)">${art}</g></mask>
    <filter id="${id}k"><feFlood flood-color="#000"/><feComposite in2="SourceAlpha" operator="in"/></filter>
  </defs>
  <path d="${puddle}" fill="#000" opacity=".42" transform="translate(1.2 2.6)" filter="url(#${id}s)"/>
  <g clip-path="url(#${id}c)">
    <path d="${puddle}" fill="url(#${id}g)"/>
    <circle cx="50" cy="50" r="31.6" fill="${faceColor}"/>
    <g filter="url(#${id}m2)"><rect width="100" height="100" mask="url(#${id}m)" ${emblemColor}/></g>
    <g filter="url(#${id}l)" style="mix-blend-mode:soft-light">
      <path d="${puddle}" fill="#fff" fill-opacity=".38"/>
      <path d="${ring}" fill-rule="evenodd" fill="#fff" fill-opacity=".5"/>
      ${face.id === 'pressed'
        ? `<circle cx="50" cy="50" r="31.6" fill="#fff" fill-opacity=".22" mask="url(#${id}x)"/>`
        : `<circle cx="50" cy="50" r="31.6" fill="#fff" fill-opacity=".14"/><rect width="100" height="100" mask="url(#${id}m)" fill="#fff" fill-opacity=".4"/>`}
    </g>
    <ellipse cx="38" cy="32" rx="26" ry="16" fill="#fff" opacity="${metal ? 0.16 : 0.05}" transform="rotate(-35 38 32)" filter="url(#${id}s)"/>
  </g>
</svg>`;
}

export function sealHtml(inv, look, cls = '') {
  return `<span class="wax ${cls}" aria-hidden="true">${sealSvg(inv, look)}</span>`;
}

// A seal that can crack in two when the invitation is opened.
export function breakableSealHtml(inv, look, cls = '') {
  return `<span class="wax breakable ${cls}" aria-hidden="true"><span class="half l">${sealSvg(inv, look)}</span><span class="half r">${sealSvg(inv, look)}</span></span>`;
}
