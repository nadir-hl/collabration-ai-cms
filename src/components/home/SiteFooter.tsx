import Link from 'next/link'
import { CENTER_PL, CENTER_PR } from './constants'

/**
 * Page footer (Figma HOME 2:902, y=3717..3903).
 *
 * The wordmark (3:2076) is the same 258.42 x 10.65 lockup the left panel
 * opens with, so it gets HeroPanel's treatment rather than a second one.
 *
 * The blurb (3:2094) is the same sentence SiteMenu already carries — kept in
 * both places deliberately, since they are the two places a visitor might
 * look for it, but if it starts drifting it should move to a Payload global
 * rather than being copy-pasted a third time.
 *
 * Muted colour is set with explicit size/weight instead of `.text-body`:
 * that class is unlayered, so it outranks Tailwind's `@layer utilities`
 * colours and would force this back to full white (see SideRail).
 */
export function SiteFooter() {
  return (
    <footer
      className="relative min-w-0 px-8 pb-24 pt-24 lg:pl-[var(--pl)] lg:pr-[var(--pr)]"
      style={{ '--pl': CENTER_PL, '--pr': CENTER_PR } as React.CSSProperties}
    >
      <Link
        href="/"
        className="text-sm font-semibold uppercase leading-none tracking-[0.34em] text-white"
      >
        Collaboration.ai
      </Link>

      <p className="mt-5 max-w-[42rem] text-sm font-medium leading-[25px] text-[var(--color-text-muted)]">
        Builds mission capability infrastructure for defense and government
        organizations. Founded 2017. Headquartered in St. Paul, Minnesota. 60+
        employees.
      </p>
    </footer>
  )
}
