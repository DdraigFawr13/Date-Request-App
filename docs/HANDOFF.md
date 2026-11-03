# Handoff

Updated: 2026-11-03. A fresh session must be able to continue from this file alone. Keep it to 60 lines; move finished entries to `docs/archive/handoff-YYYY-MM.md`.

## Phase

Maintenance. The app is live at https://moonpost-invite.vercel.app/.

## Just done

- 2026-11-03 Upgraded AI-Master-Instructions v0.3.0 → v4.4.0 on `claude/hooks-s5-v4.4.0` (draft PR; hooks rollout S5). Sync ran twice; guard hooks now ask before force pushes, test deletions and edits to synced files. `npm run check` adds the warn-only `test-traps.mjs`. `pages.yml` skips draft PRs (CI-06). D-003 now cites CI-05 (WEB-04 retired).
- 2026-10-12 Adopted AI-Master-Instructions v0.2.0 (pilot): shared rules, agents, session hook, drift check in CI, CI timeouts and pinned actions.
- 2026-10-12 Turned off Vercel branch previews: only `main` deploys (D-003, CI-05).

## Next

1. Mark PR #28 ready so CI runs; merge once green and Morgan confirms.
2. After merge, check the first `main` run and that Vercel deployed the merge commit (CI-05).

## Open questions

- None.

## Decisions since the last plan update

- 2026-11-03 Morgan approved test time budgets: `npm run check` < 10 s, `npm run test:e2e` < 60 s (AGENTS.md).
- 2026-10-12 D-001: AI rules come from AI-Master-Instructions.
- 2026-10-12 D-003: Vercel deploys from `main` only; branch previews are off.
