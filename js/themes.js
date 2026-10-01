// Themes: the eight sabbats of the Wheel of the Year, plus occasion themes.
// A theme is pure data — colors, fonts, floating particles and a few lines of copy.

export const THEMES = {
  // ── Wheel of the Year ────────────────────────────────────────────────
  samhain: {
    name: 'Samhain', group: 'wheel', tagline: 'The veil grows thin', glyph: '☾',
    bg: ['#140a18', '#3b1a2e'], card: '#221320', ink: '#f3e6d0', accent: '#e8742a', accent2: '#b48cf2', onAccent: '#1a0f1f',
    display: "'Cinzel Decorative', serif", body: "'Cormorant Garamond', serif",
    particles: ['🦇', '🍂', '🕯️', '✦', '🌙'], seal: '🎃', divider: '✦ ☾ ✦',
    greeting: 'By candle and by moonlight, you are summoned…',
    yes: 'I shall attend 🕯️', closing: 'Yours beyond the veil,',
  },
  yule: {
    name: 'Yule', group: 'wheel', tagline: 'Return of the sun', glyph: '❄',
    bg: ['#0b231d', '#16473a'], card: '#f8f2e4', ink: '#1f3b2d', accent: '#b3262e', accent2: '#c9a227', onAccent: '#fff8ea',
    display: "'Great Vibes', cursive", body: "'Cormorant Garamond', serif",
    particles: ['❄', '✧', '🌲', '❅', '✦'], seal: '🌲', wrap: 'gift', divider: '❄ ✧ ❄',
    greeting: 'On the longest night, let us make our own light…',
    yes: 'Count me in ❄', closing: 'Warmly, by the Yule fire,',
  },
  imbolc: {
    name: 'Imbolc', group: 'wheel', tagline: 'First stirrings of spring', glyph: '🜂',
    bg: ['#dfe7f1', '#f6f1ea'], card: '#ffffff', ink: '#2c3e57', accent: '#c94f4f', accent2: '#7fa7d1', onAccent: '#ffffff',
    display: "'Cormorant Garamond', serif", body: "'Cormorant Garamond', serif",
    particles: ['🕯️', '❄', '🌱', '✧', '🐑'], seal: '🕯️', divider: '✧ 🕯 ✧',
    greeting: 'As Brigid’s flame wakes the sleeping earth…',
    yes: 'Yes, light the candle 🕯️', closing: 'With a kindled heart,',
  },
  ostara: {
    name: 'Ostara', group: 'wheel', tagline: 'Balance & bloom', glyph: '✿',
    bg: ['#fde7f1', '#e3f5e8'], card: '#fffdf7', ink: '#4a3b52', accent: '#d9649a', accent2: '#6fbf8a', onAccent: '#ffffff',
    display: "'Pacifico', cursive", body: "'Quicksand', sans-serif",
    particles: ['🌷', '🥚', '🐇', '🌼', '🦋'], seal: '🥚', divider: '✿ 🐇 ✿',
    greeting: 'Day and night stand in balance — and the garden is waking…',
    yes: 'Yes! Let’s bloom 🌷', closing: 'Blossoming with joy,',
  },
  beltane: {
    name: 'Beltane', group: 'wheel', tagline: 'Fire & flowers', glyph: '🔥',
    bg: ['#ffd6e4', '#ffc999'], card: '#fff8f2', ink: '#5a1e3a', accent: '#d81b60', accent2: '#2e8b57', onAccent: '#ffffff',
    display: "'Great Vibes', cursive", body: "'Cormorant Garamond', serif",
    particles: ['🌸', '🔥', '🌺', '✿', '🎀'], seal: '🌸', divider: '✿ 🔥 ✿',
    greeting: 'The bonfires are lit and the may is in bloom…',
    yes: 'Yes, I’ll dance 🔥', closing: 'Ever-blooming,',
  },
  litha: {
    name: 'Litha', group: 'wheel', tagline: 'Midsummer’s golden light', glyph: '☀',
    bg: ['#fff1b8', '#ffc94a'], card: '#fffdf2', ink: '#5b3a00', accent: '#f08a00', accent2: '#1fa595', onAccent: '#ffffff',
    display: "'Amatic SC', cursive", body: "'Quicksand', sans-serif",
    particles: ['☀️', '🌻', '🐝', '✦', '🌼'], seal: '🌻', divider: '✦ ☀ ✦',
    greeting: 'On the longest day, the sun lingers just for us…',
    yes: 'Yes, sunshine! ☀️', closing: 'Sun-kissed & smiling,',
  },
  lughnasadh: {
    name: 'Lughnasadh', group: 'wheel', tagline: 'The first harvest', glyph: '🌾',
    bg: ['#f4e3c1', '#d9a95b'], card: '#fff8ea', ink: '#4a2e12', accent: '#a85a1b', accent2: '#5f7f1f', onAccent: '#fff8ea',
    display: "'Uncial Antiqua', serif", body: "'Cormorant Garamond', serif",
    particles: ['🌾', '🍞', '🌻', '✦', '🍯'], seal: '🌾', wrap: 'scroll', divider: '🌾 ✦ 🌾',
    greeting: 'The grain is golden and the bread is baking…',
    yes: 'I’ll gather with you 🌾', closing: 'With gratitude for the harvest,',
  },
  mabon: {
    name: 'Mabon', group: 'wheel', tagline: 'Gratitude & golden leaves', glyph: '🍁',
    bg: ['#3d1f0f', '#8a3b12'], card: '#fbf1e1', ink: '#3d1f0f', accent: '#b8461a', accent2: '#7a1f2b', onAccent: '#fff6ea',
    display: "'Cormorant Garamond', serif", body: "'Cormorant Garamond', serif",
    particles: ['🍁', '🍂', '🍎', '🍇', '✦'], seal: '🍎', divider: '🍂 ✦ 🍂',
    greeting: 'As the leaves turn and the wheel tips toward the dark…',
    yes: 'Yes, let’s cozy up 🍁', closing: 'Gratefully yours,',
  },

  // ── Occasions ────────────────────────────────────────────────────────
  candlelit: {
    name: 'Candlelit Dinner', group: 'occasion', tagline: 'A table for two', glyph: '🕯',
    bg: ['#1c0b10', '#4a0f1e'], card: '#fbf3ea', ink: '#3a0d17', accent: '#a4161a', accent2: '#c9a227', onAccent: '#fff6ea',
    display: "'Playfair Display', serif", body: "'Cormorant Garamond', serif",
    particles: ['🕯️', '🌹', '✦', '🍷', '✧'], seal: '🌹', divider: '✦ 🌹 ✦',
    greeting: 'A candle, a table, and a seat saved just for you…',
    yes: 'It’s a date 🌹', closing: 'Yours,',
  },
  starlit: {
    name: 'Starlit Night', group: 'occasion', tagline: 'Wish upon it', glyph: '✦',
    bg: ['#050a24', '#1b1f5c'], card: '#0f1545', ink: '#e7e9ff', accent: '#ffd66b', accent2: '#9aa5ff', onAccent: '#0f1545',
    display: "'Cinzel Decorative', serif", body: "'Cormorant Garamond', serif",
    particles: ['✦', '✧', '⋆', '🌙', '☄️'], seal: '🌙', divider: '⋆ ☾ ⋆',
    greeting: 'The stars have aligned, and they spell out your name…',
    yes: 'Yes, under the stars ✨', closing: 'Yours under the stars,',
  },
  picnic: {
    name: 'Garden Picnic', group: 'occasion', tagline: 'Sunshine & strawberries', glyph: '🧺',
    bg: ['#e4f6d9', '#fff3d6'], card: '#fffef8', ink: '#2f4a2a', accent: '#e05a47', accent2: '#6aa84f', onAccent: '#ffffff',
    display: "'Pacifico', cursive", body: "'Quicksand', sans-serif",
    particles: ['🌼', '🍓', '🐞', '🦋', '🌿'], seal: '🍓', divider: '🌼 ✿ 🌼',
    greeting: 'A blanket, a basket, and a lazy afternoon…',
    yes: 'Yes, pack the basket 🧺', closing: 'Sweet as strawberries,',
  },
  adventure: {
    name: 'Wild Adventure', group: 'occasion', tagline: 'Into the wild', glyph: '🧭',
    bg: ['#1d3328', '#4f6d4a'], card: '#f5efe0', ink: '#22332a', accent: '#d9822b', accent2: '#4f7cac', onAccent: '#ffffff',
    display: "'Amatic SC', cursive", body: "'Quicksand', sans-serif",
    particles: ['🌲', '🍃', '🧭', '⛰️', '🦉'], seal: '🧭', wrap: 'chest', divider: '🌲 ✦ 🌲',
    greeting: 'The trail is calling, and it said to bring you…',
    yes: 'Adventure accepted 🥾', closing: 'See you out there,',
  },
  party: {
    name: 'Celebration', group: 'occasion', tagline: 'Let’s make some noise', glyph: '🎉',
    bg: ['#2b1055', '#d53369'], card: '#ffffff', ink: '#2b1055', accent: '#e93d82', accent2: '#f5b700', onAccent: '#ffffff',
    display: "'Fredoka', sans-serif", body: "'Quicksand', sans-serif",
    particles: ['🎉', '✨', '🎈', '🥂', '🎊'], seal: '🎈', wrap: 'gift', divider: '✨ 🎉 ✨',
    greeting: 'Grab your best grin — there’s a party and you’re on the list…',
    yes: 'Wouldn’t miss it 🎉', closing: 'Let’s celebrate,',
  },
  cozy: {
    name: 'Cozy Night In', group: 'occasion', tagline: 'Blankets mandatory', glyph: '☕',
    bg: ['#3b2a24', '#6b4a3a'], card: '#fdf6ee', ink: '#3b2a24', accent: '#c26a4f', accent2: '#7d8f4e', onAccent: '#ffffff',
    display: "'Caveat', cursive", body: "'Quicksand', sans-serif",
    particles: ['☕', '🍿', '🧸', '🕯️', '🧦'], seal: '☕', divider: '☕ ✦ 🍿',
    greeting: 'Soft lights, warm drinks, and absolutely no plans to go out…',
    yes: 'Yes, I’ll bring socks 🧦', closing: 'Cozily,',
  },
  enchanted: {
    name: 'Enchanted Forest', group: 'occasion', tagline: 'Where the fae dance', glyph: '🍄',
    bg: ['#0c2418', '#2f5d50'], card: '#112a1f', ink: '#e6f5e0', accent: '#c3f584', accent2: '#f5b0e0', onAccent: '#112a1f',
    display: "'Cinzel Decorative', serif", body: "'Cormorant Garamond', serif",
    particles: ['🍄', '✨', '🧚', '🌿', '🦋'], seal: '🍄', wrap: 'scroll', divider: '🌿 ✧ 🌿',
    greeting: 'A little bird (a fairy, really) asked me to deliver this…',
    yes: 'Lead me to the glade ✨', closing: 'Enchantedly,',
  },
  seaside: {
    name: 'Seaside', group: 'occasion', tagline: 'Salt air & sunshine', glyph: '🐚',
    bg: ['#d6f1f6', '#8fd3e8'], card: '#fffdf8', ink: '#0c3c4c', accent: '#f2734a', accent2: '#2a9d8f', onAccent: '#ffffff',
    display: "'Pacifico', cursive", body: "'Quicksand', sans-serif",
    particles: ['🐚', '🌊', '🐠', '⭐', '☀️'], seal: '🐚', wrap: 'bottle', divider: '〰 🐚 〰',
    greeting: 'The tide sent a message in a bottle — and it’s for you…',
    yes: 'Yes, see you at the shore 🌊', closing: 'Sea you soon,',
  },
  show: {
    name: 'Night at the Show', group: 'occasion', tagline: 'Curtain up', glyph: '🎭',
    bg: ['#0d0b1a', '#3a0ca3'], card: '#17122d', ink: '#f5f3ff', accent: '#f72585', accent2: '#4cc9f0', onAccent: '#ffffff',
    display: "'Righteous', sans-serif", body: "'Quicksand', sans-serif",
    particles: ['🎶', '🎭', '✨', '🎟️', '🎸'], seal: '🎟️', divider: '♪ ✦ ♪',
    greeting: 'The lights dim, the crowd hushes — and there’s a seat next to mine…',
    yes: 'Save me that seat 🎟️', closing: 'See you in the front row,',
  },
};
for (const [id, t] of Object.entries(THEMES)) t.id = id;

// The calendar date of each sabbat (Northern Hemisphere, month is 1-based).
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

// Southern Hemisphere seasons are flipped, so shift the calendar six months.
function wheelMonth(month, hemi) {
  return hemi === 'S' ? ((month + 5) % 12) + 1 : month;
}

export function sabbatFor(month, day, hemi = 'N') {
  const md = wheelMonth(month, hemi) * 100 + day;
  let current = 'yule';
  for (const [id, m, d] of SEASON_STARTS) if (md >= m * 100 + d) current = id;
  return current;
}

// Returns the sabbat id if the date is the sabbat itself, else null.
export function sabbatOn(month, day, hemi = 'N') {
  const m = wheelMonth(month, hemi);
  for (const [id, [sm, sd]] of Object.entries(SABBATS)) if (sm === m && sd === day) return id;
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

export function resolveTheme(inv) {
  if (inv.th && inv.th !== 'auto' && THEMES[inv.th]) return THEMES[inv.th];
  const { month, day } = partsInTz(inv.s ?? Date.now(), inv.tz);
  return THEMES[sabbatFor(month, day, inv.h)];
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
