// Browser smoke tests for the whole journey: build → seal → open → answer.
import { test, expect } from '@playwright/test';
import { encodeInvite } from '../js/codec.js';
import { WRAPPERS } from '../js/wrappers.js';

const DAY = 864e5;
const soon = Date.now() + 7 * DAY;
const sample = (extra = {}) => ({
  v: 2, id: 'e2e', k: 'dinner', th: 'candlelit', to: 'Rowan', from: 'Sage', title: 'Dinner under the moon',
  s: soon, e: soon + 2 * 3600e3, tz: 'UTC', loc: 'The Gilded Owl', ...extra,
});
const inviteUrl = async (extra, suffix = '') => `/#i=${await encodeInvite(sample(extra))}${suffix}`;

// Every test: no outside network (fonts are recorded, not fetched), and no page errors.
let fonts, errors;
test.beforeEach(async ({ page }) => {
  fonts = [];
  errors = [];
  await page.route(/fonts\.(googleapis|gstatic)\.com/, route => {
    fonts.push(route.request().url());
    return route.fulfill({ status: 200, contentType: 'text/css', body: '' });
  });
  page.on('pageerror', e => errors.push(e.message));
  // (version.txt only exists on the deployed site, so locally it's a 404.)
  page.on('console', m => { if (m.type() === 'error' && !/version\.txt/.test(m.location().url)) errors.push(m.text()); });
});
test.afterEach(() => {
  expect(errors, 'page errors').toEqual([]);
});

// Wrappers bob and sway the whole time they wait, so don't wait for them to hold still.
const openIt = scope => scope.getByRole('button', { name: 'Open the invitation' }).click({ force: true });

test('the builder starts in quick mode and seals an invitation into the history', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('button', { name: '⚡ Quick' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('#look-tabs')).toBeHidden();

  await page.getByRole('button', { name: /Dinner date/ }).click();
  await expect(page.locator('#quick-summary')).toContainText('Candlelit');
  await page.locator('[data-bind=to]').fill('Rowan');
  await page.locator('[data-bind=from]').fill('Sage');
  await page.locator('[data-bind=title]').fill('Dinner under the moon');
  await page.getByRole('button', { name: '✨ Seal my invitation' }).click();

  await expect(page.locator('#result')).toBeVisible();
  await expect(page.locator('#result-url')).toHaveValue(/#i=[zj]/);
  await expect(page.locator('#history')).toBeVisible();
  await expect(page.locator('#history-label')).toHaveText('Your invitations (1)');
  await expect(page.locator('.sent-head')).toContainText('Dinner under the moon');

  // The full designer is one tap away, with every step numbered in order.
  await page.getByRole('button', { name: '🎨 Design everything' }).click();
  await expect(page.locator('#look-tabs')).toBeVisible();
  await expect(page.locator('#form > .step:visible .step-num')).toHaveText(['1', '2', '3', '4', '5', '6', '7', '8']);
});

test('a date in the past is flagged before sealing', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-bind=date]').fill('2020-01-01');
  await expect(page.locator('#date-warning')).toBeVisible();
  page.once('dialog', d => d.dismiss());
  await page.getByRole('button', { name: '✨ Seal my invitation' }).click();
  await expect(page.locator('#result')).toBeHidden();
});

test('the recipient loads only their invitation’s code and fonts, opens it and answers', async ({ page }) => {
  const requested = [];
  page.on('request', r => requested.push(r.url()));
  // Dinner dates ask about food by default (a question once broke the yes panel).
  await page.goto(await inviteUrl({ q: ['diet'], qc: ['Sweet or savory?'] }));
  await openIt(page);
  const title = page.locator('.card .title');
  await expect(title).toHaveText('Dinner under the moon');
  await expect(title).toBeFocused();

  expect(requested.filter(u => /builder\.(js|css)|shorten\.js/.test(u)), 'builder code').toEqual([]);
  const loaded = fonts.join(' ');
  expect(loaded).toContain('Playfair+Display'); // the dinner date's lettering
  expect(loaded).not.toContain('Creepster');

  await page.getByRole('button', { name: /It’s a date/ }).click();
  await expect(page.locator('#rsvp-heading')).toBeFocused();
  await page.getByLabel('Sweet or savory?').fill('Savory');
  await expect(page.locator('#reply-send')).toHaveAttribute('href', /^sms:.*Dinner%20under%20the%20moon.*Sweet%20or%20savory%3F%20Savory/);
  await expect(page.getByRole('button', { name: /It’s a date/ })).toHaveAttribute('aria-pressed', 'true');
});

for (const wrap of Object.keys(WRAPPERS)) {
  test(`the ${wrap} opening plays through to the card`, async ({ page }) => {
    await page.goto(await inviteUrl({ w: wrap }));
    await openIt(page);
    await expect(page.locator('.card .title')).toBeVisible({ timeout: 10_000 });
    await expect(page.locator('.rsvp-buttons')).toBeVisible();
  });
}

test('an invitation whose date has passed says so instead of asking', async ({ page }) => {
  await page.goto(await inviteUrl({ s: Date.now() - 3 * DAY, e: Date.now() - 3 * DAY + 3600e3 }));
  await openIt(page);
  await expect(page.getByText('This evening has already passed')).toBeVisible();
  await expect(page.locator('.rsvp-buttons')).toHaveCount(0);
});

test('group invitations ask for a headcount, and the sender can count the replies', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /Game night/ }).click();
  await page.locator('[data-bind=title]').fill('Game night');
  await page.locator('[data-bind=group]').check();
  await page.locator('[data-bind=hc]').fill('4');
  await page.getByRole('button', { name: '✨ Seal my invitation' }).click();
  const link = await page.locator('#result-url').inputValue();

  await page.goto(link);
  await openIt(page);
  await page.locator('[data-r=yes]').click();
  await page.getByLabel('Your name').fill('Rowan');
  await page.getByLabel('How many of you, including you?').fill('3');
  const reply = await page.locator('#reply-copy').getAttribute('data-text');
  expect(reply).toContain('👥 Party of 3');
  expect(reply).toMatch(/— Rowan$/);

  await page.goto('/');
  await page.locator('#history > summary').click();
  await page.getByRole('button', { name: '💬 Log a reply' }).click();
  await page.getByLabel('Paste the reply they texted you').fill(reply);
  await expect(page.locator('[data-log-name]')).toHaveValue('Rowan');
  await page.getByRole('button', { name: 'Add reply' }).click();
  await expect(page.locator('.sent-tally')).toContainText('3 coming');
});

test('“See it as they will” plays the real invitation without recording anything', async ({ page }) => {
  await page.goto('/');
  await page.locator('[data-bind=title]').fill('A preview');
  await page.getByRole('button', { name: '👀 See it as they will' }).click();
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  await expect(page.getByRole('button', { name: '✕ Close' }).last()).toBeFocused();
  const frame = page.frameLocator('#as-them-frame');
  await expect(frame.locator('.preview-banner')).toBeVisible();
  await openIt(frame);
  await frame.locator('[data-r=yes]').click();
  await frame.locator('#reply-copy').click();
  await expect(frame.locator('.made-with')).toHaveCount(0);
  const stored = await page.evaluate(() => Object.keys(localStorage).filter(k => k.startsWith('moonpost:rsvp')));
  expect(stored).toEqual([]);
  await page.keyboard.press('Escape');
  await expect(dialog).toBeHidden();
});

test('keyboard: tabs move with the arrow keys and choices keep focus', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: '🎨 Design everything' }).click();
  const first = page.locator('#look-tabs .tab').first();
  await first.click();
  await page.keyboard.press('ArrowRight');
  const second = page.locator('#look-tabs .tab').nth(1);
  await expect(second).toBeFocused();
  await expect(second).toHaveAttribute('aria-selected', 'true');

  const paper = page.locator('[data-action=paper]').nth(2);
  await page.locator('#papers').evaluate(el => { el.closest('details').open = true; });
  await paper.focus();
  await page.keyboard.press('Enter');
  await expect(page.locator('[data-action=paper]').nth(2)).toBeFocused();
  await expect(page.locator('[data-action=paper]').nth(2)).toHaveAttribute('aria-pressed', 'true');
});

test('the link shortener runs is.gd’s script in a sandbox it can’t escape', async ({ page }) => {
  await page.route(/https:\/\/(is|v)\.gd\/create\.php/, route => route.fulfill({
    contentType: 'text/javascript',
    body: `try { parent.document.title = 'pwned'; } catch {}
           try { parent.localStorage.setItem('pwned', '1'); } catch {}
           cb({ shorturl: 'https://is.gd/abc123' });`,
  }));
  await page.goto('/');
  const before = await page.title();
  const result = await page.evaluate(async () => {
    const { shortenUrl } = await import('/js/shorten.js');
    return shortenUrl('https://example.com/#i=zabc');
  });
  expect(result).toEqual({ url: 'https://is.gd/abc123' });
  expect(await page.title()).toBe(before);
  expect(await page.evaluate(() => localStorage.getItem('pwned'))).toBeNull();
  await expect(page.locator('iframe[sandbox]')).toHaveCount(0);
});

test('it can be added to a home screen', async ({ page, request }) => {
  await page.goto('/');
  const href = await page.locator('link[rel=manifest]').getAttribute('href');
  const manifest = await (await request.get(`/${href}`)).json();
  expect(manifest).toMatchObject({ short_name: 'Moonpost', display: 'standalone', start_url: './' });
  for (const icon of manifest.icons) expect((await request.get(`/${icon.src}`)).ok(), icon.src).toBe(true);
  expect(manifest.icons.some(i => i.purpose === 'maskable')).toBe(true);
  expect((await request.get(`/${await page.locator('link[rel=apple-touch-icon]').getAttribute('href')}`)).ok()).toBe(true);
});

test('every seal emblem sits inside the pressed face, clear of the raised ring', async ({ page }) => {
  const { measure, FACE_REACH } = await import('../scripts/fit-emblems.mjs');
  const { SVG_EMBLEMS, fittedEmblem, textEmblemSize } = await import('../js/seal.js');
  await page.goto('/');
  const arts = Object.fromEntries(Object.keys(SVG_EMBLEMS).map(id => [id, fittedEmblem(id)]));
  // The widest initials and a round emoji, in the seal's own lettering.
  for (const t of ['W', 'WW', 'WWW', 'WWWW', 'R&S', '🦁', '♞']) {
    arts[`text ${t}`] = `<text x='50' y='52' text-anchor='middle' dominant-baseline='central' font-family="'Cinzel Decorative', 'Cormorant Garamond', serif" font-weight='700' font-size='${textEmblemSize(t)}'>${t.replace('&', '&amp;')}</text>`;
  }
  const m = await measure(page, arts);
  const tooBig = Object.entries(m).filter(([, v]) => v.reach > FACE_REACH + 1.5).map(([id, v]) => `${id} reaches ${v.reach.toFixed(1)}`);
  expect(tooBig, 'emblems touching the ring (face is r=31.6) — run node scripts/fit-emblems.mjs').toEqual([]);
});
