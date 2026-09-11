import { SideRail } from './SideRail'
import { BackgroundVideo } from './BackgroundVideo'
import { SiteMenu } from './SiteMenu'
import { HeroStrip } from './HeroStrip'
import { AssistantShell, LeftPanelSlot } from './AssistantShell'
import { ASSISTANT_EASE, TOP_PAD } from './constants'

/**
 * The three-panel frame the marketing pages sit in (Figma HOME 2:902, and the
 * product pages built on it such as SOURCE 173:3):
 *
 *   - the footage, fixed behind the panel and centre, under Figma's page fill
 *     (2:905 / 173:4: black at 78%); it stops short of the opaque white rail
 *   - the left panel, sticky for the whole page — `panel` on mobile and from
 *     xl, the 113px HeroStrip on tablet (lg up to xl)
 *   - the centre column, ordinary scrolling content — `children`
 *   - the right rail with its assistant, the menu trigger and overlay, the
 *     full-height divider and the slide controls centred on it
 *
 * AssistantShell publishes --panel / --rail, and everything here that sits on
 * the panel edge or against the rail reads them, so the layout follows when
 * the rail assistant opens.
 */
export function SiteShell({
  panel,
  video,
  children,
}: {
  panel: React.ReactNode
  /** The page's background clip (see BackgroundVideo); the home clip if omitted. */
  video?: { src: string; poster: string }
  children: React.ReactNode
}) {
  return (
    <AssistantShell>
      {/* Fixed so the footage stays put while the centre column scrolls over it */}
      <div
        aria-hidden="true"
        className={`fixed inset-0 z-0 overflow-hidden lg:right-[var(--rail)] lg:transition-[right] ${ASSISTANT_EASE}`}
      >
        <BackgroundVideo {...video} />
        <div className="absolute inset-0 bg-black/[0.78]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row">
        <LeftPanelSlot>
          {panel}
          <HeroStrip />
        </LeftPanelSlot>

        <div className="min-w-0 flex-1">{children}</div>

        <SideRail />
      </div>

      {/* Pinned trigger + the menu overlay it opens */}
      <SiteMenu />

      {/* Full-height divider between the black panel and the centre column */}
      <div
        aria-hidden="true"
        className={`pointer-events-none fixed inset-y-0 z-20 hidden w-px bg-white lg:block lg:transition-[left,opacity] ${ASSISTANT_EASE} group-data-[assistant=open]/shell:opacity-0`}
        style={{ left: 'var(--panel)' }}
      />

      {/* Slide controls, centred on the divider. Inert until the carousel
          behaviour is specified. */}
      <div
        aria-hidden="true"
        className={`fixed z-20 hidden -translate-x-1/2 items-center gap-[7px] text-white lg:flex lg:transition-[left,opacity] ${ASSISTANT_EASE} group-data-[assistant=open]/shell:opacity-0`}
        style={{ left: 'var(--panel)', top: TOP_PAD, height: '29px' }}
      >
        <span className="text-[11px] leading-none">&#9664;</span>
        <span className="text-[13px] leading-none">&#9679;</span>
        <span className="text-[11px] leading-none">&#9654;</span>
      </div>
    </AssistantShell>
  )
}
