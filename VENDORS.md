# Vendors

_Last updated: 2026-06-13_

## Stripe

- **Purpose:** Payment processing, refunds, payment method management
- **Accounts per env:** DEV: <!-- TODO --> | STAGE: <!-- TODO --> | PROD: <!-- TODO -->
- **Secrets location:** Cloudflare Worker secret `STRIPE_SECRET_KEY`
- **API version:** `2024-06-20` (latest stable)
- **Pricing:** 2.9% + $0.30 per transaction
- **Data storage:** `transactions` table (payment_intent_id, charge_id)
- **Reconciliation:** Daily batch via `/api/payments/reconcile`

## Cloudflare Workers AI

- **Purpose:** ML inference — fraud detection, checkout field optimization, customer behavior analysis
- **Accounts per env:** Single account (Galactic CF account)
- **Secrets location:** CF AI binding (no separate secret needed)
- **Models used:** `@cf/meta/llama-3-8b-instruct`, `@cf/huggingface/distilbert-sst-2-int8` (fraud signals)
- **Pricing:** Per-neuron pricing via CF Workers AI
- **Data storage:** No raw model data stored — inference only

## Cloudflare D1

- **Purpose:** Per-merchant isolated data vaults, transaction logs, analytics
- **Secrets location:** D1 binding via `wrangler.toml`
- **Pricing:** Included in CF Workers paid plan

## Cloudflare KV

- **Purpose:** Checkout session state, rate limiting counters
- **Secrets location:** KV binding via `wrangler.toml`

## Cloudflare R2

- **Purpose:** Analytics report exports, audit log archives
- **Secrets location:** R2 binding via `wrangler.toml`
