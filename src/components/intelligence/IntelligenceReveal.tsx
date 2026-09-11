'use client'

import { useCallback, useRef, useSyncExternalStore, type RefObject } from 'react'
import { ScrubbedLottie } from '../home/ScrubbedLottie'

/**
 * "The knowledge is in the room… IT SHOULDN'T LEAVE WHEN THE PEOPLE DO." — the
 * designer's "intelligence stack" Lottie (LottieFiles, project CAI;
 * public/animations/intelligence-stack.json, the portal's Lottie JSON export,
 * unchanged). 698 x 241 at 24fps, 120 frames, all shapes (the statement is
 * outlined, so no fonts to load). Everything has moved by frame 85 and the
 * rest of the file is a hold, so the scroll maps onto 0-85.
 *
 * It runs on scroll the same way as Source's reveal (SourceReveal): the scrub
 * goes from when the animation's top is 80% of the way down the screen to
 * when it is 20% down. It sits ~720px down the page, so on a tall screen it is
 * already above the 80% line at load — which would open it partway through —
 * so the start is the 80% line or wherever it sits at load, whichever is
 * higher: every visitor sees it from frame 0.
 *
 * Shown at the text column's width.
 */

const END_FRAME = 85
/** Where the scrub starts and ends, as the top's distance down the screen. */
const START = 0.8
const END = 0.2

export function IntelligenceReveal() {
  const ref = useRef<HTMLDivElement>(null)
  const progress = useRevealProgress(ref)

  return (
    <div ref={ref} className="mt-3" style={{ aspectRatio: '698 / 241' }}>
      <ScrubbedLottie
        src="/animations/intelligence-stack.json"
        progress={progress}
        endFrame={END_FRAME}
        label="It shouldn’t leave when the people do."
        className="h-full w-full"
      />
    </div>
  )
}

/**
 * 0..1 over START..END (see above); 1 when the user prefers reduced motion.
 * The same measure as SourceReveal's, which keeps its own copy.
 */
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
    // 1/1000 steps: the scrub maps this onto 85 frames.
    return Math.round(Math.min(1, Math.max(0, p)) * 1000) / 1000
  }, [ref])

  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}
