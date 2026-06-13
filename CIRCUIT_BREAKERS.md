# Circuit Breakers

_Last updated: 2026-06-13_

No circuit breakers detected in current codebase — add entries as implemented.

| ID | Name | Trigger | Effect | Recovery |
|----|------|---------|--------|---------|
| CB-001 | stripe-payments | Stripe API 5xx > 3 consecutive | Fall back to queued payment processing | Auto-recover after 60s |
| CB-002 | workers-ai-inference | AI inference >500ms p99 | Disable ML optimization, use static rules | Auto-recover when latency drops |
| CB-003 | data-vault-encryption | Key derivation failure | Block all write operations, alert | Manual key rotation required |

_Note: CB-001 through CB-003 are planned — not yet implemented._
