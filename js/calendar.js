// "Add to calendar" helpers: an .ics file (Apple Calendar, Outlook desktop, and
// most phones) plus Google and Outlook.com deep links.

import { MODULES } from './modules.js';
import { partsInTz } from './themes.js';

const DEFAULT_DURATION = 2 * 3600e3;

export function endOf(inv) {
  return inv.e && inv.e > inv.s ? inv.e : inv.s + DEFAULT_DURATION;
}

// When the event is over: the end time, or the end of the day for all-day events.
export function finishedAt(inv) {
  return inv.ad ? inv.s + 864e5 : endOf(inv);
}
export const isPast = (inv, now = Date.now()) => finishedAt(inv) <= now;

// Plain-text "icon Label: value" lines for every filled-in detail.
export function detailLines(inv) {
  const lines = [];
  for (const m of MODULES) {
    const v = inv.d?.[m.id];
    if (!v || m.id === 'rsvpby') continue;
    if (m.type === 'link') { if (v.u) lines.push(`${m.icon} ${v.l || m.label}: ${v.u}`); continue; }
    lines.push(`${m.icon} ${inv.dl?.[m.id] || m.label}: ${v}`);
  }
  for (const c of inv.cf || []) if (c.l || c.v) lines.push(`${c.i || '✦'} ${c.l ? c.l + ': ' : ''}${c.v || ''}`);
  return lines;
}

export function eventDescription(inv, url) {
  const parts = [];
  if (inv.msg) parts.push(inv.msg);
  const lines = detailLines(inv);
  if (lines.length) parts.push(lines.join('\n'));
  if (inv.from) parts.push(`Invited by ${inv.from}`);
  if (url) parts.push(`Your invitation: ${url}`);
  return parts.join('\n\n');
}

export function eventLocation(inv) {
  return [inv.loc, inv.addr].filter(Boolean).join(', ');
}

const utcStamp = ms => new Date(ms).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');

function dateStamp(ms, tz, addDays = 0) {
  const { year, month, day } = partsInTz(ms, tz);
  const d = new Date(Date.UTC(year, month - 1, day + addDays));
  return d.toISOString().slice(0, 10).replace(/-/g, '');
}

const icsEscape = s => String(s).replace(/\\/g, '\\\\').replace(/\r?\n/g, '\\n').replace(/,/g, '\\,').replace(/;/g, '\\;');

// RFC 5545 lines are folded at 75 octets without splitting a UTF-8 character.
function fold(line) {
  const enc = new TextEncoder();
  const out = [];
  let cur = '', bytes = 0;
  for (const ch of line) {
    const n = enc.encode(ch).length;
    if (bytes + n > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch; bytes += n;
  }
  out.push(cur);
  return out.join('\r\n ');
}

export function buildIcs(inv, url) {
  const title = inv.title || 'An invitation';
  const lines = [
    'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Moonpost//Invitations//EN', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${inv.id || inv.s}@moonpost`,
    `DTSTAMP:${utcStamp(Date.now())}`,
  ];
  if (inv.ad) {
    lines.push(`DTSTART;VALUE=DATE:${dateStamp(inv.s, inv.tz)}`, `DTEND;VALUE=DATE:${dateStamp(inv.s, inv.tz, 1)}`);
  } else {
    lines.push(`DTSTART:${utcStamp(inv.s)}`, `DTEND:${utcStamp(endOf(inv))}`);
  }
  lines.push(`SUMMARY:${icsEscape(title)}`);
  const loc = eventLocation(inv);
  if (loc) lines.push(`LOCATION:${icsEscape(loc)}`);
  lines.push(`DESCRIPTION:${icsEscape(eventDescription(inv, url))}`);
  if (url) lines.push(`URL:${url}`);
  if (inv.rm > 0) {
    lines.push('BEGIN:VALARM', 'ACTION:DISPLAY', `DESCRIPTION:${icsEscape(title)}`, `TRIGGER:-PT${Math.round(inv.rm)}M`, 'END:VALARM');
  }
  lines.push('END:VEVENT', 'END:VCALENDAR');
  return lines.map(fold).join('\r\n') + '\r\n';
}

export function googleUrl(inv, url) {
  const dates = inv.ad
    ? `${dateStamp(inv.s, inv.tz)}/${dateStamp(inv.s, inv.tz, 1)}`
    : `${utcStamp(inv.s)}/${utcStamp(endOf(inv))}`;
  const q = new URLSearchParams({
    action: 'TEMPLATE', text: inv.title || 'An invitation', dates,
    details: eventDescription(inv, url), location: eventLocation(inv),
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export function outlookUrl(inv, url) {
  const q = new URLSearchParams({
    path: '/calendar/action/compose', rru: 'addevent', subject: inv.title || 'An invitation',
    startdt: new Date(inv.s).toISOString(), enddt: new Date(endOf(inv)).toISOString(),
    body: eventDescription(inv, url), location: eventLocation(inv),
  });
  if (inv.ad) q.set('allday', 'true');
  return `https://outlook.live.com/calendar/0/deeplink/compose?${q}`;
}

export function downloadIcs(inv, url) {
  const ics = buildIcs(inv, url);
  const name = (inv.title || 'invitation').replace(/[^\w\- ]+/g, '').trim().replace(/\s+/g, '-').toLowerCase() || 'invitation';
  // iOS Safari opens the "Add to Calendar" sheet for a calendar data URL.
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) {
    window.location.href = 'data:text/calendar;charset=utf-8,' + encodeURIComponent(ics);
    return;
  }
  const blobUrl = URL.createObjectURL(new Blob([ics], { type: 'text/calendar;charset=utf-8' }));
  const a = Object.assign(document.createElement('a'), { href: blobUrl, download: `${name}.ics` });
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(blobUrl), 10_000);
}
