import { showBuilder } from './builder.js';
import { showInvite } from './invite.js';

// Invitations live in the URL fragment (#i=…), which never reaches a server.
function route() {
  const match = location.hash.match(/^#i=(.+)$/);
  if (match) showInvite(match[1]);
  else showBuilder();
}

addEventListener('hashchange', route);
route();
