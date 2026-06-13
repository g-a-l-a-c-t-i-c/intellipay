# intellipay — CLAUDE.md

_Last updated: 2026-06-13_

## What This Is

Intellipay is an AI-first, privacy-compliant commerce intelligence platform built on Cloudflare Workers. It provides per-merchant isolated data vaults, checkout optimization via Workers AI, and a unified analytics API. Deployed as a WfP product on the Galactic Platform (`galactic-products` dispatch namespace).

## Stack

| Layer | Technology |
|-------|-----------|
| API framework | Hono |
| Runtime | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) — binding: `DB` |
| Session storage | Cloudflare KV — binding: `SESSIONS` |
| ML inference | Cloudflare Workers AI — binding: `AI` |
| Platform packages | `@g-a-l-a-c-t-i-c/cloudflare`, `@g-a-l-a-c-t-i-c/platform-types`, `@g-a-l-a-c-t-i-c/tier-guard` |
| Auth | API key (SHA-256 hashed) + merchant_id scoping |
| Encryption | AES-256-GCM via Web Crypto API (`src/lib/crypto.ts`) |

## Key Rules

- **All D1 queries must be scoped to `merchant_id`** — no unscoped SELECT across tenants (enforced by `no-cross-merchant-query` in RULES.md)
- **PII stored encrypted** — `email_enc`, `profile_enc` columns use AES-256-GCM; key from `ENCRYPTION_KEY` Worker secret
- **Money as INTEGER cents** with `_cents` suffix — display layer divides by 100
- **Timestamps as TEXT ISO-8601** (never INTEGER epoch): `DEFAULT (datetime('now'))`
- **Throw on every error** — no empty catch blocks; AI inference failure is the only intentional degraded path (falls back to static defaults)
- **Use `galactic` CLI** for all DevOps (provision, deploy, migrate, logs) — this is a Galactic Platform product

## Current State (2026-06-13)

- Phase 1 MVP implemented (`src/`) — not yet deployed (needs `galactic provision intellipay`)
- Routes: `/health`, `/api/merchants`, `/api/checkout/sessions`, `/api/checkout/complete`, `/api/customers`, `/api/analytics/dashboard`
- D1 schema: `migrations/0001_initial.sql` — merchants, customers, transactions, audit_log
- wrangler.toml D1/KV IDs are placeholders — fill in after `galactic provision intellipay`

## Flow

```
Request → galactic-dispatch (WfP) → intellipay Worker (Hono)
  → auth middleware (API key → merchant_id)
  → route handler (all queries scoped to merchant_id)
  → D1 (data) / KV (sessions) / Workers AI (inference)
```

## Deploy

```bash
galactic provision intellipay   # first time — creates D1, KV, WfP binding
galactic deploy                 # subsequent deploys
galactic migrate migrations/0001_initial.sql
galactic logs intellipay
```
