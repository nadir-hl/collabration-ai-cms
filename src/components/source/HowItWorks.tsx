'use client'

import Image from 'next/image'
import { useEffect, useRef, useSyncExternalStore, type CSSProperties } from 'react'
import { ProductSection } from '../product/ProductSection'
import { ScrubbedLottie } from '../home/ScrubbedLottie'
import { usePinnedProgress } from '../home/usePinnedProgress'
import { useElementProgress } from '../home/useElementProgress'

/**
 * "How it works — Three objects, in order." (Figma SOURCE 173:903-1043, and the
 * state boards beside the frame, 173:1216-1459), driven by the designer's
 * "CAI Source Bottom" Lottie (LottieFiles, project CAI;
 * public/animations/source-bottom.json, the portal's Lottie JSON export,
 * unchanged): 680 x 310 at 24fps, 288 frames.
 *
 * The animation walks the three objects and then closes the round:
 *   Topic       frames 0-55     rules, dates, eligibility, published out
 *   Submission  56-175          register, submit, refine (holds 148-168)
 *   Review      176-224         the scores, then the report card (holds 200-219)
 *   Closing     225-287         the round's papers stack into one report (holds from 251)
 * and the section follows it: the current object's arrow turns orange — none
 * in the closing stage, as the design's last board shows — and the copy under
 * the arrows changes to that stage's.
 *
 * On desktop the section pins, like the Problem section on the home page, and
 * the scroll drives the animation across RUNWAY px, starting LEAD px before
 * the pin so the topic has drawn itself in by the time the section settles.
 * Below lg there is no pin: the animation plays as it rises through the screen.
 *
 * The file needs `prime` (see ScrubbedLottie).
 */

const RUNWAY = 2200
const LEAD = 300
const LAST_FRAME = 287

const COPY = {
  participants:
    'Participants register once, submit, and refine. Where the program allows it, they see, critique, and upvote each other’s work, so the field improves before review begins.',
  evaluators:
    'Evaluators score in place, against the criteria the topic stated, with every submission and every score in one record.',
  report:
    'The round closes into a report the program office can hand upward: what was asked, what came in, who advanced, and why.',
} as const

type Step = 0 | 1 | 2

/** Where each stage starts in the animation, which arrow it lights, and its copy. */
const STAGES: { from: number; step: Step | null; copy: keyof typeof COPY }[] = [
  // The design gives Topic the same copy as Submission (173:929 and 173:1273).
  { from: 0, step: 0, copy: 'participants' },
  { from: 56, step: 1, copy: 'participants' },
  { from: 176, step: 2, copy: 'evaluators' },
  { from: 225, step: null, copy: 'report' },
]

export function HowItWorks() {
  const pinRef = useRef<HTMLDivElement>(null)
  const riseRef = useRef<HTMLDivElement>(null)
  const desktop = useDesktop()
  const pinned = usePinnedProgress(pinRef, RUNWAY, LEAD)
  const rising = useElementProgress(riseRef, 0.9)
  const progress = desktop ? pinned : rising

  const frame = progress * LAST_FRAME
  const stage = [...STAGES].reverse().find((s) => frame >= s.from) ?? STAGES[0]

  return (
    <div
      ref={pinRef}
      className="relative lg:h-[var(--pin-h)]"
      style={{ '--pin-h': `calc(100vh + ${RUNWAY}px)` } as CSSProperties}
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <ProductSection
          label="How it works"
          title="Three objects, in order."
          figure={
            <>
              <Steps current={stage.step} />

              {/* Every stage's copy in one grid cell, so the swap never reflows */}
              <div className="text-body mt-[42px] grid">
                {(Object.keys(COPY) as (keyof typeof COPY)[]).map((key) => (
                  <p
                    key={key}
                    aria-hidden={key !== stage.copy}
                    className={`[grid-area:1/1] ${FADE}`}
                    style={{ opacity: key === stage.copy ? 1 : 0 }}
                  >
                    {COPY[key]}
                  </p>
                ))}
              </div>

              <div ref={riseRef} className="mt-[36px]" style={{ aspectRatio: '680 / 310' }}>
                <ScrubbedLottie
                  src="/animations/source-bottom.json"
                  progress={progress}
                  endFrame={LAST_FRAME}
                  prime
                  className="h-full w-full"
                />
              </div>
            </>
          }
        >
          <p>
            Source is built on three things in sequence. A topic carries the outcome you&rsquo;re
            after, the constraints on it, and the criteria it will be judged against. A topic
            receives submissions. Submissions receive a review. Everything else on the platform
            exists to carry the work from one to the next.
          </p>
        </ProductSection>
      </div>
    </div>
  )
}

const FADE =
  'transition-opacity duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none'

/**
 * The three objects as a row of arrows (Figma 173:906-927 and the boards'
 * 173:1216-1256). The current one is the solid orange arrow with a white
 * outline offset below-left (Figma groups 65 / 67); the rest are the grey
 * gradient arrows. Positions are the boards', from the row's left edge; the
 * idle arrows sit 7.7px lower than the current one's orange body, as there.
 * Both looks are drawn for every arrow and cross-fade, so the row never jumps.
 *
 * The arrows are a sequence, not controls, so they are an ordered list with
 * the current one marked.
 */
/** Idle arrows: the 201px one (Topic, Submission) and Review's longer 221px one. */
const IDLE_SHORT = { src: '/brand/source/tab-arrow.svg', w: 201.1, labelX: 9.8, labelY: 14.9 }
const IDLE_LONG = { src: '/brand/source/tab-arrow-long.svg', w: 221.11, labelX: 29.6, labelY: 14.1 }

const STEPS = [
  { name: 'Topic', x: 0, currentX: 0, idle: IDLE_SHORT },
  { name: 'Submission', x: 213.7, currentX: 213.7, idle: IDLE_SHORT },
  { name: 'Review', x: 417.9, currentX: 438.6, idle: IDLE_LONG },
]

function Steps({ current }: { current: Step | null }) {
  // On a phone the row is wider than the screen and scrolls sideways; keep
  // the current arrow in view as the stages change. A no-op where it fits.
  const rowRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const row = rowRef.current
    if (!row || current === null || row.scrollWidth <= row.clientWidth) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    row.scrollTo({ left: Math.max(0, STEPS[current].currentX - 16), behavior: reduced ? 'auto' : 'smooth' })
  }, [current])

  return (
    <div ref={rowRef} className="mt-[43px] overflow-x-auto">
      <ol className="relative ml-[1.5px] h-[57.6px] w-[650px]" aria-label="The three objects">
        {STEPS.map((step, i) => {
          const on = current === i
          return (
            <li key={step.name} aria-current={on ? 'step' : undefined}>
              <span
                aria-hidden={on}
                className={`absolute ${FADE}`}
                style={{ left: step.x, top: 7.7, width: step.idle.w, height: 49.08, opacity: on ? 0 : 1 }}
              >
                <Image src={step.idle.src} alt="" width={Math.round(step.idle.w)} height={49} className="absolute inset-0 h-full w-full" />
                <StepLabel left={step.idle.labelX} top={step.idle.labelY}>
                  {step.name}
                </StepLabel>
              </span>

              <span
                aria-hidden={!on}
                className={`absolute h-[57.6px] w-[211px] ${FADE}`}
                style={{ left: step.currentX, top: 0, opacity: on ? 1 : 0 }}
              >
                <Image
                  src="/brand/source/tab-arrow-active-outline.svg"
                  alt=""
                  width={211}
                  height={50}
                  className="absolute left-0 top-[7.3px] h-[50.34px] w-[210.97px]"
                />
                <Image
                  src="/brand/source/tab-arrow-active.svg"
                  alt=""
                  width={201}
                  height={49}
                  className="absolute left-[10px] top-0 h-[49.07px] w-[201.1px]"
                />
                <StepLabel left={18.5} top={13.5}>
                  {step.name}
                </StepLabel>
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

function StepLabel({ left, top, children }: { left: number; top: number; children: React.ReactNode }) {
  return (
    <span
      className="absolute w-[165px] text-center text-sm font-semibold uppercase leading-normal tracking-[2.8px] text-black"
      style={{ left, top }}
    >
      {children}
    </span>
  )
}

/** True from lg up, where the section pins; false on the server and below lg. */
function useDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia('(min-width: 64rem)')
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia('(min-width: 64rem)').matches,
    () => false,
  )
}
