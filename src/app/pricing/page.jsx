import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const CHECKOUT_URL = "https://superagent-b2d614b7.base44.app/functions/createStripeCheckout";

const PLANS = [
  { name:"Free", emoji:"🔎", price:{monthly:"$0",annual:"$0"}, planKey:null, tagline:"Search & explore",
    features:["View up to 3 surplus claims","Basic county database","State directory (47 states)","Email support"], cta:"Start Free" },
  { name:"Starter", emoji:"⚡", price:{monthly:"$29/mo",annual:"$278/yr"}, planKey:{monthly:"starter_monthly",annual:"starter_annual"},
    tagline:"For solo recovery professionals",
    features:["Up to 20 active claims","Full 47-state county database","Claim tracking & task pipeline","Document vault (50 docs)","Basic OSINT search tools","Agreement templates","Email support"], cta:"Start Starter" },
  { name:"Pro", emoji:"💼", price:{monthly:"$99/mo",annual:"$950/yr"}, planKey:{monthly:"pro_monthly",annual:"pro_annual"},
    tagline:"For active recovery businesses", badge:"Most Popular", highlight:true,
    features:["Unlimited active claims","Everything in Starter","AI-powered lead scoring","Advanced OSINT lab","Skip tracing tools","Deal share pipeline","Outreach playbooks","Referral rewards","Pro Hub access","Priority support"], cta:"Get Pro" },
  { name:"Agency", emoji:"🏢", price:{monthly:"$249/mo",annual:"$2,390/yr"}, planKey:{monthly:"agency_monthly",annual:"agency_annual"},
    tagline:"For teams & high-volume operations",
    features:["Everything in Pro","Up to 5 team seats","Team workspace & chat","Shared lead pipeline","Bulk enrichment queue","White-label claimant portal","Custom reporting","Dedicated Slack support","Onboarding call included"], cta:"Get Agency" },
];

const TRUST_STATS = [
  { value:"$8K–$30K", label:"avg recovery per Pro claim" },
  { value:"47 states", label:"county database" },
  { value:"5x cheaper", label:"than SurplusFundsList Pro" },
  { value:"Free", label:"to start, no credit card" },
];

const TESTIMONIALS = [
  { quote:"Recovered $18,500 in my first month. The skip tracing tools alone paid for the subscription 10x over.", name:"Terrence W.", plan:"Pro" },
  { quote:"Outreach playbooks cut my prospecting time in half. More claims, less busywork.", name:"Deborah K.", plan:"Pro" },
  { quote:"The OSINT lab found contact info I couldn't get anywhere else. Closed 3 claims in week one.", name:"Marcus J.", plan:"Starter" },
];

const COMPETITOR_TABLE = [
  { feature:"Nationwide leads database", us:true, sfl:true, mm:false },
  { feature:"CRM pipeline", us:true, sfl:true, mm:false },
  { feature:"AI lead scoring", us:true, sfl:false, mm:false },
  { feature:"OSINT research lab", us:true, sfl:false, mm:false },
  { feature:"Outreach playbooks", us:true, sfl:false, mm:false },
  { feature:"Skip tracing", us:true, sfl:true, mm:false },
  { feature:"Starting price", us:"$29/mo", sfl:"$99/mo", mm:"Free (no CRM)" },
  { feature:"Pro/full access", us:"$99/mo", sfl:"$499/mo", mm:"N/A" },
];

const ONBOARDING_STEPS = [
  { title:"How do you currently find surplus fund leads?", options:["County courthouse records","Purchased lists","Google / public records","Referrals","Not started yet"], field:"source" },
  { title:"How many active claims are you working?", options:["Just getting started","1–5 claims","6–20 claims","20+ claims"], field:"volume" },
  { title:"What's your biggest bottleneck?", options:["Finding claimants","Skip tracing","Paperwork & docs","Outreach & follow-up","All of the above"], field:"pain" },
];

export default function SurplusFundsPricing() {
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(null);
  const [showComparison, setShowComparison] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingData, setOnboardingData] = useState({});

  useEffect(() => {
    const done = localStorage.getItem("surplusfunds_onboarding_done");
    if (!done) setShowOnboarding(true);
  }, []);

  function completeOnboarding() {
    localStorage.setItem("surplusfunds_onboarding_done", "1");
    setShowOnboarding(false);
  }

  async function handleUpgrade(planKey) {
    if (!planKey) return;
    setLoading(planKey);
    try {
      const res = await fetch(CHECKOUT_URL, {
        method:"POST", headers:{"Content-Type":"application/json"}, credentials:"include",
        body: JSON.stringify({ app:"surplusfunds", plan:planKey,
          success_url: window.location.origin+"/?checkout=success",
          cancel_url: window.location.href }),
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch { alert("Error starting checkout. Please try again."); }
    finally { setLoading(null); }
  }

  const step = ONBOARDING_STEPS[onboardingStep];

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">

      {/* Onboarding modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl">
            <div className="flex justify-between mb-2">
              <span className="text-xs text-muted-foreground">Step {onboardingStep+1} of {ONBOARDING_STEPS.length}</span>
              <button onClick={completeOnboarding} className="text-muted-foreground text-lg">✕</button>
            </div>
            <div className="w-full bg-muted rounded-full h-1.5 mb-6">
              <div className="bg-yellow-500 h-1.5 rounded-full transition-all" style={{width:`${((onboardingStep+1)/ONBOARDING_STEPS.length)*100}%`}}/>
            </div>
            <h2 className="text-xl font-bold mb-4">💰 {step.title}</h2>
            <div className="space-y-2 mb-6">
              {step.options.map(opt => {
                const selected = onboardingData[step.field]===opt;
                return (
                  <button key={opt} onClick={()=>setOnboardingData({...onboardingData,[step.field]:opt})}
                    className={`w-full text-left px-4 py-3 rounded-xl border-2 text-sm font-medium transition-all ${selected?"border-yellow-500 bg-yellow-50 text-yellow-800":"border-border hover:border-yellow-200"}`}>
                    {opt}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              {onboardingStep>0 && <Button variant="outline" onClick={()=>setOnboardingStep(s=>s-1)} className="flex-1">Back</Button>}
              <Button onClick={()=>{ onboardingStep<ONBOARDING_STEPS.length-1?setOnboardingStep(s=>s+1):completeOnboarding(); }}
                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-black font-bold">
                {onboardingStep<ONBOARDING_STEPS.length-1?"Next →":"Find My Claims →"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Trust stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 p-4 bg-yellow-50 rounded-2xl border border-yellow-100">
        {TRUST_STATS.map(s => (
          <div key={s.label} className="text-center">
            <div className="text-xl font-black text-yellow-800">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="text-center mb-10">
        <Badge className="mb-3 bg-yellow-100 text-yellow-800 border-yellow-300">🏆 Up to 5x cheaper than SurplusFundsList</Badge>
        <h1 className="text-3xl font-bold mb-2">Claim More. Earn More.</h1>
        <p className="text-muted-foreground mb-2">The most powerful surplus funds platform at the best price. Cancel anytime.</p>
        <p className="text-sm text-muted-foreground mb-6">Recovery professionals using Pro typically recover $8K–$30K per claim at 10–30% fee.</p>
        <div className="inline-flex items-center gap-2 bg-muted rounded-full p-1">
          <button onClick={()=>setBilling("monthly")} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${billing==="monthly"?"bg-white shadow":"text-muted-foreground"}`}>Monthly</button>
          <button onClick={()=>setBilling("annual")} className={`px-4 py-1.5 rounded-full text-sm font-medium transition ${billing==="annual"?"bg-white shadow":"text-muted-foreground"}`}>Annual <span className="text-green-600 font-semibold ml-1">Save 20%</span></button>
        </div>
      </div>

      {/* Plans */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-10">
        {PLANS.map((plan) => {
          const price = plan.price[billing];
          const planKey = plan.planKey?.[billing] ?? null;
          return (
            <div key={plan.name} className={`rounded-2xl border-2 p-5 flex flex-col gap-3 bg-white relative ${plan.highlight?"border-yellow-500 shadow-xl":"border-border"}`}>
              {plan.badge && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-500 text-black px-3 whitespace-nowrap">{plan.badge}</Badge>}
              <div>
                <div className="text-lg font-bold">{plan.emoji} {plan.name}</div>
                <div className="text-xs text-muted-foreground mb-1">{plan.tagline}</div>
                <div className="text-2xl font-bold">{price}</div>
              </div>
              <ul className="space-y-1.5 text-sm flex-1">
                {plan.features.map(f => <li key={f} className="flex gap-2 items-start"><span className="text-green-500 mt-0.5">✓</span><span>{f}</span></li>)}
              </ul>
              {planKey ? (
                <Button onClick={()=>handleUpgrade(planKey)} disabled={loading===planKey}
                  className={`w-full mt-2 ${plan.highlight?"bg-yellow-500 hover:bg-yellow-600 text-black font-bold":""}`}
                  variant={plan.highlight?"default":"outline"}>
                  {loading===planKey?"Loading...":plan.cta}
                </Button>
              ) : <Button variant="outline" className="w-full mt-2">Start Free</Button>}
            </div>
          );
        })}
      </div>

      {/* Testimonials */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {TESTIMONIALS.map((t,i) => (
          <div key={i} className="bg-white border border-border rounded-xl p-4">
            <div className="text-yellow-400 text-sm mb-2">★★★★★</div>
            <p className="text-sm text-muted-foreground italic mb-3">"{t.quote}"</p>
            <div className="text-xs font-medium">{t.name} <span className="text-yellow-700">· {t.plan}</span></div>
          </div>
        ))}
      </div>

      {/* Competitor comparison */}
      <div className="text-center mb-6">
        <button onClick={()=>setShowComparison(!showComparison)} className="text-sm text-blue-600 underline">
          {showComparison?"Hide":"See how we compare to SurplusFundsList →"}
        </button>
      </div>
      {showComparison && (
        <div className="overflow-x-auto mb-10">
          <table className="w-full text-sm border-collapse">
            <thead><tr className="bg-muted">
              <th className="text-left p-3 border border-border">Feature</th>
              <th className="text-center p-3 border border-border text-yellow-700">OneClickSurplusFunds</th>
              <th className="text-center p-3 border border-border">SurplusFundsList</th>
              <th className="text-center p-3 border border-border">MissingMoney</th>
            </tr></thead>
            <tbody>
              {COMPETITOR_TABLE.map((row,i) => (
                <tr key={i} className={i%2===0?"bg-white":"bg-muted/30"}>
                  <td className="p-3 border border-border font-medium">{row.feature}</td>
                  <td className="p-3 border border-border text-center">{typeof row.us==="boolean"?(row.us?<span className="text-green-600 font-bold">✓</span>:<span className="text-red-400">✗</span>):<span className="font-bold text-yellow-700">{row.us}</span>}</td>
                  <td className="p-3 border border-border text-center">{typeof row.sfl==="boolean"?(row.sfl?<span className="text-green-600 font-bold">✓</span>:<span className="text-red-400">✗</span>):row.sfl}</td>
                  <td className="p-3 border border-border text-center text-muted-foreground">{typeof row.mm==="boolean"?(row.mm?<span className="text-green-600 font-bold">✓</span>:<span className="text-red-400">✗</span>):row.mm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="text-center text-xs text-muted-foreground mt-4">Payments secured by Stripe. Cancel anytime.</p>
    </div>
  );
}
