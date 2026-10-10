# Launch Plan — 2026-10-09

No `docs/epics/EPIC-N-*.md` exists, so tickets live here only (no epics dir imposed). Cross-linked from TODO.md was NOT edited (audit-only). Code changes route via Codemind then /ship per global rules; use `@g-a-l-a-c-t-i-c/*` packages first.

## P0 — Blockers (Critical)
1. **L-1 Real payment processing**: integrate processor (Stripe) for checkout/complete; verify amount/payment server-side; set `customer_id`; idempotency key. Replaces `checkout.ts:62-77`.
2. **L-2 Fraud detection**: implement Workers AI scoring on `/sessions` and `/complete` with a tested fallback policy.
3. **L-3 Provision + deploy**: `galactic provision intellipay`, fill real D1/KV IDs, set `ENCRYPTION_KEY`/`JWT_SECRET` secrets, `galactic migrate`, verify `/health`; drop hardcoded `ENVIRONMENT`.
4. **L-4 Test suite**: vitest + workers pool against real D1: onboarding, customer CRUD + GDPR erasure, tenant-isolation (merchant A cannot read B), checkout flow, crypto round-trip. Wire CI (build+typecheck+test).

## P1 — High
5. **L-5 Crypto hardening**: require exactly 64 hex chars for `ENCRYPTION_KEY`, throw otherwise (`crypto.ts:3`); add key versioning for rotation.
6. **L-6 Merchant onboarding protection**: auth/invite or rate limit on `POST /api/merchants`; restrict CORS origins.
7. **L-7 Tenancy decision**: PRD says per-merchant D1; code is shared D1 row-scoped. Decide (ADR) and update PRD or implement.
8. **L-8 UI surface**: merchant dashboard (analytics, customers, erasure) and checkout widget consuming `optimization_config`; use website platform per global rules; wire to existing endpoints.
9. **L-9 Shadow Mode** (`ctx.waitUntil` mirroring) and **L-10 TaptoPhone/PCI scoping**: spec first in SPECS.md; confirm Phase 1 vs 2 scope with product owner.
10. **L-11 Validate AI output**: schema-validate `optimization_config`, log degraded path, measure p99 vs <100ms.

## P2 — Medium/Low
11. Audit-log all vault reads/writes/exports; paginate `GET /customers`; fix `PUT` 404 on no match; wire or remove `tier-guard`/`JWT_SECRET`; malformed-JSON 400s.
12. Ops: Sentry, `.watcher.yaml` + PostHog project, RUNBOOK rollback, privacy policy + ToS, docs reconciliation (CLAUDE.md "Current State", create EPIC files via `/decompose`).

Suggested order: L-3 and L-4 first (unblock verification), then L-1/L-2, L-5/L-6, UI, then Shadow/NFC.

Files are uncommitted pending review.
