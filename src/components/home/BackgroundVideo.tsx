'use client'

import { useEffect, useRef } from 'react'

/** One frame of the clip (24fps). Seeks smaller than half of this are skipped. */
const FRAME = 1 / 24

/**
 * Share of the remaining distance the shown frame closes each animation
 * frame. Smooths the wheel's stepped scroll into continuous motion without
 * visibly lagging behind it.
 */
const EASE = 0.2

/**
 * Decorative background video for the left panel + center section, scrubbed
 * by the page scroll: scrolling down plays it forward, scrolling up plays it
 * backward, and it holds still whenever the reader does. The page's full
 * scrollable length maps onto the clip once — top of the page is the first
 * frame, bottom is the last.
 *
 * Sits behind both panels but NOT behind the right rail, which stays white.
 * The source has no audio track, so `muted` is accurate.
 *
 * The file is encoded for seeking rather than playback. The original
 * (hero-bg.mp4) has two keyframes in 14.6s, so a seek could mean decoding up
 * to 250 frames — hopeless for scrubbing, backwards especially.
 * hero-bg-scrub.mp4 is it re-encoded at 1280x720 with a keyframe every 4
 * frames and no B-frames, so any seek decodes at most 3 frames; it is also
 * smaller (3.4MB vs 4.8MB). 720p is plenty behind the page's 78% black scrim.
 *
 *   ffmpeg -i hero-bg.mp4 -an -c:v libx264 -preset slow -bf 0 -g 4 \
 *     -keyint_min 4 -sc_threshold 0 -crf 26 -vf scale=1280:-2 \
 *     -pix_fmt yuv420p -movflags +faststart hero-bg-scrub.mp4
 *
 * Other pages pass their own clip, encoded the same way. The Source page's
 * source-bg-scrub.mp4 is "CAI Source.mp4" (3840x2160, 6.3s, one keyframe in
 * the whole clip) run through the command above; its poster is its first
 * frame (ffmpeg -i source-bg-scrub.mp4 -frames:v 1 -q:v 3 source-bg-poster.jpg).
 *
 * Seeking is paced: a rAF loop eases the shown time toward the scroll target
 * and only issues a new seek once the previous one has landed, so fast
 * scrolling never queues up more seeks than the decoder can serve. The loop
 * only runs while there is distance left to cover.
 *
 * Reduced motion: no scrubbing — the first frame (the poster) stays put.
 */
export function BackgroundVideo({
  src = '/video/hero-bg-scrub.mp4',
  poster = '/video/hero-bg-poster.jpg',
}: {
  src?: string
  poster?: string
}) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
    let raf = 0
    let shown = 0

    const target = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      return p * video.duration
    }

    const tick = () => {
      raf = 0
      if (!video.duration || reduced.matches) return

      const goal = target()
      shown += (goal - shown) * EASE
      if (Math.abs(goal - shown) < FRAME / 2) shown = goal

      if (!video.seeking && Math.abs(video.currentTime - shown) >= FRAME / 2) {
        video.currentTime = shown
      }
      if (shown !== goal || video.seeking) raf = requestAnimationFrame(tick)
    }

    const kick = () => {
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // Arriving mid-page (reload, back button): show the right frame at once
    // rather than scrubbing up to it from the start.
    const onMetadata = () => {
      if (reduced.matches) return
      shown = target()
      video.currentTime = shown
    }

    if (video.readyState >= 1) onMetadata()
    video.addEventListener('loadedmetadata', onMetadata)
    video.addEventListener('seeked', kick)
    window.addEventListener('scroll', kick, { passive: true })
    window.addEventListener('resize', kick, { passive: true })
    reduced.addEventListener('change', kick)

    return () => {
      cancelAnimationFrame(raf)
      video.removeEventListener('loadedmetadata', onMetadata)
      video.removeEventListener('seeked', kick)
      window.removeEventListener('scroll', kick)
      window.removeEventListener('resize', kick)
      reduced.removeEventListener('change', kick)
    }
  }, [])

  return (
    <video
      ref={ref}
      className="size-full object-cover"
      src={src}
      poster={poster}
      muted
      playsInline
      preload="auto"
      aria-hidden="true"
      tabIndex={-1}
    />
  )
}
