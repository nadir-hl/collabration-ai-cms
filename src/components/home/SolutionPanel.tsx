'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { usePinnedProgress } from './usePinnedProgress'
import { CENTER_PL, CENTER_PR, SOLUTION_SCRUB_RUNWAY, TOP_ROW_H } from './constants'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * Fraction of the pin's progress spent on the vertical rise (see below)
 * before the horizontal scrub takes over. Picked by feel from the reference:
 * the rise reads as a quick beat relative to the whole pin, not a slow one.
 */
const RISE_END = 0.2

/**
 * "The solution" — the four NetworkOS product cards.
 *
 * Same pin-then-scrub mechanic as ProblemPanel (see usePinnedProgress and
 * that file's doc comment) — "THE SOLUTION" label and the heading beneath it
 * sit at an identical pixel position while the row moves beneath them — but
 * with an extra beat at the start confirmed by diffing quarter-second frames
 * right where the section enters: the row first rises up from below as one
 * block (each card's top is clipped — Decide reads as roughly 40% revealed
 * mid-rise), settles at rest, and only then does the horizontal scrub begin.
 * Both phases share the one pin progress value, split by RISE_END, the same
 * multi-stage-on-one-`p` technique KnowsMissingDiagram uses.
 *
 * Unlike ProblemPanel this is one column throughout (label, heading, body,
 * then the row below), not a heading/strip split — the reference shows the
 * whole intro block full-width above the cards, not beside them.
 *
 * The row's mask deliberately breaks out of the section's usual right inset
 * (CENTER_PR, kept for the intro text only) and runs flush to the rail's own
 * edge instead — confirmed against the client's Figma file, where the third
 * card (node 3:1901 / 3:1915, both a fixed 277.14×376.66) sits mostly behind
 * the boundary at rest. Since that boundary's exact pixel position depends on
 * viewport width (CENTER_PL, the rail, and the flex split all scale), the
 * mask width is measured at runtime (maskW state below) rather than assumed
 * as a constant the way ProblemPanel/other panels get away with — a fixed
 * guess would leave slack at some widths and clip too early at others.
 */
export function SolutionPanel() {
  const pinRef = useRef<HTMLDivElement>(null)
  const p = usePinnedProgress(pinRef, SOLUTION_SCRUB_RUNWAY)

  const maskRef = useRef<HTMLDivElement>(null)
  const [maskW, setMaskW] = useState(0)
  useEffect(() => {
    const el = maskRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setMaskW(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const rise = 1 - easeOutCubic(clamp01(p / RISE_END))
  const scrub = clamp01((p - RISE_END) / (1 - RISE_END))
  const maxScroll = Math.max(0, STRIP_W_PX - maskW)

  return (
    <>
      {/* Desktop — pinned, scroll-scrubbed row */}
      <section
        ref={pinRef}
        className="relative hidden lg:block"
        style={{ height: `calc(100vh + ${SOLUTION_SCRUB_RUNWAY}px)` }}
      >
        <div
          className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden lg:pl-[var(--pl)]"
          style={{ '--pl': CENTER_PL, '--pr': CENTER_PR } as React.CSSProperties}
        >
          {/* Only the intro text keeps the usual right inset — the card row
              below is deliberately let run wider, right up to the rail (see
              the doc comment above). Both inherit the left inset from the
              container's own lg:pl above; neither needs it again. */}
          <div className="lg:pr-[var(--pr)]">
            <Intro />
          </div>

          <div ref={maskRef} className="mt-12 overflow-hidden">
            <div
              className="flex gap-6"
              style={{
                width: `${STRIP_W_PX}px`,
                transform: `translateY(${(rise * 100).toFixed(1)}%) translateX(-${(scrub * maxScroll).toFixed(1)}px)`,
              }}
            >
              {PRODUCTS.map((product) => (
                <ProductCard key={product.name} {...product} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Mobile/tablet — normal flow, no pin; swipe the row instead */}
      <section className="px-8 py-16 lg:hidden">
        <Intro />
        <div className="mt-10 flex gap-6 overflow-x-auto pb-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.name} {...product} />
          ))}
        </div>
      </section>
    </>
  )
}

function Intro() {
  return (
    <div className="min-w-0">
      {/* Same top-row + rule pattern as ChallengePanel/WhoWeveHelped — a
          centred label with a single full-width white rule below it, not
          lines flanking the label. */}
      <div className="flex items-center" style={{ height: TOP_ROW_H }}>
        <p className="section-label w-full text-center">The solution</p>
      </div>
      <hr className="mt-[4px] border-0 border-t border-white" />

      <div className="mt-10 max-w-2xl">
        <p className="section-label">One system, end to end</p>
        <h2 className="display-md mt-2">Each step hands off to the next.</h2>
        <p className="text-body mt-4 text-[--color-text-muted]">
          Surface what the organization holds. Source what it&rsquo;s missing.
          Connect the two. Carry the result to award. Each step is written
          where the next one can use it.
        </p>
      </div>
    </div>
  )
}

/* ─── Card row geometry ────────────────────────────────────────────────────── */

/** Exact Figma value (nodes 3:1901 and 3:1915 both report this fixed size). */
const CARD_W_PX = 277.14
const GAP_PX = 24

type Product = {
  name: string
  href: string
  description: string
}

const PRODUCTS: Product[] = [
  {
    name: 'Intelligence',
    href: '/products/intelligence',
    description:
      'Maps everything the organization already knows in one searchable place: the people, the suppliers, the past solicitations, and what came of them. Stays current as people and priorities change.',
  },
  {
    name: 'Source',
    href: '/products/source',
    description:
      'Builds a solicitation, opens it to the market, and collects every submission in one place through to reporting.',
  },
  {
    name: 'Decide',
    href: '/products/decide',
    description:
      'Scores a field of submissions against stated criteria and documents the reasoning from intake to award, so a selection holds up when it is questioned.',
  },
  {
    name: 'Acquire',
    href: '/products/acquire',
    description:
      'Runs a statutory SBIR or STTR program end-to-end: topic intake, solicitation, proposals, award, and phase management, cycle after cycle.',
  },
]

const STRIP_W_PX = PRODUCTS.length * CARD_W_PX + (PRODUCTS.length - 1) * GAP_PX

/**
 * Card shape — exact vector pulled from Figma (get_design_context +
 * download_assets on node 3:1901): every corner is sharp except the
 * top-right, cut with a ~33px radius, fill #636363 at 80% opacity. Not
 * .btn-primary's chamfer (10px, bottom-right) — a different shape entirely,
 * just the same idea.
 */
function ProductCard({ name, href, description }: Product) {
  return (
    <Link
      href={href}
      className="group flex shrink-0 flex-col rounded-tr-[2.06rem] bg-[#636363]/80 p-6 transition-colors hover:bg-[#636363]"
      style={{ width: `${CARD_W_PX}px` }}
    >
      <p className="section-label">NetworkOS</p>
      <h3 className="mt-1 text-xl font-bold text-white">{name}</h3>
      <p className="text-body mt-4 flex-1 text-[--color-text-muted]">{description}</p>
      <span className="btn btn-primary btn-md mt-6 w-full">Explore</span>
    </Link>
  )
}
