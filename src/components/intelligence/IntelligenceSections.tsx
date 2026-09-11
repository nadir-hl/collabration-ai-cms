import Image from 'next/image'
import { ProductColumn, ProductSection } from '../product/ProductSection'
import { PartnerDisclosure } from '../home/PartnerDisclosure'
import { LoopingLottie } from '../home/LoopingLottie'
import { HowItWorks } from './HowItWorks'
import { IntelligenceReveal } from './IntelligenceReveal'
import { UseCases } from './UseCases'

/**
 * The Intelligence page's centre column, Figma INTELLIGENCE (208:4), x 567 in
 * the 1400 frame. Vertical gaps are the frame's, measured from the end of one
 * block's copy to the start of the next (on its 25px rhythm), so the page
 * keeps the design's pacing — the same approach as SourceSections.
 */
export function IntelligenceSections() {
  return (
    <>
      <ProductSection label="What it is" title="The memory of a program office." measure={651}>
        <p>
          A program office knows who it has worked with, what it funded, what came of it, and who
          to call. Most of that lives in people, inboxes, and the files of past programs. NetworkOS
          Intelligence puts it in one searchable place, alongside the public record of who else is
          out there, and keeps it current as people and priorities change.
        </p>
        <p className="mt-[25px]">
          Runs SciTechCONNECT for the Applied Research Institute. Measured at STRIKEWERX.
        </p>
      </ProductSection>

      <ProductSection
        label="Where it comes apart"
        title="The work is bigger than the team."
        className="mt-[64px]"
        figure={<IntelligenceReveal />}
      >
        <p>
          A challenge opens and hundreds of proposals arrive for two or three people to research.
          The right vendors have to be found before the solicitation posts. Every check has to
          hold up when contracting asks. And the answers to all of it live in the heads of the
          people who were there, until they rotate.
        </p>
        <p className="mt-[25px]">The knowledge is in the room&hellip;</p>
      </ProductSection>

      <HowItWorks />

      <ProductColumn>
        <Alongside />
      </ProductColumn>

      <ProductSection
        label="Who runs it"
        title="Small teams that has to know the whole landscape."
        className="mt-[118px]"
        figure={
          <>
            <UseCases />
            <Deployments />
          </>
        }
      >
        <p>
          Program offices that source and fund technology. Portfolio and acquisition teams that
          have to brief leadership every month. The regional collaboratives and nonprofits that
          connect industry, academia, and government to federal funding. The first deployment
          connects historically Black colleges and universities to Department of War research
          funding, through the Applied Research Institute&rsquo;s SciTechCONNECT program.
        </p>
      </ProductSection>

      <ProductSection
        label="Security and hosting"
        title="Your data stays yours."
        measure={637}
        className="mt-[57px]"
        figure={<Controls />}
      >
        <p>
          Customer data stays inside the customer&rsquo;s boundary and is never used to train
          models. Controls align with NIST 800-53. Every action, query, and data source is logged,
          access is set by role, and connections to your systems read in one direction only. Built
          for unclassified program data.
        </p>
      </ProductSection>
    </>
  )
}

/**
 * Where Intelligence sits against what a program already has (Figma
 * 208:60-62): three short columns under "How it works", in the frame's
 * proportions — 178, 178 and 185 wide, ~61 apart, the same grid as Source's
 * program types. On desktop the pinned "How it works" above releases with its
 * own space below it, which stands in for the frame's 137px gap.
 *
 * Each column opens like Source's program types: an animated icon, 24.78px,
 * over a 176px rule, then the copy. The icons are the designer's (LottieFiles,
 * project CAI: "animated icons", "link", "code", left to right; the portal's
 * Lottie JSON exports, unchanged). A column without an animation keeps the
 * icon's slot open, so its rule still lines up with the others.
 */
function Alongside() {
  return (
    <ul className="text-body mt-[137px] grid grid-cols-1 gap-y-8 sm:grid-cols-[178fr_178fr_185fr] sm:gap-x-[61px] lg:mt-0">
      {ALONGSIDE.map((item) => (
        <li key={item.icon}>
          {item.animation ? (
            <LoopingLottie
              src={item.animation}
              canvas={ICON_CANVAS}
              art={ICON_ART}
              width={ICON_W}
            />
          ) : (
            // TODO(icon): this column's Lottie (see `icon`), once it can be downloaded
            <div aria-hidden="true" style={{ width: ICON_W, height: ICON_H }} />
          )}
          <hr className="mt-[13px] w-[176px] max-w-full border-0 border-t border-white" />
          <p className="mt-[21px]">{item.text}</p>
        </li>
      ))}
    </ul>
  )
}

/**
 * The same 30 x 30 "animated icons" canvas and ring (x 2.5-27.4, y 3-27.8) as
 * Source's program icons, at the same 24.78px (SourceSections keeps its own copy).
 */
const ICON_CANVAS = { w: 30, h: 30 }
const ICON_ART = { x: 2.5, y: 3, w: 24.9, h: 24.8 }
const ICON_W = 24.78
const ICON_H = (ICON_ART.h * ICON_W) / ICON_ART.w

const ALONGSIDE: { icon: string; animation?: string; text: React.ReactNode }[] = [
  {
    icon: 'animated icons',
    animation: '/animations/intelligence-icon-chat.json',
    text: (
      <>
        A general chat tool starts every conversation from nothing. Here it starts from your
        workspace&rsquo;s own records, files, and curated data, and what&rsquo;s worth keeping is
        saved for the next person. Answer quality doesn&rsquo;t depend on who writes the best
        prompt.
      </>
    ),
  },
  {
    icon: 'link',
    animation: '/animations/intelligence-icon-link.json',
    text: (
      <>
        Intelligence doesn&rsquo;t replace your contact system, your document library, or your
        submission portal. It sits between them and holds what none of them hold: the connections
        between the pieces, and the history.
      </>
    ),
  },
  {
    icon: 'code',
    animation: '/animations/intelligence-icon-code.json',
    text: (
      <>
        NetworkOS Source and NetworkOS Acquire run the solicitations a program issues.
        Intelligence holds what the organization knows around them: the suppliers, the prior work,
        and what came of it.
      </>
    ),
  },
]

/**
 * Who it runs for (Figma 208:1094): three marks over a rule and the circled
 * "+", laid out like "Who we've helped" on the home page and opening the same
 * way (PartnerDisclosure).
 *
 * The design still carries "NEED ARI LOGO" and "NEED Strikewerx LOGO" in two
 * of the three slots, so those show the organisation's name until the marks
 * arrive; USSF is the Figma vector (208:1105). The summaries are placeholder
 * copy, like the home page's.
 */
function Deployments() {
  return (
    <ul className="mt-[100px] grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-[64px]">
      {DEPLOYMENTS.map((org) => (
        <li key={org.name} className="flex flex-col items-center">
          <span className="flex h-[64px] items-center justify-center" role="img" aria-label={org.name}>
            {org.logo ?? (
              // TODO(logo): swap for the organisation's mark once supplied.
              <span className="text-center text-sm font-semibold uppercase leading-normal tracking-[2.8px] text-white">
                {org.label}
              </span>
            )}
          </span>
          <hr className="mt-[14px] w-full border-0 border-t border-white" />
          <PartnerDisclosure name={org.name} summary={org.summary} />
        </li>
      ))}
    </ul>
  )
}

const DEPLOYMENTS: {
  name: string
  label: string
  logo?: React.ReactNode
  summary: string
}[] = [
  {
    name: 'Applied Research Institute',
    label: 'Applied Research Institute',
    summary:
      'Placeholder summary for the Applied Research Institute: the program we support, the problem it was facing, and what Intelligence delivered. Replace with approved copy.',
  },
  {
    name: 'U.S. Space Force',
    label: 'USSF',
    logo: (
      <Image
        src="/brand/intelligence/logo-ussf.svg"
        alt=""
        width={112}
        height={64}
        className="h-[64.09px] w-[111.58px]"
      />
    ),
    summary:
      'Placeholder summary for the U.S. Space Force: the program we support, the problem it was facing, and what Intelligence delivered. Replace with approved copy.',
  },
  {
    name: 'STRIKEWERX',
    label: 'STRIKEWERX',
    summary:
      'Placeholder summary for STRIKEWERX: the program we support, the problem it was facing, and what Intelligence delivered. Replace with approved copy.',
  },
]

/**
 * The three kinds of control (Figma 208:40-58): a centred label over a rule
 * and the circled "+", the same row as Source's hosting options, each opening
 * onto its own sentence from the paragraph above.
 */
function Controls() {
  return (
    <ul className="mt-[90px] grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-[64px]">
      {CONTROLS.map((control) => (
        <li key={control.name} className="flex flex-col items-center">
          <h3 className="section-label block text-center">{control.name}</h3>
          <hr className="mt-[7px] w-full border-0 border-t border-white" />
          <PartnerDisclosure name={control.name} summary={control.summary} />
        </li>
      ))}
    </ul>
  )
}

const CONTROLS = [
  {
    name: 'Environment',
    summary: 'Controls align with NIST 800-53. Built for unclassified program data.',
  },
  {
    name: 'Your data',
    summary:
      'Customer data stays inside the customer’s boundary and is never used to train models.',
  },
  {
    name: 'Scope',
    summary:
      'Every action, query, and data source is logged, access is set by role, and connections to your systems read in one direction only.',
  },
]
