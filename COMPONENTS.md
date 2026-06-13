# Components

_Last updated: 2026-06-13. All deployable and importable components._

## Backend Workers / Services

### intellipay Worker (`src/`)
- **Framework:** Hono
- **Runtime:** Cloudflare Workers
- **Entry:** `src/index.ts`
- **Deploy:** `galactic deploy`
- **Dispatch namespace:** `galactic-products`
- **RPC entrypoint:** HTTP only (no WorkerEntrypoint RPC — API-first product)

## Databases

| Name | Type | Used by |
|------|------|---------|
| `intellipay` | Cloudflare D1 (SQLite) | intellipay Worker |
| KV: `SESSIONS` | Cloudflare KV | Checkout session state |
| R2: `intellipay-reports` | Cloudflare R2 | Analytics exports, audit archives |

## Shared Packages (consumed)

| Package | Purpose |
|---------|---------|
| `@g-a-l-a-c-t-i-c/platform-sdk` | D1RelationalStore, workflows |
| `@g-a-l-a-c-t-i-c/cloudflare` | AES-256-GCM encryption, KV helpers |
| `@g-a-l-a-c-t-i-c/tier-guard` | Billing tier enforcement middleware |
| `@g-a-l-a-c-t-i-c/platform-types` | Shared TypeScript types |

## Frontend (Planned)

### Merchant Dashboard (`apps/web/` — planned)
- **Framework:** React + Vite
- **Deploy target:** Cloudflare Pages
- **URL:** `https://app.intellipay.io` (planned)

### Checkout Widget (`packages/widget/` — planned)
- **Framework:** Vanilla JS (no framework — embeds in merchant sites)
- **Build:** Bundled as `intellipay.js` snippet
- **Deploy:** Served from R2 via Cloudflare CDN
