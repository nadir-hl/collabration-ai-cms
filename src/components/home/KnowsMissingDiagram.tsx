'use client'

import Image from 'next/image'
import { useRef } from 'react'
import { useElementProgress } from './useElementProgress'

/**
 * The framed diagram (Figma 2:1071, 654x355) and its scroll-driven convergence,
 * taken from the client's scrub reference recording (~3.0s-4.4s).
 *
 * The beat, in order:
 *   1. at rest        two circles wide apart, bleeding past both frame edges —
 *                     this is the static Figma composition
 *   2. converging     both travel inward toward the centre
 *   3. on contact     the dashed "missing" circle fills solid orange: what the
 *                     organization was missing becomes known
 *   4. merged         they overlap into a notched figure-8 in the middle
 *   5. flood          orange spreads to fill the whole frame, swallowing them
 *   6. reveal         the frame resolves into the product itself
 *
 * The argument the sequence makes: known + missing -> held together -> software.
 *
 * Geometry is percentages of the 654x355 frame, so it holds at any width.
 * Circle diameter 37.61% (246/654); at rest the centres sit at 13.45% and
 * 86.84%, and they finish 34% apart, which is just under one diameter and so
 * produces the slight overlap the reference shows.
 */

const DIAM = 37.61
const START_L = -5.35
const START_R = 68.04
const END_L = 33 - DIAM / 2 // centre 33%
const END_R = 67 - DIAM / 2 // centre 67%

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)

export function KnowsMissingDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useElementProgress(ref)

  // Six stages sharing one pass. Ranges overlap slightly so each hands off
  // before the previous has quite finished — no dead beats.
  const travel = easeInOut(clamp01(p / 0.45)) //  0.00-0.45  converge
  const fill = clamp01((p - 0.35) / 0.2) //        0.35-0.55  missing fills in
  const flood = clamp01((p - 0.55) / 0.2) //       0.55-0.75  orange takes over
  const reveal = clamp01((p - 0.74) / 0.21) //     0.74-0.95  product appears

  // The arrows describe the two sides as separate; once the circles start
  // closing they no longer apply, so they clear out early.
  const arrows = 1 - clamp01(p / 0.2)

  return (
    <div
      ref={ref}
      className="relative mt-[31px] border border-white"
      style={{ aspectRatio: '654 / 355' }}
      aria-hidden="true"
    >
      {/* Window chrome dots — Figma 3:1412 at 14,15 inside the frame */}
      <div className="absolute left-[2.14%] top-[4.2%] flex gap-[6px]">
        <span className="size-2 rounded-full bg-white" />
        <span className="size-2 rounded-full bg-white" />
        <span className="size-2 rounded-full bg-white" />
      </div>

      {/* Known — solid throughout */}
      <div
        className="absolute top-[15.77%] aspect-square rounded-full bg-[var(--color-brand-500)]"
        style={{ left: `${lerp(START_L, END_L, travel)}%`, width: `${DIAM}%` }}
      />

      {/* Missing — dashed until the two meet, then solid */}
      <div
        className="absolute top-[15.77%] aspect-square rounded-full"
        style={{
          left: `${lerp(START_R, END_R, travel)}%`,
          width: `${DIAM}%`,
          backgroundColor: `rgba(255, 168, 32, ${fill})`,
          border: `1px dashed rgba(255, 255, 255, ${1 - fill})`,
        }}
      />

      <Arrow direction="right" className="left-[3.36%]" opacity={arrows} />
      <Arrow direction="left" className="left-[61.93%]" opacity={arrows} />

      {/*
        Stage 5. Orange spreads across the whole frame and swallows the circles
        and the window dots — in the reference nothing survives this except the
        frame border itself.
      */}
      <div
        className="absolute inset-0 bg-[var(--color-brand-500)]"
        style={{ opacity: flood }}
      />

      {/*
        Stage 6. The product resolves out of the orange.

        PLACEHOLDER ASSET: this screenshot is not in the Figma file, so it is a
        frame lifted from the client's reference recording — 1x density and
        H.264-compressed, which shows on small UI text. Fine for reviewing the
        motion, not for shipping. Swap in the real export (ideally @2x) and
        nothing else here needs to change.
      */}
      <Image
        src="/brand/product-ui-PLACEHOLDER.png"
        alt=""
        fill
        sizes="(max-width: 1024px) 100vw, 55vw"
        className="object-cover object-top"
        style={{ opacity: reveal }}
      />
    </div>
  )
}

/** A 1px rule with a solid arrowhead. Figma 2:1064 / 2:1067, 237x12 at y=618. */
function Arrow({
  direction,
  className,
  opacity,
}: {
  direction: 'left' | 'right'
  className?: string
  opacity: number
}) {
  const head =
    direction === 'right'
      ? 'right-0 border-l-[7px] border-l-white'
      : 'left-0 border-r-[7px] border-r-white'

  return (
    <span
      className={`absolute top-[48.45%] block h-px w-[36.24%] bg-white ${className ?? ''}`}
      style={{ opacity }}
    >
      <span
        className={`absolute top-1/2 size-0 -translate-y-1/2 border-y-[5px] border-y-transparent ${head}`}
      />
    </span>
  )
}
