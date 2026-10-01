// Short links via is.gd (falling back to its sister v.gd). Their API supports
// JSONP, which works from a static page with no server. If both fail, the
// full link is used — it works just the same, it's only longer.

const MAX_LENGTH = 5000; // is.gd refuses longer URLs
const cache = new Map();

function jsonp(url, timeout = 7000) {
  return new Promise((resolve, reject) => {
    const cb = `__moonpost_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');
    const cleanup = () => { delete window[cb]; script.remove(); clearTimeout(timer); };
    const timer = setTimeout(() => { cleanup(); reject(new Error('timeout')); }, timeout);
    window[cb] = data => { cleanup(); resolve(data); };
    script.onerror = () => { cleanup(); reject(new Error('network')); };
    script.src = `${url}&callback=${cb}`;
    document.head.append(script);
  });
}

export async function shortenUrl(longUrl) {
  if (cache.has(longUrl)) return cache.get(longUrl);
  if (longUrl.length > MAX_LENGTH || !/^https:\/\//.test(longUrl)) return longUrl;
  for (const host of ['is.gd', 'v.gd']) {
    try {
      const res = await jsonp(`https://${host}/create.php?format=json&url=${encodeURIComponent(longUrl)}`);
      if (res && typeof res.shorturl === 'string' && /^https:\/\/(is|v)\.gd\/\w+$/.test(res.shorturl)) {
        cache.set(longUrl, res.shorturl);
        return res.shorturl;
      }
    } catch { /* try the next one */ }
  }
  return longUrl;
}
