# EPIC-N: [Epic Title]

**Priority**: [P0 (Critical) / P1 (High) / P2 (Medium) / P3 (Low)]
**Phase**: [Phase number — 1, 2, 3...]
**Estimated Effort**: [N weeks]

## Overview

[1–3 sentences describing what this epic delivers and why it matters.]

## User Story

As a [persona], I want [capability] so that [benefit].

## Child Tickets

### TICKET-N.1: [Ticket Title]
**Story Points**: [1/2/3/5/8/13]
**Dependencies**: [None | TICKET-N.X | EPIC-X]

**Description:**
[2–4 sentences describing what this ticket delivers.]

**Acceptance Criteria:**
- [ ] [Specific, testable criterion]
- [ ] [Error handling / edge case]
- [ ] [Observability — log/metric the work emits]

**Technical Notes:**
- [Implementation detail, library choice, performance target, or constraint]

---

## Definition of Done

- [ ] All child tickets complete
- [ ] Tests passing (unit + integration against real D1 per CLAUDE.md)
- [ ] CHANGELOG.md entry added
- [ ] Deployed to production via `galactic deploy`
- [ ] Logs verified via `galactic logs intellipay`

## Notes

- Use one `docs/epics/EPIC-N-<short-name>.md` file per epic.
- Number sequentially as you go (EPIC-1, EPIC-2, ...).
- Keep tickets small enough to ship in 1–3 days each.
- Reference this epic in PR descriptions: `Closes EPIC-N TICKET-N.X`.
- See `AMRTS` repo for a worked example.
