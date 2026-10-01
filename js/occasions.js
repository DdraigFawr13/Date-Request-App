// Occasions set the words and the lettering of an invitation; the look sets
// the colors. Every line of text can be overridden by the sender (inv.tx).

import { THEMES, resolveLook, seasonOf } from './themes.js';

// Font pairings: a display face for titles and a body face for everything else.
export const FONTS = {
  storybook: { name: 'Storybook', display: "'Cinzel Decorative', serif", body: "'Cormorant Garamond', serif" },
  classic: { name: 'Classic', display: "'Playfair Display', serif", body: "'Cormorant Garamond', serif" },
  script: { name: 'Elegant script', display: "'Great Vibes', cursive", body: "'Cormorant Garamond', serif" },
  blackletter: { name: 'Blackletter', display: "'UnifrakturMaguntia', serif", body: "'IM Fell English', serif" },
  manuscript: { name: 'Old manuscript', display: "'MedievalSharp', serif", body: "'IM Fell English', serif" },
  celtic: { name: 'Celtic', display: "'Uncial Antiqua', serif", body: "'Cormorant Garamond', serif" },
  sunny: { name: 'Sunny', display: "'Pacifico', cursive", body: "'Quicksand', sans-serif" },
  handwritten: { name: 'Handwritten', display: "'Caveat', cursive", body: "'Quicksand', sans-serif" },
  rustic: { name: 'Rustic', display: "'Amatic SC', cursive", body: "'Quicksand', sans-serif" },
  playful: { name: 'Playful', display: "'Fredoka', sans-serif", body: "'Quicksand', sans-serif" },
  kitten: { name: 'Kitten', display: "'Sniglet', sans-serif", body: "'Quicksand', sans-serif" },
  marquee: { name: 'Marquee', display: "'Righteous', sans-serif", body: "'Quicksand', sans-serif" },
};
for (const [id, f] of Object.entries(FONTS)) f.id = id;

// Seasonal wording for the sabbat gathering, picked by the event date.
const SABBAT_WORDS = {
  samhain: { badge: 'Samhain · the veil grows thin', greeting: 'By candle and by moonlight, you are summoned…', yes: 'I shall attend 🕯️', closing: 'Yours beyond the veil,' },
  yule: { badge: 'Yule · return of the sun', greeting: 'On the longest night, let us make our own light…', yes: 'Count me in ❄', closing: 'Warmly, by the Yule fire,' },
  imbolc: { badge: 'Imbolc · first stirrings of spring', greeting: 'As Brigid’s flame wakes the sleeping earth…', yes: 'Yes, light the candle 🕯️', closing: 'With a kindled heart,' },
  ostara: { badge: 'Ostara · balance & bloom', greeting: 'Day and night stand in balance — and the garden is waking…', yes: 'Yes! Let’s bloom 🌷', closing: 'Blossoming with joy,' },
  beltane: { badge: 'Beltane · fire & flowers', greeting: 'The bonfires are lit and the may is in bloom…', yes: 'Yes, I’ll dance 🔥', closing: 'Ever-blooming,' },
  litha: { badge: 'Litha · midsummer’s light', greeting: 'On the longest day, the sun lingers just for us…', yes: 'Yes, sunshine! ☀️', closing: 'Sun-kissed & smiling,' },
  lughnasadh: { badge: 'Lughnasadh · the first harvest', greeting: 'The grain is golden and the bread is baking…', yes: 'I’ll gather with you 🌾', closing: 'With gratitude for the harvest,' },
  mabon: { badge: 'Mabon · gratitude & golden leaves', greeting: 'As the leaves turn and the wheel tips toward the dark…', yes: 'Yes, let’s cozy up 🍁', closing: 'Gratefully yours,' },
};

// mods/asks pre-fill the details; everything else is wording.
export const TEMPLATES = [
  { id: 'dinner', icon: '🍷', label: 'Dinner date', title: 'Dinner for two', font: 'classic',
    badge: 'A table for two', greeting: 'A candle, a table, and a seat saved just for you…', yes: 'It’s a date 🌹', closing: 'Yours,',
    mods: { dress: 'Smart casual', cost: 'My treat ✨', transport: 'I’ll pick you up', vibe: 'Romantic' }, asks: ['diet'] },
  { id: 'picnic', icon: '🧺', label: 'Picnic', title: 'A picnic in the park', font: 'sunny',
    badge: 'Sunshine & strawberries', greeting: 'A blanket, a basket, and a lazy afternoon…', yes: 'Yes, pack the basket 🧺', closing: 'Sweet as strawberries,',
    mods: { dress: 'Comfy & cozy', bring: 'Just yourself', food: 'Snacks provided', weather: 'Mostly outdoors' }, asks: ['diet', 'drink'] },
  { id: 'stars', icon: '🔭', label: 'Stargazing', title: 'A night under the stars', font: 'storybook',
    badge: 'Wish upon it', greeting: 'The stars have aligned, and they spell out your name…', yes: 'Yes, under the stars ✨', closing: 'Yours under the stars,',
    mods: { dress: 'Comfy & cozy', bring: 'A warm layer', weather: 'Could be chilly — bring layers', activity: 'Totally chill' }, asks: ['drink'] },
  { id: 'adventure', icon: '🥾', label: 'Adventure', title: 'An adventure awaits', font: 'rustic',
    badge: 'Into the wild', greeting: 'The trail is calling, and it said to bring you…', yes: 'Adventure accepted 🥾', closing: 'See you out there,',
    mods: { dress: 'Outdoor-ready', bring: 'Water bottle', activity: 'Moderate', weather: 'Might get muddy' }, asks: [] },
  { id: 'cozy', icon: '🍿', label: 'Movie night', title: 'Movie night in', font: 'handwritten',
    badge: 'Blankets mandatory', greeting: 'Soft lights, warm drinks, and absolutely no plans to go out…', yes: 'Yes, I’ll bring socks 🧦', closing: 'Cozily,',
    mods: { dress: 'Comfy & cozy', food: 'Snacks provided', vibe: 'Low-key' }, asks: ['drink', 'wish'] },
  { id: 'show', icon: '🎭', label: 'Show / concert', title: 'A night at the show', font: 'marquee',
    badge: 'Curtain up', greeting: 'The lights dim, the crowd hushes — and there’s a seat next to mine…', yes: 'Save me that seat 🎟️', closing: 'See you in the front row,',
    mods: { dress: 'Dressy', cost: 'Tickets are covered', transport: 'Let’s ride together', link: { l: 'Our tickets', u: '' } }, asks: [] },
  { id: 'party', icon: '🎉', label: 'Party', title: 'You’re invited to celebrate!', font: 'playful',
    badge: 'Let’s make some noise', greeting: 'Grab your best grin — there’s a party and you’re on the list…', yes: 'Wouldn’t miss it 🎉', closing: 'Let’s celebrate,',
    mods: { guests: 'Bring a friend', bring: 'Just yourself', dress: 'Wear something you love' }, asks: ['song'] },
  { id: 'medieval', icon: '🏰', label: 'Royal feast', title: 'A royal feast', font: 'blackletter',
    badge: 'By royal decree', greeting: 'Hear ye, hear ye! Thy presence is humbly requested…', yes: 'I accept, my liege ⚔️', maybe: 'Another day, perchance?', no: 'Alas, I cannot', closing: 'By my hand and seal,',
    mods: { dress: 'Costume encouraged', food: 'Dinner included', vibe: 'Playful' }, asks: ['drink'] },
  { id: 'cats', icon: '🐈', label: 'Cat date', title: 'A date with cats', font: 'kitten',
    badge: 'Purrs guaranteed', greeting: 'Purr-haps you’d like to spend some time with me (and the cats)…', yes: 'Yes, meow! 🐾', maybe: 'Paws for another time?', no: 'Sadly, I can’t', closing: 'Purrs & headbutts,',
    mods: { vibe: 'Low-key', kidspets: 'Pet-friendly' }, asks: ['drink'] },
  { id: 'sabbat', icon: '🕯️', label: 'Sabbat gathering', title: 'Gather for the turning of the wheel', font: 'celtic', seasonal: true,
    closing: 'Blessed be,',
    mods: { bring: 'A dish to share', dress: 'Wear something you love', vibe: 'Witchy', guests: 'Small group' }, asks: ['diet'] },
  { id: 'coffee', icon: '☕', label: 'Coffee date', title: 'Coffee & conversation', font: 'handwritten',
    badge: 'Two cups, one table', greeting: 'I know a little place with very good coffee…', yes: 'Yes, I’ll grab a seat ☕', closing: 'Over a warm cup,',
    mods: { cost: 'My treat ✨', vibe: 'Low-key' }, asks: [] },
  { id: 'beach', icon: '🌊', label: 'Beach day', title: 'A day by the sea', font: 'sunny',
    badge: 'Salt air & sunshine', greeting: 'The tide sent a message in a bottle — and it’s for you…', yes: 'Yes, see you at the shore 🌊', closing: 'Sea you soon,',
    mods: { bring: 'Swimsuit & towel', weather: 'Sunny — bring shades', food: 'Snacks provided' }, asks: [] },
  { id: 'fae', icon: '🍄', label: 'Fairy-tale outing', title: 'Into the enchanted wood', font: 'storybook',
    badge: 'Where the fae dance', greeting: 'A little bird (a fairy, really) asked me to deliver this…', yes: 'Lead me to the glade ✨', closing: 'Enchantedly,',
    mods: { dress: 'Costume encouraged', vibe: 'Playful', activity: 'A little walking' }, asks: [] },
  { id: 'surprise', icon: '🎁', label: 'Surprise', title: 'A surprise outing', font: 'script',
    badge: 'Shh… it’s a surprise', greeting: 'I can’t tell you much — only that you’ll want to say yes…', yes: 'I trust you — yes! 🎁', closing: 'Mysteriously yours,',
    mods: { surprise: 'Total surprise — trust me', dress: 'Smart casual' }, asks: ['pickup'] },
  { id: 'custom', icon: '✨', label: 'Something else', title: '', font: 'storybook',
    badge: 'An invitation', greeting: 'A little bit of magic, just for you…', yes: 'Yes, I’d love to ✨', closing: 'Yours,',
    mods: {}, asks: [] },
];
export const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATES.map(t => [t.id, t]));

// Every editable line. `def` builds the default from the invite and the occasion's words.
export const WORDING = [
  { group: 'On the outside', key: 'for', label: 'Above the envelope', def: inv => (inv.to ? `For ${inv.to}` : 'For you') },
  { group: 'On the outside', key: 'tap', label: 'Tap hint', def: () => 'Tap to open ✨' },
  { group: 'On the outside', key: 'fromLine', label: 'Below the envelope', def: inv => (inv.from ? `from ${inv.from}` : '') },
  { group: 'On the card', key: 'badge', label: 'Banner at the top', def: (inv, w) => w.badge },
  { group: 'On the card', key: 'dear', label: 'Salutation', def: inv => (inv.to ? `Dear ${inv.to},` : '') },
  { group: 'On the card', key: 'greet', label: 'Greeting', def: (inv, w) => w.greeting },
  { group: 'On the card', key: 'moon', label: 'Moon line (blank = hide)', def: (inv, w, extra) => extra?.moon ?? '' },
  { group: 'On the card', key: 'by', label: 'Reply-by line', def: () => 'Kindly reply by' },
  { group: 'On the card', key: 'close', label: 'Closing line', def: (inv, w) => w.closing },
  { group: 'Reply buttons', key: 'ask', label: 'Question', def: inv => `Will you join${inv.from ? ` ${inv.from}` : ''}?` },
  { group: 'Reply buttons', key: 'yes', label: 'Yes button', def: (inv, w) => w.yes },
  { group: 'Reply buttons', key: 'maybe', label: 'Maybe button', def: (inv, w) => w.maybe },
  { group: 'Reply buttons', key: 'no', label: 'No button', def: (inv, w) => w.no },
  { group: 'After they answer', key: 'yesH', label: 'Yes — heading', def: () => 'Hooray! ✨' },
  { group: 'After they answer', key: 'yesP', label: 'Yes — message', def: inv => `${inv.from ? `${inv.from} will be` : 'They’ll be'} so happy.` },
  { group: 'After they answer', key: 'maybeH', label: 'Maybe — heading', def: () => 'Another time? 🌙' },
  { group: 'After they answer', key: 'maybeP', label: 'Maybe — message', def: () => 'No worries — suggest what works for you.' },
  { group: 'After they answer', key: 'noH', label: 'No — heading', def: () => 'Maybe next time 💌' },
  { group: 'After they answer', key: 'noP', label: 'No — message', def: () => 'It’s kind to let them know.' },
];

// The occasion's words (seasonal ones depend on the date).
export function occasionWords(inv) {
  const t = TEMPLATE_BY_ID[inv.k] || TEMPLATE_BY_ID.custom;
  const season = t.seasonal ? SABBAT_WORDS[seasonOf(inv)] : {};
  const base = TEMPLATE_BY_ID.custom;
  return {
    badge: season.badge || t.badge || base.badge,
    greeting: season.greeting || t.greeting || base.greeting,
    yes: season.yes || t.yes || base.yes,
    maybe: t.maybe || 'Maybe — another time?',
    no: t.no || 'Sadly, I can’t',
    closing: inv.cl || season.closing || t.closing || base.closing,
    font: t.font,
  };
}

// The full text of an invitation, with the sender's overrides applied.
// `extra` supplies computed defaults (the moon line).
export function wording(inv, extra = {}) {
  const w = occasionWords(inv);
  const tx = inv.tx && typeof inv.tx === 'object' ? inv.tx : {};
  const out = {};
  for (const f of WORDING) {
    const v = tx[f.key];
    out[f.key] = typeof v === 'string' ? v.trim() : String(f.def(inv, w, extra) ?? '');
  }
  return out;
}

// A look merged with its lettering — everything render code needs for styling.
export function resolveTheme(inv) {
  const look = resolveLook(inv);
  const font = FONTS[inv.fn] || FONTS[occasionWords(inv).font] || FONTS.storybook;
  return { ...look, display: font.display, body: font.body, fontId: font.id };
}

export { THEMES };
