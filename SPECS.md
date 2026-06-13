# Specs

_Last updated: 2026-06-13_

| Spec | Date | Status | Summary |
|------|------|--------|---------|
| PRD v1.0 | 2025-01 | Active | Commerce Intelligence Platform — merchant data vaults, AI checkout optimization, NFC payments |

## Key Decisions from PRD

- **Privacy by design:** zero-knowledge architecture, minimal data collection, auto-expiration
- **Per-merchant isolation:** no cross-merchant data sharing at any layer
- **Shadow mode:** zero-risk migration via traffic mirroring before cutover
- **ML inference target:** <100ms for checkout optimization decisions
- **Checkout load time target:** <2s initial load, <500ms interactions
- **Year 1 targets:** 1,155 merchants, $8.2M revenue, break-even Month 14
