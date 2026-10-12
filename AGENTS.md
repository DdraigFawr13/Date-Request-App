# Agent instructions

Moonpost: whimsical, themed invitations people build in the browser and send by text. Plain HTML, CSS and JavaScript modules; a small Vercel function stores short links in Vercel Blob. See [README.md](README.md) for features and layout.

Shared rules come from AI-Master-Instructions and load through CLAUDE.md (`.claude/master/RULES.md`, layers `core`, `stacks/node-web`, `project-types/web-app`). Don't edit synced files; see `.ai-master.json`.

## Read first

1. `docs/HANDOFF.md`: current state and next step.
2. `docs/DECISIONS.md`: settled rules.
3. `docs/LESSONS.md`: entries for the area you're working in.

## Local checks (run before pushing)

- Every push: `npm test` (Node's test runner, `tests/`).
- UI, invitation or `e2e/` changes: also `npm run test:e2e` (Playwright, Chromium on a Pixel 7 viewport).
- After a sync: `node .claude/master/sync.mjs --check`.

## What CI runs

- **Test** (`pages.yml`): unit tests, the AI-master drift check and Playwright e2e on every PR update and `main` push.
- On `main` only, it also publishes `moved/` to GitHub Pages, which forwards the old address to Vercel.
- Vercel deploys production from `main` (`vercel.json`, `scripts/build.sh` stamps a release id on every module import).

## Project rules

- No build step for the app: keep imports in the form `from './name.js'` or `import('./name.js')` so the deploy can stamp them (a test checks this).
- Invitations live in the link or in Blob storage under an unguessable code; never add listing, browsing or editing of stored invitations.
- Sent invitations and logged replies stay in the browser's localStorage. Never upload them or store phone numbers (APP-01).
- When the short-link API fails, the full invitation must still travel in the link (APP-03).
- Fonts and art must be openly licensed; record their source and licence (SAFE-05).

## Overrides

- **WEB-01**: plain JavaScript with no build toolchain; CI and Vercel use Node 22 and the lockfile. Pin exact versions if a build step is added.
- **WEB-04**: Vercel still builds branch previews; turning them off is an open question for Morgan (`docs/HANDOFF.md`).
