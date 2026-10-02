// Looks: the colors, particles and default materials of an invitation. Looks
// are grouped into categories for the picker. Wording and lettering come from
// the occasion (see occasions.js), not from the look.

export const LOOK_CATEGORIES = [
  { id: 'romantic', label: 'Romantic', icon: '🌹' },
  { id: 'seasonal', label: 'Seasonal', icon: '🍂' },
  { id: 'nature', label: 'Nature', icon: '🌿' },
  { id: 'medieval', label: 'Medieval', icon: '🏰' },
  { id: 'storybook', label: 'Storybook', icon: '🪄' },
  { id: 'sky', label: 'Sky', icon: '🌌' },
  { id: 'cats', label: 'Cats', icon: '🐈‍⬛' },
  { id: 'party', label: 'Parties', icon: '🎉' },
  { id: 'stage', label: 'Stage', icon: '🎭' },
  { id: 'dark', label: 'Dark side', icon: '🖤' },
  { id: 'afterdark', label: 'After dark', icon: '🗝️' },
  { id: 'night', label: 'Night & glam', icon: '✨' },
];

// pattern: the motif used on envelope liners, gift wrap and "Look's own" backgrounds.
// wax / waxFace: the default seal (a wax color id and an emblem finish id).
export const THEMES = {
  // ── Romantic ─────────────────────────────────────────────────────────
  candlelit: {
    name: 'Candlelit', cat: 'romantic', tagline: 'Wine-dark & gold', glyph: '🕯',
    bg: ['#1c0b10', '#4a0f1e'], card: '#fbf3ea', ink: '#3a0d17', accent: '#a4161a', accent2: '#b8902a', onAccent: '#fff6ea',
    particles: ['🕯️', '🌹', '✦', '🍷', '✧'], seal: '@heart', divider: '✦ 🌹 ✦',
    pattern: 'damask', wax: 'scarlet', waxFace: 'gold', paper: 'cotton', corners: 'filigree', rule: 'flourish', scene: 'candles', sides: 'thorns', wrap: 'envelope',
  },
  blush: {
    name: 'Blush & Gold', cat: 'romantic', tagline: 'Soft pink, gilded edges', glyph: '❦',
    bg: ['#f6d5d9', '#e8b4bc'], card: '#fffaf7', ink: '#5b2a35', accent: '#b5485d', accent2: '#c39a4b', onAccent: '#ffffff',
    particles: ['🌸', '✧', '💗', '✦', '🕊️'], seal: '@blossom', divider: '✧ ❦ ✧',
    pattern: 'hearts', wax: 'rose', waxFace: 'gold', paper: 'watercolor', corners: 'floral', rule: 'swash', scene: 'garden', sides: 'pearls', wrap: 'envelope',
  },
  velvet: {
    name: 'Midnight Velvet', cat: 'romantic', tagline: 'Plum, rose & candle-glow', glyph: '❧',
    bg: ['#1a0d24', '#4a1942'], card: '#2a1530', ink: '#f6e6ee', accent: '#e58fb0', accent2: '#d6b25e', onAccent: '#2a1530', dark: true,
    particles: ['🌹', '✦', '🕯️', '✧', '🍷'], seal: '@rose', divider: '✦ ❧ ✦',
    pattern: 'damask', wax: 'burgundy', waxFace: 'gold', paper: 'smooth', corners: 'filigree', rule: 'flourish', scene: 'candles', sides: 'rope', wrap: 'book',
  },

  // ── Seasonal: the Wheel of the Year ──────────────────────────────────
  samhain: {
    name: 'Samhain', cat: 'seasonal', tagline: 'The veil grows thin', glyph: '☾',
    bg: ['#140a18', '#3b1a2e'], card: '#221320', ink: '#f3e6d0', accent: '#e8742a', accent2: '#b48cf2', onAccent: '#1a0f1f', dark: true,
    particles: ['🦇', '🍂', '🕯️', '✦', '🌙'], seal: '@crescent', divider: '✦ ☾ ✦',
    pattern: 'stars', wax: 'black', waxFace: 'copper', paper: 'parchment', corners: 'celestial', rule: 'flourish', scene: 'stones', sides: 'thorns', wrap: 'owl',
  },
  yule: {
    name: 'Yule', cat: 'seasonal', tagline: 'Return of the sun', glyph: '❄',
    bg: ['#0b231d', '#16473a'], card: '#f8f2e4', ink: '#1f3b2d', accent: '#b3262e', accent2: '#b8902a', onAccent: '#fff8ea',
    particles: ['❄', '✧', '🌲', '❅', '✦'], seal: '@holly', wrap: 'gift', divider: '❄ ✧ ❄',
    pattern: 'snow', wax: 'scarlet', waxFace: 'gold', paper: 'linen', corners: 'floral', rule: 'vine', scene: 'snowpines', sides: 'vine',
  },
  imbolc: {
    name: 'Imbolc', cat: 'seasonal', tagline: 'First stirrings of spring', glyph: '✧',
    bg: ['#dfe7f1', '#f6f1ea'], card: '#ffffff', ink: '#2c3e57', accent: '#c94f4f', accent2: '#7fa7d1', onAccent: '#ffffff',
    particles: ['🕯️', '❄', '🌱', '✧', '🐑'], seal: '@candle', divider: '✧ 🕯 ✧',
    pattern: 'snow', wax: 'ivory', waxFace: 'silver', paper: 'cotton', corners: 'none', rule: 'swash', scene: 'snowpines', sides: 'frame', wrap: 'envelope',
  },
  ostara: {
    name: 'Ostara', cat: 'seasonal', tagline: 'Balance & bloom', glyph: '✿',
    bg: ['#fde7f1', '#e3f5e8'], card: '#fffdf7', ink: '#4a3b52', accent: '#d9649a', accent2: '#6fbf8a', onAccent: '#ffffff',
    particles: ['🌷', '🥚', '🐇', '🌼', '🦋'], seal: '@egg', divider: '✿ 🐇 ✿',
    pattern: 'blossoms', wax: 'lavender', waxFace: 'pearl', paper: 'watercolor', corners: 'floral', rule: 'vine', scene: 'garden', sides: 'vine', wrap: 'gift',
  },
  beltane: {
    name: 'Beltane', cat: 'seasonal', tagline: 'Fire & flowers', glyph: '❀',
    bg: ['#ffd6e4', '#ffc999'], card: '#fff8f2', ink: '#5a1e3a', accent: '#d81b60', accent2: '#2e8b57', onAccent: '#ffffff',
    particles: ['🌸', '🔥', '🌺', '✿', '🎀'], seal: '@flame', divider: '✿ 🔥 ✿',
    pattern: 'blossoms', wax: 'rose', waxFace: 'gold', paper: 'watercolor', corners: 'floral', rule: 'vine', scene: 'garden', sides: 'vine', wrap: 'scroll',
  },
  litha: {
    name: 'Litha', cat: 'seasonal', tagline: 'Midsummer’s golden light', glyph: '☀',
    bg: ['#fff1b8', '#ffc94a'], card: '#fffdf2', ink: '#5b3a00', accent: '#d97a00', accent2: '#1fa595', onAccent: '#ffffff',
    particles: ['☀️', '🌻', '🐝', '✦', '🌼'], seal: '@sun', divider: '✦ ☀ ✦',
    pattern: 'blossoms', wax: 'gold', waxFace: 'pressed', paper: 'linen', corners: 'deco', rule: 'swash', scene: 'stones', sides: 'frame', wrap: 'bottle',
  },
  lughnasadh: {
    name: 'Lughnasadh', cat: 'seasonal', tagline: 'The first harvest', glyph: '🌾',
    bg: ['#f4e3c1', '#d9a95b'], card: '#fff8ea', ink: '#4a2e12', accent: '#a85a1b', accent2: '#5f7f1f', onAccent: '#fff8ea',
    particles: ['🌾', '🍞', '🌻', '✦', '🍯'], seal: '@wheat', wrap: 'scroll', divider: '🌾 ✦ 🌾',
    pattern: 'leaves', wax: 'bronze', waxFace: 'pressed', paper: 'parchment', corners: 'floral', rule: 'vine', scene: 'harvest', sides: 'vine',
  },
  mabon: {
    name: 'Mabon', cat: 'seasonal', tagline: 'Gratitude & golden leaves', glyph: '🍁',
    bg: ['#3d1f0f', '#8a3b12'], card: '#fbf1e1', ink: '#3d1f0f', accent: '#b8461a', accent2: '#7a1f2b', onAccent: '#fff6ea',
    particles: ['🍁', '🍂', '🍎', '🍇', '✦'], seal: '@mapleleaf', divider: '🍂 ✦ 🍂',
    pattern: 'leaves', wax: 'copper', waxFace: 'gold', paper: 'parchment', corners: 'floral', rule: 'flourish', scene: 'harvest', sides: 'vine', wrap: 'chest',
  },

  halloween: {
    name: 'Halloween', cat: 'seasonal', tagline: 'Jack-o’-lanterns & haunted moons', glyph: '🎃',
    bg: ['#0d0716', '#2b1240'], card: '#161019', ink: '#f6e9d8', accent: '#ff7a1a', accent2: '#a07ad6', onAccent: '#1a0d05', dark: true,
    particles: ['🎃', '🦇', '👻', '🕸️', '🍬', '🌕'], seal: '@pumpkin', divider: '🦇 🎃 🦇', wrap: 'chest', glow: '#ff7a1a',
    pattern: 'bats', scene: 'haunted', wax: 'black', waxFace: 'copper', paper: 'speckled', corners: 'web', rule: 'swash', sides: 'thorns',
  },

  // ── Nature ───────────────────────────────────────────────────────────
  picnic: {
    name: 'Garden Picnic', cat: 'nature', tagline: 'Sunshine & strawberries', glyph: '🧺',
    bg: ['#e4f6d9', '#fff3d6'], card: '#fffef8', ink: '#2f4a2a', accent: '#d94f3d', accent2: '#6aa84f', onAccent: '#ffffff',
    particles: ['🌼', '🍓', '🐞', '🦋', '🌿'], seal: '@strawberry', divider: '🌼 ✿ 🌼',
    pattern: 'gingham', wax: 'scarlet', waxFace: 'pearl', paper: 'linen', corners: 'floral', rule: 'vine', scene: 'garden', sides: 'stitch', wrap: 'gift',
  },
  adventure: {
    name: 'Wild Adventure', cat: 'nature', tagline: 'Into the wild', glyph: '🧭',
    bg: ['#1d3328', '#4f6d4a'], card: '#f5efe0', ink: '#22332a', accent: '#c46f1f', accent2: '#4f7cac', onAccent: '#ffffff',
    particles: ['🌲', '🍃', '🧭', '⛰️', '🦉'], seal: '@compass', wrap: 'map', divider: '🌲 ✦ 🌲',
    pattern: 'leaves', wax: 'forest', waxFace: 'bronze', paper: 'parchment', corners: 'none', rule: 'swash', scene: 'trail', sides: 'rope',
  },
  enchanted: {
    name: 'Enchanted Forest', cat: 'storybook', tagline: 'Where the fae dance', glyph: '🍄',
    bg: ['#0c2418', '#2f5d50'], card: '#112a1f', ink: '#e6f5e0', accent: '#c3f584', accent2: '#f5b0e0', onAccent: '#112a1f', dark: true,
    particles: ['🍄', '✨', '🧚', '🌿', '🦋'], seal: '@mushroom', wrap: 'book', divider: '🌿 ✧ 🌿',
    pattern: 'leaves', wax: 'forest', waxFace: 'gold', paper: 'smooth', corners: 'floral', rule: 'vine', scene: 'moonwood', sides: 'vine',
  },
  seaside: {
    name: 'Seaside', cat: 'nature', tagline: 'Salt air & sunshine', glyph: '🐚',
    bg: ['#d6f1f6', '#8fd3e8'], card: '#fffdf8', ink: '#0c3c4c', accent: '#e0603a', accent2: '#2a9d8f', onAccent: '#ffffff',
    particles: ['🐚', '🌊', '🐠', '⭐', '☀️'], seal: '@shell', wrap: 'bottle', divider: '〰 🐚 〰',
    pattern: 'waves', wax: 'teal', waxFace: 'pearl', paper: 'watercolor', corners: 'none', rule: 'swash', scene: 'shore', sides: 'rope',
  },

  // ── Medieval ─────────────────────────────────────────────────────────
  royal: {
    name: 'Royal Court', cat: 'medieval', tagline: 'Crimson, ermine & gold', glyph: '♛',
    bg: ['#2a0710', '#6b0f22'], card: '#f6ecd6', ink: '#3a1010', accent: '#8e1420', accent2: '#b08a2e', onAccent: '#fff4dc',
    particles: ['⚜️', '👑', '✦', '🗝️', '✧'], seal: '@crown', wrap: 'scroll', divider: '⚜ ✦ ⚜',
    pattern: 'damask', scene: 'damask', wax: 'scarlet', waxFace: 'gold', paper: 'parchment', corners: 'gothic', rule: 'flourish', sides: 'frame',
  },
  castle: {
    name: 'Castle Keep', cat: 'medieval', tagline: 'Stone, steel & banners', glyph: '♜',
    bg: ['#1f2630', '#4a5568'], card: '#ece6d8', ink: '#22262e', accent: '#2f4b8a', accent2: '#8a7a55', onAccent: '#ffffff',
    particles: ['🛡️', '⚔️', '🏰', '✦', '🐉'], seal: '@shield', wrap: 'chest', divider: '⚔ ✦ ⚔',
    pattern: 'stone', scene: 'stone', wax: 'navy', waxFace: 'silver', paper: 'parchment', corners: 'gothic', rule: 'rule', sides: 'frame',
  },
  manuscript: {
    name: 'Illuminated', cat: 'medieval', tagline: 'Gilded letters & vines', glyph: '❦',
    bg: ['#3b2a1a', '#6e4f2c'], card: '#f3e5c4', ink: '#2e1f10', accent: '#a3201a', accent2: '#1f4e8c', onAccent: '#fff6e0',
    particles: ['📜', '🪶', '✦', '🌿', '✧'], seal: '@fleur', wrap: 'scroll', divider: '❦ ✦ ❦',
    pattern: 'damask', wax: 'burgundy', waxFace: 'gold', paper: 'parchment', corners: 'gothic', sides: 'vine', rule: 'vine', scene: 'damask',
  },

  // ── Cats ─────────────────────────────────────────────────────────────
  blackcat: {
    name: 'Black Cat', cat: 'cats', tagline: 'Moonlight & golden eyes', glyph: '🐈‍⬛',
    bg: ['#120d1e', '#33244d'], card: '#1d1630', ink: '#f2ecff', accent: '#f0c64a', accent2: '#a98be0', onAccent: '#1d1630', dark: true,
    particles: ['🐈‍⬛', '🌙', '✦', '🐾', '✧'], seal: '@cat', divider: '✦ 🐾 ✦',
    pattern: 'paws', wax: 'black', waxFace: 'gold', paper: 'smooth', corners: 'celestial', rule: 'swash', scene: 'rooftops', sides: 'paws', wrap: 'owl',
  },
  calico: {
    name: 'Calico', cat: 'cats', tagline: 'Ginger, cream & cocoa', glyph: '🐈',
    bg: ['#f7e7d2', '#e8b98a'], card: '#fffaf2', ink: '#4a2f1c', accent: '#c8642a', accent2: '#6b4a32', onAccent: '#ffffff',
    particles: ['🐈', '🧶', '🐾', '🐟', '✦'], seal: '@paw', divider: '🐾 ✦ 🐾',
    pattern: 'paws', scene: 'paws', wax: 'copper', waxFace: 'pearl', paper: 'linen', corners: 'paws', rule: 'swash', sides: 'paws', wrap: 'gift',
  },
  kitten: {
    name: 'Kitten Pastel', cat: 'cats', tagline: 'Pink noses & yarn', glyph: '🐱',
    bg: ['#fde4ef', '#e6dcff'], card: '#fffbfe', ink: '#4b3660', accent: '#d36a9e', accent2: '#8f7ad6', onAccent: '#ffffff',
    particles: ['🐱', '🧶', '💗', '🐾', '✧'], seal: '@catface', divider: '✧ 🐾 ✧',
    pattern: 'paws', scene: 'paws', wax: 'rose', waxFace: 'pearl', paper: 'watercolor', corners: 'paws', rule: 'swash', sides: 'paws', wrap: 'gift',
  },
  catcafe: {
    name: 'Cat Café', cat: 'cats', tagline: 'Lattes & lap cats', glyph: '☕',
    bg: ['#3b2a22', '#7a5641'], card: '#fbf3e8', ink: '#3b2a22', accent: '#9c5a3c', accent2: '#c39a4b', onAccent: '#ffffff',
    particles: ['☕', '🐈', '🐾', '🥐', '✦'], seal: '@cat', divider: '☕ 🐾 ☕',
    pattern: 'paws', wax: 'bronze', waxFace: 'gold', paper: 'cotton', corners: 'paws', rule: 'flourish', scene: 'fireside', sides: 'stitch', wrap: 'envelope',
  },

  // ── Storybook ────────────────────────────────────────────────────────
  wizard: {
    name: 'Wizard’s Academy', cat: 'storybook', tagline: 'Spellbooks, candles & stardust', glyph: '✦',
    bg: ['#120a24', '#3a1d5c'], card: '#f3e7cb', ink: '#2a1a3a', accent: '#5b2a86', accent2: '#b8902a', onAccent: '#fff6e0',
    particles: ['🕯️', '✨', '🔮', '📜', '⭐'], seal: '@wizardhat', divider: '✦ ☾ ✦', wrap: 'owl',
    pattern: 'magic', scene: 'magic', wax: 'purple', waxFace: 'gold', paper: 'parchment', corners: 'celestial', rule: 'flourish', sides: 'frame',
  },
  dragon: {
    name: 'Dragon’s Hoard', cat: 'storybook', tagline: 'Emerald scales & dragon gold', glyph: '🐉',
    bg: ['#06180f', '#14402a'], card: '#f4ead2', ink: '#1c2a1f', accent: '#1e6b45', accent2: '#c39a2e', onAccent: '#fff6e0',
    particles: ['🐉', '💎', '🪙', '🔥', '✦'], seal: '@dragon', divider: '✦ 🐉 ✦', wrap: 'chest',
    pattern: 'scales', scene: 'scales', wax: 'forest', waxFace: 'gold', paper: 'parchment', corners: 'gothic', rule: 'flourish', sides: 'thorns',
  },
  woodland: {
    name: 'Woodland Tea', cat: 'storybook', tagline: 'Acorns, mushrooms & a pot of tea', glyph: '🍄',
    bg: ['#e9dcc0', '#b9c79a'], card: '#fffaf0', ink: '#3a2c1c', accent: '#a04a2a', accent2: '#5d7a3a', onAccent: '#ffffff',
    particles: ['🍄', '🌰', '🦔', '🦊', '🍃', '🫖'], seal: '@teacup', divider: '🌰 🍄 🌰', wrap: 'gift',
    pattern: 'woodland', scene: 'woodland', wax: 'sage', waxFace: 'bronze', paper: 'linen', corners: 'branch', rule: 'vine', sides: 'vine',
  },

  fellowship: {
    name: 'The Fellowship', cat: 'storybook', tagline: 'A Lord of the Rings–style quest', glyph: '🍃',
    bg: ['#0d1a14', '#33402e'], card: '#f2e6c8', ink: '#2a2216', accent: '#2f5d3a', accent2: '#b8923e', onAccent: '#fff6e0',
    particles: ['🍃', '💍', '⭐', '🗡️', '🏔️', '🌿'], seal: '@ring', divider: '✦ 🍃 ✦', wrap: 'map',
    pattern: 'elvish', scene: 'middleearth', wax: 'forest', waxFace: 'gold', paper: 'parchment', corners: 'elven', sides: 'elvenvine', rule: 'vine',
  },

  // ── Sky ──────────────────────────────────────────────────────────────
  constellation: {
    name: 'Constellation', cat: 'sky', tagline: 'Star charts & golden lines', glyph: '✧',
    bg: ['#060b22', '#14214f'], card: '#0d1636', ink: '#e8ecff', accent: '#f0c75e', accent2: '#8fa3e8', onAccent: '#0d1636', dark: true,
    particles: ['✦', '✧', '⋆', '☄️', '🌙'], seal: '@constellation', divider: '⋆ ✧ ⋆', wrap: 'envelope',
    pattern: 'constellations', scene: 'constellations', wax: 'navy', waxFace: 'gold', paper: 'smooth', corners: 'stars', rule: 'rule', sides: 'frame',
  },
  aurora: {
    name: 'Aurora', cat: 'sky', tagline: 'Northern lights over the pines', glyph: '❄',
    bg: ['#04121c', '#0f2a3a'], card: '#0b1d27', ink: '#e8fbf6', accent: '#5ff2c2', accent2: '#b59cff', onAccent: '#04121c', dark: true,
    particles: ['✦', '❄', '✧', '🌲', '💫'], seal: '@snowflake', divider: '✧ ❄ ✧', wrap: 'bottle', glow: '#5ff2c2',
    pattern: 'snow', scene: 'aurora', wax: 'teal', waxFace: 'silver', paper: 'smooth', corners: 'celestial', rule: 'swash', sides: 'frame',
  },

  // ── Stage ────────────────────────────────────────────────────────────
  midsummer: {
    name: 'A Midsummer Night’s Dream', cat: 'stage', tagline: 'A moonlit wood, fairies & mischief', glyph: '☾',
    bg: ['#0a1630', '#2b2a5e'], card: '#f6f0e2', ink: '#24233f', accent: '#6b4aa8', accent2: '#b89a4a', onAccent: '#ffffff',
    particles: ['🧚', '✨', '🌙', '🌸', '🦋', '🍃'], seal: '@donkey', divider: '✧ ☾ ✧', wrap: 'scroll',
    pattern: 'midsummer', scene: 'moonwood', wax: 'lavender', waxFace: 'gold', paper: 'vellum', corners: 'floral', sides: 'vine', rule: 'vine',
  },
  theatre: {
    name: 'Theatre Night', cat: 'stage', tagline: 'Red velvet, gilt & curtain up', glyph: '🎭',
    bg: ['#1c0408', '#4f0d18'], card: '#f7eedb', ink: '#2b1014', accent: '#9b1b2c', accent2: '#c9a24a', onAccent: '#fff6e6',
    particles: ['🎭', '🌹', '🎟️', '✨', '⭐'], seal: '@masks', divider: '✦ 🎭 ✦', wrap: 'book',
    pattern: 'masks', scene: 'curtain', wax: 'burgundy', waxFace: 'gold', paper: 'cotton', corners: 'filigree', sides: 'frame', rule: 'flourish',
  },
  musical: {
    name: 'Broadway Musical', cat: 'stage', tagline: 'Marquee lights & a showstopper', glyph: '♪',
    bg: ['#0c0814', '#2a1238'], card: '#1a1026', ink: '#fff4dc', accent: '#f4c24c', accent2: '#ff5d8f', onAccent: '#1a1026', dark: true,
    particles: ['🎶', '🎵', '⭐', '🎤', '✨', '💃'], seal: '@note', divider: '♪ ★ ♪', wrap: 'gift', glow: '#ffcf6a',
    pattern: 'notes', scene: 'marquee', wax: 'gold', waxFace: 'black', paper: 'silk', corners: 'deco', rule: 'swash', sides: 'bulbs',
  },

  nocturne: {
    name: 'The Nocturne', cat: 'stage', tagline: 'A Halloween burlesque soirée', glyph: '❦',
    bg: ['#08030a', '#2c0716'], card: '#130910', ink: '#f8e9e4', accent: '#c8173d', accent2: '#d9a95b', onAccent: '#ffffff', dark: true,
    particles: ['🦇', '🌹', '💋', '🥂', '🕯️', '✨'], seal: '@lips', divider: '✦ ❦ ✦', wrap: 'book',
    pattern: 'fishnet', scene: 'burlesque', wax: 'scarlet', waxFace: 'gold', paper: 'silk', corners: 'rhinestone', sides: 'plumes', rule: 'swash',
  },

  // ── Parties & nights out ─────────────────────────────────────────────
  speakeasy: {
    name: 'Speakeasy', cat: 'party', tagline: 'Emerald, brass & jazz', glyph: '🍸',
    bg: ['#0c1c17', '#1d3b30'], card: '#f4ecd8', ink: '#1d2b24', accent: '#1f5c45', accent2: '#b8902a', onAccent: '#fff8e6',
    particles: ['🍸', '🥃', '🎷', '✦', '🍒'], seal: '@martini', divider: '✦ 🍸 ✦', wrap: 'telegram',
    pattern: 'cocktails', scene: 'sunburst', wax: 'forest', waxFace: 'gold', paper: 'cotton', corners: 'deco', sides: 'frame', rule: 'rule',
  },
  neon: {
    name: 'Neon Club', cat: 'party', tagline: 'Hot pink & electric blue', glyph: '★',
    bg: ['#07040f', '#1a0533'], card: '#120a24', ink: '#f4ecff', accent: '#ff3fd8', accent2: '#2ee6ff', onAccent: '#120a24', dark: true,
    particles: ['💃', '🪩', '✨', '🎧', '💜'], seal: '@star', divider: '✦ ★ ✦', wrap: 'gift', glow: '#ff3fd8',
    pattern: 'disco', scene: 'neon', wax: 'black', waxFace: 'silver', paper: 'smooth', corners: 'deco', rule: 'swash', sides: 'rhinestones',
  },
  disco: {
    name: 'Disco Fever', cat: 'party', tagline: 'Mirror balls & sequins', glyph: '✧',
    bg: ['#2a0a4a', '#7a1fa2'], card: '#fdf7ff', ink: '#3a1450', accent: '#c2187a', accent2: '#8d95ab', onAccent: '#ffffff',
    particles: ['🪩', '✨', '💃', '🕺', '⭐'], seal: '@discoball', divider: '✧ 🪩 ✧', wrap: 'gift',
    pattern: 'disco', scene: 'bokeh', wax: 'silver', waxFace: 'pressed', paper: 'smooth', corners: 'deco', rule: 'swash', sides: 'rhinestones',
  },
  gamenight: {
    name: 'Game Night', cat: 'party', tagline: 'Dice, cards & snacks', glyph: '♟',
    bg: ['#13233f', '#24467a'], card: '#fffaf0', ink: '#1d2a44', accent: '#d23f2e', accent2: '#e0a91c', onAccent: '#ffffff',
    particles: ['🎲', '♟️', '🃏', '🧩', '⭐'], seal: '@die', divider: '♠ ♥ ♣ ♦', wrap: 'chest',
    pattern: 'dice', scene: 'dice', wax: 'royal', waxFace: 'gold', paper: 'smooth', corners: 'none', sides: 'frame', rule: 'rule',
  },
  birthday: {
    name: 'Birthday Bash', cat: 'party', tagline: 'Cake, candles & balloons', glyph: '🎂',
    bg: ['#ffd1e8', '#c9e7ff'], card: '#ffffff', ink: '#4a2a5c', accent: '#e2457a', accent2: '#3fa7d6', onAccent: '#ffffff',
    particles: ['🎂', '🎈', '🎁', '🎉', '✨'], seal: '@cake', divider: '🎈 ✦ 🎈', wrap: 'gift',
    pattern: 'confetti', scene: 'confetti', wax: 'rose', waxFace: 'gold', paper: 'watercolor', corners: 'none', rule: 'swash', sides: 'beads',
  },
  tiki: {
    name: 'Tiki Bar', cat: 'party', tagline: 'Rum, hibiscus & palms', glyph: '🌺',
    bg: ['#ff8a4c', '#1f9e90'], card: '#fff8ec', ink: '#3b2414', accent: '#d9502b', accent2: '#1f8a6e', onAccent: '#ffffff',
    particles: ['🍹', '🌺', '🌴', '🍍', '🥥'], seal: '@hibiscus', divider: '🌺 ✦ 🌺', wrap: 'bottle',
    pattern: 'leaves', scene: 'tropics', wax: 'teal', waxFace: 'pearl', paper: 'linen', corners: 'floral', rule: 'vine', sides: 'rope',
  },

  // ── Dark side ────────────────────────────────────────────────────────
  gothic: {
    name: 'Gothic', cat: 'dark', tagline: 'Black lace & blood-red roses', glyph: '✝',
    bg: ['#08060a', '#2a0a12'], card: '#16101a', ink: '#efe6ea', accent: '#c1203a', accent2: '#a89aa8', onAccent: '#ffffff', dark: true,
    particles: ['🥀', '🦇', '🕯️', '✦', '🖤'], seal: '@rose', divider: '✦ ✝ ✦', wrap: 'scroll',
    pattern: 'lace', scene: 'lace', wax: 'black', waxFace: 'silver', paper: 'parchment', corners: 'gothic', sides: 'lace', rule: 'flourish',
  },
  emo: {
    name: 'Emo', cat: 'dark', tagline: 'Black, hot pink & eyeliner', glyph: '♥',
    bg: ['#0b0b0e', '#1d1022'], card: '#151318', ink: '#f2eef3', accent: '#ff2e88', accent2: '#8a8a96', onAccent: '#ffffff', dark: true,
    particles: ['🖤', '💔', '⛓️', '🎸', '✖️'], seal: '@brokenheart', divider: '✖ 🖤 ✖', wrap: 'envelope',
    pattern: 'stripes', scene: 'stripes', wax: 'black', waxFace: 'rosegold', paper: 'smooth', corners: 'none', sides: 'stitch', rule: 'rule',
  },
  kinky: {
    name: 'Kinky', cat: 'afterdark', tagline: 'Lace, leather & a little danger', glyph: '❦',
    bg: ['#050305', '#2b0610'], card: '#120a0e', ink: '#f5e9ec', accent: '#d9264a', accent2: '#c39a4b', onAccent: '#ffffff', dark: true,
    particles: ['💋', '🍒', '🔥', '🗝️', '🖤'], seal: '@lips', divider: '✦ ❦ ✦', wrap: 'envelope',
    pattern: 'lace', scene: 'velvet', wax: 'scarlet', waxFace: 'gold', paper: 'smooth', corners: 'filigree', sides: 'lace', rule: 'flourish',
  },
  boudoir: {
    name: 'Boudoir', cat: 'afterdark', tagline: 'Blush silk, black lace & pearls', glyph: '❦',
    bg: ['#1c0c12', '#4a1e2c'], card: '#fbeef0', ink: '#2b1418', accent: '#a8244a', accent2: '#b88a62', onAccent: '#ffffff',
    particles: ['🌹', '🕯️', '🥂', '🎀', '💋'], seal: '@bow', divider: '✦ ❦ ✦', wrap: 'envelope',
    pattern: 'lace', scene: 'bokeh', wax: 'rose', waxFace: 'gold', paper: 'silk', corners: 'rose', sides: 'pearls', rule: 'flourish',
  },
  masquerade: {
    name: 'Masquerade', cat: 'afterdark', tagline: 'Black velvet, gold & secrets', glyph: '❖',
    bg: ['#07060a', '#2a1f12'], card: '#0f0c09', ink: '#f6ead2', accent: '#d4af37', accent2: '#b0283c', onAccent: '#0f0c09', dark: true,
    particles: ['🎭', '🪶', '🥂', '✨', '🕯️'], seal: '@mask', divider: '❖ ✦ ❖', wrap: 'book',
    pattern: 'damask', scene: 'bokeh', wax: 'black', waxFace: 'gold', paper: 'smooth', corners: 'baroque', sides: 'beads', rule: 'swash',
  },
  noir: {
    name: 'Noir', cat: 'afterdark', tagline: 'Smoke, shadows & a red lip', glyph: '♠',
    bg: ['#060606', '#2a2a2a'], card: '#f2efe9', ink: '#151515', accent: '#b3122e', accent2: '#6e6e6e', onAccent: '#ffffff',
    particles: ['🌙', '🥃', '🌹', '🎷', '✦'], seal: '@lips', divider: '✦ ♠ ✦', wrap: 'telegram',
    pattern: 'stripes', scene: 'noir', wax: 'black', waxFace: 'silver', paper: 'cotton', corners: 'deco', sides: 'frame', rule: 'rule',
  },

  // ── Night & glam ─────────────────────────────────────────────────────
  starlit: {
    name: 'Starlit Night', cat: 'sky', tagline: 'Wish upon it', glyph: '✦',
    bg: ['#050a24', '#1b1f5c'], card: '#0f1545', ink: '#e7e9ff', accent: '#ffd66b', accent2: '#9aa5ff', onAccent: '#0f1545', dark: true,
    particles: ['✦', '✧', '⋆', '🌙', '☄️'], seal: '@moonstar', divider: '⋆ ☾ ⋆',
    pattern: 'stars', scene: 'moonlit', wax: 'navy', waxFace: 'gold', paper: 'smooth', corners: 'celestial', rule: 'swash', sides: 'frame', wrap: 'bottle',
  },
  cyberpunk: {
    name: 'Cyberpunk', cat: 'night', tagline: 'Neon city, chrome & static', glyph: '◈',
    bg: ['#05040d', '#1c0b33'], card: '#0b0b16', ink: '#e8f7ff', accent: '#00f0ff', accent2: '#ff2bd6', onAccent: '#05040d', dark: true,
    particles: ['⚡', '💾', '🌃', '✦', '🤖', '💜'], seal: '@chip', divider: '◈ ⚡ ◈', wrap: 'envelope', glow: '#00f0ff',
    pattern: 'circuit', scene: 'cyber', wax: 'black', waxFace: 'silver', paper: 'smooth', corners: 'circuit', sides: 'circuit', rule: 'rule',
  },
  show: {
    name: 'Night at the Show', cat: 'night', tagline: 'Curtain up', glyph: '🎭',
    bg: ['#0d0b1a', '#3a0ca3'], card: '#17122d', ink: '#f5f3ff', accent: '#f72585', accent2: '#4cc9f0', onAccent: '#ffffff', dark: true,
    particles: ['🎶', '🎭', '✨', '🎟️', '🎸'], seal: '@star', divider: '♪ ✦ ♪',
    pattern: 'stars', scene: 'curtain', wax: 'black', waxFace: 'silver', paper: 'smooth', corners: 'deco', rule: 'rule', sides: 'bulbs', wrap: 'telegram',
  },
  party: {
    name: 'Celebration', cat: 'party', tagline: 'Let’s make some noise', glyph: '🎉',
    bg: ['#2b1055', '#d53369'], card: '#ffffff', ink: '#2b1055', accent: '#e93d82', accent2: '#e0a800', onAccent: '#ffffff',
    particles: ['🎉', '✨', '🎈', '🥂', '🎊'], seal: '@star', wrap: 'gift', divider: '✨ 🎉 ✨',
    pattern: 'confetti', scene: 'confetti', wax: 'gold', waxFace: 'pressed', paper: 'smooth', corners: 'deco', rule: 'swash', sides: 'beads',
  },
  cozy: {
    name: 'Cozy Night In', cat: 'night', tagline: 'Blankets mandatory', glyph: '☕',
    bg: ['#3b2a24', '#6b4a3a'], card: '#fdf6ee', ink: '#3b2a24', accent: '#b45d43', accent2: '#7d8f4e', onAccent: '#ffffff',
    particles: ['☕', '🍿', '🧸', '🕯️', '🧦'], seal: '@mug', divider: '☕ ✦ 🍿',
    pattern: 'plaid', scene: 'fireside', wax: 'burgundy', waxFace: 'pearl', paper: 'linen', corners: 'none', sides: 'stitch', rule: 'swash', wrap: 'envelope',
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
  if (typeof inv.th === 'string' && Object.hasOwn(THEMES, inv.th)) return THEMES[inv.th];
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
