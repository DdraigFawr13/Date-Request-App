# Handoff

Updated: 2026-10-12. A fresh session must be able to continue from this file alone. Keep it to 60 lines; move finished entries to `docs/archive/handoff-YYYY-MM.md`.

## Phase

Maintenance. The app is live at https://moonpost-invite.vercel.app/.

## Just done

- 2026-10-12 Adopted AI-Master-Instructions v0.2.0 (pilot): shared rules, agents, session hook, drift check in CI, CI timeouts and pinned actions.

## Next

1. Morgan: decide whether to turn off Vercel branch previews (WEB-04). If yes, add the `git.deploymentEnabled` rule to `vercel.json` and remove the override.

## Open questions

- Turn off Vercel branch previews so only `main` deploys? Recommended: yes, it matches the other projects and every merge still deploys.

## Decisions since the last plan update

- 2026-10-12 D-001: AI rules come from AI-Master-Instructions.
