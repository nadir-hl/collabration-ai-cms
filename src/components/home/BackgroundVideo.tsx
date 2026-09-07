'use client'

import { useEffect, useRef } from 'react'

/**
 * Decorative background video for the left panel + center section.
 *
 * Sits behind both panels but NOT behind the right rail, which stays white.
 * The source has no audio track, so `muted` is accurate rather than a
 * workaround for autoplay policy.
 *
 * Reduced motion: a full-bleed moving background is exactly the kind of thing
 * `prefers-reduced-motion` exists for. CSS alone cannot stop playback, so the
 * video is paused here and the poster frame is left showing.
 */
export function BackgroundVideo() {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const query = window.matchMedia('(prefers-reduced-motion: reduce)')

    const apply = () => {
      if (query.matches) {
        el.pause()
      } else {
        // play() rejects if the browser blocks autoplay; nothing to recover.
        void el.play().catch(() => {})
      }
    }

    apply()
    query.addEventListener('change', apply)
    return () => query.removeEventListener('change', apply)
  }, [])

  return (
    <video
      ref={ref}
      className="size-full object-cover"
      src="/video/hero-bg.mp4"
      poster="/video/hero-bg-poster.jpg"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
