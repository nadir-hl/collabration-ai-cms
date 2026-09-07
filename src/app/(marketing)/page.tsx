import { HeroPanel } from '@/components/home/HeroPanel'
import { ChallengePanel } from '@/components/home/ChallengePanel'
import { WhoWeveHelped } from '@/components/home/WhoWeveHelped'
import { ProblemPanel } from '@/components/home/ProblemPanel'
import { SolutionPanel } from '@/components/home/SolutionPanel'
import { ByTheNumbers } from '@/components/home/ByTheNumbers'
import { NextSteps } from '@/components/home/NextSteps'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SideRail } from '@/components/home/SideRail'
import { BackgroundVideo } from '@/components/home/BackgroundVideo'
import { SiteMenu } from '@/components/home/SiteMenu'
import { PANEL_W, RAIL_W, TOP_PAD } from '@/components/home/constants'

/**
 * Home — rebuilt from the approved Figma design (CAI file, HOME frame 2:902,
 * landing state 8:9) and the client's scrub reference recording.
 *
 * LAYOUT MODEL, taken from the reference video: the left panel and the right
 * rail are STICKY for the whole page — the panel is pixel-identical in every
 * frame from ~1s onward — while the center column is ordinary scrolling content
 * carrying every section past them.
 *
 * That means sections "rise from the bottom" through normal document flow; no
 * transform trickery is involved. The one-viewport spacer at the top of the
 * center column is what leaves the center showing bare video on landing.
 *
 * Every section of the 3866px frame is now built. The one thing still
 * outstanding is behavioural rather than visual: NextSteps has no submit
 * destination — see that file for the HubSpot/Payload wiring it needs.
 */
export default function HomePage() {
  return (
    <div className="relative">
      {/*
        Fixed so the footage stays put while the center column scrolls over it.
        Covers the panel and center but stops short of the rail, which is opaque
        white. The scrim is Figma's page fill (2:905): black at 78%.
      */}
      <div
        aria-hidden="true"
        className="fixed inset-0 z-0 overflow-hidden lg:right-[var(--rail)]"
        style={{ '--rail': RAIL_W } as React.CSSProperties}
      >
        <BackgroundVideo />
        <div className="absolute inset-0 bg-black/[0.78]" />
      </div>

      <div className="relative z-10 flex flex-col lg:flex-row">
        {/* Sticky for the whole page — never scrolls away */}
        <div className="lg:sticky lg:top-0 lg:h-screen lg:w-[34.142857%] lg:shrink-0">
          <HeroPanel />
        </div>

        {/* The scrolling column */}
        <div className="min-w-0 flex-1">
          {/* One viewport of nothing, so the center is bare video on landing */}
          <div aria-hidden="true" className="hidden h-screen lg:block" />

          <ChallengePanel />
          <WhoWeveHelped />
          <ProblemPanel />
          <SolutionPanel />
          <ByTheNumbers />
          <NextSteps />
          <SiteFooter />
        </div>

        <SideRail />
      </div>

      {/* Pinned trigger + the menu overlay it opens */}
      <SiteMenu />

      {/* Full-height divider between the black panel and the center column */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-y-0 z-20 hidden w-px bg-white lg:block"
        style={{ left: PANEL_W }}
      />

      {/* Slide controls, centred on the divider. Inert until the carousel
          behaviour is specified. */}
      <div
        aria-hidden="true"
        className="fixed z-20 hidden -translate-x-1/2 items-center gap-[7px] text-white lg:flex"
        style={{ left: PANEL_W, top: TOP_PAD, height: '29px' }}
      >
        <span className="text-[11px] leading-none">&#9664;</span>
        <span className="text-[13px] leading-none">&#9679;</span>
        <span className="text-[11px] leading-none">&#9654;</span>
      </div>
    </div>
  )
}
