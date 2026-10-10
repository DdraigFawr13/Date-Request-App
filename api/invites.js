// Short links: stores an encoded invitation under a random 8-character code
// (POST { data } → { code }) and hands it back (GET ?code=…). Invitations are
// kept in a private Vercel Blob store: only this function can read them.

import { get, put } from '@vercel/blob';
import { randomBytes } from 'node:crypto';

const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const CODE = /^[A-Za-z0-9]{8}$/;
const DATA = /^[jyz][A-Za-z0-9_-]+$/; // an encoded invitation (js/codec.js)
const MAX_LENGTH = 6000;

export const newCode = () => Array.from(randomBytes(8), b => ALPHABET[b % 62]).join('');
export const validData = data => typeof data === 'string' && data.length <= MAX_LENGTH && DATA.test(data);
const path = code => `i/${code}.txt`;
const json = (body, status = 200) => Response.json(body, { status, headers: { 'cache-control': 'no-store' } });

export async function POST(request) {
  const body = await request.json().catch(() => null);
  if (!validData(body?.data)) return json({ error: 'invalid invitation' }, 400);
  for (let attempt = 0; attempt < 3; attempt++) {
    const code = newCode();
    try {
      await put(path(code), body.data, { access: 'private', addRandomSuffix: false, allowOverwrite: false, contentType: 'text/plain' });
      return json({ code });
    } catch (e) {
      if (!/exist/i.test(e.message)) throw e; // a taken code: pick another
    }
  }
  return json({ error: 'try again' }, 503);
}

export async function GET(request) {
  const code = new URL(request.url).searchParams.get('code');
  if (!CODE.test(code || '')) return json({ error: 'not found' }, 404);
  const found = await get(path(code), { access: 'private' });
  if (!found) return json({ error: 'not found' }, 404);
  // An invitation never changes once stored, so browsers may keep it.
  return new Response(found.stream, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=86400' } });
}
