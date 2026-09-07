'use client'

import { useCallback, useSyncExternalStore, type RefObject } from 'react'

/**
 * Progress from 0 to 1 describing how far an element has travelled up through
 * the viewport.
 *
 *   0 -> the element's top edge is at the bottom of the viewport (just entering)
 *   1 -> it has risen by `span` x viewport height since then
 *
 * Page-level scroll progress is no longer useful for the center column: it is
 * ordinary scrolling content of unbounded length, so a section's own position
 * should drive its animation, not distance from the top of the document.
 *
 * Returns 1 when the user prefers reduced motion, so the animation rests at its
 * finished state without ever moving.
 */
export function useElementProgress(ref: RefObject<HTMLElement | null>, span = 0.85) {
  const subscribe = useCallback((onChange: () => void) => {
    let frame = 0
    const handle = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        onChange()
      })
    }

    // The element may already be on screen at mount, before any scroll fires.
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
    const travelled = (vh - el.getBoundingClientRect().top) / Math.max(1, vh * span)
    // Quantised so sub-pixel scrolling doesn't re-render every frame.
    return Math.round(Math.min(1, Math.max(0, travelled)) * 200) / 200
  }, [ref, span])

  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}
