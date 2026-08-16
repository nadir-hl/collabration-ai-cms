# Collaboration.AI — Project Tickets

Single source of truth for all requirements from the client PRD.
Updated as work progresses. Statuses: `✅ done` · `🔄 in-progress` · `⏳ pending`

---

## Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Done and verified in browser |
| 🔄 | Started — code exists but incomplete or not verified end-to-end |
| ⏳ | Not started |

---

## PHASE 1 — A Live Site

### P1-SETUP · Project foundation

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P1-S1 | Next.js 16 project initialised | ✅ | App Router, TypeScript, Tailwind v4 |
| P1-S2 | Payload CMS v3 installed and wired into Next.js | ✅ | One repo, one deploy |
| P1-S3 | PostgreSQL database connected (Neon) | ✅ | Schema auto-migrated on first boot |
| P1-S4 | All content collections defined in schema | ✅ | Users, Posts, CaseStudies, Competitors, Products, People, Redirects, Media |
| P1-S5 | GitHub repo created and connected | ✅ | `nadir-hl/collabration-ai-cms` |
| P1-S6 | Cloudflare Pages deployment configured | ⏳ | Needs `@cloudflare/next-on-pages` adapter setup + CF account wiring |
| P1-S7 | Preview URL per branch | ⏳ | Automatic once Cloudflare Pages is connected |
| P1-S8 | Staging and production environments separated | ⏳ | Depends on P1-S6 |
| P1-S9 | Cloudflare CDN, WAF, DNS, bot rules live | ⏳ | Needs CF account access from client |
| P1-S10 | Image storage (Cloudflare R2) configured | ⏳ | Payload media currently using local disk |
| P1-S11 | Monitoring and alerting live before launch | ⏳ | |

---

### P1-DS · Design system

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P1-DS1 | Design tokens defined (colour, type, spacing, radius, shadow) | ✅ | CSS custom properties in `globals.css`; swap hex values when brand assets arrive |
| P1-DS2 | Brand colours and typography from client | ⏳ | Placeholder tokens in place; waiting for real assets |
| P1-DS3 | Navigation component — desktop + mobile + product dropdown | ✅ | `src/components/Nav.tsx` |
| P1-DS4 | Footer component | ✅ | `src/components/Footer.tsx` |
| P1-DS5 | RichText renderer (Lexical → JSX) | ✅ | `src/components/RichText.tsx` |
| P1-DS6 | Button component (primary / secondary / ghost variants) | ⏳ | Currently inline Tailwind; extract to component |
| P1-DS7 | Card component | ⏳ | Currently inline; extract for reuse |
| P1-DS8 | Social card image template (OG images) | ⏳ | Needed before launch |
| P1-DS9 | Product art direction — visual differentiation per product | ⏳ | Needs design input from client |
| P1-DS10 | Case study cover image template | ⏳ | |

---

### P1-PAGES · Core public pages

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P1-P1 | Home page | ✅ | Hero, product grid, social proof strip, CTA section |
| P1-P2 | Products parent page (dropdown nav) | ✅ | `/products` — numbered list, "better together" section |
| P1-P3 | Source product page | 🔄 | Template done (`/products/[slug]`); content not added in Payload yet |
| P1-P4 | Decide product page | 🔄 | Template done; content pending |
| P1-P5 | Acquire product page | 🔄 | Template done; content pending |
| P1-P6 | Intelligence product page | 🔄 | Template done; content pending |
| P1-P7 | Cross-product section on every product page | ✅ | "Also in the platform" links built in |
| P1-P8 | About page | ✅ | `/about` — pulls team from Payload People collection |
| P1-P9 | Team section | ✅ | Part of `/about` — grid auto-populates from People |
| P1-P10 | Careers page | ⏳ | `/careers` — list open roles from People (`isOpenRole: true`); placeholder if none |
| P1-P11 | Contact page | 🔄 | `/contact` — page exists; HubSpot form embed not yet wired |
| P1-P12 | HubSpot form embedded with attribution intact | ⏳ | Need client HubSpot portal ID + form ID |
| P1-P13 | Lead copy stored in Payload on form submit | ⏳ | Needs Payload API route wired to HubSpot webhook |
| P1-P14 | Privacy page | ⏳ | `/privacy` — carry over existing text unchanged |
| P1-P15 | Terms page | ⏳ | `/terms` — carry over existing text unchanged |

---

### P1-RES · Resources section

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P1-R1 | Resources index (`/resources`) | ✅ | Unified feed: blog + case studies + competitor map teaser |
| P1-R2 | Blog post template (`/resources/[slug]`) | ✅ | Rich text body, author, tags, date, breadcrumb |
| P1-R3 | Case study index (`/resources/case-studies`) | ✅ | |
| P1-R4 | Case study template (`/resources/case-studies/[slug]`) | ✅ | Problem / what we did / outcome / pull quote / CTA |
| P1-R5 | Competitor comparison map index (`/resources/compare`) | ✅ | Summary table + card grid, auto-updates from Payload |
| P1-R6 | Individual competitor page (`/resources/compare/[slug]`) | ✅ | Fact table (claim / ours / theirs / source / date) + verdict + approver |
| P1-R7 | Resources linked from Nav and Footer | ✅ | Both components include `/resources` link |

---

### P1-MIG · Migration track (runs alongside Phase 1)

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P1-M1 | Access to current WordPress site and hosting | ⏳ | Pending from client |
| P1-M2 | Crawl every live address and classify by value + traffic | ⏳ | Start once M1 is unblocked |
| P1-M3 | Draft redirect map | ⏳ | |
| P1-M4 | Agree kept list and retired list — then freeze it | ⏳ | Gates domain move |
| P1-M5 | Carry retained posts into Payload Posts collection | ⏳ | |
| P1-M6 | Validate every redirect: one hop, 301, correct destination | ⏳ | Longest item — start early |
| P1-M7 | Retired addresses return 410 (or 404 with reason) | ⏳ | |
| P1-M8 | Redirect middleware at the edge (reads Payload Redirects collection) | ⏳ | Cloudflare Worker or Next.js middleware serving 301/410 |
| P1-M9 | Redirect editing UI in admin (post-launch by editors) | ✅ | Redirects collection in Payload with full CRUD |
| P1-M10 | DNS cutover plan with rehearsed rollback on staging | ⏳ | |

---

### P1-QA · Quality bar and launch

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P1-Q1 | Every public route server-rendered (view source shows real content) | ✅ | Next.js SSR throughout |
| P1-Q2 | Core Web Vitals pass on every template | ⏳ | Run Lighthouse before launch |
| P1-Q3 | No secrets in the repo | ✅ | `.env` in `.gitignore`; `.env.example` documents keys |
| P1-Q4 | Browser and device testing pass | ⏳ | |
| P1-Q5 | Performance budget met per template | ⏳ | |
| P1-Q6 | Forms verified (Contact → HubSpot + Payload) | ⏳ | Depends on P1-P12/P1-P13 |
| P1-Q7 | Crawl verified, schema validated, tracking verified | ⏳ | Pre-launch checklist |
| P1-Q8 | Rollback rehearsed on staging before DNS move | ⏳ | |

---

## PHASE 2 — A Site Your Team Runs

### P2-ADMIN · Admin and roles

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P2-A1 | User roles defined: admin, approver, reviewer, editor | ✅ | `src/collections/Users.ts` |
| P2-A2 | Per-collection access control functions | 🔄 | Claim gate on Competitors done; full role enforcement per collection not yet built |
| P2-A3 | Draft → preview → publish → unpublish → rollback | ✅ | Payload versions with drafts enabled on Posts, CaseStudies, Competitors |
| P2-A4 | Version history readable in admin | ✅ | Built into Payload |
| P2-A5 | Media library (upload, reuse without touching code) | ✅ | Media collection with image resizing |
| P2-A6 | Redirect editing after launch by editors (no developer needed) | ✅ | Redirects collection |

---

### P2-REVIEW · Review and approval workflow

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P2-R1 | Assign a reviewer to a document | ⏳ | Needs a `reviewer` relationship field + notification hook |
| P2-R2 | Notify reviewer when assigned | ⏳ | Email notification via Payload hooks |
| P2-R3 | Review state visible on every document (pending / approved / rejected) | ⏳ | Add `reviewStatus` field to relevant collections |
| P2-R4 | Named approver recorded on every published page | 🔄 | `approver` field exists on CaseStudies and Competitors; not on Posts or Products yet |
| P2-R5 | Claim gate: competitor claim cannot publish without named approver | ✅ | `beforeChange` hook in `src/collections/Competitors.ts` |
| P2-R6 | Audit log: who changed what and when | ⏳ | Payload has version history but not a human-readable audit log; needs custom view or plugin |

---

### P2-INTAKE · Intake and competitor pipeline

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P2-I1 | Intake flow end-to-end (submission → draft in Payload) | ⏳ | |
| P2-I2 | Competitor structured fact set (claim / ours / theirs / source / date) | ✅ | `facts` array in Competitors collection |
| P2-I3 | AI agent (Claude API) drafts competitor page into Payload as draft | ⏳ | Agent can only create drafts; cannot publish |
| P2-I4 | Agent draft visible on protected preview branch | ⏳ | Needs Payload draft preview + branch preview setup |
| P2-I5 | Agent rules written in the repo, permissions enforced | ⏳ | `AGENTS.md` exists; agent access policy not yet written |
| P2-I6 | Every agent run leaves a readable, reversible change | ⏳ | |
| P2-I7 | Comparison map auto-rolls up all published competitor pages | ✅ | `/resources/compare` queries Payload live |

---

### P2-LAUNCH · Public launch

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P2-L1 | Team training — create / edit / review / publish unaided | ⏳ | |
| P2-L2 | Short plain-language playbook written | ⏳ | |
| P2-L3 | Public launch | ⏳ | |

---

## PHASE 3 — A Site That Gets Found

### P3-SEO · Search and measurement

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| P3-S1 | Search Console: property verified, sitemap submitted, coverage clean | ⏳ | |
| P3-S2 | SEMrush connected as measurement source | ⏳ | |
| P3-S3 | Keyword mapping: every measured term points at a canonical page | ⏳ | Agent-assisted; needs keyword data from client |
| P3-S4 | Schema.org markup generated from reviewed visible content | ⏳ | Validate on every build |
| P3-S5 | Internal linking strategy implemented, no orphan pages | ⏳ | |
| P3-S6 | AI crawler policy enforced at Cloudflare edge and verified in logs | ⏳ | |
| P3-S7 | January federal program: addresses, templates, taxonomy in place | ⏳ | Hard deadline — must be live before January 2027 |
| P3-S8 | Measurement handover: team reads numbers without Humanlens | ⏳ | |

---

## ONGOING SUPPORT

| ID | Ticket | Status | Notes |
|----|--------|--------|-------|
| OS-1 | New pages and templates picked up and shipped within the month | ⏳ | |
| OS-2 | Content and search support against the measured keyword list | ⏳ | |
| OS-3 | Named support channel with response inside a working day | ⏳ | |

---

## OPEN QUESTIONS (from PRD)

| # | Question | Status |
|---|----------|--------|
| OQ-1 | Which question each priority page is the canonical answer to (keyword mapping input) | ⏳ Waiting on client |
| OQ-2 | Date the redirect list freezes and final list of addresses to keep | ⏳ Waiting on client |
| OQ-3 | Which posts are worth carrying over from the old site | ⏳ Waiting on client |
| OQ-4 | Which case studies are cleared to publish, and by whom | ⏳ Waiting on client |
| OQ-5 | Named approver for competitor claims | ⏳ Waiting on client |
| OQ-6 | Careers: live roles at launch or a placeholder | ⏳ Waiting on client |
| OQ-7 | Start date confirmed | ⏳ |
| OQ-8 | Access: WordPress, hosting, DNS, analytics, HubSpot | ⏳ Waiting on client |
| OQ-9 | Search Console access confirmed | ⏳ Waiting on client |
| OQ-10 | Keyword and ICP data from positioning work | ⏳ Waiting on client |

---

## Summary

| Phase | Total | ✅ Done | 🔄 In progress | ⏳ Pending |
|-------|-------|---------|----------------|-----------|
| Phase 1 — Setup | 11 | 5 | 0 | 6 |
| Phase 1 — Design system | 10 | 5 | 0 | 5 |
| Phase 1 — Pages | 15 | 5 | 6 | 4 |
| Phase 1 — Resources | 7 | 7 | 0 | 0 |
| Phase 1 — Migration | 10 | 1 | 0 | 9 |
| Phase 1 — QA & launch | 8 | 2 | 0 | 6 |
| Phase 2 — Admin | 6 | 4 | 1 | 1 |
| Phase 2 — Review & approval | 6 | 1 | 1 | 4 |
| Phase 2 — Intake & agents | 7 | 2 | 0 | 5 |
| Phase 2 — Launch | 3 | 0 | 0 | 3 |
| Phase 3 — SEO | 8 | 0 | 0 | 8 |
| Ongoing support | 3 | 0 | 0 | 3 |
| **Total** | **94** | **32** | **8** | **54** |

---

_Last updated: 2026-08-16_
