// Short links: the encoded invitation is stored in Moonpost's own small
// database (Supabase) under a random 8-character code, so the link is just
// …/#aB3xYz9k. If the database can't be reached, the whole invitation travels
// in the link instead (#i=…) — longer, but it works just the same.
//
// The key below is the public "publishable" key. It can only call the two
// functions in supabase/schema.sql: store an invitation, or fetch one by its
// exact code. It can't list, change or delete anything.

const API = 'https://nroywllxiazkvyyvcbrj.supabase.co/rest/v1/rpc';
const KEY = 'sb_publishable_f91cCeJoLcLoff4cNkOVxg_BeDqOgFE';
const MAX_LENGTH = 6000; // the database refuses anything longer
export const SHORT_CODE = /^[A-Za-z0-9]{8}$/;

async function rpc(fn, body, timeout = 6000) {
  const res = await fetch(`${API}/${fn}`, {
    method: 'POST',
    headers: { apikey: KEY, 'content-type': 'application/json' },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(timeout),
  });
  if (!res.ok) throw new Error(`the server said ${res.status}`);
  return res.json();
}

const why = e => (e.name === 'TimeoutError' ? 'the link service didn’t answer'
  : e.name === 'TypeError' ? 'the link service couldn’t be reached' : e.message);

// Returns { url, error }: the short link, or the full link plus why a short
// one couldn't be made (shown to the sender).
export async function saveInvite(code, base = `${location.origin}${location.pathname}`) {
  const longUrl = `${base}#i=${code}`;
  if (code.length > MAX_LENGTH) return { url: longUrl, error: `the invitation is too long to store (${code.length} characters)` };
  try {
    const short = await rpc('create_invite', { data: code });
    if (typeof short === 'string' && SHORT_CODE.test(short)) return { url: `${base}#${short}` };
    return { url: longUrl, error: 'the link service sent back something unexpected' };
  } catch (e) {
    return { url: longUrl, error: why(e) };
  }
}

// The encoded invitation for a short code: a string, or null when there's no
// such invitation. Throws when the database can't be reached (worth retrying).
export async function loadInvite(short) {
  const data = await rpc('get_invite', { code: short });
  return typeof data === 'string' ? data : null;
}
