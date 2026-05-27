# OneClickSurplusFunds — Freemium Claim Gate
## Free = 3 claims | Starter = 20 | Pro = unlimited

### Wire into your Claims list page and Claim detail/create page

```jsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const GATE_URL = "https://superagent-b2d614b7.base44.app/functions/checkUsageGate";
const CHECKOUT_URL = "https://superagent-b2d614b7.base44.app/functions/createStripeCheckout";

// ── Hook ──────────────────────────────────────────────────────────────────
function useClaimGate() {
  const [gate, setGate] = useState(null);
  const [loading, setLoading] = useState(true);

  const check = () => {
    fetch(GATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ app: "surplusfunds", action: "check" }),
    })
      .then(r => r.json())
      .then(setGate)
      .catch(() => setGate({ allowed: true, limit: 99999, remaining: 99999, tier: "free" }))
      .finally(() => setLoading(false));
  };

  useEffect(() => { check(); }, []);

  async function consumeClaim() {
    const res = await fetch(GATE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ app: "surplusfunds", action: "increment" }),
    });
    const data = await res.json();
    setGate(data);
    return data.allowed;
  }

  return { gate, loading, consumeClaim, refresh: check };
}

// ── Upgrade Modal ──────────────────────────────────────────────────────────
function ClaimUpgradeModal({ open, onClose, tier }) {
  const [loading, setLoading] = useState(null);

  async function upgrade(plan) {
    setLoading(plan);
    const res = await fetch(CHECKOUT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        app: "surplusfunds", plan,
        success_url: window.location.origin + "/?checkout=success",
        cancel_url: window.location.href,
      }),
    });
    const { url } = await res.json();
    if (url) window.location.href = url;
    setLoading(null);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <button onClick={onClose} className="float-right text-gray-400 text-xl">✕</button>
        <div className="text-center mb-6">
          <div className="text-4xl mb-2">💼</div>
          <h2 className="text-xl font-bold">
            {tier === "free" ? "Free claim limit reached (3/3)" : "Starter claim limit reached (20/20)"}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">Upgrade to claim more surplus funds.</p>
        </div>

        {tier === "free" && (
          <div className="space-y-3">
            <div className="border border-amber-400 rounded-xl p-4 bg-amber-50">
              <div className="flex justify-between mb-2">
                <span className="font-bold">⚡ Starter</span>
                <span className="font-bold text-amber-600">$15/mo</span>
              </div>
              <ul className="text-xs text-muted-foreground mb-3 space-y-1">
                <li>✓ Up to 20 active claims</li>
                <li>✓ Full county database</li>
                <li>✓ Claim tracking & tasks</li>
                <li>✓ Document vault</li>
              </ul>
              <Button onClick={() => upgrade("starter_monthly")} disabled={loading === "starter_monthly"} className="w-full bg-amber-500 hover:bg-amber-600 text-white">
                {loading === "starter_monthly" ? "Loading..." : "Get Starter — $15/mo"}
              </Button>
            </div>
            <div className="border border-yellow-500 rounded-xl p-4 bg-yellow-50">
              <div className="flex justify-between mb-2">
                <span className="font-bold">💼 Pro</span>
                <span className="font-bold text-yellow-700">$49/mo</span>
              </div>
              <ul className="text-xs text-muted-foreground mb-3 space-y-1">
                <li>✓ Unlimited active claims</li>
                <li>✓ Lead quality scoring</li>
                <li>✓ OSINT search tools</li>
                <li>✓ Agreement templates</li>
                <li>✓ Deal share pipeline</li>
              </ul>
              <Button onClick={() => upgrade("pro_monthly")} disabled={loading === "pro_monthly"} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                {loading === "pro_monthly" ? "Loading..." : "Get Pro — $49/mo"}
              </Button>
            </div>
          </div>
        )}

        {tier === "starter" && (
          <div className="border border-yellow-500 rounded-xl p-4 bg-yellow-50">
            <div className="flex justify-between mb-2">
              <span className="font-bold">💼 Pro — Unlimited Claims</span>
              <span className="font-bold">$49/mo</span>
            </div>
            <ul className="text-xs text-muted-foreground mb-3 space-y-1">
              <li>✓ Unlimited active claims</li>
              <li>✓ Lead quality scoring</li>
              <li>✓ OSINT + agreement templates</li>
            </ul>
            <Button onClick={() => upgrade("pro_monthly")} disabled={loading === "pro_monthly"} className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
              {loading === "pro_monthly" ? "Loading..." : "Upgrade to Pro — $49/mo"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Claims List Page integration ───────────────────────────────────────────
export default function ClaimsPage() {
  const { gate, loading, consumeClaim } = useClaimGate();
  const [showUpgrade, setShowUpgrade] = useState(false);
  // ... your existing claims state

  async function handleCreateClaim() {
    const allowed = await consumeClaim();
    if (!allowed) {
      setShowUpgrade(true);
      return;
    }
    // ... your existing create claim logic
  }

  const claimLimitReached = gate?.allowed === false;

  return (
    <div>
      {/* Usage indicator in page header */}
      {gate?.tier !== "pro" && (
        <div className="flex items-center justify-between mb-4 p-3 bg-muted rounded-lg">
          <div className="text-sm">
            <span className="font-medium">
              {gate?.tier === "free"
                ? `Free plan: ${gate?.used ?? 0} / 3 claims used`
                : `Starter plan: ${gate?.used ?? 0} / 20 claims used`}
            </span>
            {claimLimitReached && (
              <Badge className="ml-2 bg-red-100 text-red-700">Limit Reached</Badge>
            )}
          </div>
          {claimLimitReached && (
            <Button size="sm" onClick={() => setShowUpgrade(true)} className="bg-yellow-500 hover:bg-yellow-600 text-black">
              Upgrade →
            </Button>
          )}
        </div>
      )}

      {/* Your existing claims list */}

      {/* Locked overlay on "Add Claim" button when exhausted */}
      <Button
        onClick={handleCreateClaim}
        disabled={loading}
        className={claimLimitReached ? "opacity-50 cursor-not-allowed" : ""}
      >
        {claimLimitReached ? "🔒 Claim Limit Reached — Upgrade" : "+ Add New Claim"}
      </Button>

      <ClaimUpgradeModal
        open={showUpgrade}
        onClose={() => setShowUpgrade(false)}
        tier={gate?.tier ?? "free"}
      />
    </div>
  );
}
```

### Soft lock on claim detail view (blur locked claims)

```jsx
// In ClaimDetailPage or claim card component:
// Show only 3 real claims, blur/lock the rest for free users

{claims.map((claim, i) => (
  <div key={claim.id} className={`relative ${i >= gate?.limit && gate?.tier === "free" ? "select-none" : ""}`}>
    {i >= (gate?.limit ?? 3) && gate?.tier === "free" && (
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm rounded-xl flex items-center justify-center z-10">
        <div className="text-center">
          <div className="text-2xl mb-1">🔒</div>
          <div className="font-semibold text-sm">Upgrade to view</div>
          <Button size="sm" onClick={() => setShowUpgrade(true)} className="mt-2 bg-yellow-500 text-black">
            Unlock All Claims
          </Button>
        </div>
      </div>
    )}
    {/* Your existing claim card */}
  </div>
))}
```
