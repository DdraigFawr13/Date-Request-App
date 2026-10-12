# Decisions

Settled rules for this project. Not a changelog: an entry stays while the rule is in force. Change a rule here in the same change that changes the behaviour. Mark ideas Proposed until Morgan approves them; mark retired entries SUPERSEDED with a pointer, never delete them.

## D-001 AI rules come from AI-Master-Instructions

- **Status:** Accepted (2026-10-12)
- **Decision:** Shared AI rules, agents, the session hook and the branch-cleanup workflow are synced from AI-Master-Instructions at the version in `.ai-master.json`. Project-specific rules live in `AGENTS.md`.
- **Why:** one maintained copy instead of hand-copied files that drift; this repo is the pilot.

## D-002 Invitation data stays with the people using it

- **Status:** Accepted (before 2026-10-12, recorded from README "Privacy notes")
- **Decision:** Sent invitations and replies stay in the sender's browser. Short links are stored by code only, with no listing or browsing. No phone numbers are stored.
- **Why:** privacy by default; the app has no accounts.
