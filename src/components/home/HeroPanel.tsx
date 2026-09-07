'use client'

import Link from 'next/link'
import { IntroBlock } from './IntroBlock'
import { useScrollProgress } from './useScrollProgress'
import { PANEL_SCRIM, SCROLL_RUNWAY, TOP_PAD, TOP_ROW_H } from './constants'

/**
 * Left panel. Holds two states and scrubs between them on scroll:
 *
 *   landing  (Figma "Open" 8:9)  — truncated headline + the PROBLEM ->
 *                                  FIELDED CAPABILITY block, no product list
 *   scrolled (Figma HOME 2:902)  — full headline, product list below the CTA
 *
 * Persistent across both: wordmark, eyebrow, body copy, CTA.
 *
 * Collapsing is done with the `grid-template-rows: Nfr` technique rather than
 * animating height, so no element has to be measured — 0fr is zero height, 1fr
 * is natural height, and fractional values interpolate between them. The CTA
 * rises on its own as the intro block collapses, which is what makes the intro
 * read as moving up and out.
 */
export function HeroPanel() {
  const p = useScrollProgress(SCROLL_RUNWAY)

  return (
    <div
      className="relative z-10 flex h-full flex-col px-8 pb-16 lg:px-14"
      style={{
        paddingTop: TOP_PAD,
        // Sits on top of the page-level black/78 from page.tsx. See PANEL_SCRIM
        // for why this is lighter than the Figma value.
        backgroundColor: `rgba(0, 0, 0, ${PANEL_SCRIM})`,
      }}
    >
      {/* Top row — shares a vertical centre with THE CHALLENGE and the menu button */}
      <div className="flex items-center" style={{ height: TOP_ROW_H }}>
        <Link
          href="/"
          className="text-sm font-semibold uppercase leading-none tracking-[0.34em] text-white"
        >
          Collaboration.ai
        </Link>
      </div>

      <div className="mt-[63px] max-w-[24rem]">
        <p className="section-label">Software for program offices</p>

        {/*
          Both headlines occupy the same grid cell so the container is always as
          tall as the longer one — they cross-fade in place with no reflow.
        */}
        <h1 className="display-xl mt-4 grid">
          <span
            className="[grid-area:1/1]"
            style={{ opacity: 1 - p }}
            aria-hidden={p > 0.5}
          >
            The infrastructure that moves a defense program from&hellip;
          </span>
          <span className="[grid-area:1/1]" style={{ opacity: p }} aria-hidden={p <= 0.5}>
            The infrastructure that moves a defense program from problem to fielded
            capability.
          </span>
        </h1>

        {/* Landing-only: collapses upward as it fades */}
        <div
          className="grid"
          style={{
            gridTemplateRows: `${1 - p}fr`,
            opacity: 1 - p,
            transform: `translateY(${-24 * p}px)`,
          }}
          aria-hidden={p > 0.5}
        >
          <div className="min-h-0 overflow-hidden">
            <IntroBlock />
          </div>
        </div>

        <p className="text-body mt-7">
          Collaboration.Ai builds NetworkOS for defense and government programs. It
          connects what your organization already knows to what it is missing, and
          carries the work through to the field.
        </p>
      </div>

      <div className="mt-12 max-w-[377px]">
        <Link href="/contact" className="btn btn-primary btn-lg w-full">
          Talk to our team
        </Link>
      </div>

      {/* Scrolled-only: expands into place below the CTA as it fades in */}
      <div
        className="grid"
        style={{
          gridTemplateRows: `${p}fr`,
          opacity: p,
          transform: `translateY(${24 * (1 - p)}px)`,
        }}
        aria-hidden={p <= 0.5}
      >
        <div className="min-h-0 overflow-hidden">
          <nav className="pt-[52px]" aria-label="NetworkOS products">
            <p className="section-label">NetworkOS</p>
            <ul className="mt-4 space-y-2">
              {['Intelligence', 'Source', 'Decide', 'Acquire'].map((name) => (
                <li key={name}>
                  <Link
                    href={`/products/${name.toLowerCase()}`}
                    className="text-body text-white transition-colors hover:text-[var(--color-brand-500)]"
                    tabIndex={p <= 0.5 ? -1 : undefined}
                  >
                    {name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}
