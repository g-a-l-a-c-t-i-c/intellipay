# Architecture Decisions

_When to add an ADR: if you'd put it in CLAUDE.md, put it here instead._

_Last updated: 2026-06-13_

## ADR-1 — 2026-06-13 — Active
**Title:** Deploy as WfP product on galactic-dispatch
**Context:** Intellipay is a new product in the Galactic Platform portfolio. Needs to use shared billing, AI gateway, and vendor services without HTTP overhead.
**Decision:** Deploy via `galactic provision intellipay` into the `galactic-products` WfP dispatch namespace. Use RPC service bindings for billing and vendors.
**Consequences:** Must follow WfP routing conventions; gets platform billing/auth for free; can't use standalone `wrangler dev` easily.
**Rule:** See global CLAUDE.md `galactic-dispatch` rule.

## ADR-2 — 2026-06-13 — Active
**Title:** Per-merchant D1 schema isolation (not row-level)
**Context:** PRD requires zero cross-merchant data leakage. Row-level isolation with tenant_id is simpler but has higher risk of misconfigured queries.
**Decision:** Use merchant_id scoping at the query layer (enforced by `no-cross-merchant-query` rule). All queries parameterized with merchant_id from validated JWT.
**Consequences:** Simpler than separate D1 databases per merchant; requires strict query discipline (enforced by RULES.md); scales better on D1 billing.
**Rule:** `no-cross-merchant-query`

## ADR-3 — 2026-06-13 — Active
**Title:** AES-256-GCM field-level encryption using @g-a-l-a-c-t-i-c/cloudflare
**Context:** PII (email, customer profiles) must be encrypted at rest per PRD. D1 encryption-at-rest is not field-level.
**Decision:** Use `@g-a-l-a-c-t-i-c/cloudflare` encrypt/decrypt utilities for all PII fields. Encrypted columns named with `_enc` suffix.
**Consequences:** Slightly slower writes; can't query on encrypted fields; master key rotation requires re-encryption; enforced by `no-raw-pii-storage` rule.
**Rule:** `no-raw-pii-storage`
