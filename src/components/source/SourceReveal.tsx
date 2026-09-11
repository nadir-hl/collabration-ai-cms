'use client'

import { useCallback, useRef, useSyncExternalStore, type RefObject } from 'react'
import { ScrubbedLottie } from '../home/ScrubbedLottie'

/**
 * "The next round shouldn't start with a … SEARCH FOR THE LAST ONE." — the
 * designer's "CAI Source Reveal" Lottie (LottieFiles, project CAI;
 * public/animations/source-reveal.json, the portal's Lottie JSON export,
 * unchanged). 696 x 300 at 30fps.
 *
 * Per the design note it runs on scroll: the lens rises from below onto the
 * first document, then reveals a round's paper trail from left to right (the
 * document, the email, the scores, the signed memo), then sweeps back over
 * "SEARCH FOR THE LAST ONE." as the words fade in behind it. It settles at
 * frame 183 (the rest of the file is a hold), so the scroll maps onto 0-183.
 *
 * The scrub runs from when the animation's top is 80% of the way down the
 * screen to when it is 20% down. It sits ~720px down the page, though, so on
 * a tall screen it is already above the 80% line at load — which would open
 * the animation partway through, with the lens caught mid-rise. So the start
 * is the 80% line or wherever the animation sits at load, whichever is
 * higher: every visitor sees it from frame 0.
 *
 * Shown at the text column's width. The canvas has an empty strip under the
 * artwork (y 253-300, 6.75% of its width), which the negative bottom margin
 * gives back so the next block keeps the design's spacing.
 */

const REVEAL_END_FRAME = 183
/** Where the scrub starts and ends, as the top's distance down the screen. */
const START = 0.8
const END = 0.2

export function SourceReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useRevealProgress(ref)

  return (
    <div ref={ref} className="-mb-[6.75%] mt-3" style={{ aspectRatio: '696 / 300' }}>
      <ScrubbedLottie
        src="/animations/source-reveal.json"
        progress={progress}
        endFrame={REVEAL_END_FRAME}
        label="Search for the last one."
        className="h-full w-full"
      />
    </div>
  )
}

/** 0..1 over START..END (see above). 1 when the user prefers reduced motion. */
function useRevealProgress(ref: RefObject<HTMLElement | null>) {
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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 1

    const el = ref.current
    if (!el) return 0

    const vh = window.innerHeight
    const top = el.getBoundingClientRect().top
    // Its top at load is its offset from the top of the page.
    const startTop = Math.min(vh * START, top + window.scrollY)
    const endTop = vh * END
    const p = (startTop - top) / Math.max(1, startTop - endTop)
    // 1/1000 steps: the scrub maps this onto 183 frames.
    return Math.round(Math.min(1, Math.max(0, p)) * 1000) / 1000
  }, [ref])

  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}
