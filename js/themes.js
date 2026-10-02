// Looks: the colors, particles and default materials of an invitation. Looks
// are grouped into categories for the picker. Wording and lettering come from
// the occasion (see occasions.js), not from the look.

export const LOOK_CATEGORIES = [
  { id: 'romantic', label: 'Romantic', icon: '🌹' },
  { id: 'seasonal', label: 'Seasonal', icon: '🍂' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'medieval', label: 'Medieval', icon: '🏰' },
  { id: 'cats', label: 'Cats', icon: '🐈‍⬛' },
  { id: 'night', label: 'Night & glam', icon: '✨' },
];

// pattern: the motif used on envelope liners, gift wrap and "Look's own" backgrounds.
// wax / waxFace: the default seal (a wax color id and an emblem finish id).
export const THEMES = {
  // ── Romantic ─────────────────────────────────────────────────────────
  candlelit: {
    name: 'Candlelit', cat: 'romantic', tagline: 'Wine-dark & gold', glyph: '🕯',
    bg: ['#1c0b10', '#4a0f1e'], card: '#fbf3ea', ink: '#3a0d17', accent: '#a4161a', accent2: '#b8902a', onAccent: '#fff6ea',
    particles: ['🕯️', '🌹', '✦', '🍷', '✧'], seal: '♥︎', divider: '✦ 🌹 ✦',
    pattern: 'damask', wax: 'scarlet', waxFace: 'gold', paper: 'cotton', corners: 'filigree', rule: 'flourish',
  },
  blush: {
    name: 'Blush & Gold', cat: 'romantic', tagline: 'Soft pink, gilded edges', glyph: '❦',
    bg: ['#f6d5d9', '#e8b4bc'], card: '#fffaf7', ink: '#5b2a35', accent: '#b5485d', accent2: '#c39a4b', onAccent: '#ffffff',
    particles: ['🌸', '✧', '💗', '✦', '🕊️'], seal: '❀', divider: '✧ ❦ ✧',
    pattern: 'hearts', wax: 'rose', waxFace: 'gold', paper: 'watercolor', corners: 'floral', rule: 'swash',
  },
  velvet: {
    name: 'Midnight Velvet', cat: 'romantic', tagline: 'Plum, rose & candle-glow', glyph: '❧',
    bg: ['#1a0d24', '#4a1942'], card: '#2a1530', ink: '#f6e6ee', accent: '#e58fb0', accent2: '#d6b25e', onAccent: '#2a1530', dark: true,
    particles: ['🌹', '✦', '🕯️', '✧', '🍷'], seal: '🌹', divider: '✦ ❧ ✦',
    pattern: 'damask', wax: 'burgundy', waxFace: 'gold', paper: 'smooth', corners: 'filigree', rule: 'flourish',
  },

  // ── Seasonal: the Wheel of the Year ──────────────────────────────────
  samhain: {
    name: 'Samhain', cat: 'seasonal', tagline: 'The veil grows thin', glyph: '☾',
    bg: ['#140a18', '#3b1a2e'], card: '#221320', ink: '#f3e6d0', accent: '#e8742a', accent2: '#b48cf2', onAccent: '#1a0f1f', dark: true,
    particles: ['🦇', '🍂', '🕯️', '✦', '🌙'], seal: '☾', divider: '✦ ☾ ✦',
    pattern: 'stars', wax: 'black', waxFace: 'copper', paper: 'parchment', corners: 'celestial', rule: 'flourish',
  },
  yule: {
    name: 'Yule', cat: 'seasonal', tagline: 'Return of the sun', glyph: '❄',
    bg: ['#0b231d', '#16473a'], card: '#f8f2e4', ink: '#1f3b2d', accent: '#b3262e', accent2: '#b8902a', onAccent: '#fff8ea',
    particles: ['❄', '✧', '🌲', '❅', '✦'], seal: '❄', wrap: 'gift', divider: '❄ ✧ ❄',
    pattern: 'snow', wax: 'scarlet', waxFace: 'gold', paper: 'linen', corners: 'floral', rule: 'vine',
  },
  imbolc: {
    name: 'Imbolc', cat: 'seasonal', tagline: 'First stirrings of spring', glyph: '✧',
    bg: ['#dfe7f1', '#f6f1ea'], card: '#ffffff', ink: '#2c3e57', accent: '#c94f4f', accent2: '#7fa7d1', onAccent: '#ffffff',
    particles: ['🕯️', '❄', '🌱', '✧', '🐑'], seal: '✦', divider: '✧ 🕯 ✧',
    pattern: 'snow', wax: 'ivory', waxFace: 'silver', paper: 'cotton', corners: 'none', rule: 'swash',
  },
  ostara: {
    name: 'Ostara', cat: 'seasonal', tagline: 'Balance & bloom', glyph: '✿',
    bg: ['#fde7f1', '#e3f5e8'], card: '#fffdf7', ink: '#4a3b52', accent: '#d9649a', accent2: '#6fbf8a', onAccent: '#ffffff',
    particles: ['🌷', '🥚', '🐇', '🌼', '🦋'], seal: '❀', divider: '✿ 🐇 ✿',
    pattern: 'blossoms', wax: 'lavender', waxFace: 'pearl', paper: 'watercolor', corners: 'floral', rule: 'vine',
  },
  beltane: {
    name: 'Beltane', cat: 'seasonal', tagline: 'Fire & flowers', glyph: '❀',
    bg: ['#ffd6e4', '#ffc999'], card: '#fff8f2', ink: '#5a1e3a', accent: '#d81b60', accent2: '#2e8b57', onAccent: '#ffffff',
    particles: ['🌸', '🔥', '🌺', '✿', '🎀'], seal: '❀', divider: '✿ 🔥 ✿',
    pattern: 'blossoms', wax: 'rose', waxFace: 'gold', paper: 'watercolor', corners: 'floral', rule: 'vine',
  },
  litha: {
    name: 'Litha', cat: 'seasonal', tagline: 'Midsummer’s golden light', glyph: '☀',
    bg: ['#fff1b8', '#ffc94a'], card: '#fffdf2', ink: '#5b3a00', accent: '#d97a00', accent2: '#1fa595', onAccent: '#ffffff',
    particles: ['☀️', '🌻', '🐝', '✦', '🌼'], seal: '☀︎', divider: '✦ ☀ ✦',
    pattern: 'blossoms', wax: 'gold', waxFace: 'pressed', paper: 'linen', corners: 'deco', rule: 'swash',
  },
  lughnasadh: {
    name: 'Lughnasadh', cat: 'seasonal', tagline: 'The first harvest', glyph: '🌾',
    bg: ['#f4e3c1', '#d9a95b'], card: '#fff8ea', ink: '#4a2e12', accent: '#a85a1b', accent2: '#5f7f1f', onAccent: '#fff8ea',
    particles: ['🌾', '🍞', '🌻', '✦', '🍯'], seal: '🌾', wrap: 'scroll', divider: '🌾 ✦ 🌾',
    pattern: 'leaves', wax: 'bronze', waxFace: 'pressed', paper: 'parchment', corners: 'floral', rule: 'vine',
  },
  mabon: {
    name: 'Mabon', cat: 'seasonal', tagline: 'Gratitude & golden leaves', glyph: '🍁',
    bg: ['#3d1f0f', '#8a3b12'], card: '#fbf1e1', ink: '#3d1f0f', accent: '#b8461a', accent2: '#7a1f2b', onAccent: '#fff6ea',
    particles: ['🍁', '🍂', '🍎', '🍇', '✦'], seal: '🍂', divider: '🍂 ✦ 🍂',
    pattern: 'leaves', wax: 'copper', waxFace: 'gold', paper: 'parchment', corners: 'floral', rule: 'flourish',
  },

  // ── Nature ───────────────────────────────────────────────────────────
  picnic: {
    name: 'Garden Picnic', cat: 'nature', tagline: 'Sunshine & strawberries', glyph: '🧺',
    bg: ['#e4f6d9', '#fff3d6'], card: '#fffef8', ink: '#2f4a2a', accent: '#d94f3d', accent2: '#6aa84f', onAccent: '#ffffff',
    particles: ['🌼', '🍓', '🐞', '🦋', '🌿'], seal: '🍓', divider: '🌼 ✿ 🌼',
    pattern: 'gingham', wax: 'scarlet', waxFace: 'pearl', paper: 'linen', corners: 'floral', rule: 'vine',
  },
  adventure: {
    name: 'Wild Adventure', cat: 'nature', tagline: 'Into the wild', glyph: '🧭',
    bg: ['#1d3328', '#4f6d4a'], card: '#f5efe0', ink: '#22332a', accent: '#c46f1f', accent2: '#4f7cac', onAccent: '#ffffff',
    particles: ['🌲', '🍃', '🧭', '⛰️', '🦉'], seal: '🧭', wrap: 'chest', divider: '🌲 ✦ 🌲',
    pattern: 'leaves', wax: 'forest', waxFace: 'bronze', paper: 'parchment', corners: 'none', rule: 'swash',
  },
  enchanted: {
    name: 'Enchanted Forest', cat: 'nature', tagline: 'Where the fae dance', glyph: '🍄',
    bg: ['#0c2418', '#2f5d50'], card: '#112a1f', ink: '#e6f5e0', accent: '#c3f584', accent2: '#f5b0e0', onAccent: '#112a1f', dark: true,
    particles: ['🍄', '✨', '🧚', '🌿', '🦋'], seal: '🍄', wrap: 'scroll', divider: '🌿 ✧ 🌿',
    pattern: 'leaves', wax: 'forest', waxFace: 'gold', paper: 'smooth', corners: 'floral', rule: 'vine',
  },
  seaside: {
    name: 'Seaside', cat: 'nature', tagline: 'Salt air & sunshine', glyph: '🐚',
    bg: ['#d6f1f6', '#8fd3e8'], card: '#fffdf8', ink: '#0c3c4c', accent: '#e0603a', accent2: '#2a9d8f', onAccent: '#ffffff',
    particles: ['🐚', '🌊', '🐠', '⭐', '☀️'], seal: '🐚', wrap: 'bottle', divider: '〰 🐚 〰',
    pattern: 'waves', wax: 'teal', waxFace: 'pearl', paper: 'watercolor', corners: 'none', rule: 'swash',
  },

  // ── Medieval ─────────────────────────────────────────────────────────
  royal: {
    name: 'Royal Court', cat: 'medieval', tagline: 'Crimson, ermine & gold', glyph: '♛',
    bg: ['#2a0710', '#6b0f22'], card: '#f6ecd6', ink: '#3a1010', accent: '#8e1420', accent2: '#b08a2e', onAccent: '#fff4dc',
    particles: ['⚜️', '👑', '✦', '🗝️', '✧'], seal: '@crown', wrap: 'scroll', divider: '⚜ ✦ ⚜',
    pattern: 'damask', scene: 'damask', wax: 'scarlet', waxFace: 'gold', paper: 'parchment', corners: 'gothic', rule: 'flourish',
  },
  castle: {
    name: 'Castle Keep', cat: 'medieval', tagline: 'Stone, steel & banners', glyph: '♜',
    bg: ['#1f2630', '#4a5568'], card: '#ece6d8', ink: '#22262e', accent: '#2f4b8a', accent2: '#8a7a55', onAccent: '#ffffff',
    particles: ['🛡️', '⚔️', '🏰', '✦', '🐉'], seal: '@shield', wrap: 'chest', divider: '⚔ ✦ ⚔',
    pattern: 'stone', scene: 'stone', wax: 'navy', waxFace: 'silver', paper: 'parchment', corners: 'gothic', rule: 'rule',
  },
  manuscript: {
    name: 'Illuminated', cat: 'medieval', tagline: 'Gilded letters & vines', glyph: '❦',
    bg: ['#3b2a1a', '#6e4f2c'], card: '#f3e5c4', ink: '#2e1f10', accent: '#a3201a', accent2: '#1f4e8c', onAccent: '#fff6e0',
    particles: ['📜', '🪶', '✦', '🌿', '✧'], seal: '⚜︎', wrap: 'scroll', divider: '❦ ✦ ❦',
    pattern: 'damask', wax: 'burgundy', waxFace: 'gold', paper: 'parchment', corners: 'gothic', sides: 'vine', rule: 'vine',
  },

  // ── Cats ─────────────────────────────────────────────────────────────
  blackcat: {
    name: 'Black Cat', cat: 'cats', tagline: 'Moonlight & golden eyes', glyph: '🐈‍⬛',
    bg: ['#120d1e', '#33244d'], card: '#1d1630', ink: '#f2ecff', accent: '#f0c64a', accent2: '#a98be0', onAccent: '#1d1630', dark: true,
    particles: ['🐈‍⬛', '🌙', '✦', '🐾', '✧'], seal: '@cat', divider: '✦ 🐾 ✦',
    pattern: 'paws', wax: 'black', waxFace: 'gold', paper: 'smooth', corners: 'celestial', rule: 'swash',
  },
  calico: {
    name: 'Calico', cat: 'cats', tagline: 'Ginger, cream & cocoa', glyph: '🐈',
    bg: ['#f7e7d2', '#e8b98a'], card: '#fffaf2', ink: '#4a2f1c', accent: '#c8642a', accent2: '#6b4a32', onAccent: '#ffffff',
    particles: ['🐈', '🧶', '🐾', '🐟', '✦'], seal: '@paw', divider: '🐾 ✦ 🐾',
    pattern: 'paws', scene: 'paws', wax: 'copper', waxFace: 'pearl', paper: 'linen', corners: 'paws', rule: 'swash',
  },
  kitten: {
    name: 'Kitten Pastel', cat: 'cats', tagline: 'Pink noses & yarn', glyph: '🐱',
    bg: ['#fde4ef', '#e6dcff'], card: '#fffbfe', ink: '#4b3660', accent: '#d36a9e', accent2: '#8f7ad6', onAccent: '#ffffff',
    particles: ['🐱', '🧶', '💗', '🐾', '✧'], seal: '@catface', divider: '✧ 🐾 ✧',
    pattern: 'paws', scene: 'paws', wax: 'rose', waxFace: 'pearl', paper: 'watercolor', corners: 'paws', rule: 'swash',
  },
  catcafe: {
    name: 'Cat Café', cat: 'cats', tagline: 'Lattes & lap cats', glyph: '☕',
    bg: ['#3b2a22', '#7a5641'], card: '#fbf3e8', ink: '#3b2a22', accent: '#9c5a3c', accent2: '#c39a4b', onAccent: '#ffffff',
    particles: ['☕', '🐈', '🐾', '🥐', '✦'], seal: '@cat', divider: '☕ 🐾 ☕',
    pattern: 'paws', wax: 'bronze', waxFace: 'gold', paper: 'cotton', corners: 'paws', rule: 'flourish',
  },

  // ── Night & glam ─────────────────────────────────────────────────────
  starlit: {
    name: 'Starlit Night', cat: 'night', tagline: 'Wish upon it', glyph: '✦',
    bg: ['#050a24', '#1b1f5c'], card: '#0f1545', ink: '#e7e9ff', accent: '#ffd66b', accent2: '#9aa5ff', onAccent: '#0f1545', dark: true,
    particles: ['✦', '✧', '⋆', '🌙', '☄️'], seal: '☾', divider: '⋆ ☾ ⋆',
    pattern: 'stars', scene: 'stars', wax: 'navy', waxFace: 'gold', paper: 'smooth', corners: 'celestial', rule: 'swash',
  },
  show: {
    name: 'Night at the Show', cat: 'night', tagline: 'Curtain up', glyph: '🎭',
    bg: ['#0d0b1a', '#3a0ca3'], card: '#17122d', ink: '#f5f3ff', accent: '#f72585', accent2: '#4cc9f0', onAccent: '#ffffff', dark: true,
    particles: ['🎶', '🎭', '✨', '🎟️', '🎸'], seal: '✦', divider: '♪ ✦ ♪',
    pattern: 'stars', scene: 'velvet', wax: 'black', waxFace: 'silver', paper: 'smooth', corners: 'deco', rule: 'rule',
  },
  party: {
    name: 'Celebration', cat: 'night', tagline: 'Let’s make some noise', glyph: '🎉',
    bg: ['#2b1055', '#d53369'], card: '#ffffff', ink: '#2b1055', accent: '#e93d82', accent2: '#e0a800', onAccent: '#ffffff',
    particles: ['🎉', '✨', '🎈', '🥂', '🎊'], seal: '✦', wrap: 'gift', divider: '✨ 🎉 ✨',
    pattern: 'confetti', scene: 'confetti', wax: 'gold', waxFace: 'pressed', paper: 'smooth', corners: 'deco', rule: 'swash',
  },
  cozy: {
    name: 'Cozy Night In', cat: 'night', tagline: 'Blankets mandatory', glyph: '☕',
    bg: ['#3b2a24', '#6b4a3a'], card: '#fdf6ee', ink: '#3b2a24', accent: '#b45d43', accent2: '#7d8f4e', onAccent: '#ffffff',
    particles: ['☕', '🍿', '🧸', '🕯️', '🧦'], seal: '♥︎', divider: '☕ ✦ 🍿',
    pattern: 'plaid', scene: 'plaid', wax: 'burgundy', waxFace: 'pearl', paper: 'linen', corners: 'none', sides: 'stitch', rule: 'swash',
  },
};
for (const [id, t] of Object.entries(THEMES)) t.id = id;

// The calendar date of each sabbat (month is 1-based).
export const SABBATS = {
  imbolc: [2, 1], ostara: [3, 20], beltane: [5, 1], litha: [6, 21],
  lughnasadh: [8, 1], mabon: [9, 22], samhain: [10, 31], yule: [12, 21],
};

// Each season starts roughly halfway between two sabbats, so a date gets the
// sabbat it is closest to (e.g. mid-October already feels like Samhain).
const SEASON_STARTS = [
  ['imbolc', 1, 11], ['ostara', 2, 25], ['beltane', 4, 11], ['litha', 5, 27],
  ['lughnasadh', 7, 12], ['mabon', 8, 28], ['samhain', 10, 12], ['yule', 11, 26],
];

export function sabbatFor(month, day) {
  const md = month * 100 + day;
  let current = 'yule';
  for (const [id, m, d] of SEASON_STARTS) if (md >= m * 100 + d) current = id;
  return current;
}

// Returns the sabbat id if the date is the sabbat itself, else null.
export function sabbatOn(month, day) {
  for (const [id, [sm, sd]] of Object.entries(SABBATS)) if (sm === month && sd === day) return id;
  return null;
}

// Calendar parts of an instant, as seen in a given time zone.
export function partsInTz(ms, tz) {
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: tz || undefined, year: 'numeric', month: 'numeric', day: 'numeric',
    hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  });
  const out = {};
  for (const p of fmt.formatToParts(new Date(ms))) if (p.type !== 'literal') out[p.type] = Number(p.value);
  return out;
}

export function seasonOf(inv) {
  const { month, day } = partsInTz(inv.s ?? Date.now(), inv.tz);
  return sabbatFor(month, day);
}

// The look's own data. Older links may say 'auto', meaning "the season of the date".
export function resolveLook(inv) {
  if (inv.th && THEMES[inv.th]) return THEMES[inv.th];
  return THEMES[seasonOf(inv)];
}

// ── Moon lore ──────────────────────────────────────────────────────────
export const MONTH_MOONS = [
  'Wolf Moon', 'Snow Moon', 'Worm Moon', 'Pink Moon', 'Flower Moon', 'Strawberry Moon',
  'Buck Moon', 'Sturgeon Moon', 'Harvest Moon', 'Hunter’s Moon', 'Beaver Moon', 'Cold Moon',
];

const PHASES = [
  ['🌑', 'New Moon'], ['🌒', 'Waxing Crescent'], ['🌓', 'First Quarter'], ['🌔', 'Waxing Gibbous'],
  ['🌕', 'Full Moon'], ['🌖', 'Waning Gibbous'], ['🌗', 'Last Quarter'], ['🌘', 'Waning Crescent'],
];
const SYNODIC_DAYS = 29.530588853;
const KNOWN_NEW_MOON = Date.UTC(2000, 0, 6, 18, 14);

export function moonPhase(ms) {
  const age = (((ms - KNOWN_NEW_MOON) / 864e5) % SYNODIC_DAYS + SYNODIC_DAYS) % SYNODIC_DAYS;
  const idx = Math.floor((age / SYNODIC_DAYS) * 8 + 0.5) % 8;
  const [emoji, name] = PHASES[idx];
  return { emoji, name, age };
}
