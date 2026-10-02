// Web fonts are fetched only when they're needed. index.html loads the three
// faces every page uses; an invitation then adds just its own pairing, and the
// builder adds the rest so its lettering picker can show every style.

const FAMILIES = {
  'Almendra': 'ital,wght@0,700;1,400',
  'Amatic SC': 'wght@700',
  'Caveat': 'wght@600',
  'Cinzel Decorative': 'wght@700',
  'Cormorant Garamond': 'ital,wght@0,500;0,700;1,500',
  'Creepster': '',
  'Fredoka': 'wght@500;600',
  'Great Vibes': '',
  'Henny Penny': '',
  'IM Fell English': 'ital@0;1',
  'Limelight': '',
  'MedievalSharp': '',
  'Monoton': '',
  'Orbitron': 'wght@600;800',
  'Pacifico': '',
  'Permanent Marker': '',
  'Playfair Display': 'ital,wght@0,700;1,500',
  'Quicksand': 'wght@400;600;700',
  'Righteous': '',
  'Sniglet': 'wght@400;800',
  'Uncial Antiqua': '',
  'UnifrakturMaguntia': '',
};

// Loaded by index.html itself (the builder's chrome, the seal's initials).
export const BASE_FAMILIES = ['Cinzel Decorative', 'Cormorant Garamond', 'Quicksand'];

const loaded = new Set(BASE_FAMILIES);

// "'Great Vibes', cursive" → ['Great Vibes'] (only families we know how to fetch).
export function familiesIn(...stacks) {
  const out = [];
  for (const stack of stacks) {
    for (const [, name] of String(stack || '').matchAll(/['"]([^'"]+)['"]/g)) {
      if (Object.hasOwn(FAMILIES, name) && !out.includes(name)) out.push(name);
    }
  }
  return out;
}

export function fontsUrl(families) {
  const parts = families.map(f => `family=${f.replace(/ /g, '+')}${FAMILIES[f] ? `:${FAMILIES[f]}` : ''}`);
  return `https://fonts.googleapis.com/css2?${parts.join('&')}&display=swap`;
}

export function loadFonts(families) {
  const needed = families.filter(f => Object.hasOwn(FAMILIES, f) && !loaded.has(f));
  if (!needed.length || typeof document === 'undefined') return;
  for (const f of needed) loaded.add(f);
  const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href: fontsUrl(needed) });
  link.dataset.fonts = needed.join(',');
  document.head.append(link);
}

export const loadThemeFonts = theme => loadFonts(familiesIn(theme.display, theme.body));
export const loadAllFonts = () => loadFonts(Object.keys(FAMILIES));
