# Handoff: short links on Vercel (October 2026)

State at the end of the session that replaced is.gd with Moonpost's own short
links. Everything below is live and verified (a real seal → short link → open).

## How it works now

- **App:** https://moonpost-invite.vercel.app (Vercel project `date-request-app`,
  team `golden-goose-engineering-group`). Every push to `main` deploys it.
  `vercel.json` + `scripts/build.sh` copy the site to `dist/` and stamp the
  release on every import (`version.txt` shows the deployed commit).
- **Short links:** `api/invites.js` (a Vercel function). `POST {data}` stores the
  encoded invitation and returns an 8-character code; `GET ?code=` returns it.
  Links look like `…/#aB3xYz9k`; `js/app.js` routes them, `js/links.js` calls
  the API.
- **Storage:** Vercel Blob store `moonpost-data` (`store_kFVAaLSWqiknTCBJ`).
  It is a **private** store: the code must use `access: 'private'` (public
  access fails with "Cannot use public access on a private store"). Auth is
  automatic (OIDC + `BLOB_STORE_ID`); there is no `BLOB_READ_WRITE_TOKEN`.
- **Fallback:** if the API is unreachable, sealing returns the self-contained
  `#i=` link in the compact `y` format (`js/codec.js`: minute times, occasion
  defaults left out; ~270 chars for a typical invite). Old `z`/`j` links still
  decode.
- **Old address:** GitHub Pages (`ddraigfawr13.github.io/Date-Request-App/`) now
  only serves `moved/index.html`, which forwards `#…` links to the Vercel
  address. The GitHub workflow runs the tests on every push and PR, then
  publishes that page from `main`.

## Gotchas

- Sent-invitation history is in localStorage **per address**: anything sealed
  on the old GitHub Pages address doesn't appear on the Vercel one.
- Vercel Hobby keeps runtime logs for 1 hour; check them soon after a problem.
- Cloud Claude sessions on this repo can't reach `vercel.app` /
  `api.vercel.com` unless those hosts are allowed in the environment's network
  settings. The Vercel connector (now authorized for the team) works
  regardless: deployments, env vars, runtime logs, and
  `web_fetch_vercel_url` for GET requests.
- e2e tests mock `/api/invites`; wait for `#result-url` to hold a value after
  sealing before reading it (sealing is async).

## Leftovers

- Supabase project `moonpost` (`nroywllxiazkvyyvcbrj`, us-east-1) was the first
  attempt at short links. It is **paused** and unused; delete it from the
  Supabase dashboard when convenient.

## Next ideas (from the review, not started)

1. **Edit without re-sending:** have `POST` also return a secret edit token
   (kept in the sender's sent list), and add an update route so re-sealing an
   edited invitation updates the same short link.
2. **Replies without copy-paste:** record answers against the code so "Your
   invitations" shows live headcounts. Bigger; most useful for group invites.
