# Runbook

_Last updated: 2026-06-13_

## Workers

| Worker | Restart Command | Health Endpoint |
|--------|----------------|-----------------|
| `intellipay` | `galactic deploy` | `GET /health` |

## Common Operations

### Deploy

```bash
galactic deploy
```

### Tail Logs

```bash
galactic logs intellipay
```

### Run DB Migration

```bash
galactic migrate <migration-file.sql>
```

### Check Health

```bash
curl https://intellipay.g-a-l-a-c-t-i-c.com/health
```

## Incident Response

### Payment Processing Failure
1. Check Stripe status page
2. Review `galactic logs intellipay` for error patterns
3. Trigger CB-001 circuit breaker manually if needed
4. File incident in INCIDENTS.md

### Data Vault Encryption Failure
1. STOP all write operations immediately
2. Check encryption key in Worker secrets: `galactic secrets list`
3. Rotate key if compromised — triggers CB-003
4. Audit all writes since failure started

### High Latency / AI Inference Timeout
1. Check Workers AI quota: Cloudflare dashboard
2. Disable ML optimization (CB-002) to restore baseline performance
3. Investigate specific model causing slowdown
