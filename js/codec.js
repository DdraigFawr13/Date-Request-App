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
  const invite = JSON.parse(new TextDecoder().decode(bytes));
  if (!invite || typeof invite !== 'object' || typeof invite.s !== 'number') throw new Error('Invitation is missing its date');
  return invite;
}
