'use client'

import Image from 'next/image'
import { useEffect, useRef } from 'react'
import { useAssistant } from './AssistantShell'
import { ASSISTANT_EASE, PANEL_HOLD_W, TOP_PAD, TOP_ROW_H } from './constants'

/**
 * Right white rail of the HOME frame (Figma 3:1930), which doubles as the
 * assistant panel (Figma 138:1031).
 *
 *   closed  64px. Mark on the shared top row, vertical prompt below it.
 *   open    ASSISTANT_W, the left panel's width. The mark slides to the
 *           panel's 25px inset and the prompt becomes the placeholder of an
 *           input pinned 45px from the bottom (37px tall, 1px black stroke,
 *           amber 25x25 send button). Figma mocks the panel at 350px with a
 *           298px input; the input keeps Figma's 25px / 27px side insets and
 *           spans the wider panel.
 *
 * The mark is the toggle; Escape anywhere in the panel closes it again. The
 * left panel collapsing at the same time is AssistantShell's job.
 *
 * In the design this rail runs the FULL page height (4030px), not just this
 * viewport — so it is a page-level element, not part of the hero. Its contents
 * hold the open width (PANEL_HOLD_W) and are clipped by the aside, so nothing
 * reflows while the width animates. `overflow: clip` rather than hidden: a
 * hidden box is still scrollable, so the input could scroll the rail's content
 * sideways. The mark and the send arrow are the exported Figma assets,
 * committed to public/brand since Figma asset URLs expire after ~7 days.
 */
export function SideRail() {
  const { open, setOpen } = useAssistant()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) inputRef.current?.focus({ preventScroll: true })
  }, [open])

  return (
    <aside
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          setOpen(false)
          toggleRef.current?.focus()
        }
      }}
      className={`relative z-10 hidden shrink-0 self-start overflow-clip bg-[var(--color-bg-rail)] lg:sticky lg:top-0 lg:block lg:h-screen lg:w-[var(--rail)] lg:transition-[width] ${ASSISTANT_EASE}`}
    >
      <div className={`relative h-full ${PANEL_HOLD_W}`}>
        {/* Mark on the shared top row, level with the slide arrows and the
            menu/close button. 19px centres it in the closed 64px rail. */}
        <div
          className={`absolute flex items-center transition-[left] ${ASSISTANT_EASE}`}
          style={{ top: TOP_PAD, height: TOP_ROW_H, left: open ? '25px' : '19px' }}
        >
          <button
            ref={toggleRef}
            type="button"
            onClick={() => setOpen(!open)}
            aria-expanded={open}
            aria-controls="rail-assistant"
            aria-label={open ? 'Close assistant' : 'Open assistant'}
            className="flex cursor-pointer"
          >
            <Image src="/brand/cai-mark.svg" alt="" width={26} height={27} priority />
          </button>
        </div>

        {/* Prompt, centred in the closed 64px rail. The centring lives on this
            horizontal wrapper: inside the vertical-rl <p> the cross axis runs
            right-to-left, which pinned the text to the rail's right edge. */}
        <div
          aria-hidden={open}
          className={`absolute left-0 flex w-16 justify-center transition-opacity ${ASSISTANT_EASE} ${open ? 'opacity-0' : ''}`}
          style={{ top: `calc(${TOP_PAD} + ${TOP_ROW_H} + 2rem)` }}
        >
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
        </div>

        <form
          id="rail-assistant"
          aria-label="Ask Collaboration.AI"
          inert={!open}
          // No destination yet: the assistant backend isn't specified, so
          // submitting is a no-op for now.
          onSubmit={(e) => e.preventDefault()}
          className={`absolute bottom-[45px] left-[25px] right-[27px] flex h-[37px] items-center border border-black transition-opacity ${ASSISTANT_EASE} ${open ? '' : 'opacity-0'}`}
        >
          <input
            ref={inputRef}
            type="text"
            name="q"
            autoComplete="off"
            aria-label="What are you looking for?"
            placeholder="Hey, what are you looking for?"
            className="h-full min-w-0 flex-1 bg-transparent pl-[10px] pr-2 text-sm font-medium leading-[25px] text-black outline-none placeholder:text-[#b3b3b3]"
          />
          {/* Figma 138:1105-1107: amber square plus the two arrow strokes,
              placed at their exported offsets. */}
          <button
            type="submit"
            aria-label="Send"
            className="relative mr-[5px] size-[25px] shrink-0 cursor-pointer rounded-[2.5px] bg-[var(--color-brand-500)] transition-colors hover:bg-[var(--color-brand-400)]"
          >
            <Image
              src="/brand/send-arrow-stem.svg"
              alt=""
              width={2}
              height={18}
              className="absolute left-[12.12px] top-[4px] h-[18px] w-[1.76px] max-w-none"
            />
            <Image
              src="/brand/send-arrow-head.svg"
              alt=""
              width={18}
              height={11}
              className="absolute left-[3.36px] top-[2.72px] h-[10.89px] w-[18.28px] max-w-none"
            />
          </button>
        </form>
      </div>
    </aside>
  )
}
