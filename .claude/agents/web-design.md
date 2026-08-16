---
name: web-design
description: Web design and frontend implementation guidelines for Humanlens CMS — Next.js App Router, Tailwind CSS, and Payload CMS patterns. Use when building pages, components, or layouts.
---

# Web Design — Humanlens CMS

Practical implementation guide for the frontend layer of this Next.js 15 + Payload CMS project.

## Stack

- **Framework:** Next.js 15 (App Router) — read `node_modules/next/dist/docs/` before using any Next.js API
- **Styling:** Tailwind CSS + CSS custom properties in `src/app/globals.css`
- **CMS data:** Payload CMS v3, fetched server-side in page components
- **Deployment:** Cloudflare Pages

## File conventions

| What | Where |
|------|-------|
| Marketing pages | `src/app/(marketing)/` |
| Shared components | `src/components/` |
| Global styles / tokens | `src/app/globals.css` |
| Nav & Footer | `src/components/Nav.tsx`, `src/components/Footer.tsx` |

## Page component pattern

```tsx
// Server component — fetch data here, not in child components
export default async function PageName() {
  const data = await getPayloadData()   // payload query, cached by Next.js
  return <PageLayout data={data} />
}
```

- Pages under `(marketing)/` are Server Components by default — keep them that way.
- Push interactivity down to the smallest client component possible (`"use client"` at the leaf).
- Use `generateMetadata()` for per-page SEO — title, description, og:image.

## Payload data fetching

- Use the Payload local API in server components — no fetch, no network hop.
- Always specify `depth` to avoid over-fetching related documents.
- Draft/preview mode is already wired — respect `draftMode()` from `next/headers`.

## Responsive design

```
Mobile first → md (768 px) → lg (1024 px) → xl (1280 px)
```

- Write base styles for 375 px, add overrides at larger breakpoints.
- Test every new page at all four breakpoints before marking done.

## Navigation & routing

- `Nav.tsx` and `Footer.tsx` are layout-level — edit them carefully; they appear on every page.
- Use Next.js `<Link>` for all internal navigation (never `<a href>`).
- Active link state: read `usePathname()` in a client component wrapper inside Nav.

## Performance rules

- Images: always use `next/image` with explicit `width`/`height` or `fill` + a sized container.
- Fonts: loaded via `next/font` — do not add `<link>` tags for fonts.
- Third-party scripts: use `next/script` with `strategy="lazyOnload"` unless the script is critical.
- Avoid importing large libraries in Server Components — they bloat the server bundle.

## Accessibility baseline

- Semantic HTML first: `<header>`, `<main>`, `<nav>`, `<section>`, `<article>`, `<footer>`.
- Every interactive element needs a visible focus ring (`focus-visible:outline`).
- Color alone must never be the only way to convey information.
- ARIA roles only when native HTML semantics are insufficient.

## Common gotchas in this project

- The `(marketing)` route group shares a layout — check `src/app/(marketing)/layout.tsx` before adding per-page layout wrappers.
- Cloudflare Pages does not support Node.js APIs at the edge — keep middleware and edge functions runtime-safe.
- Payload admin runs on `/admin` — do not create a marketing page at that path.
