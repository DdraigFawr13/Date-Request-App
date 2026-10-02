// Invitations live in the URL fragment (#i=…), which never reaches a server.
// Each side is loaded only when it's needed, so someone opening an invitation
// never downloads the builder (and the other way round). "&preview" marks the
// sender watching their own invitation from the builder.
async function route() {
  const match = location.hash.match(/^#i=([^&]+)(&preview)?$/);
  if (match) (await import('./invite.js')).showInvite(match[1], { preview: !!match[2] });
  else (await import('./builder.js')).showBuilder();
}

addEventListener('hashchange', route);
route();
