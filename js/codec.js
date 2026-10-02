// Packs an invitation into a URL-safe string so the whole thing travels in the
// link itself — no server or database needed. Uses deflate when the browser
// supports it ('z' prefix) and plain base64 JSON otherwise ('j' prefix).

function toB64Url(bytes) {
  let bin = '';
  for (let i = 0; i < bytes.length; i += 0x8000) bin += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(bin).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64Url(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  return Uint8Array.from(atob(b64), c => c.charCodeAt(0));
}

async function pipe(bytes, transform) {
  const stream = new Blob([bytes]).stream().pipeThrough(transform);
  return new Uint8Array(await new Response(stream).arrayBuffer());
}

// Drops empty values so links stay short.
export function prune(value) {
  if (Array.isArray(value)) {
    const arr = value.map(prune).filter(v => v !== undefined);
    return arr.length ? arr : undefined;
  }
  if (value && typeof value === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(value)) {
      const p = prune(v);
      if (p !== undefined) out[k] = p;
    }
    return Object.keys(out).length ? out : undefined;
  }
  if (value === '' || value === null || value === false || value === undefined) return undefined;
  if (typeof value === 'number' && Number.isNaN(value)) return undefined;
  return value;
}

export async function encodeInvite(invite) {
  const bytes = new TextEncoder().encode(JSON.stringify(prune(invite) ?? {}));
  if (typeof CompressionStream !== 'undefined') {
    try {
      return 'z' + toB64Url(await pipe(bytes, new CompressionStream('deflate-raw')));
    } catch { /* fall through to uncompressed */ }
  }
  return 'j' + toB64Url(bytes);
}

export async function decodeInvite(code) {
  const kind = code[0];
  let bytes = fromB64Url(code.slice(1));
  if (kind === 'z') bytes = await pipe(bytes, new DecompressionStream('deflate-raw'));
  else if (kind !== 'j') throw new Error('Unknown invitation format');
  return normalizeInvite(JSON.parse(new TextDecoder().decode(bytes)));
}

// ── Cleaning a decoded invitation ─────────────────────────────────────
// Links can be hand-edited, so every field is coerced to the type the app
// expects. Anything unusable is dropped; a missing or impossible date
// rejects the whole link (the recipient sees "this invitation lost its way").
const MAX_TEXT = 2000;
const str = v => (typeof v === 'string' ? v.slice(0, MAX_TEXT) : undefined);
const strList = v => (Array.isArray(v) ? v.map(str).filter(x => x !== undefined) : undefined);
const plainObject = v => (v && typeof v === 'object' && !Array.isArray(v) ? v : undefined);
const strMap = v => {
  const o = plainObject(v);
  if (!o) return undefined;
  const out = {};
  for (const [k, val] of Object.entries(o)) if (typeof val === 'string') out[k] = val.slice(0, MAX_TEXT);
  return out;
};
const DAY = 864e5;
const validTz = tz => {
  if (typeof tz !== 'string') return undefined;
  try { new Intl.DateTimeFormat('en-US', { timeZone: tz }); return tz; } catch { return undefined; }
};

export function normalizeInvite(raw) {
  if (!plainObject(raw)) throw new Error('Invitation is unreadable');
  const s = raw.s;
  // Dates within about 200 years of now are plausible; anything else is a broken link.
  if (typeof s !== 'number' || !Number.isFinite(s) || Math.abs(s - Date.now()) > 73000 * DAY) throw new Error('Invitation is missing its date');
  const inv = { s };
  for (const k of ['v', 'rm']) if (typeof raw[k] === 'number' && Number.isFinite(raw[k])) inv[k] = raw[k];
  if (typeof raw.e === 'number' && Number.isFinite(raw.e) && raw.e > s && raw.e - s < 31 * DAY) inv.e = raw.e;
  if (raw.ad === true) inv.ad = true;
  if (raw.at === true) inv.at = true;
  const tz = validTz(raw.tz);
  if (tz) inv.tz = tz;
  for (const k of ['id', 'k', 'to', 'from', 'title', 'msg', 'loc', 'addr', 'th', 'h', 'fn', 'bs', 'cc', 'gl', 'pp', 'dc', 'ds', 'dv', 'w', 'sc', 'sf', 'se', 'cl', 'ph', 'af']) {
    const v = str(raw[k]);
    if (v !== undefined) inv[k] = v;
  }
  const lists = { q: strList(raw.q), bc: strList(raw.bc) };
  for (const [k, v] of Object.entries(lists)) if (v) inv[k] = v;
  // Your own questions: a list now, a single string in older links.
  const qc = typeof raw.qc === 'string' ? [raw.qc] : strList(raw.qc);
  if (qc) inv.qc = qc.map(q => q.slice(0, MAX_TEXT));
  for (const k of ['dl', 'tx']) { const m = strMap(raw[k]); if (m) inv[k] = m; }
  const d = plainObject(raw.d);
  if (d) {
    inv.d = strMap(d);
    const link = plainObject(d.link);
    if (link && typeof link.u === 'string') inv.d.link = { l: str(link.l) || '', u: link.u.slice(0, MAX_TEXT) };
  }
  if (Array.isArray(raw.cf)) {
    inv.cf = raw.cf.filter(plainObject).slice(0, 40).map(c => ({ i: str(c.i) || '', l: str(c.l) || '', v: str(c.v) || '' }));
  }
  return inv;
}
