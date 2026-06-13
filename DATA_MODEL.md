# Data Model

_Last updated: 2026-06-13_

## Overview

Intellipay uses Cloudflare D1 (SQLite) with per-merchant isolated schemas. All PII fields are AES-256-GCM encrypted using `@g-a-l-a-c-t-i-c/cloudflare` utilities.

## Schema (Planned — Phase 1 MVP)

### merchants

```sql
CREATE TABLE merchants (
  id          TEXT PRIMARY KEY,           -- UUID
  name        TEXT NOT NULL,
  api_key     TEXT NOT NULL,              -- hashed
  plan_tier   TEXT NOT NULL DEFAULT 'starter',
  status      TEXT NOT NULL DEFAULT 'active',
  settings    TEXT,                       -- JSON config blob
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### customers (per-merchant, AES-256-GCM encrypted PII)

```sql
CREATE TABLE customers (
  id           TEXT PRIMARY KEY,          -- UUID
  merchant_id  TEXT NOT NULL,
  email_enc    TEXT NOT NULL,             -- AES-256-GCM encrypted
  profile_enc  TEXT,                      -- AES-256-GCM encrypted JSON
  behavior     TEXT,                      -- JSON analytics blob
  gdpr_deleted INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### transactions

```sql
CREATE TABLE transactions (
  id              TEXT PRIMARY KEY,       -- UUID
  merchant_id     TEXT NOT NULL,
  customer_id     TEXT,
  amount_cents    INTEGER NOT NULL,       -- integer cents; display /100
  currency        TEXT NOT NULL DEFAULT 'USD',
  status          TEXT NOT NULL,          -- pending|complete|failed|refunded
  stripe_id       TEXT,
  payment_method  TEXT,
  metadata        TEXT,                   -- JSON
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);
```

### checkout_sessions (KV-backed — schema for reference)

```
key: session:{id}
value: {
  merchant_id, customer_id, cart_items, optimization_config,
  shadow_mode, created_at, expires_at
}
TTL: 2 hours
```

### audit_log

```sql
CREATE TABLE audit_log (
  id          TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  actor_id    TEXT,
  action      TEXT NOT NULL,              -- GDPR, DATA_EXPORT, CONFIG_CHANGE, etc.
  resource    TEXT NOT NULL,
  details     TEXT,                       -- JSON
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);
```

## Conventions

- Timestamps: `TEXT` ISO-8601 (never INTEGER epoch) per SQLite/D1 rules
- Money: `INTEGER` cents with `_cents` suffix (never REAL/FLOAT)
- IDs: UUID v4 as TEXT
- Encrypted fields: `_enc` suffix, stored as base64 AES-256-GCM ciphertext
