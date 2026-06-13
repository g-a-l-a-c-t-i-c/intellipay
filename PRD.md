# Product Requirements Document

_Last updated: 2026-06-13. Full PRD at `/Users/am/galactic/PRD/intellipay-PRD.md`._

## Vision

Intellipay is the world's first privacy-compliant, AI-powered commerce intelligence platform that transforms checkout optimization into complete business intelligence — while merchants retain 100% data ownership through isolated, encrypted data vaults.

## Goals

- Enable mid-market merchants ($1M–$10M ARR) to improve checkout conversion by 15–25% via AI-powered optimization
- Provide complete data ownership through per-merchant encrypted data vaults (AES-256-GCM)
- Enable zero-risk platform migration via Shadow Mode traffic mirroring
- Reduce interchange fees by 60% via TaptoPhone NFC direct payment processing
- Reach break-even by Month 14 with 1,155 merchants and $8.2M ARR

## Non-Goals

- Intellipay does not aggregate or share merchant data cross-tenant — privacy by design
- Phase 1 does not include the vertical template system (Phase 2)
- Phase 1 does not include the full marketing automation engine (Phase 2)

## Target Users

- **Primary:** Mid-market e-commerce merchants ($1M–$10M annual revenue)
- **Secondary:** SMB merchants ($100K–$1M annual revenue)
- **Tertiary:** Enterprise merchants ($10M+)

## Core Features (Phase 1 MVP)

### Merchant Data Vault
Per-merchant isolated D1 database with AES-256-GCM encrypted customer profiles. Full GDPR/CCPA compliance with right-to-erasure.

### AI-Powered Checkout Optimization
Real-time checkout personalization: dynamic form field ordering, payment method prioritization, fraud detection via Workers AI. Target: <100ms inference, 15–25% conversion lift.

### Shadow Mode Migration
Zero-risk migration via `ctx.waitUntil()` traffic mirroring. Side-by-side comparison before gradual cutover (1% → 100%).

### TaptoPhone Payment Processing
NFC payment terminal integration, PCI DSS compliant, reducing interchange fees by 60%.

## Success Metrics

- Checkout conversion rate improvement: 15–25%
- ML inference latency: <100ms p99
- Checkout load time: <2s
- System uptime: 99.99%
- Year 1 merchants: 1,155
- Year 1 ARR: $8.2M
