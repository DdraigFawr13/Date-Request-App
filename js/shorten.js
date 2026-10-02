// Short links via is.gd (falling back to its sister v.gd). Their API supports
// JSONP, which works from a static page with no server. If both fail, the
// full link is used — it works just the same, it's only longer.
//
// JSONP means running is.gd's script, so it runs inside a sandboxed iframe with
// an opaque origin: it can't reach this page, its storage or the draft, and all
// it can do is post a message back, which is checked before it's used.

const MAX_LENGTH = 5000; // is.gd refuses longer URLs
const cache = new Map();

// JSON for inside an inline <script>: no "</script>" or "<!--" can break out.
const scriptJson = v => JSON.stringify(v).replace(/</g, '\\u003c');

export function sandboxDoc(url, id) {
  return `<!doctype html><script>
    const send = msg => parent.postMessage({ id: ${scriptJson(id)}, ...msg }, '*');
    window.cb = data => send({ data });
    const s = document.createElement('script');
    s.onerror = () => send({ error: 'network' });
    s.src = ${scriptJson(`${url}&callback=cb`)};
    document.head.append(s);
  </script>`;
}

function jsonp(url, timeout = 7000) {
  return new Promise((resolve, reject) => {
    const id = Math.random().toString(36).slice(2);
    const frame = Object.assign(document.createElement('iframe'), { hidden: true, title: 'Link shortener' });
    frame.setAttribute('sandbox', 'allow-scripts');
    const cleanup = () => { removeEventListener('message', onMessage); frame.remove(); clearTimeout(timer); };
    const timer = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, timeout);
    function onMessage(e) {
      if (e.source !== frame.contentWindow || e.data?.id !== id) return;
      cleanup();
      if (e.data.error) reject(new Error(String(e.data.error)));
      else resolve(e.data.data);
    }
    addEventListener('message', onMessage);
    frame.srcdoc = sandboxDoc(url, id);
    document.body.append(frame);
  });
}

// Returns { url, error }: the short link, or the full link plus why shortening
// failed (shown to the sender so a failure can be diagnosed).
export async function shortenUrl(longUrl) {
  if (cache.has(longUrl)) return { url: cache.get(longUrl) };
  if (longUrl.length > MAX_LENGTH) return { url: longUrl, error: `the link is too long to shorten (${longUrl.length} characters)` };
  if (!/^https:\/\//.test(longUrl)) return { url: longUrl, error: 'short links only work from the live (https) site' };
  const problems = [];
  for (const host of ['is.gd', 'v.gd']) {
    try {
      const res = await jsonp(`https://${host}/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
      if (res && typeof res.shorturl === 'string' && /^https:\/\/(is|v)\.gd\/\w+$/.test(res.shorturl)) {
        cache.set(longUrl, res.shorturl);
        return { url: res.shorturl };
      }
      problems.push(`${host} said “${String(res?.errormessage || 'no short link returned').slice(0, 140)}”`);
    } catch (e) {
      problems.push(`${host} ${e.message === 'timeout' ? 'didn’t answer' : 'couldn’t be reached (a content blocker may be blocking it)'}`);
    }
  }
  return { url: longUrl, error: problems.join('; ') };
}
