'use client'

import { useCallback, useRef, useSyncExternalStore, type CSSProperties, type RefObject } from 'react'
import { useElementProgress } from './useElementProgress'
import { ProductAnimation } from './ProductAnimation'
import { CENTER_PL, CENTER_PR, DIAGRAM_SCRUB_RUNWAY } from './constants'

/**
 * The framed diagram (Figma 2:1071, 654x355) and its scroll-driven sequence,
 * taken from the client's scrub reference recording (~3.0s-5.0s).
 *
 * The beat, in order:
 *   1. at rest        two circles wide apart, bleeding past both frame edges —
 *                     this is the static Figma composition
 *   2. converging     both travel inward toward the centre
 *   3. on contact     the dashed "missing" circle fills solid orange: what the
 *                     organization was missing becomes known
 *   4. flood          orange spreads to fill the whole frame, swallowing them
 *   5. expand         the card grows to the full width of the centre panel
 *                     and as tall as the viewport allows; the product
 *                     animation always sits whole inside it
 *   6. product        the "fake backend" animation resolves out of the orange
 *                     and draws its network graph in, frame for frame with
 *                     the scroll (see ProductAnimation)
 *
 * The argument the sequence makes: known + missing -> held together -> software.
 *
 * Desktop pins it, like the Problem section: 1-3 play as the frame rises into
 * place, 4-6 while it is held, then it scrolls away at full size. The space
 * the full-size card needs is reserved from the start, so nothing below it
 * ever jumps. Below lg there is no pin and no expansion: the frame simply
 * has the product's shape throughout.
 *
 * Circle geometry is percentages of the frame, so it holds at any size.
 * Diameter 37.61% of the width (246/654); at rest the centres sit at 13.45%
 * and 86.84%, and they finish 34% apart, just under one diameter — the slight
 * overlap the reference shows.
 */

const DIAM = 37.61
const START_L = -5.35
const START_R = 68.04
const END_L = 33 - DIAM / 2 // centre 33%
const END_R = 67 - DIAM / 2 // centre 67%

/** The frame's share of the centre panel: it sits inside the text column. */
const PL = parseFloat(CENTER_PL) / 100
const INNER = 1 - PL - parseFloat(CENTER_PR) / 100
const FRAME_RATIO = 355 / 654
const PRODUCT_RATIO = 1000 / 1050

/** The recording pins the small frame with its top ~158px down (900px tall). */
const SMALL_TOP = 158
/**
 * The full-size card, held BIG_TOP from the top while pinned: the whole centre
 * panel wide, and as tall as the product's shape would make it but never
 * taller than the viewport leaves with BIG_TOP above and below. Where that
 * caps the height (1728x962: 1074 x 882) the card is wider than the artwork,
 * which then sits whole and centred on its own background (ProductAnimation).
 */
const BIG_TOP = 40
const BIG_H = `min(100cqi * ${PRODUCT_RATIO}, 100vh - ${2 * BIG_TOP}px)`

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const lerp = (a: number, b: number, t: number) => a + (b - a) * t
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2)
/** Keeps interpolated numbers short and out of exponent notation in CSS. */
const n = (x: number) => +x.toFixed(5)

type Stages = {
  travel: number
  fill: number
  arrows: number
  flood: number
  reveal: number
  draw: number
}

export function KnowsMissingDiagram() {
  return (
    <>
      <PinnedDiagram />
      <InFlowDiagram />
    </>
  )
}

/** lg and up: rises into place, pins, expands, scrubs. */
function PinnedDiagram() {
  const wrapRef = useRef<HTMLDivElement>(null)
  const t = useRiseThenPin(wrapRef)
  const rise = Math.min(t, 1)
  const pin = Math.max(t - 1, 0)

  const stages: Stages = {
    travel: easeInOut(clamp01(rise / 0.85)),
    fill: clamp01((rise - 0.7) / 0.3),
    arrows: 1 - clamp01(rise / 0.35),
    flood: clamp01(pin / 0.08),
    reveal: clamp01((pin - 0.12) / 0.1),
    draw: clamp01((pin - 0.22) / 0.7),
  }
  const grow = easeInOut(clamp01((pin - 0.08) / 0.17))

  // Small: the text column's box at SMALL_TOP. Big: the full panel width at
  // BIG_TOP. `top` is relative to the sticky anchor, which sits at SMALL_TOP.
  // 100cqi is the centre panel's width (the wrapper is its container).
  const box: CSSProperties = {
    top: -(SMALL_TOP - BIG_TOP) * grow,
    left: `calc(${n((1 - grow) * PL)} * 100cqi)`,
    width: `calc(${n((1 - grow) * INNER + grow)} * 100cqi)`,
    height: `calc(${n((1 - grow) * INNER * FRAME_RATIO)} * 100cqi + ${n(grow)} * ${BIG_H})`,
  }

  return (
    <div
      ref={wrapRef}
      className="relative mt-[31px] hidden lg:block"
      style={{ containerType: 'inline-size' }}
    >
      {/* The pin: a zero-height sticky anchor the frame hangs from */}
      <div style={{ height: DIAGRAM_SCRUB_RUNWAY }}>
        <div className="sticky h-0" style={{ top: SMALL_TOP }}>
          <Frame stages={stages} circleTop="15.77%" className="absolute" style={box} />
        </div>
      </div>
      {/* Where the full-size card comes to rest once the pin releases */}
      <div
        aria-hidden="true"
        style={{ marginTop: -(SMALL_TOP - BIG_TOP), height: `calc(${BIG_H})` }}
      />
    </div>
  )
}

/** Below lg: no pin; the frame has the product's shape and scrubs in flow. */
function InFlowDiagram() {
  const ref = useRef<HTMLDivElement>(null)
  const p = useElementProgress(ref)

  const stages: Stages = {
    travel: easeInOut(clamp01(p / 0.35)),
    fill: clamp01((p - 0.25) / 0.15),
    arrows: 1 - clamp01(p / 0.15),
    flood: clamp01((p - 0.4) / 0.1),
    reveal: clamp01((p - 0.48) / 0.1),
    draw: clamp01((p - 0.55) / 0.4),
  }

  return (
    <div ref={ref} className="mt-[31px] px-8 lg:hidden">
      {/* Circles centred vertically in the taller frame */}
      <Frame stages={stages} circleTop="30.25%" className="relative" style={{ aspectRatio: '1050 / 1000' }} />
    </div>
  )
}

function Frame({
  stages,
  circleTop,
  className,
  style,
}: {
  stages: Stages
  circleTop: string
  className?: string
  style?: CSSProperties
}) {
  const { travel, fill, arrows, flood, reveal, draw } = stages
  return (
    <div className={`border border-white ${className ?? ''}`} style={style} aria-hidden="true">
      {/* Window chrome dots — Figma 3:1412 at 14,15 inside the frame */}
      <div className="absolute left-[14px] top-[15px] flex gap-[6px]">
        <span className="size-2 rounded-full bg-white" />
        <span className="size-2 rounded-full bg-white" />
        <span className="size-2 rounded-full bg-white" />
      </div>

      {/* Known — solid throughout */}
      <div
        className="absolute aspect-square rounded-full bg-[var(--color-brand-500)]"
        style={{ top: circleTop, left: `${lerp(START_L, END_L, travel)}%`, width: `${DIAM}%` }}
      />

      {/* Missing — dashed until the two meet, then solid */}
      <div
        className="absolute aspect-square rounded-full"
        style={{
          top: circleTop,
          left: `${lerp(START_R, END_R, travel)}%`,
          width: `${DIAM}%`,
          backgroundColor: `rgba(255, 168, 32, ${fill})`,
          border: `1px dashed rgba(255, 255, 255, ${1 - fill})`,
        }}
      />

      <Arrow direction="right" className="left-[3.36%]" opacity={arrows} />
      <Arrow direction="left" className="left-[61.93%]" opacity={arrows} />

      {/*
        Stage 4. Orange spreads across the whole frame and swallows the circles
        and the window dots — in the reference nothing survives this except the
        frame border itself.
      */}
      <div className="absolute inset-0 bg-[var(--color-brand-500)]" style={{ opacity: flood }} />

      {/* Stage 6. The product resolves out of the orange and draws itself in */}
      <ProductAnimation progress={draw} className="absolute inset-0" style={{ opacity: reveal }} />
    </div>
  )
}

/**
 * One number for the desktop sequence, 0..2:
 *   0..1  the frame rising from the bottom of the viewport to SMALL_TOP
 *   1..2  pinned there, across DIAGRAM_SCRUB_RUNWAY px of scroll
 * Returns 2 (everything finished) when the user prefers reduced motion.
 */
function useRiseThenPin(ref: RefObject<HTMLElement | null>) {
  const subscribe = useCallback((onChange: () => void) => {
    let frame = 0
    const handle = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        onChange()
      })
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('resize', handle, { passive: true })
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', handle)
      window.removeEventListener('resize', handle)
    }
  }, [])

  const getSnapshot = useCallback(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 2

    const el = ref.current
    if (!el) return 0

    const top = el.getBoundingClientRect().top
    const vh = window.innerHeight
    const t =
      top > SMALL_TOP
        ? clamp01((vh - top) / Math.max(1, vh - SMALL_TOP))
        : 1 + clamp01((SMALL_TOP - top) / DIAGRAM_SCRUB_RUNWAY)
    // 1/1000 steps: the scrub maps ~0.7 of the pin onto 139 frames.
    return Math.round(t * 1000) / 1000
  }, [ref])

  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
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
