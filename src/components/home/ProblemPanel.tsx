'use client'

import Image from 'next/image'
import { useRef, type CSSProperties } from 'react'
import { usePinnedProgress } from './usePinnedProgress'
import { ProblemAnimation, SCRUB_END_FRAME } from './ProblemAnimation'
import { LoopingLottie } from './LoopingLottie'
import { CENTER_PL, PROBLEM_SCRUB_RUNWAY } from './constants'

/**
 * "Where it comes apart".
 *
 * Pinned, with scroll driving the designer's Lottie (see ProblemAnimation).
 *
 * The pinned geometry is measured off the client's reference recording,
 * which is 1400x900 — the Figma canvas width — so one video pixel is one
 * Figma unit. With the section pinned:
 *   - the PROBLEM wordmark top sits at y=170;
 *   - the Lottie canvas origin sits at y=85, and 325px right of the content
 *     column's left edge, at 1:1 (the checklist borders line up to the pixel:
 *     y 168/206/545 in the video = 83/121/460 on the canvas, +85 each).
 * There is no separate divider: the vertical rule in the reference is the
 * Lottie's own line, which draws on with the animation. The canvas is not
 * cropped either — it runs off the bottom of the screen and behind the rail,
 * and the sticky container's overflow is what clips it, so the submission
 * rows rise in from the screen edge exactly as they do in the recording.
 */
const PIN_TOP = 170
const CANVAS_TOP = 85
const CANVAS_LEFT = 325
/** Figma 2:1255 — the text column's width. */
const INTRO_W = 306
/**
 * In the recording the Lottie has just started when the pin engages — frame
 * ~2, one checkbox and a header dot drawn. At the pinned pace of (226 - 2)
 * frames over the runway, that's ~18px of scroll before the pin.
 */
const LEAD_PX = 18
/** The recording's text column sits 4px left of the content edge here. */
const INTRO_NUDGE = -4
/**
 * The recording lights the copy up one line at a time, each the instant a
 * slide of the animation settles: frames 58, 104, 150 and 193, the ends of
 * the checklist strip's four moves. The first line starts lit; the closing
 * paragraph is last. Until then a line sits at white 30%.
 */
const LIGHT_AT = [58, 104, 150, 193]
const DIM = 'rgba(255, 255, 255, 0.3)'
/** The copy, in the order it lights up. */
const LINES = [
  'A portal takes the submissions.',
  'A spreadsheet tracks them.',
  'A working group holds the relationships.',
  'Program files hold the history.',
]

/** Mobile only: rising rows would otherwise pop in at the window's edge. */
const MOBILE_FADE: CSSProperties = {
  maskImage: 'linear-gradient(to bottom, #000 440px, transparent)',
  WebkitMaskImage: 'linear-gradient(to bottom, #000 440px, transparent)',
}

export function ProblemPanel() {
  const pinRef = useRef<HTMLDivElement>(null)
  const p = usePinnedProgress(pinRef, PROBLEM_SCRUB_RUNWAY, LEAD_PX)
  const lit = 1 + LIGHT_AT.filter((frame) => p * SCRUB_END_FRAME >= frame).length

  return (
    <>
      {/* Desktop — pinned, scroll drives the animation */}
      <section
        ref={pinRef}
        className="relative hidden lg:block"
        style={{ height: `calc(100vh + ${PROBLEM_SCRUB_RUNWAY}px)` }}
      >
        <div
          className="sticky top-0 h-screen overflow-hidden lg:pl-[var(--pl)]"
          style={{ '--pl': CENTER_PL } as CSSProperties}
        >
          <div className="relative h-full">
            <div className="absolute" style={{ top: PIN_TOP, left: INTRO_NUDGE, width: INTRO_W }}>
              <Intro lit={lit} />
            </div>
            <ProblemAnimation
              progress={p}
              className="absolute"
              style={{ left: CANVAS_LEFT, top: CANVAS_TOP }}
            />
          </div>
        </div>
      </section>

      {/* Mobile/tablet — normal flow, no pin; the animation loops on its own */}
      <section className="px-8 py-16 lg:hidden">
        <Intro lit={LINES.length + 1} />
        <div className="relative mt-10 h-[520px] overflow-hidden" style={MOBILE_FADE}>
          <ProblemAnimation className="absolute left-0 top-[-54px]" />
        </div>
      </section>
    </>
  )
}

/** `lit`: how many of the lines (then the closing paragraph) are lit. */
function Intro({ lit }: { lit: number }) {
  return (
    <div className="min-w-0">
      {/*
        Figma 2:1254 — the fractured wordmark, animated: the designer's
        "problem" Lottie (public/animations/problem-wordmark.json, the portal's
        Lottie JSON export), 800 x 157 at 10fps, a 2s loop, with the wordmark
        at x 20-773, y 7-153 on its canvas. Sized to the static export's
        238.5px, which stands in until the player loads. The recording has it
        2px further left than the text below.
      */}
      <LoopingLottie
        src="/animations/problem-wordmark.json"
        canvas={{ w: 800, h: 157 }}
        art={{ x: 20, y: 7, w: 753, h: 146 }}
        width={238.5}
        label="Problem"
        className="-ml-[2px]"
        fallback={
          <Image
            src="/brand/problem.svg"
            alt=""
            width={239}
            height={46}
            className="absolute left-0 top-0 h-auto w-[238.5px]"
          />
        }
      />
      {/* Figma: the text block starts 72px below the wordmark's top */}
      <p className="section-label mt-[26px]">Where it comes apart</p>
      <h2 className="display-md mt-2">No system holds the whole program.</h2>

      {/*
        Colours are inline: `.text-body` is unlayered, so it outranks
        Tailwind's `@layer utilities` colours (same trap SideRail documents).
      */}
      <div className="text-body mt-6 space-y-0.5">
        {LINES.map((line, i) => (
          <p key={line} style={{ color: i < lit ? '#fff' : DIM }}>
            {line}
          </p>
        ))}
      </div>

      <p
        className="mt-6 text-sm font-medium leading-[25px]"
        style={{ color: lit > LINES.length ? '#fff' : DIM }}
      >
        Every piece has an owner and the program has none, so it gets reassembled
        at each step, and again at the start of every cycle.
      </p>
    </div>
  )
}
