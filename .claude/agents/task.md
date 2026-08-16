---
name: task
description: Break down and track implementation tasks for this Humanlens CMS project. Use when planning features, filing tickets, or scoping work across Payload collections, Next.js pages, and Cloudflare Pages.
---

# Task Planning — Humanlens CMS

When the user asks to plan, scope, or break down work:

1. **Read TICKETS.md first** — all PRD requirements live there; new tasks must map to an existing ticket or a clear gap.
2. Break work into atomic units that can each be completed and committed independently.
3. For each task include:
   - Which layer it touches: Payload collection / Next.js route / component / API / infra
   - Acceptance criteria (what "done" looks like, not just what to build)
   - Blockers or dependencies on other tasks
4. Order tasks so each one can be merged without breaking the app for existing visitors.
5. Flag any task that requires a DB migration or schema change — these need extra care on Neon Postgres with Payload.
6. Keep tasks small enough that a single PR describes them in one sentence.

## Task format

```
### [TICKET-ID] Short title
Layer: <collection | page | component | api | infra>
Goal: One sentence — what the user will be able to do.
Done when: Bullet list of observable outcomes.
Blocks / blocked by: <other task IDs or none>
```

## Common task categories in this project

- **Collection changes** — adding fields, hooks, or access rules to Payload collections (`src/collections/`)
- **Page routes** — new or updated marketing pages under `src/app/(marketing)/`
- **Components** — shared UI pieces in `src/components/`
- **Access / roles** — changes to `src/access/roles.ts`
- **Config** — `src/payload.config.ts` or `src/app/globals.css`
