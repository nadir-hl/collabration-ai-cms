'use client'

import Link from 'next/link'
import { useCallback, useRef } from 'react'
import { RAIL_W, TOP_PAD } from './constants'

/**
 * Menu trigger + overlay panel (Figma 8:6).
 *
 * The 860x532 node is a scaled-down mockup of the component, not the intended
 * viewport size — the actual design is a full-screen overlay covering the left
 * + center panels only, leaving the right rail (RAIL_W) visible and untouched.
 * So the dialog is left-anchored and full-height, width = 100% minus RAIL_W
 * (100% on mobile, where the rail is hidden). No ::backdrop dimming: the panel
 * itself is opaque and covers the entire interactive area except the rail,
 * which must never be dimmed.
 *
 * Built on the native <dialog> element with showModal(), which gives us focus
 * trapping, Escape-to-close, and inertness of the page behind for free — all
 * things a hand-rolled overlay tends to get subtly wrong.
 *
 * Content geometry (unchanged from the mockup, scales via % padding): rule
 * above the columns at mt-[6.5rem] (matches TOP_PAD, the row height every
 * panel opens with), columns below that, wordmark + description below a
 * second rule, close button 29x29 near the top-right corner.
 *
 * The trigger is fixed to the viewport, offset from the right by the rail's
 * width plus the 26px gap Figma leaves between them.
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
        className="fixed z-30 flex size-[29px] items-center justify-center rounded-md bg-black transition-colors hover:bg-neutral-800"
        style={{ top: TOP_PAD, right: `calc(${RAIL_W} + 26px)` }}
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
        // Left-anchored, full height, full width minus the rail (RAIL_W =
        // 4rem — keep this literal in sync with constants.ts; Tailwind can't
        // interpolate the JS value into an arbitrary-value class).
        className="site-menu fixed inset-y-0 left-0 right-auto m-0 h-auto w-full max-w-none max-h-none overflow-y-auto bg-white p-0 text-black lg:w-[calc(100%-4rem)]"
      >
        <div className="relative px-[12%] pb-14 pt-[6.6%]">
          {/* Close — Figma 3:2130, 29x29 at (783, 35) */}
          <button
            type="button"
            onClick={close}
            aria-label="Close menu"
            className="absolute right-[6.6%] top-[6.6%] flex size-[29px] items-center justify-center rounded-md bg-[var(--color-brand-500)] text-black transition-colors hover:bg-[var(--color-brand-400)]"
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
