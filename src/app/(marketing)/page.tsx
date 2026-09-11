import { HeroPanel } from '@/components/home/HeroPanel'
import { ChallengePanel } from '@/components/home/ChallengePanel'
import { WhoWeveHelped } from '@/components/home/WhoWeveHelped'
import { ProblemPanel } from '@/components/home/ProblemPanel'
import { SolutionPanel } from '@/components/home/SolutionPanel'
import { ByTheNumbers } from '@/components/home/ByTheNumbers'
import { NextSteps } from '@/components/home/NextSteps'
import { SiteFooter } from '@/components/home/SiteFooter'
import { SiteShell } from '@/components/home/SiteShell'

/**
 * Home — rebuilt from the approved Figma design (CAI file, HOME frame 2:902,
 * landing state 8:9) and the client's scrub reference recording.
 *
 * LAYOUT MODEL, taken from the reference video: the left panel and the right
 * rail are STICKY for the whole page — the panel is pixel-identical in every
 * frame from ~1s onward — while the center column is ordinary scrolling content
 * carrying every section past them. SiteShell holds that frame (shared with
 * the product pages); this file only supplies the panel and the column.
 *
 * That means sections "rise from the bottom" through normal document flow; no
 * transform trickery is involved. The one-viewport spacer at the top of the
 * center column is what leaves the center showing bare video on landing.
 *
 * RAIL ASSISTANT (Figma 138:1031): clicking the rail mark collapses the left
 * panel and widens the rail into the assistant — see SiteShell/AssistantShell.
 *
 * Every section of the 3866px frame is now built. The one thing still
 * outstanding is behavioural rather than visual: NextSteps has no submit
 * destination — see that file for the HubSpot/Payload wiring it needs.
 */
export default function HomePage() {
  return (
    <SiteShell panel={<HeroPanel />}>
      {/* One viewport of nothing, so the center is bare video on landing */}
      <div aria-hidden="true" className="hidden h-screen lg:block" />

      <ChallengePanel />
      <WhoWeveHelped />
      <ProblemPanel />
      <SolutionPanel />
      <ByTheNumbers />
      <NextSteps />
      <SiteFooter />
    </SiteShell>
  )
}
