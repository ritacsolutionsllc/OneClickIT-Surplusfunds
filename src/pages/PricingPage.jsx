# OneClickSurplusFunds — Pricing/Billing Page
App ID: 6a0cd5df6d5ee52a95407a7e

```jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CHECKOUT_URL = "https://superagent-b2d614b7.base44.app/functions/createStripeCheckout";

const PLANS = [
  {
    name: "Free", emoji: "🔎",
    price: { monthly: "$0", annual: "$0" },
    planKey: null,
    features: ["View up to 3 surplus claims", "Basic county database", "Email support"],
    cta: "Start Free",
  },
  {
    name: "Starter", emoji: "⚡", highlight: false,
    price: { monthly: "$15/mo", annual: "$144/yr" },
    planKey: { monthly: "starter_monthly", annual: "starter_annual" },
    features: ["Up to 20 active claims", "Full county database", "Claim tracking & tasks", "Document vault", "Skip tracing tools", "Email support"],
    cta: "Get Starter",
  },
  {
    name: "Pro", emoji: "💼", highlight: true,
    price: { monthly: "$49/mo", annual: "$470/yr" },
    planKey: { monthly: "pro_monthly", annual: "pro_annual" },
    features: ["Unlimited active claims", "All Starter features", "Lead quality scoring", "OSINT search tools", "Agreement templates", "Deal share pipeline", "Referral rewards", "Priority support"],
    cta: "Get Pro",
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly");
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
          app: "surplusfunds",
          plan: planKey,
          success_url: window.location.origin + "/?checkout=success",
          cancel_url: window.location.href,
        }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert("Error. Try again."); }
    finally { setLoading(null); }
  }

  return (
    <div className="max-w-5xl mx-auto py-12 px-4">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold mb-2">Claim More. Earn More.</h1>
        <p className="text-muted-foreground mb-6">Access surplus property funds before they expire. Cancel anytime.</p>
        <div className="inline-flex items-center gap-2 bg-muted rounded-full p-1">
          <button onClick={() => setBilling("monthly")} className={`px-4 py-1.5 rounded-full text-sm font-medium ${billing === "monthly" ? "bg-white shadow" : "text-muted-foreground"}`}>Monthly</button>
          <button onClick={() => setBilling("annual")} className={`px-4 py-1.5 rounded-full text-sm font-medium ${billing === "annual" ? "bg-white shadow" : "text-muted-foreground"}`}>Annual <span className="text-green-600 font-semibold">Save 20%</span></button>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-6">
        {PLANS.map((plan) => {
          const price = plan.price[billing];
          const planKey = plan.planKey?.[billing] ?? null;
          return (
            <div key={plan.name} className={`rounded-2xl border p-6 flex flex-col gap-4 bg-white ${plan.highlight ? "border-yellow-500 shadow-xl" : "border-border"}`}>
              {plan.highlight && <Badge className="w-fit bg-yellow-500 text-black">Most Popular</Badge>}
              <div>
                <div className="text-xl font-bold mb-1">{plan.emoji} {plan.name}</div>
                <div className="text-3xl font-bold">{price}</div>
              </div>
              <ul className="space-y-2 text-sm flex-1">
                {plan.features.map(f => <li key={f} className="flex gap-2"><span className="text-green-500">✓</span>{f}</li>)}
              </ul>
              {planKey ? (
                <Button onClick={() => handleUpgrade(planKey)} disabled={loading === planKey} className={`w-full ${plan.highlight ? "bg-yellow-500 hover:bg-yellow-600 text-black font-bold" : ""}`}>
                  {loading === planKey ? "Loading..." : plan.cta}
                </Button>
              ) : (
                <Button variant="outline" className="w-full">Start Free</Button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
```
