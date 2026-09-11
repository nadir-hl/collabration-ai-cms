'use client'

import { useId, useState } from 'react'

/**
 * The circled "+" under each partner in "Who we've helped" (Figma 2:1203 /
 * 2:1201 / 2:1199) and the summary it reveals beneath it.
 *
 * The design only shows the closed state, so the open state follows the
 * page's existing vocabulary: the "+" drops its vertical bar to read as "−",
 * and the summary opens with the same grid-template-rows 0fr -> 1fr technique
 * HeroPanel uses, so nothing has to be measured. Each partner opens on its
 * own. `inert` keeps the collapsed text out of the tab order and the
 * accessibility tree.
 */
export function PartnerDisclosure({ name, summary }: { name: string; summary: string }) {
  const [open, setOpen] = useState(false)
  const panelId = useId()

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={`More about ${name}`}
        aria-expanded={open}
        aria-controls={panelId}
        className="mt-[15px] flex size-[16.4px] cursor-pointer items-center justify-center rounded-full border border-white text-white transition-colors hover:bg-white hover:text-black"
      >
        <span aria-hidden="true" className="relative block size-[7px]">
          <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
          <span
            className={`absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current transition-transform duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none ${open ? 'scale-y-0' : ''}`}
          />
        </span>
      </button>

      <div
        id={panelId}
        inert={!open}
        className="grid w-full transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="text-body pt-4 text-left">{summary}</p>
        </div>
      </div>
    </>
  )
}
