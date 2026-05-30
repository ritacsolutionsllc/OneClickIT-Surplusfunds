# OneClickSurplusFunds

> Professional surplus funds recovery platform. 50 states covered.

**Live URL:** https://oneclicksurplusfunds.base44.app  
**Pricing:** Free (3 claims) / Starter $29/mo / Pro $99/mo / Agency $249/mo  
**Enforcement Gates:** 1/6 passing  
**Current Status:** 🔴 40+ routes exposed. App description is boilerplate. /Sign route needs deletion.

---

## Implementation Priority: #12 / 13

## Enforcement Gate Checklist

| Gate | Status |
|------|--------|
| Routing (Public/Protected/Admin classification) | ✅ |
| Auth (Login + Signup pages) | ❌ |
| Pricing (/pricing page with Stripe CTAs) | ❌ |
| Entitlements (PlanGate on premium features) | ❌ |
| Stripe Webhook | ✅ Registered May 29 2026 |
| Admin Safety (AuthGuard adminOnly) | ❌ |

---

## Protected Routes

- `40+ routes — see implementation guide`

## Plan Gates

- `/enrichment (pro)`
- `/osint (pro)`
- `/pro (agency)`
- `/marketplace (agency)`

---

## Backend Functions (all live)

| Function | Endpoint |
|----------|----------|
| Stripe Checkout | `POST https://superagent-b2d614b7.base44.app/functions/createStripeCheckout` |
| Billing Portal | `POST https://superagent-b2d614b7.base44.app/functions/createBillingPortal` |
| Usage Gate | `POST https://superagent-b2d614b7.base44.app/functions/checkUsageGate` |
| Export Gate | `POST https://superagent-b2d614b7.base44.app/functions/exportGate` |
| Audit Logger | `POST https://superagent-b2d614b7.base44.app/functions/auditLogger` |

---

## Universal Components Required

- `AuthGuard.jsx` — wraps all protected routes
- `PlanGate.jsx` — wraps premium features with upgrade prompt
- `BillingPortalButton.jsx` — opens Stripe customer self-serve portal

---

## QA Checklist

- [ ] Logged-out users cannot access protected routes (test in incognito)
- [ ] /login and /signup are separate with correct redirect behavior
- [ ] Public homepage shows marketing content — not dashboard UI
- [ ] /pricing page exists and is publicly accessible
- [ ] Pricing CTAs trigger createStripeCheckout correctly
- [ ] Premium features show upgrade prompt to free users
- [ ] Premium features blocked at logic layer (not just UI)
- [ ] Admin routes return 403 for non-admin authenticated users
- [ ] BillingPortalButton opens Stripe customer portal
- [ ] No demo/test data visible to real users
- [ ] Mobile layout (375px) — no overflow or broken elements

---

## Related Apps (Cross-sell)

All 13 apps: https://oneclickitonboarding.base44.app  
Book a demo: https://calendly.com/oneclickitllc

---

*Managed by RITAC Solutions · RITAC Command AI Agent · May 2026*
