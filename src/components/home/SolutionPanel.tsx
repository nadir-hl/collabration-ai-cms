'use client'

import Link from 'next/link'
import { useRef } from 'react'
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

/* ─── Card row geometry ────────────────────────────────────────────────────── */

const GAP_PX = 24

/**
 * DELIBERATE DEVIATION FROM FIGMA, at the client's direction.
 *
 * The vector (nodes 3:1901 / 3:1915) is a fixed 277.14 wide, but what the
 * design is actually communicating is a *composition*: two whole cards plus
 * the third cut in half at the rail. That composition is the requirement; the
 * card width is just whatever satisfies it.
 *
 * So the width is derived from the measured mask rather than fixed:
 *
 *   2 cards + 2 gaps + half a card = mask
 *   2.5W + 2(GAP) = maskW   ->   W = (maskW - 2·GAP) / 2.5
 *
 * A fixed width cannot hold this — it only looks right at whatever viewport it
 * was tuned against. 300 is correct at a 1440 viewport (mask 795) but breaks
 * at 1728 (mask 966), where three whole cards fit and Decide stops being cut
 * at all. That is the bug this replaces.
 *
 * Clamped at both ends so the text measure stays sane: at the narrow end of
 * `lg` the formula wants cards too narrow to read, and on a 4K display it
 * wants ~870, which is a 100-character line. Inside the clamp the composition
 * is exact; outside it degrades gracefully (a little more or less than half
 * showing) rather than collapsing.
 */
/**
 * Done in CSS rather than by measuring, so there is no JS in the sizing path
 * at all. `cqi` is the mask's own inline size (it declares itself a container
 * below), so the cards solve the equation against whatever width the mask
 * actually has, with no ResizeObserver, no fallback width on first paint, and
 * no re-render on resize.
 *
 * That also makes it observable in a backgrounded tab. A ResizeObserver never
 * fires while `document.visibilityState === 'hidden'` (Chrome throttles the
 * whole render loop, rAF included), which silently pinned the width to its
 * fallback — layout, by contrast, is always computed.
 *
 * The mask spans the whole centre column, from the divider on the left
 * panel's edge to the rail, so cards stay visible as they scrub left all the
 * way to that white line rather than being cut at the content inset. At rest
 * the row still starts at the content inset (ROW_START: CENTER_PL expressed in
 * the mask's own cqi — the mask is the full column, so they measure the same),
 * and the composition is solved against what lies to the right of it.
 *
 * Cards are 80px narrower than the composition alone would make them, at the
 * client's request, floored at CARD_MIN_W_PX so the text column stays
 * readable on smaller desktops (a flat -80px leaves ~145px of text at 1400).
 *
 *   visible = 100cqi - ROW_START
 *   card    = max(CARD_MIN_W, (visible - 2·GAP) / 2.5 - 80px)
 *   strip   = 4·card + 3·GAP
 *   scroll  = ROW_START + strip - 100cqi     (the last card ends at the rail)
 */
const ROW_START_CSS = `${parseFloat(CENTER_PL)}cqi`
const CARD_MIN_W_PX = 270
const CARD_W_CSS = `max(${CARD_MIN_W_PX}px, (100cqi - ${ROW_START_CSS} - ${2 * GAP_PX}px) / 2.5 - 80px)`
const STRIP_W_CSS = `calc(4 * ${CARD_W_CSS} + ${3 * GAP_PX}px)`
const MAX_SCROLL_CSS = `calc(${ROW_START_CSS} + ${STRIP_W_CSS} - 100cqi)`

/**
 * Pinned-row card height, taller than the content alone at the client's
 * request. It grows with the viewport because the pin is h-screen and clips:
 * 22rem is what the pinned view needs besides the cards (the intro block,
 * ~210-230px, the 48px gap, and ~45px of air above and below), capped at
 * 34rem. On short viewports this falls below the content height and the card
 * simply hugs its content, so nothing is ever clipped by it. The extra height
 * opens between the description and the button (the description is flex-1).
 */
const CARD_MIN_H_CSS = 'min(34rem, calc(100vh - 22rem))'

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

  const rise = 1 - easeOutCubic(clamp01(p / RISE_END))
  const scrub = clamp01((p - RISE_END) / (1 - RISE_END))

  return (
    <>
      {/* Desktop — pinned, scroll-scrubbed row */}
      <section
        ref={pinRef}
        className="relative hidden lg:block"
        style={{ height: `calc(100vh + ${SOLUTION_SCRUB_RUNWAY}px)` }}
      >
        <div
          className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden"
          style={{ '--pl': CENTER_PL, '--pr': CENTER_PR } as React.CSSProperties}
        >
          {/* Only the intro text keeps the usual insets. The card row's mask
              below deliberately runs the full column, from the divider to the
              rail (see the geometry notes above); the row itself starts at
              the content inset via ROW_START. */}
          <div className="lg:pl-[var(--pl)] lg:pr-[var(--pr)]">
            <Intro />
          </div>

          {/* container-type makes cqi below resolve against this element */}
          <div className="mt-12 overflow-hidden" style={{ containerType: 'inline-size' }}>
            <div
              className="flex gap-6"
              style={{
                width: STRIP_W_CSS,
                marginLeft: ROW_START_CSS,
                transform: `translateY(${(rise * 100).toFixed(1)}%) translateX(calc(-1 * ${scrub.toFixed(4)} * ${MAX_SCROLL_CSS}))`,
              }}
            >
              {PRODUCTS.map((product) => (
                <ProductCard
                  key={product.name}
                  width={CARD_W_CSS}
                  minHeight={CARD_MIN_H_CSS}
                  {...product}
                />
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
        <p className="text-body mt-4">
          Surface what the organization holds. Source what it&rsquo;s missing.
          Connect the two. Carry the result to award. Each step is written
          where the next one can use it.
        </p>
      </div>
    </div>
  )
}

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


/**
 * Card shape — exact vector pulled from Figma (get_design_context +
 * download_assets on node 3:1901): every corner is sharp except the
 * top-right, cut with a ~33px radius, fill #636363 at 80% opacity. Not
 * .btn-primary's chamfer (10px, bottom-right) — a different shape entirely,
 * just the same idea.
 */
function ProductCard({
  name,
  href,
  description,
  width = '300px',
  minHeight,
}: Product & { width?: string; minHeight?: string }) {
  return (
    <Link
      href={href}
      // Vertical padding. Mobile (not pinned): a flat 56px. Tablet (lg to xl):
      // 32px — the cards are at their narrowest there, so their text wraps
      // longest and the pinned row (h-screen) has no room to spare. Desktop:
      // 32-56px scaled with viewport height, so a short laptop viewport
      // (~1366x650) still fits the pinned row instead of clipping its bottom.
      className="group flex shrink-0 flex-col rounded-tr-[2.06rem] bg-[#636363]/80 px-8 py-14 transition-colors hover:bg-[#636363] lg:max-xl:py-8 xl:py-[clamp(2rem,calc((100vh_-_520px)/5),3.5rem)]"
      style={{ width, minHeight }}
    >
      <p className="section-label">NetworkOS</p>
      <h3 className="mt-1 text-xl font-bold text-white">{name}</h3>
      {/*
        The card width is dictated by the 2.5-card composition, so on a very
        wide display it can outgrow a comfortable line length. Capping the
        measure here (rather than capping the card) keeps the composition
        exact at every width while the text stays readable — ~62 characters
        at a 2560 viewport, and it stops growing past this beyond that.
      */}
      <p className="text-body mt-4 max-w-[34rem] flex-1">{description}</p>
      <span className="btn btn-primary btn-md mt-6 w-full">Explore</span>
    </Link>
  )
}
