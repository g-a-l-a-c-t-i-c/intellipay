# Launch Readiness Report — 2026-10-09

## Overall Verdict: No-Go

Phase 1 MVP code (456 lines, 6 files in `src/`) exists but is undeployed, untested, has no UI surface, and 2 of 4 PRD core features have no backend. Prior audit: none.

## Dimension 1: Full-stack implementation vs. PRD
UI surface candidates found: none (no React/Vue/Astro/Expo, no dashboard dir). API-only repo. No `docs/epics/EPIC-N` files exist (template only); findings grouped by PRD section.

| PRD feature | Verdict | Severity | Evidence |
|---|---|---|---|
| Merchant Data Vault: AES-256-GCM encrypted customers, GDPR erasure | Backend real, No UI surface | High (PRD names a merchant dashboard; WIREFRAMES/USER_FLOWS imply UI) | `src/routes/customers.ts:17-97`, `src/lib/crypto.ts:28-45`, erasure `customers.ts:79-97` |
| Vault: "per-merchant isolated D1 database" | Backend missing (single shared D1, row-scoped by merchant_id) | High | `wrangler.toml` single `DB`; `migrations/0001_initial.sql` |
| Vault: key handling | Defect: `importKey` zero-pads/truncates short keys (`crypto.ts:4`) so a weak `ENCRYPTION_KEY` silently works; non-hex input yields NaN bytes | High | `src/lib/crypto.ts:3-6` |
| AI checkout optimization (field order, payment priority) | Backend partial; no UI/checkout widget consuming `optimization_config` | High | `src/routes/checkout.ts:23-48`; LLM output merged unvalidated into response (`:41-44`); model is llama-3-8b via text prompt, no latency measurement vs <100ms target |
| Fraud detection via Workers AI | Backend missing | Critical (golden path: payments) | no fraud code anywhere in `src/` |
| Checkout complete / transactions | Backend stub: records a "complete" tx from client-supplied `amount_cents`/`stripe_id`; no Stripe/processor call or verification; `customer_id` always null | Critical | `checkout.ts:62-77` |
| Shadow Mode migration | Backend missing | High (named core feature) | no `waitUntil` mirroring in `src/` |
| TaptoPhone NFC / PCI | Backend missing | High (core feature; PCI scope undefined) | none |
| Merchant onboarding `POST /api/merchants` | Backend real, unauthenticated, unthrottled; no UI wizard | High | `src/routes/merchants.ts:9-25` |
| Analytics dashboard API | Backend real, No UI surface | High | `src/routes/analytics.ts:8-33` |
| Audit logging for all vault ops | Partial: only GDPR_DELETE logged; reads/writes/exports not | Medium | `customers.ts:92-95` |
| Tier enforcement (`@g-a-l-a-c-t-i-c/tier-guard` dependency) | Declared, never imported; `planTier` unused | Medium | `package.json`, `middleware/auth.ts` |
| JWT auth (TODO says API key + JWT) | `JWT_SECRET` in Env, unused | Low | `src/index.ts:11` |

Other defects: `PUT /api/customers/:id` returns `updated:true` even when no row matched (`customers.ts:70`); `checkout.ts` catch swallows AI errors without logging (allowed by CLAUDE.md but should `console.warn`); wildcard CORS with Bearer-auth API (`index.ts:18`); no request-body validation/try-catch for malformed JSON (becomes 500 via onError); `GET /api/customers` decrypts all rows with no pagination.

## Dimension 2: Test verification
- Test files: none (`find *.test.ts` empty). `vitest run` would fail with "no test files"; `node_modules` not installed so no run was attempted.
- Golden paths untested: onboarding, customer CRUD + erasure, checkout session to complete, tenant isolation, encryption round-trip.
- No `vitest.config`, though `@cloudflare/vitest-pool-workers` is declared.

## Dimension 3: Deployed assets
Not queried live: nothing is deployed per CLAUDE.md ("not yet deployed"). `wrangler.toml` D1 `database_id` and KV `id` are `placeholder-will-be-set-on-provision`; `ENVIRONMENT = "production"` is hardcoded. No `/health` to hit. Secrets `ENCRYPTION_KEY`, `JWT_SECRET` not set anywhere (not shown). `[[dispatch_namespace]]` binding in a WfP user worker's wrangler is unusual; verify against `galactic provision` output.

## Dimension 4: Operational checklist
| Item | Result |
|---|---|
| Secrets in git | Pass (no key-pattern hits in history spot-check) |
| Error tracking/monitoring | Fail: no Sentry, no `.watcher.yaml`, no PostHog project |
| Rollback path | Fail/unverified: RUNBOOK has no deploy rollback procedure; nothing deployed |
| Legal pages (privacy/terms) | Fail: none; required for a GDPR/CCPA product |
| CI | Fail: no `.github/workflows`, no CI tests |
| Rate limiting / abuse | Fail: unauthenticated merchant creation, no limits |
| Doc drift | PRD/SPECS only 50/16 lines; Epics absent; CLAUDE.md says "Phase 1 MVP implemented" vs 4 core features missing |

## Skipped / Could Not Verify
- Live health/ops-MCP reads: nothing deployed.
- Test execution: no tests exist and dependencies not installed (read-only audit).
- UI-to-endpoint connection: no UI exists.
- Full PRD at `/Users/am/galactic/PRD/intellipay-PRD.md` not read; the repo PRD is a summary.
