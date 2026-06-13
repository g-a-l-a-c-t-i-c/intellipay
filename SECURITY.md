# Security

_Last updated: 2026-06-13_

## Authentication

- **Merchant API keys:** SHA-256 hashed at rest in D1; passed as `Authorization: Bearer <key>` header
- **JWTs:** RS256 signed, 1h expiry; secret stored as Cloudflare Worker secret `JWT_SECRET`
- **MFA:** Planned Phase 2 — TOTP-based via authenticator apps

## Authorization

- **RBAC:** Merchant → roles: `owner`, `admin`, `viewer`
- **Tenant isolation:** All D1 queries are scoped to `merchant_id` extracted from validated JWT — no cross-merchant data access possible at API layer
- **Rate limiting:** 1000 req/min per merchant API key via KV counters

## Encryption

- **At rest:** AES-256-GCM field-level encryption on all PII (email, customer profiles) using `@g-a-l-a-c-t-i-c/cloudflare` utilities
- **Key storage:** Cloudflare Worker secret `ENCRYPTION_KEY` — never in code or D1
- **In transit:** TLS 1.3 enforced by Cloudflare edge

## Trust Boundaries

| Boundary | Trust Level | Mechanism |
|----------|-------------|-----------|
| Public internet → Worker | Untrusted | API key + JWT validation on every request |
| Worker → D1 | Trusted (same account) | CF binding, merchant_id scoping |
| Worker → Workers AI | Trusted (same account) | CF binding |
| Worker → Stripe | Semi-trusted | HTTPS + Stripe-Signature header |
| Worker → billing-service | Trusted (RPC) | Service binding |

## Compliance

- GDPR: right-to-erasure implemented via `gdpr_deleted` flag + field nullification
- CCPA: data export via `GET /api/customers/{id}/export` (planned)
- PCI DSS: no raw card data stored — Stripe tokenizes all card data
- Audit logging: all data vault operations logged to `audit_log` table

## Secrets (references only — never raw values)

| Secret | Location |
|--------|---------|
| `JWT_SECRET` | Cloudflare Worker secret |
| `ENCRYPTION_KEY` | Cloudflare Worker secret |
| `STRIPE_SECRET_KEY` | Cloudflare Worker secret |
| `WEBHOOK_SECRET` | Cloudflare Worker secret |
