import Link from 'next/link'
import { PANEL_SCRIM, STRIP_W, TOP_PAD } from './constants'

/**
 * Left panel on tablet, lg up to xl (Figma 138:588, tablet frame 1035 wide).
 *
 * At these widths the full panel (HeroPanel) would squeeze the headline into a
 * ~240px column, so the design folds it into a 113px strip that keeps only the
 * brand and the CTA, both turned to read top-to-bottom like the rail's prompt.
 * Nothing else in the layout changes: the divider and slide arrows sit on the
 * strip's edge (var(--panel)) and the center column takes the freed width.
 *
 * Positions are Figma's, measured from the strip's top-left:
 *   wordmark  caps at x 60.6-71.3, starting on the top row (TOP_PAD)
 *   CTA       52.5 x 258 at (29, 400), white outline +8px right/bottom
 *
 * The fill is PANEL_SCRIM rather than Figma's black/78 multiply, matching the
 * full panel (see PANEL_SCRIM for why).
 */
export function HeroStrip() {
  return (
    <div
      className="relative hidden h-full lg:max-xl:block"
      style={{ width: STRIP_W, backgroundColor: `rgba(0, 0, 0, ${PANEL_SCRIM})` }}
    >
      <Link
        href="/"
        className="absolute left-[59px] text-sm font-semibold uppercase leading-none tracking-[0.34em] text-white"
        style={{ top: TOP_PAD, writingMode: 'vertical-rl' }}
      >
        Collaboration.ai
      </Link>

      {/* Positioned by a wrapper: .btn-primary is unlayered CSS that sets
          `position: relative`, which would beat an `absolute` utility. */}
      <div className="absolute left-[29px] top-[400px]">
        <Link
          href="/contact"
          className="btn btn-primary btn-primary-vertical h-[258px] w-[52.5px]"
        >
          Talk to our team
        </Link>
      </div>
    </div>
  )
}
