import type { CSSProperties } from 'react'
import { ScrubbedLottie } from './ScrubbedLottie'

/**
 * The designer's "fake backend" Lottie (LottieFiles, project CAI) — the
 * product the Knows/Missing diagram resolves into.
 * public/animations/fake-backend.json is the dotLottie export with its two
 * WebP layers inlined, so it loads in one request.
 *
 * 1050 x 1000 at 30fps, 210 frames: a static dashboard (the two image layers)
 * whose centre network graph draws itself in over frames 0-139, then holds.
 * It is scrubbed, not played: `progress` 0..1 maps onto those drawing frames,
 * so the graph builds and unbuilds with the scroll.
 *
 * It is always shown whole ("meet"). In a box wider than its 1050:1000 shape
 * it sits centred, and the box takes the artwork's own background colour, so
 * the extra width reads as more of the same surface rather than as bands.
 */

const SRC = '/animations/fake-backend.json'
/** The graph is fully drawn here; the frames after it only hold. */
const DRAWN_FRAME = 139
/** The dashboard's background — the colour of its bottom image layer. */
const ARTWORK_BG = 'rgb(242, 238, 233)'

export function ProductAnimation({
  progress,
  className,
  style,
}: {
  progress: number
  className?: string
  style?: CSSProperties
}) {
  return (
    <ScrubbedLottie
      src={SRC}
      progress={progress}
      endFrame={DRAWN_FRAME}
      className={className}
      style={{ backgroundColor: ARTWORK_BG, ...style }}
    />
  )
}
