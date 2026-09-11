'use client'

import { useCallback, useSyncExternalStore, type RefObject } from 'react'

/**
 * Progress from 0 to 1 while a `position: sticky` section is pinned.
 *
 * Unlike useElementProgress (an element rising through the viewport in
 * normal flow) this is for a section whose OUTER wrapper is made taller than
 * the viewport specifically to hold it in place: the wrapper's top reaches
 * the viewport's top exactly when the pin begins, and progress reaches 1
 * `runway` px later, which is also when the wrapper ends and the pin
 * releases. Progress is therefore just how far the wrapper's top has gone
 * negative, scaled by `runway`.
 *
 * Returns 1 when the user prefers reduced motion, so the section renders
 * resolved (its last beat) with no animation at all.
 */
export function usePinnedProgress(
  ref: RefObject<HTMLElement | null>,
  runway: number,
  /** Start this many px before the pin engages — for animations that begin
   *  while the section is still settling into place. 0 = start at the pin. */
  lead = 0,
) {
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

    const travelled = (lead - el.getBoundingClientRect().top) / Math.max(1, runway + lead)
    // Quantised so sub-pixel scrolling doesn't re-render every frame. 1/1000
    // rather than coarser because a Lottie scrub maps this to ~226 frames.
    return Math.round(Math.min(1, Math.max(0, travelled)) * 1000) / 1000
  }, [ref, runway, lead])

  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}
