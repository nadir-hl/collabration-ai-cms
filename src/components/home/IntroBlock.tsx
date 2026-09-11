import Image from 'next/image'
import { LoopingLottie } from './LoopingLottie'

/**
 * The landing-state block from Figma "Open" (8:9): PROBLEM, four dashed arrows,
 * then FIELDED CAPABILITY.
 *
 * It visually completes the truncated headline — "…a defense program from…" —
 * so the same sentence is expressed two ways: stylised here, plain once scrolled.
 *
 * PROBLEM and its arrows are the designer's "problem arrows" animation
 * (public/animations/problem-arrows.json, the portal's Lottie JSON export):
 * 800 x 439 at 10fps, a 2s loop, the arrows' dashes marching downward. On its
 * canvas the wordmark spans x 20-773 from y 12 and the arrow tips end at
 * y 425. It is sized so the wordmark keeps the static export's 239px (Figma
 * 3:2048); the arrows take the animation's own spacing.
 *
 * FIELDED CAPABILITY (3:1964) is the Figma vector export, at the design's fixed
 * pixel size, matching the fixed 23px headline above. It carries
 * mix-blend-screen in the file; kept because it now sits over video rather
 * than flat black.
 */
export function IntroBlock() {
  return (
    <div className="pt-8">
      <LoopingLottie
        src="/animations/problem-arrows.json"
        canvas={{ w: 800, h: 439 }}
        art={{ x: 20, y: 12, w: 753, h: 413 }}
        width={239}
        label="Problem"
        fallback={
          <Image
            src="/brand/problem.svg"
            alt=""
            width={239}
            height={46}
            priority
            className="absolute left-0 top-0 h-auto w-[239px]"
          />
        }
      />

      <Image
        src="/brand/fielded-capability.svg"
        alt="Fielded capability"
        width={302}
        height={83}
        priority
        className="mt-[25px] h-auto w-[302px] max-w-full mix-blend-screen"
      />
    </div>
  )
}
