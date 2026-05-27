/**
 * checkUsageGate — Universal freemium usage gate
 *
 * POST { app: "databreachwatch" | "modelbench" | "surplusfunds", action: "check" | "increment" }
 *
 * Returns:
 *   { allowed: true, used: N, limit: N, tier: string }
 *   { allowed: false, used: N, limit: N, tier: "free", upgrade_url: string }
 *
 * Deployed at: https://superagent-b2d614b7.base44.app/functions/checkUsageGate
 */

import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

// ── Tier limits per app ────────────────────────────────────────────────────
const LIMITS: Record<string, Record<string, number>> = {
  databreachwatch: { free: 5, pro: 99999, team: 99999 },
  modelbench:      { free: 10, pro: 99999, team: 99999 },
  surplusfunds:    { free: 3, starter: 20, pro: 99999 },
};

const UPGRADE_URLS: Record<string, string> = {
  databreachwatch: 'https://data-breach-watch-4a131d90.base44.app/Pricing',
  modelbench:      'https://app.base44.com/apps/695790c4419efebb5f0b9818/Pricing',
  surplusfunds:    'https://app.base44.com/apps/6a0cd5df6d5ee52a95407a7e/Pricing',
};

// Entity names per app where subscription tier is stored
const SUBSCRIPTION_ENTITY: Record<string, { entity: string; tierField: string; emailField: string }> = {
  databreachwatch: { entity: 'Subscription', tierField: 'plan_id',           emailField: 'customer_email' },
  modelbench:      { entity: 'UserUsage',    tierField: 'subscription_tier', emailField: 'user_email' },
  surplusfunds:    { entity: 'UserSubscription', tierField: 'plan',          emailField: 'created_by' },
};

// ─────────────────────────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { app, action = 'check' } = body;

    if (!app || !LIMITS[app]) {
      return Response.json({ error: `Unknown app: ${app}` }, { status: 400 });
    }

    const appLimits = LIMITS[app];
    const upgradeUrl = UPGRADE_URLS[app];
    const subConfig = SUBSCRIPTION_ENTITY[app];

    // ── 1. Determine user's tier ─────────────────────────────────────────
    let tier = 'free';
    try {
      const subs = await base44.asServiceRole.entities[subConfig.entity].filter(
        subConfig.emailField === 'created_by'
          ? { created_by: user.id }
          : { [subConfig.emailField]: user.email }
      );
      if (subs.length > 0 && subs[0].status === 'active') {
        tier = (subs[0][subConfig.tierField] ?? 'free').toLowerCase();
        // Normalize tier names
        if (['premium', 'diamond', 'pro_monthly', 'pro_annual'].includes(tier)) tier = 'pro';
        if (['team_monthly', 'team_annual'].includes(tier)) tier = 'team';
        if (['starter_monthly', 'starter_annual'].includes(tier)) tier = 'starter';
      }
    } catch (_) { /* defaults to free */ }

    const limit = appLimits[tier] ?? appLimits['free'];
    const isPaid = limit >= 99999;

    // ── 2. If paid tier — always allow ───────────────────────────────────
    if (isPaid) {
      return Response.json({ allowed: true, used: 0, limit, tier, upgrade_url: null });
    }

    // ── 3. Count usage this billing cycle ────────────────────────────────
    const now = new Date();
    const cycleStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString(); // first of month

    let usageRecord: Record<string, unknown> | null = null;
    let usageCount = 0;

    try {
      const records = await base44.asServiceRole.entities.UsageGate.filter({
        user_id: user.id,
        app_key: app,
      });

      if (records.length > 0) {
        usageRecord = records[0];
        // Reset if new billing cycle
        const lastReset = usageRecord.cycle_start as string ?? '';
        if (lastReset < cycleStart) {
          await base44.asServiceRole.entities.UsageGate.update(usageRecord.id as string, {
            count: 0,
            cycle_start: cycleStart,
          });
          usageCount = 0;
          usageRecord = { ...usageRecord, count: 0 };
        } else {
          usageCount = usageRecord.count as number ?? 0;
        }
      } else {
        // Create new record
        usageRecord = await base44.asServiceRole.entities.UsageGate.create({
          user_id: user.id,
          user_email: user.email,
          app_key: app,
          count: 0,
          cycle_start: cycleStart,
          tier,
        });
        usageCount = 0;
      }
    } catch (e) {
      return Response.json({ error: `Usage tracking error: ${e.message}` }, { status: 500 });
    }

    // ── 4. Check if allowed ──────────────────────────────────────────────
    const allowed = usageCount < limit;

    // ── 5. Increment if action=increment AND allowed ─────────────────────
    if (action === 'increment' && allowed && usageRecord?.id) {
      await base44.asServiceRole.entities.UsageGate.update(usageRecord.id as string, {
        count: usageCount + 1,
        last_used: new Date().toISOString(),
      });
      usageCount += 1;
    }

    return Response.json({
      allowed,
      used: usageCount,
      limit,
      tier,
      remaining: Math.max(0, limit - usageCount),
      upgrade_url: allowed ? null : upgradeUrl,
      message: allowed
        ? `${limit - usageCount} ${app === 'surplusfunds' ? 'claims' : app === 'modelbench' ? 'comparisons' : 'scans'} remaining this month`
        : `You've used all ${limit} free ${app === 'surplusfunds' ? 'claims' : app === 'modelbench' ? 'comparisons' : 'scans'} this month. Upgrade to continue.`,
    });

  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});
