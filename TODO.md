# TODO

_Last updated: 2026-06-13_

## Phase 1 — MVP (Months 1–3)

| Priority | Task | Area | Notes |
|----------|------|------|-------|
| High | Provision D1 database + run schema migrations | Infra | `galactic provision intellipay` |
| High | Implement merchant auth (API key + JWT) | Auth | RBAC, MFA planned for Phase 2 |
| High | Implement Merchant Data Vault (per-merchant D1 + AES-256-GCM) | Core | Use `@g-a-l-a-c-t-i-c/cloudflare` encryption |
| High | Build checkout optimization Worker (form field ordering, payment prioritization) | Core | <100ms ML inference target |
| High | Integrate Workers AI for fraud detection | AI/ML | Cloudflare AI binding |
| High | Build analytics dashboard API endpoints | API | `/api/analytics/dashboard` |
| Medium | Implement Shadow Mode traffic mirroring | Core | `ctx.waitUntil()` for side-by-side comparison |
| Medium | TaptoPhone NFC payment processing integration | Payments | PCI DSS compliance required |
| Medium | Merchant onboarding API (`POST /api/merchants`) | API | Step-by-step setup wizard |
| Medium | Audit logging for all data vault operations | Security | GDPR/CCPA compliance |
| Low | Set up Watcher enrollment (`.watcher.yaml`) | Observability | PostHog project needed |
| Low | Write unit + integration tests | Testing | vitest against real D1 |

## Phase 2 — Core Platform (Months 4–6)

| Priority | Task | Area |
|----------|------|------|
| Medium | Vertical template system (Fashion, Food, B2B) | Product |
| Medium | Advanced analytics platform (ClickHouse integration) | Analytics |
| Medium | Marketing automation engine | Marketing |
| Low | Custom integration builder | Integrations |
