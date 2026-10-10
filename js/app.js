// Invitations live in the URL fragment, which never reaches a web server: either
// the whole invitation (#i=…) or a short code to fetch it by (#aB3xYz9k).
// Each side is loaded only when it's needed, so someone opening an invitation
// never downloads the builder (and the other way round). "&preview" marks the
// sender watching their own invitation from the builder.
async function route() {
  const full = location.hash.match(/^#i=([^&]+)(&preview)?$/);
  const short = location.hash.match(/^#([A-Za-z0-9]{8})$/);
  if (full || short) (await import('./invite.js')).showInvite(full ? { code: full[1] } : { short: short[1] }, { preview: !!full?.[2] });
  else (await import('./builder.js')).showBuilder();
}

addEventListener('hashchange', route);
route();
