# Data Flows

_Last updated: 2026-06-13_

## Checkout Optimization Flow

```
Merchant Checkout Page
  → POST /api/checkout/sessions (create session, load merchant config)
  → Workers AI inference (fraud score, field ordering, payment method priority) — <100ms
  → KV: store session state (TTL: 2h)
  → Return optimized checkout config to client JS widget
  → POST /api/checkout/complete (process payment via Stripe)
  → D1: write transaction record
  → D1: write behavioral analytics (async via ctx.waitUntil)
```

## Shadow Mode Migration Flow

```
Incoming checkout request
  → Primary path: existing platform processes request (sync)
  → ctx.waitUntil: mirror request to intellipay for side-by-side comparison (async)
  → Compare: response time, conversion signal, error rate
  → Dashboard: show migration readiness percentage
  → Traffic shifting: gradually route 1% → 10% → 100% to intellipay
```

## Merchant Data Vault Write Flow

```
POST /api/customers (create/update customer)
  → Validate merchant API key
  → AES-256-GCM encrypt PII fields (email, profile)
  → D1: insert/update customers row
  → D1: write audit_log entry (GDPR compliance)
  → Return customer ID (no PII in response)
```

## Analytics Pipeline

```
Transaction completed
  → ctx.waitUntil: async analytics write
  → D1: behavioral_analytics table
  → Aggregation (hourly cron): roll up metrics into dashboard_stats
  → GET /api/analytics/dashboard: read pre-aggregated stats
  → GET /api/analytics/insights: Workers AI generates natural language insights
```

## GDPR Delete Flow

```
DELETE /api/customers/{id}
  → Validate merchant ownership
  → D1: set gdpr_deleted=1, null out encrypted fields
  → D1: write audit_log entry (GDPR_DELETE action)
  → Return 204 No Content
  → Async: R2 export deletion (if any exports contain customer data)
```
