// Short links: the encoded invitation is stored by Moonpost's own little API
// (api/invites.js, on Vercel) under a random 8-character code, so the link is
// just …/#aB3xYz9k. If that can't be reached, the whole invitation travels in
// the link instead (#i=…): longer, but it works just the same.

const API = 'api/invites';
const MAX_LENGTH = 6000; // the API refuses anything longer
export const SHORT_CODE = /^[A-Za-z0-9]{8}$/;

const why = e => (e.name === 'TimeoutError' ? 'the link service didn’t answer'
  : e.name === 'TypeError' ? 'the link service couldn’t be reached' : e.message);

// Returns { url, error }: the short link, or the full link plus why a short
// one couldn't be made (shown to the sender).
export async function saveInvite(code, base = `${location.origin}${location.pathname}`) {
  const longUrl = `${base}#i=${code}`;
  if (code.length > MAX_LENGTH) return { url: longUrl, error: `the invitation is too long to store (${code.length} characters)` };
  try {
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ data: code }),
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`the link service said ${res.status}`);
    const { code: short } = await res.json();
    if (typeof short === 'string' && SHORT_CODE.test(short)) return { url: `${base}#${short}` };
    return { url: longUrl, error: 'the link service sent back something unexpected' };
  } catch (e) {
    return { url: longUrl, error: why(e) };
  }
}

// The encoded invitation for a short code: a string, or null when there's no
// such invitation. Throws when the API can't be reached (worth retrying).
export async function loadInvite(short) {
  const res = await fetch(`${API}?code=${encodeURIComponent(short)}`, { signal: AbortSignal.timeout(8000) });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`the link service said ${res.status}`);
  return res.text();
}
