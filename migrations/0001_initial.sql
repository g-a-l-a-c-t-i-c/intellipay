-- intellipay Phase 1 schema
-- Timestamps: TEXT ISO-8601 (never INTEGER epoch)
-- Money: INTEGER cents with _cents suffix
-- PII: AES-256-GCM encrypted, _enc suffix

CREATE TABLE IF NOT EXISTS merchants (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  api_key     TEXT NOT NULL,           -- SHA-256 hash of the raw key
  plan_tier   TEXT NOT NULL DEFAULT 'starter',
  status      TEXT NOT NULL DEFAULT 'active',
  settings    TEXT,                    -- JSON blob
  created_at  TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_merchants_api_key ON merchants(api_key);

CREATE TABLE IF NOT EXISTS customers (
  id           TEXT PRIMARY KEY,
  merchant_id  TEXT NOT NULL,
  email_enc    TEXT NOT NULL,          -- AES-256-GCM encrypted
  profile_enc  TEXT,                   -- AES-256-GCM encrypted JSON
  behavior     TEXT,                   -- JSON analytics
  gdpr_deleted INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_customers_merchant ON customers(merchant_id);

CREATE TABLE IF NOT EXISTS transactions (
  id              TEXT PRIMARY KEY,
  merchant_id     TEXT NOT NULL,
  customer_id     TEXT,
  amount_cents    INTEGER NOT NULL,    -- integer cents; display /100
  currency        TEXT NOT NULL DEFAULT 'USD',
  status          TEXT NOT NULL,       -- pending|complete|failed|refunded
  stripe_id       TEXT,
  payment_method  TEXT,
  metadata        TEXT,                -- JSON
  created_at      TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_transactions_merchant ON transactions(merchant_id);

CREATE TABLE IF NOT EXISTS audit_log (
  id          TEXT PRIMARY KEY,
  merchant_id TEXT NOT NULL,
  actor_id    TEXT,
  action      TEXT NOT NULL,           -- GDPR_DELETE, CONFIG_CHANGE, DATA_EXPORT, etc.
  resource    TEXT NOT NULL,
  details     TEXT,                    -- JSON
  created_at  TEXT NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_audit_merchant ON audit_log(merchant_id);
