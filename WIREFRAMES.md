# UI/UX Wireframes

_Last updated: 2026-06-13. Mermaid diagrams — render in GitHub or any Mermaid-compatible viewer._

## Navigation Structure

```mermaid
graph TD
    Landing["Landing / Marketing Site"] --> Login["Login (API key or magic link)"]
    Login --> Dashboard["Merchant Dashboard"]
    Dashboard --> Analytics["Analytics & Reports"]
    Dashboard --> Customers["Customer Vault"]
    Dashboard --> Checkout["Checkout Config"]
    Dashboard --> Payments["Payments & Transactions"]
    Dashboard --> Settings["Settings & Integrations"]
    Dashboard --> Migration["Shadow Mode Migration"]
    Checkout --> Widget["Widget Customizer"]
    Checkout --> AIConfig["AI Optimization Rules"]
    Settings --> APIKeys["API Key Management"]
    Settings --> Webhooks["Webhooks"]
    Settings --> Team["Team & RBAC"]
```

## Dashboard Layout

```mermaid
graph LR
    Sidebar["Sidebar:\nNavigation menu\nMerchant selector"]
    Header["Header:\nSearch + Alerts + User"]
    Widgets["Main:\nRevenue metrics\nConversion rate\nCart abandonment\nFraud score\nAI status"]
    Footer["Footer:\nSupport + Docs"]
    Header --- Sidebar
    Sidebar --- Widgets
    Widgets --- Footer
```

## Checkout Widget (Embedded in Merchant Site)

```mermaid
graph TD
    PaymentFields["Payment Method Selection\n(AI-ordered: best conversion first)"]
    FormFields["Form Fields\n(AI-ordered: minimal friction)"]
    SecurityBadge["Security Badge + Privacy Notice"]
    SubmitBtn["Complete Purchase"]
    PaymentFields --> FormFields
    FormFields --> SecurityBadge
    SecurityBadge --> SubmitBtn
```

## Shadow Mode Migration Dashboard

```mermaid
graph LR
    TrafficBar["Traffic Split Bar\n(0% → 100% intellipay)"]
    MetricsCompare["Side-by-Side Metrics:\nConversion | Latency | Errors"]
    MigrationControl["Migration Controls:\nIncrease / Rollback / Commit"]
    TrafficBar --- MetricsCompare
    MetricsCompare --- MigrationControl
```
