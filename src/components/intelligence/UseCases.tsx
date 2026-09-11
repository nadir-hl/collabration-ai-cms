'use client'

import Image from 'next/image'
import { useId, useState } from 'react'

/**
 * What teams use Intelligence for (Figma INTELLIGENCE 208:1064, icons
 * 208:1081-1093): orange headings, each with a "+" at the list's right edge
 * that opens its description underneath. The design shows the first one open
 * (its icon is the "−", 208:1093), so it starts open here; each opens and
 * closes on its own.
 *
 * Only the first has copy in the design. The others carry placeholder text
 * until it arrives (the Source frame's note for the same pattern: "Need to get
 * copy for each of these drop downs").
 *
 * Geometry from the frame: the list runs 647 wide (x 567-1214, the icon's
 * right edge), the copy 568; headings are 14px on Poppins' normal line height
 * with one blank line between items, and the copy sits straight under its
 * heading on the 25px rhythm.
 */

const PLACEHOLDER =
  'Placeholder description: what this looks like for a program office in practice. Replace with approved copy.'

const USE_CASES = [
  {
    title: 'Market research under volume.',
    body: 'Turn a program office need into a cited market research report or acquisition brief the office can hand upward, at the pace the intake arrives.',
  },
  { title: 'The bench before the solicitation.', body: PLACEHOLDER },
  { title: 'Vetting that holds up.', body: PLACEHOLDER },
  { title: 'The portfolio check. Who to call.', body: PLACEHOLDER },
]

export function UseCases() {
  return (
    <ul className="mt-[120px] max-w-[647px]">
      {USE_CASES.map((item, i) => (
        <UseCase key={item.title} {...item} defaultOpen={i === 0} first={i === 0} />
      ))}
    </ul>
  )
}

function UseCase({
  title,
  body,
  defaultOpen,
  first,
}: {
  title: string
  body: string
  defaultOpen: boolean
  first: boolean
}) {
  const [open, setOpen] = useState(defaultOpen)
  const panelId = useId()

  return (
    <li className={first ? undefined : 'mt-[21px]'}>
      <h3>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={panelId}
          className="flex w-full cursor-pointer items-center justify-between gap-6 text-left"
        >
          {/* Not .section-label: unlayered, it would outrank the line height */}
          <span className="text-sm font-semibold uppercase leading-normal tracking-[2.8px] text-[var(--color-brand-500)]">
            {title}
          </span>
          <span aria-hidden="true" className="relative size-[11.16px] shrink-0">
            <Image
              src="/brand/intelligence/list-plus.svg"
              alt=""
              width={11}
              height={11}
              className={`absolute inset-0 size-full ${FADE} ${open ? 'opacity-0' : ''}`}
            />
            <Image
              src="/brand/intelligence/list-minus.svg"
              alt=""
              width={11}
              height={1}
              className={`absolute left-0 top-1/2 h-px w-full -translate-y-1/2 ${FADE} ${open ? '' : 'opacity-0'}`}
            />
          </span>
        </button>
      </h3>

      <div
        id={panelId}
        inert={!open}
        className="grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
        style={{ gridTemplateRows: open ? '1fr' : '0fr', opacity: open ? 1 : 0 }}
      >
        <div className="min-h-0 overflow-hidden">
          <p className="text-body max-w-[568px]">{body}</p>
        </div>
      </div>
    </li>
  )
}

const FADE =
  'transition-opacity duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none'
