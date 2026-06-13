# Interfaces

_Last updated: 2026-06-13. How developers and AI agents interact with intellipay programmatically._

---

## HTTP API

Base: `https://intellipay.g-a-l-a-c-t-i-c.com` (planned)

Auth: `Authorization: Bearer <api_key>` on all endpoints. JWT issued via `/api/auth/token`.

### Merchant Management

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/merchants` | Create merchant account |
| GET | `/api/merchants/{id}` | Get merchant details |
| PUT | `/api/merchants/{id}` | Update merchant settings |
| DELETE | `/api/merchants/{id}` | Deactivate merchant |

### Checkout

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/checkout/sessions` | Create checkout session (returns optimized config) |
| GET | `/api/checkout/sessions/{id}` | Get session details |
| PUT | `/api/checkout/sessions/{id}` | Update session |
| POST | `/api/checkout/complete` | Complete transaction |

### Analytics

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/analytics/dashboard` | Dashboard metrics (pre-aggregated) |
| GET | `/api/analytics/reports` | Generate reports |
| POST | `/api/analytics/queries` | Custom analytics queries |
| GET | `/api/analytics/insights` | AI-generated natural language insights |

### Customers (Data Vault)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/customers` | List customers (merchant-scoped) |
| GET | `/api/customers/{id}` | Get customer details |
| PUT | `/api/customers/{id}` | Update customer data |
| DELETE | `/api/customers/{id}` | Delete customer (GDPR right-to-erasure) |

### Payments

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/payments/process` | Process payment |
| GET | `/api/payments/{id}` | Get payment status |
| POST | `/api/payments/refund` | Process refund |
| GET | `/api/payments/methods` | Available payment methods |

### Webhooks Management

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/webhooks` | Register webhook endpoint |
| GET | `/api/webhooks` | List webhooks |
| PUT | `/api/webhooks/{id}` | Update webhook |
| DELETE | `/api/webhooks/{id}` | Delete webhook |

### System

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check |

---

## Inbound Webhooks

| Endpoint | Vendor | Signature Method | Events |
|----------|--------|-----------------|--------|
| `POST /api/webhooks/stripe` | Stripe | `Stripe-Signature` HMAC-SHA256 | `payment_intent.succeeded`, `payment_intent.failed`, `charge.refunded` |

---

## Service Bindings / RPC (consumed)

| Service | Binding Name | Methods Used |
|---------|-------------|-------------|
| `billing-service` | `BILLING` | `checkQuota()`, `recordUsage()` |
| `vendors-worker` | `VENDORS` | `getStripeClient()` |
