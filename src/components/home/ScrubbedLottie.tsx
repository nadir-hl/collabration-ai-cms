'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { AnimationItem } from 'lottie-web'

/**
 * A Lottie whose frame follows a 0..1 `progress` instead of a clock, so it
 * builds and unbuilds with the scroll. `endFrame` is the frame progress 1
 * lands on — usually where the animation has finished moving, not its last
 * frame, since designer exports tend to end on a long hold.
 *
 * `fit` is the SVG preserveAspectRatio mode: "meet" shows the whole canvas
 * (letterboxed if the box is a different shape), "slice" fills the box and
 * crops, both centred.
 *
 * `prime` works around exports whose layers only evaluate once the player has
 * stepped through the frames in order: from a fresh load, a jump straight to
 * frame 140 of "CAI Source Bottom" draws nothing (0 paths with geometry),
 * while after one frame-by-frame pass every jump draws correctly (210). With
 * `prime` set, that pass runs once right after loading, before any scrub.
 *
 * The player is imported dynamically because lottie-web touches `document`
 * at module load and would break the server render.
 */
export function ScrubbedLottie({
  src,
  progress,
  endFrame,
  fit = 'meet',
  prime = false,
  label,
  className,
  style,
}: {
  src: string
  progress: number
  endFrame: number
  fit?: 'meet' | 'slice'
  prime?: boolean
  /** Accessible name when the animation carries meaning; decorative if omitted. */
  label?: string
  className?: string
  style?: CSSProperties
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [anim, setAnim] = useState<AnimationItem | null>(null)

  useEffect(() => {
    let cancelled = false
    let item: AnimationItem | null = null

    ;(async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import('lottie-web'),
        fetch(src).then((r) => r.json()),
      ])
      if (cancelled || !hostRef.current) return

      item = lottie.loadAnimation({
        container: hostRef.current,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        animationData: data,
        rendererSettings: { preserveAspectRatio: `xMidYMid ${fit}` },
      })
      if (prime) {
        const loaded = item
        if (!loaded.isLoaded) {
          await new Promise<void>((resolve) => loaded.addEventListener('DOMLoaded', () => resolve()))
        }
        if (cancelled) return
        for (let frame = 0; frame < loaded.totalFrames; frame++) loaded.goToAndStop(frame, true)
      }
      setAnim(item)
    })()

    return () => {
      cancelled = true
      item?.destroy()
    }
  }, [src, fit, prime])

  useEffect(() => {
    if (anim) anim.goToAndStop(progress * endFrame, true)
  }, [anim, progress, endFrame])

  return (
    <div
      ref={hostRef}
      role={label ? 'img' : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={`overflow-hidden ${className ?? ''}`}
      style={style}
    />
  )
}
