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
