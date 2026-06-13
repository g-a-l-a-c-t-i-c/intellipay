# Testing

_Last updated: 2026-06-13_

## Test Framework

- **Unit/Integration:** vitest (Cloudflare Workers environment via `@cloudflare/vitest-pool-workers`)
- **E2E:** Planned — curl-based smoke tests via `galactic test intellipay --smoke`

## Test Scripts (planned)

```json
{
  "test": "vitest run",
  "test:watch": "vitest",
  "test:coverage": "vitest run --coverage"
}
```

## Coverage Gaps (as of initial scaffold)

| Area | Status |
|------|--------|
| Merchant auth (API key validation) | Not written |
| Data vault encryption/decryption | Not written |
| Checkout optimization logic | Not written |
| Payment processing (Stripe) | Not written |
| Analytics API endpoints | Not written |
| GDPR delete flow | Not written |

## Rules

- Tests must run against real D1 (no mocks) per global CLAUDE.md
- Use `@cloudflare/vitest-pool-workers` for Workers environment compatibility
- Each test that writes data must clean up after itself (use transactions or unique merchant IDs)
