import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeInvite, encodeInvite, prune } from '../js/codec.js';
import { moonPhase, sabbatFor, sabbatOn } from '../js/themes.js';
import { resolveTheme, wording } from '../js/occasions.js';
import { buildIcs, detailLines, googleUrl } from '../js/calendar.js';
import { esc, renderCard } from '../js/render.js';

const sample = {
  v: 1, id: 'abc123', title: 'Dinner under the Hunter’s Moon 🌕', to: 'Rowan', from: 'Sage',
  msg: 'Line one\nLine two, with; punctuation',
  s: Date.UTC(2026, 9, 31, 23, 0), e: Date.UTC(2026, 10, 1, 1, 0), tz: 'America/New_York',
  loc: 'The Gilded Owl', addr: '13 Willow Lane', th: 'auto',
  d: { dress: 'Black & velvet', cost: 'My treat ✨', link: { l: 'Menu', u: 'https://example.com/menu' } },
  cf: [{ i: '🔑', l: 'Password', v: 'Moonbeam' }], q: ['diet'], rm: 60, empty: '', no: false,
};

test('invitations survive an encode/decode round trip', async () => {
  const code = await encodeInvite(sample);
  assert.match(code, /^[zj][A-Za-z0-9_-]+$/, 'code is URL-safe');
  const back = await decodeInvite(code);
  assert.deepEqual(back, prune(sample));
  assert.equal(back.empty, undefined);
});

test('garbled links are rejected', async () => {
  await assert.rejects(decodeInvite('zNotReallyAnInvite'));
  await assert.rejects(decodeInvite('x123'));
});

test('dates map to the nearest Wheel of the Year season', () => {
  assert.equal(sabbatFor(10, 1), 'mabon');
  assert.equal(sabbatFor(10, 20), 'samhain');
  assert.equal(sabbatFor(12, 25), 'yule');
  assert.equal(sabbatFor(1, 5), 'yule');
  assert.equal(sabbatFor(2, 1), 'imbolc');
  assert.equal(sabbatFor(3, 20), 'ostara');
  assert.equal(sabbatFor(5, 1), 'beltane');
  assert.equal(sabbatFor(6, 21), 'litha');
  assert.equal(sabbatFor(8, 1), 'lughnasadh');
  assert.equal(sabbatOn(10, 31), 'samhain');
  assert.equal(sabbatOn(10, 30), null);
});

test('older "auto" links still get the season of the event date', () => {
  // 11pm Oct 31 in New York is already Nov 1 in UTC — still Samhain either way.
  assert.equal(resolveTheme(sample).id, 'samhain');
  assert.equal(resolveTheme({ ...sample, th: 'starlit' }).id, 'starlit');
  assert.equal(resolveTheme({ ...sample, th: 'nonsense' }).id, 'samhain');
});

test('the occasion sets wording and lettering; the look sets colors', () => {
  const dinner = resolveTheme({ ...sample, k: 'dinner', th: 'blackcat' });
  assert.equal(dinner.id, 'blackcat');
  assert.equal(dinner.fontId, 'classic');
  assert.equal(resolveTheme({ ...sample, k: 'dinner', fn: 'blackletter' }).fontId, 'blackletter');
  const words = wording({ ...sample, k: 'dinner', th: 'blackcat' });
  assert.equal(words.yes, 'It’s a date 🌹');
  assert.equal(words.dear, 'Dear Rowan,');
  assert.equal(words.for, 'For Rowan');
  const own = wording({ ...sample, k: 'dinner', tx: { yes: 'Absolutely!', badge: ' ', dear: 'My dearest Rowan,' } });
  assert.equal(own.yes, 'Absolutely!');
  assert.equal(own.badge, '', 'a blanked line is hidden');
  assert.equal(own.dear, 'My dearest Rowan,');
  assert.match(wording({ ...sample, k: 'sabbat' }).greet, /veil|candle/i, 'sabbat wording follows the date');
});

test('moon phase matches a known full moon', () => {
  assert.equal(moonPhase(Date.UTC(2026, 9, 26, 4, 0)).name, 'Full Moon'); // Oct 26 2026
  assert.equal(moonPhase(Date.UTC(2026, 9, 10, 16, 0)).name, 'New Moon'); // Oct 10 2026
});

test('ics output is valid-looking, escaped and folded', () => {
  const ics = buildIcs(sample, 'https://example.com/#i=x');
  assert.match(ics, /DTSTART:20261031T230000Z/);
  assert.match(ics, /DTEND:20261101T010000Z/);
  assert.match(ics, /TRIGGER:-PT60M/);
  assert.match(ics, /LOCATION:The Gilded Owl\\, 13 Willow Lane/);
  for (const line of ics.split('\r\n')) assert.ok(new TextEncoder().encode(line).length <= 75, `line too long: ${line}`);
  const unfolded = ics.replace(/\r\n /g, '');
  assert.match(unfolded, /Line one\\nLine two\\, with\\; punctuation/);
});

test('all-day events use local dates', () => {
  const ics = buildIcs({ ...sample, ad: true, s: Date.UTC(2026, 11, 21, 5, 0) }, '');
  assert.match(ics, /DTSTART;VALUE=DATE:20261221/);
  assert.match(ics, /DTEND;VALUE=DATE:20261222/);
});

test('google calendar link carries the details', () => {
  const url = new URL(googleUrl(sample, 'https://example.com'));
  assert.equal(url.searchParams.get('dates'), '20261031T230000Z/20261101T010000Z');
  assert.match(url.searchParams.get('details'), /What to wear: Black & velvet/);
  assert.deepEqual(detailLines(sample).at(-1), '🔑 Password: Moonbeam');
});

test('rendered cards escape everything from the link', () => {
  const evil = { ...sample, title: '<img src=x onerror=alert(1)>', d: { link: { l: 'x', u: 'javascript:alert(1)' } } };
  const html = renderCard({ ...evil, tx: { greet: '<b>hi</b>' }, dl: { dress: '<i>' }, qc: ['<x>'] }, resolveTheme(evil));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('javascript:'));
  assert.equal(esc('"<&>\''), '&quot;&lt;&amp;&gt;&#39;');
});

test('wrappers and wax seals fall back to the look and reject bad input', async () => {
  const { resolveWrapper, wrapperHtml } = await import('../js/wrappers.js');
  const { sealColor, sealEmblem, sealFace, sealHtml, WAX_BY_ID } = await import('../js/seal.js');
  const { THEMES } = await import('../js/themes.js');
  const seaside = THEMES.seaside;
  assert.equal(resolveWrapper({}, seaside), 'bottle', 'look picks its own wrapper');
  assert.equal(resolveWrapper({}, THEMES.samhain), 'envelope');
  assert.equal(resolveWrapper({ w: 'scroll' }, seaside), 'scroll');
  assert.equal(resolveWrapper({ w: 'trebuchet' }, seaside), 'bottle');
  assert.equal(sealColor({ sc: '#c9a227' }, seaside), '#c9a227');
  assert.equal(sealColor({ sc: 'navy' }, seaside), WAX_BY_ID.navy.hex);
  assert.equal(sealColor({ sc: 'red;background:url(x)' }, seaside), WAX_BY_ID[seaside.wax].hex);
  assert.equal(sealFace({ sf: 'gold' }, seaside).id, 'gold');
  assert.equal(sealFace({ sf: '#ff0000' }, seaside).id, 'custom');
  assert.equal(sealFace({ sf: 'nope"' }, seaside).id, 'pressed');
  assert.equal(sealEmblem({}, seaside), seaside.seal);
  assert.equal(sealEmblem({ se: '  R&S  ' }, seaside), 'R&S');
  assert.equal(sealEmblem({ se: 'ABCDEFG' }, seaside), 'ABCD');
  assert.equal(sealEmblem({ se: '@crown' }, seaside), '@crown');
  assert.equal(sealEmblem({ se: '@<script>' }, seaside), seaside.seal);
  assert.ok(!sealHtml({ se: '<b>' }, seaside).includes('<b>'));
  assert.ok(!sealHtml({ sf: '"><script>' }, seaside).includes('<script>'));
  const words = { for: '<script>', tap: 'Tap', fromLine: '' };
  assert.ok(!wrapperHtml({ w: 'chest' }, seaside, words).includes('<script>'));
});

test('custom backgrounds only accept real colors', async () => {
  const { backdropCss } = await import('../js/decor.js');
  const { THEMES } = await import('../js/themes.js');
  const css = backdropCss(THEMES.royal, { bs: 'paws', bc: ['#112233', 'url(evil)'] });
  assert.match(css, /#112233/);
  assert.ok(!css.includes('evil'));
  assert.ok(backdropCss(THEMES.royal, { bs: 'nonsense' }).includes('data:image/svg+xml'), 'unknown scene falls back to the look’s');
});

test('every look and occasion only references things that exist', async () => {
  const { THEMES, LOOK_CATEGORIES } = await import('../js/themes.js');
  const { TEMPLATES, FONTS } = await import('../js/occasions.js');
  const { PATTERNS, SCENES, PAPERS, CORNER_OPTIONS, SIDE_OPTIONS, RULE_OPTIONS } = await import('../js/decor.js');
  const { WAX_BY_ID, FACE_BY_ID, SVG_EMBLEMS } = await import('../js/seal.js');
  const { WRAPPERS } = await import('../js/wrappers.js');
  const has = (list, id) => list.some(o => o.id === id);
  for (const [id, t] of Object.entries(THEMES)) {
    assert.ok(has(LOOK_CATEGORIES, t.cat), `${id}: category`);
    assert.ok(PATTERNS[t.pattern], `${id}: pattern ${t.pattern}`);
    if (t.scene) assert.ok(has(SCENES, t.scene), `${id}: scene ${t.scene}`);
    assert.ok(WAX_BY_ID[t.wax], `${id}: wax ${t.wax}`);
    assert.ok(FACE_BY_ID[t.waxFace], `${id}: finish ${t.waxFace}`);
    assert.ok(has(PAPERS, t.paper), `${id}: paper ${t.paper}`);
    assert.ok(has(CORNER_OPTIONS, t.corners), `${id}: corners ${t.corners}`);
    if (t.sides) assert.ok(has(SIDE_OPTIONS, t.sides), `${id}: sides ${t.sides}`);
    assert.ok(has(RULE_OPTIONS, t.rule), `${id}: rule ${t.rule}`);
    if (t.wrap) assert.ok(WRAPPERS[t.wrap], `${id}: wrap ${t.wrap}`);
    if (t.seal.startsWith('@')) assert.ok(SVG_EMBLEMS[t.seal.slice(1)], `${id}: seal ${t.seal}`);
  }
  for (const c of LOOK_CATEGORIES) assert.ok(Object.values(THEMES).some(t => t.cat === c.id), `empty tab ${c.id}`);
  for (const t of TEMPLATES) assert.ok(FONTS[t.font], `${t.id}: font ${t.font}`);
  const { OCCASION_LOOKS } = await import('../js/occasions.js');
  for (const [k, look] of Object.entries(OCCASION_LOOKS)) {
    assert.ok(TEMPLATES.some(t => t.id === k), `quick look for unknown occasion ${k}`);
    assert.ok(THEMES[look], `${k}: quick look ${look}`);
  }
});

test('page color is independent of the background and stays readable', async () => {
  const { contrast, backdropCss } = await import('../js/decor.js');
  const { THEMES } = await import('../js/themes.js');
  const base = { ...sample, th: 'candlelit' };
  const dark = resolveTheme({ ...base, cc: '#141018' });
  assert.equal(dark.card, '#141018');
  assert.equal(dark.dark, true);
  assert.ok(contrast(dark.ink, dark.card) >= 4.5, 'body text reads on a dark page');
  assert.ok(contrast(dark.accent, dark.card) >= 3, 'title reads on a dark page');
  assert.deepEqual(dark.bg, THEMES.candlelit.bg, 'background keeps the look’s colors');
  const pale = resolveTheme({ ...base, th: 'neon', cc: '#fff7e8' });
  assert.ok(contrast(pale.ink, pale.card) >= 4.5, 'body text reads on a pale page');
  assert.ok(contrast(pale.accent, pale.card) >= 3, 'title reads on a pale page');
  assert.equal(resolveTheme({ ...base, cc: 'red;x' }).card, THEMES.candlelit.card, 'bad colors are ignored');
  // And the background can change without touching the page.
  const both = { ...base, cc: '#141018', bc: ['#112233', '#445566'] };
  assert.equal(resolveTheme(both).card, '#141018');
  assert.match(backdropCss(resolveTheme(both), both), /#112233/);
});

test('neon glow follows the look, can be turned off, and only takes real colors', async () => {
  const { resolveGlow } = await import('../js/decor.js');
  const { THEMES } = await import('../js/themes.js');
  assert.equal(resolveGlow({}, THEMES.neon), THEMES.neon.glow);
  assert.equal(resolveGlow({}, THEMES.candlelit), null);
  assert.equal(resolveGlow({ gl: 'none' }, THEMES.neon), null);
  assert.equal(resolveGlow({ gl: '#2ee6ff' }, THEMES.candlelit), '#2ee6ff');
  assert.equal(resolveGlow({ gl: 'red;}' }, THEMES.candlelit), null);
});

test('emoji in italic lines are wrapped so they stay upright, and text is still escaped', async () => {
  const { escEmoji } = await import('../js/util.js');
  assert.equal(escEmoji('🌕 Beneath the <full> moon'), '<span class="emo">🌕</span> Beneath the &lt;full&gt; moon');
  assert.match(escEmoji('✨ It falls on Samhain itself ✨'), /^<span class="emo">✨<\/span>.*<span class="emo">✨<\/span>$/);
});

test('hand-edited links are cleaned up or rejected, never crash the page', async () => {
  const { normalizeInvite } = await import('../js/codec.js');
  const { wrapperHtml } = await import('../js/wrappers.js');
  const s = Date.UTC(2026, 9, 31, 23);
  const hostile = [
    { th: '__proto__' }, { th: 'constructor' }, { fn: 'constructor' }, { k: 'toString' }, { sc: 'toString' }, { sf: 'constructor' },
    { se: '@constructor' }, { se: '@__proto__' }, { w: 'constructor' }, { q: ['constructor', 'diet'] }, { cf: { a: 1 } }, { cf: ['x', { l: 5 }] },
    { q: 'diet' }, { qc: 5 }, { d: 'x' }, { d: { link: 'x', dress: 7 } }, { dl: ['x'] }, { tx: ['a'] }, { title: 123 }, { to: { x: 1 } },
    { tz: 'Not/AZone' }, { e: -5 }, { bc: '#123456' }, { title: 'x'.repeat(50000) },
  ];
  for (const extra of hostile) {
    const inv = normalizeInvite({ s, tz: 'UTC', title: 'T', ...extra });
    const theme = resolveTheme(inv);
    const words = wording(inv);
    const html = renderCard(inv, theme) + wrapperHtml(inv, theme, words);
    assert.ok(!/undefined|\[object Object\]|function \w*\(|NaN/.test(html), `junk in markup for ${JSON.stringify(extra).slice(0, 60)}`);
  }
  for (const bad of [null, [], 'x', {}, { s: 'soon' }, { s: NaN }, { s: 9e15 }, { s: Infinity }]) {
    assert.throws(() => normalizeInvite(bad), `rejects ${JSON.stringify(bad)}`);
  }
  assert.equal(normalizeInvite({ s, tz: 'Not/AZone' }).tz, undefined, 'unknown time zones are dropped');
  assert.deepEqual(normalizeInvite({ s, qc: 'Sweet or savory?' }).qc, ['Sweet or savory?'], 'older single questions still work');
});

test('every look reads well: text, titles, buttons and text on the background', async () => {
  const { THEMES } = await import('../js/themes.js');
  const { contrast, readableButton, textOnBackdrop } = await import('../js/decor.js');
  const mix = (a, b, t) => { const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16); return '#' + [16, 8, 0].map(s => Math.round(((pa >> s) & 255) * (1 - t) + ((pb >> s) & 255) * t).toString(16).padStart(2, '0')).join(''); };
  for (const t of Object.values(THEMES)) {
    assert.ok(contrast(t.ink, t.card) >= 4.5, `${t.id}: body text`);
    assert.ok(contrast(mix(t.card, t.ink, 0.76), t.card) >= 4.5, `${t.id}: greeting text`);
    assert.ok(contrast(t.accent, t.card) >= 3, `${t.id}: title`);
    const b = readableButton(t);
    assert.ok(contrast(b.ink, b.bg) >= 4.5, `${t.id}: button text (${contrast(b.ink, b.bg).toFixed(2)})`);
    const fg = textOnBackdrop(t);
    assert.ok(Math.min(contrast(fg, t.bg[0]), contrast(fg, t.bg[1])) >= 3, `${t.id}: text on the background`);
  }
});

test('metallic foil accents only accept known finishes and pick a variant for the page', async () => {
  const { resolveFoil, FOILS } = await import('../js/decor.js');
  assert.equal(resolveFoil({}, true), null);
  assert.equal(resolveFoil({ af: 'constructor' }, true), null);
  assert.equal(resolveFoil({ af: 'gold;}' }, true), null);
  assert.deepEqual(resolveFoil({ af: 'gold', at: true }, true), { id: 'gold', stops: FOILS.gold.bright, title: true });
  assert.equal(resolveFoil({ af: 'silver' }, false).stops, FOILS.silver.deep, 'light pages get the deeper foil');
  const card = renderCard({ ...sample, th: 'velvet', af: 'copper' }, resolveTheme({ ...sample, th: 'velvet', af: 'copper' }));
  assert.match(card, /data-foil="copper"/);
  assert.match(card, /<linearGradient id='fo\d+'/);
});

test('every opening renders, and the telegram types escaped text', async () => {
  const { WRAPPERS, wrapperHtml } = await import('../js/wrappers.js');
  const { THEMES } = await import('../js/themes.js');
  const inv = { title: '<img src=x onerror=alert(1)> party', s: Date.now() };
  for (const w of Object.keys(WRAPPERS)) {
    const html = wrapperHtml({ ...inv, w }, THEMES.royal, { for: 'For <b>Rowan</b>', tap: 'Tap', fromLine: '' });
    assert.match(html, new RegExp(`data-wrap="${w}"`));
    assert.ok(!/<img|<b>/i.test(html), `${w}: unescaped text`);
  }
});

test('every module import can be stamped with the release id on deploy', async () => {
  const { readdirSync, readFileSync } = await import('node:fs');
  const dir = new URL('../js/', import.meta.url);
  for (const file of readdirSync(dir).filter(f => f.endsWith('.js'))) {
    const src = readFileSync(new URL(file, dir), 'utf8');
    for (const [, spec] of src.matchAll(/\bfrom\s+["'`]([^"'`]+)["'`]/g)) {
      assert.match(spec, /^\.\/[A-Za-z0-9_-]+\.js$/, `${file}: import "${spec}" must be a plain './name.js' so the deploy can stamp it`);
    }
    for (const [call] of src.matchAll(/\bimport\s*\([^)]*\)/g)) {
      assert.match(call, /^import\('\.\/[A-Za-z0-9_-]+\.js'\)$/, `${file}: ${call} must be a plain import('./name.js') so the deploy can stamp it`);
    }
  }
});

test('every look is a complete, flat entry (no look nested inside another)', async () => {
  const { THEMES } = await import('../js/themes.js');
  for (const [id, t] of Object.entries(THEMES)) {
    for (const key of ['name', 'cat', 'bg', 'card', 'ink', 'accent', 'accent2', 'seal', 'pattern', 'wax', 'paper']) assert.ok(t[key], `${id}: missing ${key}`);
    for (const [k, v] of Object.entries(t)) assert.ok(typeof v !== 'object' || Array.isArray(v), `${id}.${k} is a nested object`);
  }
});

test('each invitation loads only the fonts its lettering needs', async () => {
  const { familiesIn, fontsUrl, BASE_FAMILIES } = await import('../js/fonts.js');
  const { FONTS } = await import('../js/occasions.js');
  for (const [id, f] of Object.entries(FONTS)) {
    assert.ok(familiesIn(f.display, f.body).length >= 1, `${id}: no loadable family`);
  }
  assert.deepEqual(familiesIn("'Great Vibes', cursive", "'Cormorant Garamond', serif"), ['Great Vibes', 'Cormorant Garamond']);
  assert.deepEqual(familiesIn("'Not A Font', serif", 'system-ui'), [], 'unknown families are ignored');
  assert.equal(fontsUrl(['Amatic SC', 'Creepster']), 'https://fonts.googleapis.com/css2?family=Amatic+SC:wght@700&family=Creepster&display=swap');
  const { readFileSync } = await import('node:fs');
  const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
  const head = html.match(/fonts\.googleapis\.com\/css2\?([^"]+)"/)[1];
  assert.deepEqual([...head.matchAll(/family=([^:&]+)/g)].map(m => m[1].replace(/\+/g, ' ')), BASE_FAMILIES, 'index.html loads just the base faces');
});

test('an invitation is over once it ends (or at the end of an all-day date)', async () => {
  const { isPast } = await import('../js/calendar.js');
  const now = Date.UTC(2026, 9, 31, 12);
  assert.equal(isPast({ s: now - 3600e3 }, now), false, 'still on (default two hours)');
  assert.equal(isPast({ s: now - 3 * 3600e3 }, now), true);
  assert.equal(isPast({ s: now - 3 * 3600e3, e: now + 60e3 }, now), false, 'uses the end time');
  assert.equal(isPast({ s: now - 10 * 3600e3, ad: true }, now), false, 'all day lasts the day');
  assert.equal(isPast({ s: now - 25 * 3600e3, ad: true }, now), true);
});

test('group replies carry a headcount and a name the sender can count', async () => {
  const { replyText } = await import('../js/invite.js');
  const { parseReply, tally, upsertSent, cleanSent } = await import('../js/replies.js');
  const { normalizeInvite } = await import('../js/codec.js');
  const inv = normalizeInvite({ s: Date.UTC(2026, 9, 31, 23), tz: 'UTC', title: 'Game night', hc: 6 });
  const yes = replyText(inv, 'yes', { name: 'Rowan', party: 3, answers: ['Red'] }, ['Drink of choice?']);
  assert.match(yes, /^✨ Yes!/);
  assert.deepEqual(parseReply(yes), { r: 'yes', n: 3, name: 'Rowan' });
  assert.deepEqual(parseReply(replyText(inv, 'no', { name: 'Ash' })), { r: 'no', n: 1, name: 'Ash' });
  assert.deepEqual(parseReply(replyText(inv, 'maybe', {})), { r: 'maybe', n: 1, name: '' });
  assert.equal(parseReply('Count me in!!').r, 'yes', 'hand-typed replies get a best guess');
  assert.equal(parseReply('so sorry, can’t make it').r, 'no');
  assert.equal(parseReply('👥 Party of 999').n, 50);
  const one = replyText(normalizeInvite({ s: inv.s, title: 'Dinner' }), 'yes', { name: 'Rowan', party: 4 });
  assert.ok(!/Party of|Rowan/.test(one), 'one-to-one invitations stay as they were');

  assert.deepEqual(tally([{ r: 'yes', n: 3 }, { r: 'yes' }, { r: 'no' }, { r: 'maybe' }, { r: 'coming' }, { r: 'x' }]), { yes: 2, maybe: 1, no: 1, coming: 4 });
  let list = upsertSent([], { id: 'a', url: 'u1' });
  list[0].replies.push({ r: 'yes', n: 2 });
  list = upsertSent(upsertSent(list, { id: 'b', url: 'u2' }), { id: 'a', url: 'u3' });
  assert.deepEqual(list.map(e => [e.id, e.url, e.replies.length]), [['a', 'u3', 1], ['b', 'u2', 0]], 'resealing keeps replies and moves it to the top');
  assert.deepEqual(cleanSent([null, 'x', { id: 1 }, { id: 'c', url: 'u', replies: 'no' }]), [{ id: 'c', url: 'u', replies: [] }]);

  assert.equal(normalizeInvite({ s: inv.s, hc: 7.6 }).hc, 8);
  assert.equal(normalizeInvite({ s: inv.s, hc: 1e9 }).hc, 50);
  for (const bad of [0, -2, '5', NaN, null]) assert.equal(normalizeInvite({ s: inv.s, hc: bad }).hc, undefined, `hc ${bad}`);
});

test('the shortener sandbox can’t be broken out of by a crafted link', async () => {
  const { sandboxDoc } = await import('../js/shorten.js');
  const doc = sandboxDoc('https://is.gd/create.php?format=json&url=</script><script>alert(1)</script>', 'id"1');
  assert.equal(doc.match(/<\/script>/g).length, 1, 'only the sandbox’s own closing tag');
  assert.ok(!/<script>alert/.test(doc));
});
