'use client'

import { useCallback, useSyncExternalStore } from 'react'

/**
 * Scroll progress from 0 to 1 over the first `distance` pixels of the page.
 *
 * Drives the landing -> scrolled transition in the left panel. Progress is read
 * from scrollY rather than run as a CSS transition, so the animation tracks the
 * scrollbar instead of its own clock — scrubbing back up reverses it.
 *
 * useSyncExternalStore is the right primitive here: scroll position is external
 * mutable browser state, and it gives us a correct server snapshot (0, the
 * landing state) without setting state from inside an effect.
 *
 * Returns 1 when the user prefers reduced motion, so the panel renders resolved
 * with no animation at all.
 */
export function useScrollProgress(distance: number) {
  const subscribe = useCallback((onChange: () => void) => {
    let frame = 0
    const handle = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        onChange()
      })
    }

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
    const travelled = window.scrollY / Math.max(1, distance)
    // Quantised so tiny sub-pixel scrolls don't trigger a re-render every frame.
    return Math.round(Math.min(1, Math.max(0, travelled)) * 200) / 200
  }, [distance])

  return useSyncExternalStore(subscribe, getSnapshot, () => 0)
}
