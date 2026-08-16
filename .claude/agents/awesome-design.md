---
name: awesome-design
description: Design excellence checklist and principles for Humanlens CMS UI. Use before shipping any visual change — components, pages, or global styles. Covers typography, spacing, color, hierarchy, and polish.
---

# Awesome Design — Humanlens CMS

Read this before touching any UI. Great design is not decoration; it is clarity made visible.

## Core principles

1. **One job per screen.** Every page has a single primary action. Everything else is support.
2. **Hierarchy before color.** Size and weight establish what matters. Color reinforces; it does not replace.
3. **Breathing room.** Generous whitespace signals confidence. Cramped layouts signal anxiety.
4. **Consistent rhythm.** Spacing follows an 8 px base unit. Use 4, 8, 16, 24, 32, 48, 64 — not arbitrary values.
5. **Motion earns its place.** Animate state changes (hover, focus, open/close), not decorative flourishes.

## Typography

- **One typeface family** in the project — do not introduce a second without a strong reason.
- Body text: 16 px / 1.6 line-height minimum for readability.
- Headings: fluid scale (`clamp()`), not fixed breakpoint jumps.
- Never set body copy wider than 72 ch.

## Color

- Define everything in `src/app/globals.css` as CSS custom properties on `:root`.
- Every color must pass WCAG AA contrast (4.5:1 for body text, 3:1 for large text / UI).
- Limit the palette: 1 brand color, 1 neutral scale (5–7 steps), 1 semantic set (error, warning, success, info).
- Dark mode: swap tokens, never duplicate rules. Use `@media (prefers-color-scheme: dark)`.

## Components (Tailwind + shadcn/ui)

- Prefer composing existing primitives over writing net-new styles.
- Interactive states required: `hover`, `focus-visible`, `active`, `disabled`. Never skip `focus-visible`.
- Minimum touch target: 44 × 44 px.
- Icons paired with text: `aria-hidden="true"` on the icon, label on the element.

## Layout

- Mobile-first. Write the small layout first, then override at `md:` / `lg:`.
- Avoid magic numbers for widths — use `max-w-prose`, `max-w-screen-lg`, or a token.
- Grid over absolute positioning for multi-column layouts.

## Polish checklist before marking a UI task done

- [ ] Text does not overflow or truncate unexpectedly at any viewport width
- [ ] All images have meaningful `alt` text (or `alt=""` if decorative)
- [ ] Page is usable keyboard-only (Tab order is logical, focus ring is visible)
- [ ] No layout shift on load (images have explicit width/height or `aspect-ratio`)
- [ ] Verified in both light and dark mode
- [ ] Verified at 375 px (mobile), 768 px (tablet), and 1280 px (desktop)
