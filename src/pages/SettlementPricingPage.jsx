# SettlementClaim (oneclickclassyclaims) — Monetization Build
## Base44 App ID: 6a13be871360aad9c9d11d35
## Site: oneclickclassyclaims.com (currently offline — fix hosting first)
## Model: Success fee (% of payout) + SaaS subscription

---

## REVENUE MODEL (3 streams)

1. **Success fee** — 10–15% of settlement payout (ClaimSuccessFee entity already exists ✅)
2. **Subscription** — $9/mo Starter / $29/mo Pro (unlimited claims + priority tracking)
3. **Lead resale** — qualified CampaignLeads sold to law firms at $15–$50/lead

---

## 1. PRICING PAGE — paste into /Pricing in Base44 editor

```jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CHECKOUT_URL = "https://superagent-b2d614b7.base44.app/functions/createStripeCheckout";

const PLANS = [
  {
    name: "Free",
    emoji: "📋",
    tagline: "Find and file your first claim",
    price: "$0",
    planKey: null,
    features: [
      "Browse all open settlements",
      "File up to 2 claims",
      "Basic eligibility checker",
      "Standard email updates",
    ],
    locked: ["Priority claim tracking", "Document vault", "Expert claim review"],
    cta: "Start Free",
  },
  {
    name: "Starter",
    emoji: "⚡",
    tagline: "For active claimants",
    price: "$9/mo",
    planKey: "starter_monthly",
    highlight: true,
    badge: "Best Value",
    features: [
      "Unlimited active claims",
      "Priority claim status tracking",
      "Document vault (50 files)",
      "Email + SMS notifications",
      "Payout estimator",
      "1-click claim submission",
    ],
    locked: ["Expert claim review", "Law firm referrals"],
    cta: "Get Starter",
  },
  {
    name: "Pro",
    emoji: "💼",
    tagline: "Maximize your settlement payouts",
    price: "$29/mo",
    planKey: "pro_monthly",
    features: [
      "Everything in Starter",
      "Expert claim review (2/mo)",
      "Law firm referral matching",
      "Success fee reduced to 8%",
      "Expedited processing flag",
      "Priority support",
      "Claim appeal assistance",
    ],
    locked: [],
    cta: "Get Pro",
  },
];

export default function SettlementPricingPage() {
  const [loading, setLoading] = useState(null);

  async function handleUpgrade(planKey) {
    if (!planKey) return;
    setLoading(planKey);
    try {
      const res = await fetch(CHECKOUT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          app: "settlementclaim",
          plan: planKey,
          success_url: window.location.origin + "/?checkout=success",
          cancel_url: window.location.href,
        }),
      });
      const { url } = await res.json();
      if (url) window.location.href = url;
    } catch {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <Badge className="mb-3 bg-green-100 text-green-700 border-green-200">
          💵 $15B+ in unclaimed settlements each year
        </Badge>
        <h1 className="text-3xl font-bold mb-2">Claim What's Yours</h1>
        <p className="text-lg text-muted-foreground">
          Track, file, and maximize your class action settlement payouts.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-10">
        {PLANS.map((plan) => (
          <div
            key={plan.name}
            className={`rounded-2xl border-2 p-6 flex flex-col gap-4 bg-white relative
              ${plan.highlight ? "border-green-500 shadow-xl" : "border-border"}`}
          >
            {plan.badge && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-3">
                {plan.badge}
              </Badge>
            )}
            <div>
              <div className="text-xl font-bold mb-0.5">{plan.emoji} {plan.name}</div>
              <div className="text-xs text-muted-foreground mb-1">{plan.tagline}</div>
              <div className="text-3xl font-extrabold">{plan.price}</div>
            </div>
            <ul className="space-y-1.5 text-sm flex-1">
              {plan.features.map((f) => (
                <li key={f} className="flex gap-2 items-start">
                  <span className="text-green-500 mt-0.5 shrink-0">✓</span>
                  <span>{f}</span>
                </li>
              ))}
              {plan.locked?.map((f) => (
                <li key={f} className="flex gap-2 items-start text-muted-foreground">
                  <span className="mt-0.5 shrink-0">🔒</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            {plan.planKey ? (
              <Button
                onClick={() => handleUpgrade(plan.planKey)}
                disabled={loading === plan.planKey}
                className={`w-full ${plan.highlight ? "bg-green-600 hover:bg-green-700 text-white" : ""}`}
              >
                {loading === plan.planKey ? "Loading..." : plan.cta}
              </Button>
            ) : (
              <Button variant="outline" className="w-full"
                onClick={() => window.location.href = "/Settlements"}>
                {plan.cta}
              </Button>
            )}
          </div>
        ))}
      </div>

      {/* Success fee notice */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 text-center">
        <div className="font-bold mb-1">💰 Success Fee Model</div>
        <p className="text-sm text-muted-foreground">
          On Free and Starter plans, we charge a <strong>10% success fee</strong> on your settlement payout — only when you get paid.
          Pro plan reduces this to <strong>8%</strong>. No payout = no fee.
        </p>
      </div>
    </div>
  );
}
```

---

## 2. SUCCESS FEE GATE — wire into ClaimPayout flow

```jsx
// In ClaimPayoutPage or when payout is confirmed:
import { ClaimSuccessFee } from "@/api/entities";
import { UserSubscription } from "@/api/entities";

async function triggerSuccessFee(claim, payoutAmount) {
  const sub = await UserSubscription.filter({});
  const plan = sub[0]?.plan ?? "free";
  const feeRate = plan === "pro" ? 0.08 : 0.10; // Pro = 8%, others = 10%

  const feeAmount = Math.round(payoutAmount * feeRate * 100) / 100;

  // Create fee record (triggers Stripe checkout)
  const fee = await ClaimSuccessFee.create({
    claim_id: claim.id,
    settlement_title: claim.settlement_title,
    payout_amount: payoutAmount,
    fee_percentage: feeRate * 100,
    fee_amount: feeAmount,
    status: "pending",
  });

  // Initiate Stripe checkout for fee payment
  const res = await fetch("https://superagent-b2d614b7.base44.app/functions/createStripeCheckout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      app: "settlementclaim",
      plan: "success_fee",
      amount: feeAmount,
      success_url: window.location.origin + "/?fee_paid=true",
      cancel_url: window.location.href,
    }),
  });
  const { url } = await res.json();
  if (url) window.location.href = url;
}
```

---

## 3. HOSTING FIX — oneclickclassyclaims.com is currently offline

### Steps to restore:
1. Check Vercel dashboard → is the project deployed?
2. Check domain DNS → is `oneclickclassyclaims.com` pointing to Vercel/hosting?
3. If Base44 app: go to app settings → Custom Domain → add `oneclickclassyclaims.com`
4. If Vercel: `vercel --prod` in the project directory
5. Check SSL certificate expiry

### Quick test:
```bash
dig oneclickclassyclaims.com
curl -I https://oneclickclassyclaims.com
```
