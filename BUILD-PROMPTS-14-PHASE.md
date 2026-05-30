# RITAC Solutions — 14-Phase Build Prompts
# Copy-paste ready for Base44 AI Agent Controls
# Generated: May 30, 2026
# Order: Surplus Funds (8 phases) → Security Score (6 phases)

---

# ════════════════════════════════════════════════════════
# PROMPT 1 OF 14
# Project: OneClickSurplusFunds
# Phase: Homepage Rebuild
# ════════════════════════════════════════════════════════

## GOAL
Rebuild the public homepage (/) to convert first-time visitors within 10 seconds.
The existing product is stronger than the site communicates. Fix that gap.
Do NOT touch any protected app routes, entities, or business logic.

## TARGET FILE
Pages → Home (public, route /)

## REQUIRED SECTIONS — in this exact order

### 1. Nav
- Logo: DollarSign icon + "OneClick" + "SurplusFunds" (amber-600 on SurplusFunds)
- Links: How It Works / Pricing / Learn / Trust
- Buttons: Log In (ghost) + Start Free (amber-600 filled)
- Sticky, white background, border-bottom

### 2. Trust Notice Bar
- Amber-50 background, full width, below nav
- Text: "Note: Official unclaimed property searches are free through your state government and NAUPA resources. OneClickSurplusFunds is a private workflow platform — not a government website. Learn more →"
- "Learn more" links to /trust

### 3. Hero
- Dark gradient background (amber-900 → stone-900)
- Category badge: "Surplus Funds · Excess Proceeds · Overages"
- H1: "The Operating System for Surplus Funds Operators."
- Subheadline: "Find leads. Evaluate claimability. Contact owners. Manage claim workflows. Generate agreements. Track submissions and payouts — all in one organized platform built for the way this work actually runs."
- Small text: "Built for independent operators, boutique agencies, and recovery attorneys."
- Primary CTA: "Start Free →" (amber-500 button, dark text)
- Secondary CTA: "See How It Works" (outline, amber-300 text)
- Product preview: 3 side-by-side dark glass panels:
  - Panel 1 "Lead Finder": 3 rows showing county name, dollar amount, colored badge (Deadline Soon=red, High Value=green, New Today=blue)
  - Panel 2 "Claim Workspace": labeled fields — Stage, Priority, Next Step, Documents, County
  - Panel 3 "County Playbook": county name, 4 bullet notes, difficulty badge

### 4. Stats Strip
- Gray-50 background
- 4 stats: "50 States" / "2,000+ Counties tracked" / "5 Workflow stages per claim" / "Private platform — Not a gov site"

### 5. Why It's Different (4-column comparison)
- Title: "Built for This Work. Not Adapted From Something Else."
- Columns: Official State Search / Generic CRM / Coaching/Course / OneClickSurplusFunds
- Each column: icon, name, 6 bullet points
- OneClickSurplusFunds column: amber-500 border highlight, "You" badge, checkmarks
- Other columns: gray border, dashes instead of checkmarks

### 6. Product Pillars (6 cards, 2-col on mobile, 3-col on desktop)
- Gray-50 background
- Title: "Everything You Need to Run Claims at Scale"
- Cards: Find Opportunities / Prioritize Better Leads / Convert to Claim Workspace / Contact Claimants / Generate Agreements / Learn While You Work
- Each: colored icon box, bold title, 2-sentence description

### 7. How It Works (5 steps, vertical timeline)
- Steps with numbered bubbles connected by vertical lines:
  01 Search or Import Leads
  02 Filter and Prioritize
  03 Open Your Claim Workspace
  04 Work Outreach, Documents, and Submission
  05 Track Progress and Outcomes
- CTA below: "Start Your First Claim →"

### 8. Learn + Playbooks Moat
- Dark stone-900 background, white text
- Left: headline "You Don't Just Get Software. You Get the Playbook." + 6 bullet benefits + "Explore the Learning Hub →" button
- Right: 3 county playbook cards (dark glass) showing county, statute, difficulty badge, special notes

### 9. Claim Workspace Showcase
- Title: "Your Claim. Every Detail. In One Place."
- Large card preview showing:
  - Left 2/3: Claim header with status badge + 6 field grid (Stage, Priority, Next Action, Outreach, Agreement, Documents) + Outreach Timeline
  - Right 1/3: County Playbook panel (amber-50) + Blockers panel + Fee Potential card (green, shows estimate)

### 10. Pricing Teaser (4 plan cards)
- Free / Starter $29/mo / Pro $99/mo / Agency $249/mo
- Each: plan name, price, "Best for:" line, 4-6 feature bullets, CTA button
- Pro: amber-500 border + "MOST POPULAR" tag
- Link below: "View full pricing details →" to /pricing

### 11. FAQ (accordion, 6 questions)
- Is this a government website?
- What's included on the free plan?
- What unlocks when I upgrade?
- Do I need legal training?
- Can I cancel anytime?
- How is this different from a CRM?

### 12. Final CTA
- Amber-900 background
- "Ready to Work Smarter?"
- 3 buttons: Start Free / Explore Lessons / Book a Demo (calendly.com/oneclickitllc)

### 13. Footer
- Logo + trust disclaimer
- 3 link columns: Product / Trust / Also from RITAC
- Bottom bar: copyright + "private platform, not a government website" note

## DO NOT BREAK
- /states route (SEO anchor — always public)
- /pricing route
- /trust route
- /learn route
- Any existing entity data or app logic
- Login/signup routes

## ACCEPTANCE CRITERIA
- First-time visitor understands the product in under 10 seconds
- Trust distinction (public free vs. private paid workflow) is explicit and visible without scrolling
- No generic AI SaaS hero text or repeated icon-card filler sections
- Mobile layout works at 375px

---

# ════════════════════════════════════════════════════════
# PROMPT 2 OF 14
# Project: OneClickSurplusFunds
# Phase: Trust Page
# ════════════════════════════════════════════════════════

## GOAL
Build or rebuild the /trust page. Reduce skepticism. Separate this product from "lead seller" tools.
Make it look and read like legitimate workflow software.

## TARGET FILE
Pages → Trust (public, route /trust)

## REQUIRED SECTIONS

### 1. Hero
- White background, clean layout
- H1: "We Exist to Organize the Process. Not Replace It."
- Subheadline: "OneClickSurplusFunds is a private research, workflow, and document management platform. Not a government website. Not a lead broker."

### 2. What This Platform Does
- 6 items in 2-column grid, each with icon + title + 2-sentence description:
  - Lead research and organization
  - Claimability evaluation tools
  - Claim workspace and stage tracking
  - Claimant outreach and logging
  - Document and agreement generation
  - County-specific process guidance

### 3. What This Platform Does NOT Do (important — explicit)
- Card with amber-50 background
- Bullet list:
  - "We are not a government website"
  - "We do not process official claims on your behalf"
  - "We do not guarantee claim approval or payout"
  - "We are not affiliated with any county, state, or federal agency"
  - "We do not provide legal advice"
  - "Official unclaimed property searches are available free through your state unclaimed property office and NAUPA-affiliated resources"
- Add link: "Find your state's official search →" (link to naupa.org or equivalent)

### 4. Official vs. Private Search (side-by-side comparison)
- Title: "Official Public Search vs. Private Workflow Software"
- Two columns:
  Left — Official State Search: free, run by government, shows basic record data, no workflow tools, no outreach features, no training, no tracking
  Right — OneClickSurplusFunds: private, paid, organized workflow, outreach tools, county guidance, claim tracking, document generation

### 5. Data Sources and Verification
- Explain what data may be included and its nature (public record research)
- Explain that users are responsible for verifying county records directly
- Explain that data may be incomplete, outdated, or require cross-reference
- Explain that county clerks and state offices are the authoritative source

### 6. Document Handling and Privacy
- What happens to uploaded documents
- What happens to claim data
- No sale of personal data
- Workspace isolation per user

### 7. Who This Is For
- Independent surplus funds operators
- Boutique recovery agencies
- Attorneys managing excess proceeds cases
- People learning the surplus funds process

### 8. Who This Is NOT For
- People looking for a free government search tool
- People expecting the platform to file claims for them
- People seeking legal representation

### 9. Disclaimers Section
- Gray-50 background, smaller text
- "This platform does not replace county instructions, state statutes, or legal advice."
- "Requirements vary by jurisdiction. Always verify current rules with the relevant county or state office."
- "OneClickSurplusFunds is operated by RITAC Solutions LLC."

### 10. CTA
- "Have questions about how we handle your data or how the platform works?"
- Link to /contact

## DO NOT BREAK
- Existing /trust route if present (rebuild in place)
- No changes to app entities or protected routes

## ACCEPTANCE CRITERIA
- Page makes platform look credible, not sketchy
- Explicit "not a government website" statement visible near top
- No legal overclaiming
- No vague "we protect your data" copy without specifics

---

# ════════════════════════════════════════════════════════
# PROMPT 3 OF 14
# Project: OneClickSurplusFunds
# Phase: Pricing Page Rebuild
# ════════════════════════════════════════════════════════

## GOAL
Rebuild /pricing to convert visitors, match canonical entitlements, and answer the real objections.

## TARGET FILE
Pages → Pricing (public, route /pricing)

## CANONICAL PLANS — use ONLY these, no invented tiers
- Free: 3 claim lookups, sample lessons, demo counties
- Starter: $29/mo — 20 active claims, full lead finder, claim workspaces, templates, basic playbooks
- Pro: $99/mo — unlimited claims, OSINT + enrichment, outreach tools, all playbooks, CSV export, reports
- Agency: $249/mo — everything in Pro + Pro Hub, partner marketplace, bulk export, priority support

## STRIPE CHECKOUT — use this function for all CTA buttons
POST https://superagent-b2d614b7.base44.app/functions/createStripeCheckout
body: { "app": "surplusfunds", "plan": "starter_monthly" | "pro_monthly" | "agency_monthly" }

## REQUIRED SECTIONS

### 1. Header
- Title: "Start Free. Scale When You're Ready."
- Subtitle: "No long-term contracts. Upgrade unlocks more counties, more leads, and operational depth."
- Monthly/Annual toggle (annual = 2 months free)

### 2. Pricing Cards (4 tiers)
For each plan include:
- Plan name + price
- "Best for:" line
- "What you can accomplish:" 3-4 sentences
- Feature list with checkmarks
- "After signup:" 1-sentence next step
- CTA button

Free card:
- Best for: Exploring before committing
- Accomplish: Browse sample leads, open a demo county playbook, start a beginner lesson
- After signup: Log in and explore demo content immediately
- CTA: "Start Free" → /signup

Starter card:
- Best for: Solo operators working their first counties
- Accomplish: Find and filter real leads across your target states, convert to full claim workspaces, use outreach templates, and follow county playbooks
- After signup: Run your first lead search and open your first claim workspace
- CTA: "Start Starter" → createStripeCheckout

Pro card (HIGHLIGHT):
- Best for: Active operators managing multiple simultaneous cases
- Accomplish: Unlimited claim capacity + OSINT research + lead enrichment + outreach management + full county playbook library + CSV export + reporting
- After signup: Unlock exact owner data, full county access, and operational scale
- CTA: "Start Pro" → createStripeCheckout

Agency card:
- Best for: Agencies, teams, and high-volume operators
- Accomplish: Everything in Pro plus the Pro Hub with advanced tips, partner marketplace access, bulk data export, and priority support
- After signup: Access team tools and partner integrations immediately
- CTA: "Start Agency" → createStripeCheckout

### 3. Feature Comparison Table
- Rows: Lead finder / Active claims / Owner names + amounts / County playbooks / Outreach tools / Document templates / OSINT + enrichment / CSV export / Reports / Pro Hub / Partner marketplace / Priority support
- Columns: Free / Starter / Pro / Agency
- Use checkmarks, dashes, and quantity limits

### 4. Competitor Comparison (restrained and factual)
- Title: "How does this compare?"
- Keep it factual — only use publicly visible competitor pricing
- Example framing: "Some platforms charge $99/mo for CRM-only tools, $170 for Starter lead access, or $499 for nationwide data — without integrated workflow, county guidance, or claim management."
- Do NOT name competitors by name
- Do NOT claim "X times cheaper" without verified math

### 5. Billing FAQ (accordion)
- Is this a government site? → No. Private workflow platform. Official searches are free.
- Can I search official unclaimed property for free? → Yes — through your state office. We organize the workflow after.
- What does the free plan include? → 3 lookups, sample lessons, demo counties
- What unlocks on paid plans? → Exact owner data, full lead finder, claim workspaces, outreach, templates, playbooks, export
- Are templates and outreach included on every paid tier? → Starter includes templates and basic outreach. Pro and Agency unlock full outreach management.
- Can I cancel anytime? → Yes. No long-term contracts.
- What happens after my trial ends? → You move to the free tier unless you've added a payment method.

### 6. Bottom CTA
- "Still have questions?" → link to /contact and calendly.com/oneclickitllc

## DO NOT BREAK
- Existing /pricing route
- Existing Stripe price IDs (use surplusfunds plan keys from createStripeCheckout)
- Free plan must not require payment info

## ACCEPTANCE CRITERIA
- Plan names exactly match internal canonical tier names: free / starter / pro / agency
- No competitor named by name
- No "X times cheaper" claim
- Every CTA button calls createStripeCheckout with correct app + plan keys
- Annual toggle exists even if prices are currently same as monthly (can note "coming soon")

---

# ════════════════════════════════════════════════════════
# PROMPT 4 OF 14
# Project: OneClickSurplusFunds
# Phase: Lead Finder Polish
# ════════════════════════════════════════════════════════

## GOAL
Upgrade the Lead Finder to feel like intelligence software, not a data table.
Do NOT break existing filter logic, gating, masking, CSV import/export, or lead-to-claim conversion.

## TARGET FILE
Pages → /leads (protected, requires AuthGuard)

## REQUIRED IMPROVEMENTS

### Lead Row Enhancements
Add visual signal badges to each lead row:
- "New Today" (blue) — if created_date is today
- "Deadline Soon" (red) — if deadline within 30 days
- "High Value" (green) — if amount > $25,000
- "Easier County" (amber) — if county difficulty = beginner/easy

Add decision cues to each row (show below or beside main info):
- Urgency indicator (days until deadline or "No deadline set")
- County difficulty (Beginner / Moderate / Advanced / Unknown)
- Claimability signal if available (Likely / Uncertain / Requires research)
- Fee potential estimate if amount is known: show "(~$X at 20%)"
- Recommended next action: "Convert to claim" / "Research county" / "Verify deadline"

### Free Plan UI Improvements
When user is on free plan:
- Show first 3 results unmasked (demo leads)
- Remaining rows: show county and state only, mask owner name and exact amount with "—" or "****"
- Add banner above masked rows: "Upgrade to Starter to unlock exact owner names, amounts, and full lead access."
- CTA button: "Unlock Full Finder → $29/mo" → calls createStripeCheckout { app: "surplusfunds", plan: "starter_monthly" }

### Empty States
Add proper empty states for:
- No leads found with current filters: show "No results for these filters. Try expanding your search." with a "Clear Filters" button
- No leads imported yet (new user): show "Your lead finder is empty. Import a CSV or search by state to get started." with action buttons
- Network error: show ErrorState component with retry button

### Filter Panel Improvements
Keep existing filters. Add or improve:
- Sort by: Amount (high/low), Deadline (soonest), Date added (newest)
- Quick filter chips at top: "Deadline Soon" / "High Value" / "New Today" / "Easier Counties"

### Lead-to-Claim Conversion
Keep existing conversion button. Make it more prominent:
- Show "Open in Workspace →" button on every row (or on hover)
- On free plan rows that are masked: button reads "Unlock to Work This Lead →" and opens upgrade prompt

## DO NOT BREAK
- Existing filter logic
- Plan gating and masking behavior
- CSV import/export
- Lead-to-claim conversion path
- Existing entity fields on leads

## ACCEPTANCE CRITERIA
- Lead Finder communicates actionable intelligence, not just raw data
- Free plan limitations are visually clear without being aggressive
- Every lead row shows a recommended next step
- Empty states are never blank

---

# ════════════════════════════════════════════════════════
# PROMPT 5 OF 14
# Project: OneClickSurplusFunds
# Phase: Claim Workspace / Claim Detail Polish
# ════════════════════════════════════════════════════════

## GOAL
Turn the Claim Detail page into a premium case cockpit. Every claim must tell the user what to do next.
Do NOT break existing claim data, entity fields, tab structure, or stage logic.

## TARGET FILES
Pages → /ClaimDetail (protected) and /workspace (protected)

## REQUIRED IMPROVEMENTS

### Above the Fold (always visible, no scrolling required)
Restructure the top of the page to show immediately:
1. Claim header: county + amount + a status badge (color-coded by stage)
2. Stage tracker: horizontal 5-step progress (Lead → Outreach → Agreement → Submitted → Resolved)
3. Priority indicator: High / Medium / Low with color
4. Next required action: single bold line — e.g. "Send authorization letter" or "Verify deadline with county"
5. Blockers: if any blockers exist, show them as amber warning chips
6. Document readiness: "2 of 4 documents ready" with progress bar

### Tab Structure (keep existing tabs, improve content)
Tab 1 — Overview:
- All above-fold fields in detail
- Fee potential estimate (if amount is known)
- Claimant contact status
- County difficulty badge

Tab 2 — Outreach:
- Timeline of all logged communications (date, channel, outcome)
- "Log New Contact" button always visible
- Plan limit shown clearly if applicable
- Recommended template suggestions based on current stage

Tab 3 — Documents / Agreements:
- List of required documents with status (Not started / Draft / Ready / Submitted)
- "Generate Agreement" button prominent
- Upload slot for each document type
- County-specific document notes (e.g. "Jefferson Co requires notarized authorization")

Tab 4 — Research:
- Keep existing research fields
- Add OSINT/enrichment status if Pro+ user
- Link to county playbook from this tab

Tab 5 — Notes / Timeline:
- Activity log of all actions taken on this claim (with timestamps)
- Add note input
- Show blockers log

### County Playbook Panel (sidebar or collapsible panel)
- Always accessible from Claim Detail
- Shows county name, statute, deadline notes, difficulty, special warnings
- Framed as: "What to know about [County Name]"
- If no playbook exists: "This county hasn't been added yet. Check back or contact support."

### Contextual Learning (bottom of page)
- Show 1-2 related lessons relevant to current stage
- Example: if stage = Outreach → show "How to write a claimant letter" lesson card
- Link: "Open in Learn →"

### What To Do Next (persistent prompt)
- Sticky or always-visible section at bottom or sidebar
- Bold: "Your next step:"
- One-sentence action based on stage + blockers
- Button: takes user to the right tab or action

## DO NOT BREAK
- Existing entity data model
- Existing tab navigation
- Existing stage logic
- Existing document upload functionality
- Outreach logging history

## ACCEPTANCE CRITERIA
- User can open a claim and know the next step without reading more than 3 lines
- Stage, priority, next action, and blockers are visible above the fold
- Claim Detail feels guided and operational, not just an edit form

---

# ════════════════════════════════════════════════════════
# PROMPT 6 OF 14
# Project: OneClickSurplusFunds
# Phase: Learn + Playbooks Polish
# ════════════════════════════════════════════════════════

## GOAL
Reposition the Learn section as "training that turns into execution." Make playbooks a first-class feature.
Do NOT break existing lesson progress tracking, locked content, or tier gating.

## TARGET FILES
Pages → /learn (public + protected) and /playbooks and /PlaybookDetail

## REQUIRED IMPROVEMENTS — LEARN PAGE

### Page Header
- Title: "Learn Surplus Funds. Then Go Work It."
- Subtitle: "Lessons connect directly to your claim workflow. Start a lesson, then open the related tool — training that turns into action, not just knowledge."

### Learning Tracks (keep existing + add structure)
- Add track labels:
  - Beginner Path: "New to surplus funds? Start here."
  - Core Operations: "Lead research, claimability, and outreach."
  - Advanced Tactics: "Harder counties, probate cases, and scale."
- For each lesson card, add:
  - Estimated time (e.g. "12 min")
  - Outcome line: "After this lesson you'll know how to..."
  - "Related tool" badge linking to Lead Finder, Claim Workspace, or Outreach
  - Lock indicator for paid-tier content

### Lesson Progress
- Keep existing progress tracking
- Add overall completion % at top
- Add "Next lesson" CTA button at top if user is mid-track

### Free vs. Paid Access
- Free users: first 3 lessons of Beginner Path unlocked
- Starter+: all Beginner + Core lessons
- Pro+: all lessons
- Show lock icons with tier label: "Unlock with Pro →"

## REQUIRED IMPROVEMENTS — PLAYBOOKS PAGE

### Page Header
- Title: "County Playbooks"
- Subtitle: "Operational guides for working surplus funds by jurisdiction. Know the rules, deadlines, and pitfalls before you start."

### County Cards
For each county playbook card, show:
- County name + State
- Difficulty badge: Beginner / Moderate / Advanced / Complex
- Key stat line: e.g. "12mo hold · §45.032 FL"
- Tag: "High volume" / "Probate risk" / "Strong returns" / "Attorney recommended"
- "View Playbook →" link

### Filter/Sort
- Filter by: State / Difficulty / Tags
- Sort by: Difficulty (easiest first) / Alphabetical

### Individual Playbook Page (/PlaybookDetail)
Each playbook page should contain:
- County + State header
- Difficulty badge
- Statute reference
- Surplus hold period
- Filing notes and packet requirements
- Special warnings (probate, time limits, forms)
- "Related claims" section: shows any open claims in this county
- "Start a lesson" section: links to relevant lessons

### Free vs. Paid
- Free: 3 demo county playbooks visible
- Starter+: all playbooks available
- Show upgrade prompt for locked counties

## DO NOT BREAK
- Existing lesson data and progress tracking
- Existing playbook entity structure
- Existing locked content gating logic

## ACCEPTANCE CRITERIA
- Learn page feels like a productized training system, not a content list
- Playbooks feel like a competitive moat, not a wiki
- Every lesson links to a real workflow tool or action
- County difficulty classification visible on all cards

---

# ════════════════════════════════════════════════════════
# PROMPT 7 OF 14
# Project: OneClickSurplusFunds
# Phase: Outreach Upgrade
# ════════════════════════════════════════════════════════

## GOAL
Make the Outreach feature feel like intentional communication management, not a utility form.
Do NOT break existing outreach logging, template library, or plan limits.

## TARGET FILE
Pages → /outreach (protected)

## REQUIRED IMPROVEMENTS

### Page Structure
Replace flat form with a guided workflow. Show 5 explicit steps:

Step 1 — Choose Claim
- Dropdown or search: "Which claim are you reaching out for?"
- Show claim name, county, and stage
- If no claim selected: show EmptyState with "Select or open a claim to start outreach"

Step 2 — Choose Channel
- 3 options: Certified Mail / Phone / Email
- Each option: icon + label + 1-sentence guidance (e.g. "Certified mail required in most jurisdictions")
- Highlight recommended channel based on claim stage

Step 3 — Choose Template
- Show template list filtered to selected channel and claim stage
- Each template card: name + 2-line preview + "Stage: Outreach Active" tag
- "Create from scratch" option at bottom
- If no templates: show EmptyState with "No templates for this channel. Create one in Templates."

Step 4 — Review
- Show template preview with merged claim data (owner name, county, amount if available)
- Editable before sending
- Show character count if SMS, word count if letter

Step 5 — Send / Log
- Button: "Log This Contact" (does not actually send — logs the action)
- If email integration exists: "Send Email" option
- On log: show confirmation + update outreach timeline

### Outreach Timeline (below the form)
- Keep existing history log
- Improve visual: show date, channel icon, template name, outcome (Sent / No Answer / Responded / Returned)
- "Add Manual Note" button for phone call notes

### Plan Limits
- Show current outreach usage vs. plan limit at top of page
- Free: "Outreach logging available on Starter and above. Upgrade to unlock."
- Starter: "5 outreach logs per month"
- Pro+: "Unlimited outreach logging"
- Show upgrade CTA when limit approached

### Empty States
- No claim selected: "Select a claim to begin outreach"
- No templates: "You don't have any templates yet. Create one in the Templates section."
- No history: "No outreach logged yet. Your communication timeline will appear here."

## DO NOT BREAK
- Existing outreach log data
- Existing template library
- Existing plan gating for outreach features

## ACCEPTANCE CRITERIA
- Outreach has an explicit 5-step guided flow
- Plan limits are visible without being aggressive
- Timeline log is readable and informative
- Empty states are never blank or confusing

---

# ════════════════════════════════════════════════════════
# PROMPT 8 OF 14
# Project: OneClickSurplusFunds
# Phase: Onboarding and Free-to-Paid Conversion
# ════════════════════════════════════════════════════════

## GOAL
Make the free experience valuable quickly. Make upgrade triggers feel helpful, not spammy.
Do NOT break existing auth flow, signup, or entity logic.

## TARGET FILES
Pages → /signup completion flow, /dashboard (first-run), and upgrade prompts throughout app

## REQUIRED: POST-SIGNUP ONBOARDING FLOW
Show this flow after /signup completes, before /dashboard:

### Onboarding Step 1 — Welcome
- "Welcome to OneClickSurplusFunds. Let's get you set up."
- 3 quick bullets of what they'll do: Browse sample leads / Open a demo county / Start a beginner lesson
- Button: "Let's Go →"

### Onboarding Step 2 — Pick Your Starting Point
- 3 cards, user picks one:
  - "I want to find leads" → takes to Lead Finder after onboarding
  - "I want to learn the process" → takes to Learn after onboarding
  - "I have leads to import" → takes to Lead Finder with import modal open
- "Skip to dashboard" link below

### Onboarding Step 3 — What You Can Do Free
- Show 3 things available immediately:
  - 3 sample lead lookups (show demo county cards)
  - First 3 beginner lessons
  - Demo county playbooks (Broward FL, Cook IL, Harris TX)
- Show 3 things that unlock on Starter:
  - Exact owner names + amounts
  - Full 50-state lead finder
  - Claim workspaces + outreach
- Button: "Start Exploring Free →"
- Link: "Upgrade to Starter — $29/mo →"

## REQUIRED: FIRST-RUN DASHBOARD
When user has no imported leads and no active claims:

### First-Run Banner
- Red-to-red-700 gradient card at top of dashboard
- "Run your first lead search" headline
- "Add your first lead or browse demo counties to see how the platform works."
- Buttons: "Browse Demo Leads →" / "Import CSV →" / "Start a Lesson →"
- Dismiss (X) button — saves dismissal to localStorage

### Demo Content Cards
- Show 3 sample lead cards (clearly labeled "Demo — Upgrade to unlock real data")
- Show 1 demo county playbook card

### Progress Tracker (first-run only)
- 4-step checklist:
  [ ] Complete account setup
  [ ] Browse your first lead
  [ ] Open your first lesson
  [ ] Upgrade to unlock full access
- Each step: checkbox + label + "Go →" button

## REQUIRED: UPGRADE TRIGGER PLACEMENT
Add contextual upgrade prompts at these moments (not popups — inline):

Lead Finder: when free user tries to view masked rows
→ "Unlock exact owner names, amounts, and full county access — Starter $29/mo"

Claim Workspace: when free user tries to convert a lead to a claim
→ "Creating claim workspaces requires Starter or above — Upgrade →"

Outreach: when free user reaches the outreach tab
→ "Outreach tools are available on Starter and above — Upgrade →"

CSV Export: when free user clicks export
→ "Export is available on Starter and above — Upgrade →"

Learn: when free user clicks a locked lesson
→ "This lesson unlocks on Pro — Upgrade →"

All upgrade CTAs call: createStripeCheckout { app: "surplusfunds", plan: "starter_monthly" }

## DO NOT BREAK
- Existing signup and login flows
- Existing entity data
- Existing plan gating logic — only add UI around existing gates, don't rebuild the gates

## ACCEPTANCE CRITERIA
- New free user sees value within 60 seconds of signup
- Upgrade triggers appear at natural friction points, not randomly
- Upgrade messaging always explains what unlocks, not just "upgrade now"
- Free experience never feels broken or empty

---

# ════════════════════════════════════════════════════════
# PROMPT 9 OF 14
# Project: OneClickIT Security Score
# Phase: Billing Integrity Audit
# ════════════════════════════════════════════════════════

## GOAL
Ensure billing state is consistent, reliable, and derived from a single source of truth.
No component should contain hidden plan-name logic or read subscription state from multiple places.

## CONTEXT
- App: oneclickitsecurity.com
- Canonical plans: free / essentials ($39/mo) / pro ($79/mo) / team ($249/mo)
- Stripe price IDs (confirmed live):
  essentials_monthly: price_1TcgdqGjV1Qo4p4LQBwzbx9Q
  essentials_annual:  price_1TcgdqGjV1Qo4p4LeFaydxi8
  pro_monthly:        price_1TceAJGjV1Qo4p4LtKREg4VG
  pro_annual:         price_1TceAKGjV1Qo4p4LaOXEwqr7
  team_monthly:       price_1TcgdqGjV1Qo4p4LAedwSvqF
  team_annual:        price_1TcgdrGjV1Qo4p4LB2b0ueZA
- Stripe Checkout: POST https://superagent-b2d614b7.base44.app/functions/createStripeCheckout
  body: { "app": "oneclicksecurity", "plan": "essentials_monthly" | "pro_monthly" | "team_monthly" }
- Billing Portal: POST https://superagent-b2d614b7.base44.app/functions/createBillingPortal
  body: { "app": "oneclicksecurity" }

## REQUIRED IMPLEMENTATION

### 1. Centralized Billing Config
Create one file: src/lib/billingConfig.js (or equivalent)

Contents:
- PLANS object: { free, essentials, pro, team } each with: name, price, priceId (monthly), priceIdAnnual, features[]
- TIER_ORDER array: ["free", "essentials", "pro", "team"]
- Helper: hasAccess(userTier, requiredTier) → boolean
- Helper: getPlanName(tier) → display name string
- Helper: getPlanColor(tier) → tailwind color class
- NO other file should contain plan-name strings or tier comparison logic

### 2. WorkspaceProvider / Subscription State
The WorkspaceProvider should be the ONLY place that reads subscription state.
It must expose:
- currentPlan: "free" | "essentials" | "pro" | "team"
- planStatus: "active" | "trialing" | "past_due" | "cancelled" | "free"
- planDisplayName: string
- periodEnd: ISO string or null
- hasAccess(requiredTier): boolean function
- isLoading: boolean

All PlanGate, PlanBadge, and billing UI components must consume from WorkspaceProvider ONLY.

### 3. PlanGate Component (if not already built)
```jsx
// components/PlanGate.jsx
import { useWorkspace } from "@/context/WorkspaceProvider";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PlanGate({ requiredTier, feature, children }) {
  const { hasAccess, isLoading } = useWorkspace();
  if (isLoading) return <div className="animate-pulse h-32 bg-gray-100 rounded-2xl" />;
  if (hasAccess(requiredTier)) return children;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
      <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center mb-4">
        <Lock className="w-6 h-6 text-red-600" />
      </div>
      <h3 className="font-black text-gray-900 mb-2">{feature}</h3>
      <p className="text-gray-500 text-sm mb-5 max-w-xs">
        This feature requires the {requiredTier.charAt(0).toUpperCase() + requiredTier.slice(1)} plan or above.
      </p>
      <Button className="bg-red-600 hover:bg-red-700 text-white font-bold" onClick={() => window.location.href = "/pricing"}>
        Upgrade Plan →
      </Button>
    </div>
  );
}
```

### 4. Apply PlanGate to These Routes
- /app/Playbooks → requiredTier="essentials" feature="Remediation Playbooks"
- /app/Vendors → requiredTier="essentials" feature="Vendor Risk Tracker"
- /app/Reports → requiredTier="pro" feature="Security Reports"
- /app/Trust → requiredTier="pro" feature="Trust Center Builder"
- /app/BreachWatch → requiredTier="pro" feature="Breach Watch Monitor"

### 5. PlanBadge Component
```jsx
// components/PlanBadge.jsx
import { useWorkspace } from "@/context/WorkspaceProvider";
import { getPlanName, getPlanColor } from "@/lib/billingConfig";

export default function PlanBadge({ showUpgrade = false }) {
  const { currentPlan, planStatus } = useWorkspace();
  const isPastDue = planStatus === "past_due";
  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPastDue ? "bg-red-100 text-red-700" : getPlanColor(currentPlan)}`}>
        {isPastDue ? "⚠️ Past Due" : getPlanName(currentPlan)}
      </span>
      {showUpgrade && currentPlan === "free" && (
        <a href="/pricing" className="text-xs text-red-600 font-semibold hover:underline">Upgrade →</a>
      )}
    </div>
  );
}
```

Add PlanBadge to /app/Dashboard header.

### 6. BillingPortalButton Component
```jsx
// components/BillingPortalButton.jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Loader2, ExternalLink } from "lucide-react";

export default function BillingPortalButton({ label = "Manage Billing" }) {
  const [loading, setLoading] = useState(false);
  async function handleOpen() {
    setLoading(true);
    try {
      const res = await fetch("https://superagent-b2d614b7.base44.app/functions/createBillingPortal", {
        method: "POST", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ app: "oneclicksecurity" }),
      });
      const { url } = await res.json();
      if (url) window.open(url, "_blank");
    } catch (e) { alert("Could not open billing portal. Please try again."); }
    finally { setLoading(false); }
  }
  return (
    <Button onClick={handleOpen} disabled={loading} variant="outline" className="font-semibold">
      {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Opening...</> : <><ExternalLink className="w-4 h-4 mr-2" />{label}</>}
    </Button>
  );
}
```

Add BillingPortalButton to /app/Billing page.

## DO NOT BREAK
- WorkspaceProvider if already built — extend it, don't replace it
- Existing /pricing page
- Existing Stripe checkout integrations
- ProtectedAppLayout

## ACCEPTANCE CRITERIA
- Plan names match everywhere: UI, PlanGate, billing page, webhook entity
- hasAccess() is the single entitlement check — no scattered if(plan === "pro") logic
- PlanBadge visible in dashboard header
- BillingPortalButton works and opens Stripe portal
- Past-due state surfaces visibly in billing UI

---

# ════════════════════════════════════════════════════════
# PROMPT 10 OF 14
# Project: OneClickIT Security Score
# Phase: Webhook Hardening
# ════════════════════════════════════════════════════════

## GOAL
Make webhook processing reliable, idempotent, and transparent.
Subscription state must come from Stripe truth — not from redirect success.

## CONTEXT
- Webhook endpoint: https://superagent-b2d614b7.base44.app/functions/stripeWebhook
- Webhook secret: set in Base44 Secrets as STRIPE_WEBHOOK_SECRET ✅
- Signature verification: already implemented ✅
- Events registered: checkout.session.completed, customer.subscription.updated/deleted, invoice.payment_succeeded/failed

## REQUIRED VERIFICATION CHECKLIST
Go through each of the following and confirm the implementation in stripeWebhook.ts handles it:

### Signature Validation
- [x] stripe.webhooks.constructEventAsync used ✅
- [x] Returns 400 on invalid signature ✅
- [x] Returns 200 on all successfully processed events (even errors inside handler) ✅
  - REASON: returning non-200 causes Stripe to retry — logic errors should not trigger retries

### Idempotency
- [x] processedEvents Set tracks event.id in memory ✅
- [ ] Add persistent idempotency: store processed event IDs in AuditLog or a WebhookEvent entity
  - This prevents duplicate processing across function restarts
  - Add: { action: "stripe.event_processed", entity_type: "WebhookEvent", entity_name: event.id }
  - On startup: query last 100 processed events and seed the in-memory Set

### Event Handling Completeness
Confirm these transitions are handled:
- checkout.session.completed → activate subscription ✅
- customer.subscription.created → create initial record ✅
- customer.subscription.updated → handle: upgrade, downgrade, cancel_at_period_end, trial_end, pause ✅
- customer.subscription.deleted → downgrade to free ✅
- invoice.payment_succeeded → renew + update period_end ✅
- invoice.payment_failed → set status to past_due ✅

### Trial Transitions
- When trialing subscription converts to active → status updated correctly ✅
- When trial ends without payment method → subscription deleted event fires → downgrade to free ✅

### Cancel at Period End
- When sub.cancel_at_period_end = true AND status = active → keep current tier until period ends
- When period ends → subscription.deleted fires → downgrade to free

### Missed Event Reconciliation
Add an admin-accessible diagnostic: compare Stripe subscription list vs UserSubscription entity records.
Not required to implement automatically — just expose the comparison in /app/Admin or /app/Billing for manual review.

## IMPLEMENTATION TASK
In the Security Score app, add this to /app/Admin:

```jsx
// Admin diagnostic panel — Billing Sync Check
// Shows: active Stripe subscriptions vs. UserSubscription records
// Allows admin to manually trigger a sync for a specific email

function BillingSyncPanel() {
  const [email, setEmail] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  async function checkSync() {
    setLoading(true);
    // Call createBillingPortal to verify customer exists in Stripe
    const res = await fetch("https://superagent-b2d614b7.base44.app/functions/createBillingPortal", {
      method: "POST", credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ app: "oneclicksecurity", user_email: email }),
    });
    const data = await res.json();
    setResult(data);
    setLoading(false);
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6">
      <h3 className="font-black text-gray-900 mb-4">Billing Sync Diagnostic</h3>
      <div className="flex gap-3 mb-4">
        <Input placeholder="user@email.com" value={email} onChange={e => setEmail(e.target.value)} />
        <Button onClick={checkSync} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Check"}
        </Button>
      </div>
      {result && <pre className="text-xs bg-gray-50 rounded-xl p-4 overflow-auto">{JSON.stringify(result, null, 2)}</pre>}
    </div>
  );
}
```

## DO NOT BREAK
- Existing stripeWebhook.ts deployment
- Existing STRIPE_WEBHOOK_SECRET secret
- Existing signature verification

## ACCEPTANCE CRITERIA
- Webhook processes all 6 event types correctly
- Duplicate event IDs do not corrupt subscription state
- Past-due state is written correctly to UserSubscription
- Cancel-at-period-end keeps access until end of period
- Admin has a billing sync diagnostic tool

---

# ════════════════════════════════════════════════════════
# PROMPT 11 OF 14
# Project: OneClickIT Security Score
# Phase: Internal Audit Logger
# ════════════════════════════════════════════════════════

## GOAL
Replace any external audit log posting with the internal auditLogger function.
All sensitive actions must be logged to the AuditLog entity.

## CONTEXT
- auditLogger endpoint: https://superagent-b2d614b7.base44.app/functions/auditLogger ✅ deployed and tested
- AuditLog entity: exists ✅ with fields: workspace_id, actor_email, actor_name, action, entity_type, entity_id, entity_name, old_value, new_value, ip_address, user_agent, notes

## REQUIRED AUDIT EVENTS
Add the following audit logger calls to these pages/actions:

### /app/Domains
- After domain add: action="domain.added", entity_type="Domain", entity_name=domainName
- After domain remove: action="domain.removed", entity_type="Domain", entity_name=domainName
- After scan trigger: action="domain.scan_completed", entity_type="Domain", entity_name=domainName

### /app/Vendors
- After vendor risk change: action="vendor.risk_changed", entity_type="Vendor", entity_name=vendorName, old_value={risk: oldRisk}, new_value={risk: newRisk}
- After vendor delete: action="vendor.deleted", entity_type="Vendor", entity_name=vendorName

### /app/Playbooks
- After playbook marked complete: action="playbook.completed", entity_type="Playbook", entity_name=playbookName

### /app/Reports
- After report exported: action="report.exported", entity_type="Report", entity_name=reportName

### /app/Trust
- After trust center published: action="trust_center.published", entity_type="TrustCenter", entity_name=workspaceName

### /app/Admin
- After any user role change: action="admin.user_role_changed", entity_type="User", entity_name=targetEmail, old_value={role: oldRole}, new_value={role: newRole}
- After any record delete: action="admin.record_deleted", entity_type=entityType, entity_name=entityName

### Billing Events (handled automatically by stripeWebhook)
- billing.plan_upgraded ✅ (webhook writes these)
- billing.subscription_cancelled ✅
- billing.payment_failed ✅
- billing.portal_opened: add this when BillingPortalButton is clicked

## AUDIT LOGGER CALL PATTERN
Use this pattern in every page — just swap the fields:

```js
async function logAudit(action, entityType, entityName, oldVal, newVal) {
  try {
    await fetch("https://superagent-b2d614b7.base44.app/functions/auditLogger", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action,
        entity_type: entityType,
        entity_name: entityName,
        old_value: oldVal,
        new_value: newVal,
      }),
    });
  } catch {
    // Non-fatal — never let audit failure break the user action
  }
}
```

## DO NOT BREAK
- Existing page logic
- auditLogger is fire-and-forget — catch all errors silently

## ACCEPTANCE CRITERIA
- All 6 action categories are logged
- No raw sensitive data in log payloads (handled by auditLogger sanitizer)
- Logs appear in AuditLog entity after each action
- Audit failures never break the user-facing action

---

# ════════════════════════════════════════════════════════
# PROMPT 12 OF 14
# Project: OneClickIT Security Score
# Phase: UI Consistency Pass
# ════════════════════════════════════════════════════════

## GOAL
Eliminate unfinished-feeling states. Every major page must have loading, empty, error, and populated states.
No fake metrics for empty accounts. No raw "Loading..." strings.

## REQUIRED COMPONENTS (create if missing)

### PageLoading
```jsx
// components/PageLoading.jsx
export default function PageLoading({ message = "Loading..." }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-8 h-8 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">{message}</p>
    </div>
  );
}
```

### EmptyState
```jsx
// components/EmptyState.jsx
import { Button } from "@/components/ui/button";

export default function EmptyState({ icon, title, description, cta, secondaryCta, className = "" }) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-8 text-center ${className}`}>
      {icon && <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-5 text-gray-400">{icon}</div>}
      <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
      {description && <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">{description}</p>}
      {cta && (
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {cta.href
            ? <a href={cta.href}><Button className="bg-red-600 hover:bg-red-700 text-white font-bold">{cta.label}</Button></a>
            : <Button onClick={cta.onClick} className="bg-red-600 hover:bg-red-700 text-white font-bold">{cta.label}</Button>
          }
          {secondaryCta && (secondaryCta.href
            ? <a href={secondaryCta.href}><Button variant="outline" className="font-semibold">{secondaryCta.label}</Button></a>
            : <Button variant="outline" onClick={secondaryCta.onClick} className="font-semibold">{secondaryCta.label}</Button>
          )}
        </div>
      )}
    </div>
  );
}
```

### ErrorState
```jsx
// components/ErrorState.jsx
import { AlertCircle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ErrorState({ title = "Something went wrong", message = "We couldn't load this content. Try again.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-8 text-center">
      <div className="w-14 h-14 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="w-7 h-7 text-red-600" />
      </div>
      <h3 className="text-lg font-black text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm max-w-xs mb-6 leading-relaxed">{message}</p>
      {onRetry && <Button onClick={onRetry} variant="outline" className="font-semibold"><RefreshCw className="w-4 h-4 mr-2" />Try Again</Button>}
    </div>
  );
}
```

## APPLY TO THESE PAGES

For each page below, implement all 4 states:

### /app/Dashboard
- Loading: use PageLoading
- Empty (new account, no domains): show FirstRunBanner + guided next steps. DO NOT show zero-filled score cards.
- Error: ErrorState with retry
- Populated: normal dashboard

### /app/Domains
- Loading: SkeletonTable (4 rows)
- Empty: EmptyState — "No domains added yet" + "Add Your First Domain" CTA
- Error: ErrorState
- Populated: domain list

### /app/ScoreOverview
- Loading: SkeletonScore (circular placeholder)
- Empty: "Score not yet calculated — add a domain to run your first scan"
- Error: ErrorState
- Populated: score ring + breakdown

### /app/Findings
- Loading: SkeletonTable
- Empty: "No findings yet. Run a scan to see results." or "No findings — great security posture." (context-dependent)
- Error: ErrorState
- Populated: findings list

### /app/Vendors
- Loading: SkeletonCard × 3
- Empty: "No vendors added. Add your first vendor to start risk assessments."
- Error: ErrorState
- Populated: vendor grid

### /app/Alerts
- Loading: SkeletonTable
- Empty: "No alerts — your monitored domains look clean."
- Error: ErrorState
- Populated: alert list

### /app/Reports
- Loading: PageLoading
- Empty (plan too low): PlanGate("pro") wraps this — shows upgrade prompt
- Empty (plan ok, no reports): "No reports generated yet. Run a scan and export your first report."
- Error: ErrorState
- Populated: report list

## DO NOT BREAK
- Existing data fetching logic — only wrap with loading/error/empty states
- Existing entity reads

## ACCEPTANCE CRITERIA
- No page shows blank white space while loading
- No page shows zero-filled metrics for empty accounts
- All errors have a retry path
- All empty states have a clear next action

---

# ════════════════════════════════════════════════════════
# PROMPT 13 OF 14
# Project: OneClickIT Security Score
# Phase: Onboarding and Activation Polish
# ════════════════════════════════════════════════════════

## GOAL
New users must reach first value within 60 seconds of signup.
First-run dashboard must feel intentional, not sparse.

## TARGET FILES
Pages → /register (or post-signup flow) and /app/Dashboard

## REQUIRED: ONBOARDING FLOW
Show this after /register completion, before /app/Dashboard.

Route: /onboarding (protected, redirect to /app/Dashboard after complete)

### Step 1 — Company (optional but encouraged)
- Input: Company or workspace name
- Dropdown: Industry (Technology/SaaS, Healthcare, Legal/Finance, Retail, Marketing/Agency, Other)
- "Continue →" button
- "Skip for now" link

### Step 2 — Add Your First Domain
- Input: domain name (no https://)
- Helper text: "We'll run your first security scan immediately."
- "Run First Scan →" button
- "Skip — I'll add a domain from the dashboard" link

### Step 3 — You're Set
- Checklist showing:
  [✓] Account created
  [✓] Security scan queued (if domain added)
  [ ] Review your score (next step)
  [ ] Set up remediation priorities (Essentials+)
- "Go to Dashboard →" button

### Log onboarding completion
After Step 3, call auditLogger:
action="workspace.created", entity_type="Workspace", entity_name=companyName

## REQUIRED: FIRST-RUN DASHBOARD BANNER
Show when: user has no scanned domains OR hasDomains = false

```jsx
// Show above main dashboard content
function FirstRunBanner({ onDismiss }) {
  return (
    <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 text-white mb-6 relative">
      <button onClick={onDismiss} className="absolute top-4 right-4 text-red-200 hover:text-white">×</button>
      <h3 className="font-black text-lg mb-1">Run your first security scan</h3>
      <p className="text-red-100 text-sm mb-4">
        Add your domain to get your security score, identify vulnerabilities, and see your remediation priorities.
      </p>
      <div className="flex flex-wrap gap-3">
        <a href="/app/Domains">
          <button className="bg-white text-red-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-50">
            Add Your Domain →
          </button>
        </a>
        <a href="/security-score">
          <button className="bg-red-500 text-white font-semibold px-4 py-2 rounded-xl text-sm hover:bg-red-400">
            Preview Free Score
          </button>
        </a>
      </div>
    </div>
  );
}
// Dismiss saves to localStorage: 'sc_banner_dismissed'
```

## REQUIRED: ACTIVATION PROGRESS TRACKER
Show on first-run dashboard below the banner:

```jsx
const ACTIVATION_STEPS = [
  { label: "Complete account setup", href: "/app/Settings", done: true },
  { label: "Add your first domain", href: "/app/Domains", done: hasDomains },
  { label: "Review your security score", href: "/app/ScoreOverview", done: hasScore },
  { label: "Set up remediation playbooks", href: "/app/Playbooks", done: false, upgrade: !hasEssentials },
];
```

Each step: checkbox icon + label + "Go →" link + optional "Upgrade" badge if requires plan

## DO NOT BREAK
- Existing /register page and auth flow
- Existing WorkspaceProvider
- Existing dashboard content — banner and tracker appear ABOVE existing content

## ACCEPTANCE CRITERIA
- New user sees onboarding flow immediately after register
- First-run dashboard never shows empty score rings with zeros
- Activation tracker shows clear progress toward first value
- Onboarding completion is logged to AuditLog

---

# ════════════════════════════════════════════════════════
# PROMPT 14 OF 14
# Project: OneClickIT Security Score
# Phase: Trust, Billing, and Settings Polish
# ════════════════════════════════════════════════════════

## GOAL
Public site and app must tell the same trust story. Billing and settings must feel production-stable.

## TARGET FILES
Pages → /trust (public), /app/Billing (protected), /app/Settings (protected)

---

## TRUST PAGE (/trust — public)

### Required Sections

1. Hero
- H1: "Built to keep your security posture honest."
- Subtitle: "Here's how OneClickIT Security works, what it can and can't do, and how we protect your workspace."

2. Workspace Isolation
- Each workspace is isolated — users only see their own domains, findings, and reports
- Row-level access controls enforced at the data layer
- No cross-workspace data leakage

3. Billing Integrity
- Subscription state is driven by Stripe webhook confirmation — not by redirect success
- Plan changes take effect only after Stripe confirms payment
- Subscription history and billing events are logged internally

4. Access Control
- All app routes require authentication
- Admin routes require admin role — enforced at both route and data layer
- No public routes expose internal data

5. Audit Logging
- Sensitive actions are logged: domain changes, vendor updates, report exports, admin actions, billing changes
- Logs are workspace-scoped and retain actor email, timestamp, and action type
- No raw secrets or payment data stored in logs

6. Scan Data
- Security scans run against publicly available signals (DNS, SSL, headers, reputation data)
- We do not perform intrusive penetration testing
- Results are informational — always verify critical findings with a qualified security professional

7. Data Retention and Deletion
- Account deletion removes associated workspace data
- Contact support to request data export or deletion

8. Who This Is For
- SMBs who want a clear, ongoing picture of their security posture
- IT managers who need a structured remediation workflow
- Teams who need to demonstrate security readiness to customers or partners

9. Limitations Disclaimer
- "OneClickIT Security Score is a monitoring and workflow tool. It does not replace a formal security audit, penetration test, or legal compliance review."
- "Findings are based on publicly available signals and may not reflect your complete security posture."

10. Contact
- Questions about data, privacy, or compliance? Link to /contact.

---

## BILLING PAGE (/app/Billing — protected)

### Required Layout

1. Page Header
- Title: "Billing & Plan"
- Subtitle: "Manage your subscription, payment method, and billing history."

2. Current Plan Card
- Show: plan name, plan status (Active / Trialing / Past Due / Cancelled), renewal date if applicable
- Feature list for current plan
- Past-due warning if applicable: "⚠️ Payment failed. Update your payment method to restore full access."
- Button: BillingPortalButton (opens Stripe portal)

3. Upgrade Prompt (free users only)
- Gradient card: "Unlock more with Essentials"
- 3 bullet features: Remediation Playbooks / Vendor Risk Tracker / Email Alerts
- Button: "View Plans →" → /pricing

4. Plan Comparison Quick View
- Simple 3-column table: Essentials / Pro / Team
- 5 key features rows
- "Current plan" badge on active tier

5. Billing FAQ (accordion, 4 questions)
- When does my plan renew?
- What happens if my payment fails?
- Can I upgrade or downgrade anytime?
- How do I cancel?

---

## SETTINGS PAGE (/app/Settings — protected)

### Required Sections

1. Account
- Display name (editable)
- Email (read-only, contact support to change)
- Password change link

2. Workspace
- Workspace name (editable)
- Industry (editable dropdown)
- Created date (read-only)

3. Notifications
- Email alerts for new findings: toggle
- Weekly digest: toggle
- Payment reminders: toggle

4. Danger Zone
- "Delete Workspace" button — confirmation modal required
- Warning: "This permanently removes your workspace, domains, findings, and reports."

### Section Format
Each section: card with gray border, title, description, form fields, Save button.
Save button: shows "Saving..." state, then "Saved ✓" for 2 seconds.

## DO NOT BREAK
- Existing WorkspaceProvider
- Existing settings entity fields
- Existing billing integration

## ACCEPTANCE CRITERIA
- Trust page addresses workspace isolation, billing integrity, access control, and audit logging
- Billing page shows current plan clearly and surfaces past-due state
- Settings page has all 4 sections with proper save states
- No legacy tier names anywhere on these pages
- "OneClickIT Security Score" appears consistently — no "Security Score App" or other variant names
