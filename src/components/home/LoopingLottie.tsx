'use client'

import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { AnimationItem } from 'lottie-web'

/**
 * A decorative Lottie that loops while it is on screen — used for the two
 * animated PROBLEM wordmarks (the designer's "problem" and "problem arrows",
 * LottieFiles project CAI).
 *
 * Laid out by its artwork, not its canvas: `art` is the artwork's box on the
 * canvas, and the canvas is scaled and offset so that box lands `width` wide
 * at this element's top-left, with the element exactly as tall as the
 * artwork. The rest of the canvas is empty margin and simply overflows.
 *
 * `fallback` (a static export of the same artwork) stands in until the player
 * has loaded, so the page never opens on a gap. The animation pauses whenever
 * it is off screen or clipped away, and shows a still first frame when the
 * user prefers reduced motion.
 *
 * The player is imported dynamically because lottie-web touches `document`
 * at module load and would break the server render.
 */
export function LoopingLottie({
  src,
  canvas,
  art,
  width,
  label,
  fallback,
  className,
}: {
  src: string
  canvas: { w: number; h: number }
  art: { x: number; y: number; w: number; h: number }
  width: number
  /** Accessible name when it carries meaning; omit for decorative icons. */
  label?: string
  fallback?: ReactNode
  className?: string
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)
  const scale = width / art.w

  useEffect(() => {
    let cancelled = false
    let item: AnimationItem | null = null
    let observer: IntersectionObserver | null = null

    ;(async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import('lottie-web'),
        fetch(src).then((r) => r.json()),
      ])
      const host = hostRef.current
      if (cancelled || !host) return

      const anim = lottie.loadAnimation({
        container: host,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        animationData: data,
      })
      item = anim

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        anim.goToAndStop(0, true)
      } else {
        observer = new IntersectionObserver(([entry]) =>
          entry.isIntersecting ? anim.play() : anim.pause(),
        )
        observer.observe(host)
      }
      setReady(true)
    })()

    return () => {
      cancelled = true
      observer?.disconnect()
      item?.destroy()
    }
  }, [src])

  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`relative ${className ?? ''}`}
      style={{ width, height: art.h * scale }}
    >
      {!ready && fallback}
      <div
        ref={hostRef}
        aria-hidden="true"
        className="absolute"
        style={{
          left: -art.x * scale,
          top: -art.y * scale,
          width: canvas.w * scale,
          height: canvas.h * scale,
        }}
      />
    </div>
  )
}
