import Image from 'next/image'

/**
 * Right white rail of the HOME frame (Figma 3:1930).
 *
 * In the design this rail is 64px wide and runs the FULL page height (4030px),
 * not just this viewport — so it is a page-level element, not part of the hero.
 * The mark is the exported Figma glyph, committed to public/brand rather than
 * hotlinked, since Figma asset URLs expire after ~7 days.
 */
export function SideRail() {
  return (
    <aside className="relative z-10 hidden w-16 shrink-0 flex-col items-center gap-8 self-start bg-[var(--color-bg-rail)] py-[6.25rem] lg:sticky lg:top-0 lg:flex lg:h-screen">
      <Image
        src="/brand/cai-mark.svg"
        alt="Collaboration.AI"
        width={26}
        height={27}
        priority
      />

      {/*
        Deliberately NOT using `.text-body` here: that class is unlayered, so it
        outranks Tailwind's `@layer utilities` colours and would force white text
        onto the white rail. Size/weight are set directly instead.
      */}
      <p
        className="whitespace-nowrap text-sm font-medium leading-[25px] text-black"
        style={{ writingMode: 'vertical-rl' }}
      >
        Hey, what are you looking for?
      </p>
    </aside>
  )
}
