import Image from 'next/image'

/**
 * The landing-state block from Figma "Open" (8:9): PROBLEM, four dashed arrows,
 * then FIELDED CAPABILITY.
 *
 * It visually completes the truncated headline — "…a defense program from…" —
 * so the same sentence is expressed two ways: stylised here, plain once scrolled.
 *
 * PROBLEM (3:2048) and FIELDED CAPABILITY (3:1964) are the Figma vector exports.
 * PROBLEM's fractured letterforms are bespoke artwork with no font equivalent,
 * so they could not be reproduced as text. Sizes are the design's fixed pixel
 * values, matching the fixed 23px headline they sit under.
 *
 * FIELDED CAPABILITY carries mix-blend-screen in the file; kept here because it
 * now sits over video rather than flat black.
 */
export function IntroBlock() {
  return (
    <div className="pt-8">
      <Image
        src="/brand/problem.svg"
        alt="Problem"
        width={239}
        height={46}
        priority
        className="h-auto w-[239px] max-w-full"
      />

      <DashedArrows />

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

/** Figma 3:1983 / 3:1988 / 3:1993 / 3:1998 — four 59px arrows, 24px apart. */
function DashedArrows() {
  return (
    <div className="mt-[17px] flex gap-[19px]" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <span key={i} className="relative block h-[59px] w-[5px]">
          <span className="absolute left-1/2 top-0 h-[53px] -translate-x-1/2 border-l border-dashed border-white" />
          <span className="absolute bottom-0 left-1/2 size-0 -translate-x-1/2 border-x-[2.5px] border-x-transparent border-t-[6px] border-t-white" />
        </span>
      ))}
    </div>
  )
}
