// The sender's record of what they've sent and who has answered. It lives
// only on their device (localStorage), since there's no server: replies arrive
// as ordinary texts and the sender pastes them in to keep count.

export const SENT_KEY = 'moonpost:sent';
const MAX_SENT = 60;

// Reads a reply as written by the invitation (invite.js replyText): its first
// line says yes / maybe / no, "👥 Party of 3" gives the headcount and a last
// line "— Rowan" the name. Anything typed by hand gets a best guess.
export function parseReply(text) {
  const t = String(text || '').trim();
  const first = t.split('\n')[0] || '';
  let r = /^✨/u.test(first) ? 'yes' : /^🌙/u.test(first) ? 'maybe' : /^💌/u.test(first) ? 'no' : '';
  if (!r) {
    if (/\b(maybe|another time|not sure)\b/i.test(t)) r = 'maybe';
    else if (/\b(can[’']?t|cannot|won[’']?t|sadly|no)\b/i.test(t)) r = 'no';
    else if (/\b(yes|yay|count me in|i[’']?ll be there|i[’']?m in)\b/i.test(t)) r = 'yes';
  }
  const party = t.match(/👥\s*Party of (\d+)/u);
  const name = t.match(/^—\s*(.+)$/mu);
  return { r, n: party ? Math.max(1, Math.min(50, Number(party[1]))) : 1, name: name ? name[1].trim().slice(0, 60) : '' };
}

// Totals for a list of replies: people coming, and how many said each answer.
export function tally(replies = []) {
  const out = { yes: 0, maybe: 0, no: 0, coming: 0 };
  for (const x of replies) {
    if (!Object.hasOwn(out, x.r) || x.r === 'coming') continue;
    out[x.r] += 1;
    if (x.r === 'yes') out.coming += Math.max(1, Number(x.n) || 1);
  }
  return out;
}

// Adds or updates an entry (matched by the invitation's id), newest first.
// Replies already logged against it are kept when it's sealed again.
export function upsertSent(list, entry) {
  const old = list.find(e => e.id === entry.id);
  const merged = { ...entry, replies: old?.replies || [] };
  return [merged, ...list.filter(e => e.id !== entry.id)].slice(0, MAX_SENT);
}

// A cleaned-up history from storage (it may have been written by an older version).
export function cleanSent(raw) {
  if (!Array.isArray(raw)) return [];
  return raw.filter(e => e && typeof e === 'object' && typeof e.id === 'string' && typeof e.url === 'string')
    .map(e => ({ ...e, replies: Array.isArray(e.replies) ? e.replies.filter(x => x && typeof x === 'object') : [] }));
}
