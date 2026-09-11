'use client'

import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { ASSISTANT_EASE, TOP_PAD } from './constants'

/**
 * Menu trigger + overlay panel (Figma 8:6).
 *
 * The 860x532 node matches the center column (855 of the 1400 canvas), so the
 * menu covers the center column only: the left black panel and the right rail
 * both stay visible and untouched. On lg the dialog runs from var(--panel) to
 * var(--rail), full height — widths AssistantShell publishes, so the menu
 * still fits the center column while the rail assistant is open. On mobile,
 * where neither side element is shown, it is full-width. No ::backdrop dimming: the panel
 * itself is opaque, and the left panel and rail behind the backdrop must never
 * be dimmed.
 *
 * Built on the native <dialog> element with showModal(), which gives us focus
 * trapping, Escape-to-close, and inertness of the page behind for free — all
 * things a hand-rolled overlay tends to get subtly wrong.
 *
 * Content geometry (unchanged from the mockup, scales via % padding): rule
 * above the columns at mt-[6.5rem] (matches TOP_PAD, the row height every
 * panel opens with), columns below that, wordmark + description below a
 * second rule. The 29x29 close button sits on the shared top row (TOP_PAD),
 * exactly where the trigger is, so it lines up with the slide arrows and the
 * rail mark.
 *
 * The trigger is fixed to the viewport, offset from the right by the rail's
 * width (var(--rail), so it slides along when the assistant opens) plus the
 * 26px gap Figma leaves between them.
 */

const columns = [
  {
    heading: 'Products',
    links: [
      { label: 'Network OS Intelligence', href: '/products/intelligence' },
      { label: 'Network OS Source', href: '/products/source' },
      { label: 'Network OS Decide', href: '/products/decide' },
      // Figma reads "Aquire"; corrected here.
      { label: 'Network OS Acquire', href: '/products/acquire' },
    ],
  },
  {
    heading: 'About',
    links: [
      { label: 'Our team', href: '/about' },
      { label: 'Careers', href: '/careers' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Case studies', href: '/resources/case-studies' },
      { label: 'Consulting', href: '/resources/consulting' },
      { label: 'Blog', href: '/resources' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
]

export function SiteMenu() {
  const ref = useRef<HTMLDialogElement>(null)

  const close = useCallback(() => ref.current?.close(), [])

  // Clicking the backdrop closes. The dialog element itself fills the viewport,
  // so a click landing on it rather than on the panel is a backdrop click.
  const onBackdrop = useCallback(
    (e: React.MouseEvent<HTMLDialogElement>) => {
      if (e.target === ref.current) ref.current?.close()
    },
    [],
  )

  return (
    <>
      <button
        type="button"
        aria-label="Open menu"
        onClick={() => ref.current?.showModal()}
        className={`fixed z-30 flex size-[29px] items-center justify-center rounded-md bg-black transition-[right,background-color] hover:bg-neutral-800 ${ASSISTANT_EASE}`}
        style={{ top: TOP_PAD, right: 'calc(var(--rail) + 26px)' }}
      >
        <span className="flex w-[17px] flex-col gap-[3px]" aria-hidden="true">
          <span className="h-[1.5px] w-full bg-white" />
          <span className="h-[1.5px] w-full bg-white" />
          <span className="h-[1.5px] w-full bg-white" />
        </span>
      </button>

      <dialog
        ref={ref}
        onClick={onBackdrop}
        aria-label="Site menu"
        // Center column only: from the left panel's edge to the rail's.
        className="site-menu fixed inset-y-0 left-0 right-auto m-0 h-auto w-full max-w-none max-h-none overflow-y-auto bg-white p-0 text-black backdrop:bg-transparent lg:left-[var(--panel)] lg:w-[calc(100%_-_var(--panel)_-_var(--rail))]"
      >
        <div className="relative px-[12%] pb-14 pt-[6.6%]">
          {/* Close — Figma 3:2130. Same spot as the trigger: the dialog ends
              where the rail starts, so the trigger's RAIL_W + 26px is 26px here. */}
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            style={{ top: TOP_PAD, right: '26px' }}
            className="absolute flex size-[29px] items-center justify-center rounded-md bg-[var(--color-brand-500)] text-black transition-colors hover:bg-[var(--color-brand-400)]"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden="true">
              <path
                d="M1 1l10 10M11 1L1 11"
                stroke="currentColor"
                strokeWidth="1.75"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <hr className="mt-[6.5rem] border-0 border-t border-black" />

          <nav className="grid grid-cols-1 gap-8 py-9 sm:grid-cols-3">
            {columns.map((column) => (
              <div key={column.heading}>
                <h2 className="text-base font-bold uppercase leading-[25px]">
                  {column.heading}
                </h2>
                <ul>
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        onClick={close}
                        className="block text-base leading-[25px] transition-colors hover:text-[var(--color-brand-600)]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>

          <hr className="border-0 border-t border-black" />

          <p className="mt-9 text-base font-semibold uppercase leading-none tracking-[0.34em]">
            Collaboration.ai
          </p>

          <p className="mt-5 max-w-[42rem] text-base leading-[25px]">
            Builds mission capability infrastructure for defense and government
            organizations. Founded 2017. Headquartered in St. Paul, Minnesota. 60+
            employees.
          </p>
        </div>
      </dialog>
    </>
  )
}
