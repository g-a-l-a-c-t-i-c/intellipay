# Environments

_Last updated: 2026-06-13_

## Environments

| Environment | Status | Worker Name | D1 Database |
|-------------|--------|-------------|-------------|
| production | not provisioned | `intellipay` | `intellipay` |

## Secrets

All secrets stored as Cloudflare Worker secrets via `galactic secrets set`.

| Secret | Purpose | Set via |
|--------|---------|---------|
| `JWT_SECRET` | JWT signing key for merchant auth | `galactic secrets set intellipay JWT_SECRET <value>` |
| `ENCRYPTION_KEY` | AES-256-GCM master key for data vault | `galactic secrets set intellipay ENCRYPTION_KEY <value>` |
| `STRIPE_SECRET_KEY` | Payment processing (Stripe) | `galactic secrets set intellipay STRIPE_SECRET_KEY <value>` |
| `WEBHOOK_SECRET` | Inbound webhook signature verification | `galactic secrets set intellipay WEBHOOK_SECRET <value>` |

## Environment Files

No `.env` files — all config via `wrangler.toml` vars and Cloudflare Worker secrets.
