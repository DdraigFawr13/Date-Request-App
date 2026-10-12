# Handoff

Updated: 2026-10-12. A fresh session must be able to continue from this file alone. Keep it to 60 lines; move finished entries to `docs/archive/handoff-YYYY-MM.md`.

## Phase

Maintenance. The app is live at https://moonpost-invite.vercel.app/.

## Just done

- 2026-10-12 Adopted AI-Master-Instructions v0.2.0 (pilot): shared rules, agents, session hook, drift check in CI, CI timeouts and pinned actions.
- 2026-10-12 Turned off Vercel branch previews: only `main` deploys (D-003, WEB-04).

## Next

1. After master v0.2.0 is released, re-sync from the tag (`node .claude/master/sync.mjs`) and run `--check`.

## Open questions

- None.

## Decisions since the last plan update

- 2026-10-12 D-001: AI rules come from AI-Master-Instructions.
- 2026-10-12 D-003: Vercel deploys from `main` only; branch previews are off.
