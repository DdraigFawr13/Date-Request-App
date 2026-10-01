import { test } from 'node:test';
import assert from 'node:assert/strict';
import { decodeInvite, encodeInvite, prune } from '../js/codec.js';
import { moonPhase, resolveTheme, sabbatFor, sabbatOn } from '../js/themes.js';
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
  assert.equal(sabbatFor(10, 31, 'S'), 'beltane', 'southern hemisphere is flipped');
  assert.equal(sabbatOn(10, 31), 'samhain');
  assert.equal(sabbatOn(10, 30), null);
});

test('auto theme uses the event date in its own time zone', () => {
  // 11pm Oct 31 in New York is already Nov 1 in UTC — still Samhain either way.
  assert.equal(resolveTheme(sample).id, 'samhain');
  assert.equal(resolveTheme({ ...sample, th: 'starlit' }).id, 'starlit');
  assert.equal(resolveTheme({ ...sample, th: 'nonsense' }).id, 'samhain');
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
  const html = renderCard(evil, resolveTheme(evil));
  assert.ok(!html.includes('<img'));
  assert.ok(!html.includes('javascript:'));
  assert.equal(esc('"<&>\''), '&quot;&lt;&amp;&gt;&#39;');
});
