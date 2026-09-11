import Image from 'next/image'
import { ProductColumn, ProductSection } from '../product/ProductSection'
import { PartnerDisclosure } from '../home/PartnerDisclosure'
import { LoopingLottie } from '../home/LoopingLottie'
import { AfwerxChallengeLogo } from '../home/WhoWeveHelped'
import { SourceReveal } from './SourceReveal'
import { HowItWorks } from './HowItWorks'

/**
 * The Source page's centre column, Figma SOURCE (173:3), x 567 in the 1400
 * frame. Vertical gaps are the frame's, measured from the end of one block's
 * copy to the start of the next, so the page keeps the design's pacing.
 */
export function SourceSections() {
  return (
    <>
      <ProductSection label="What it is" title="The front door of a program." measure={651}>
        <p>
          A program that needs something it doesn&rsquo;t have has to ask for it. NetworkOS
          Source is where that ask becomes a solicitation: the outcome you need, the constraints
          on it, and the criteria a submission will be judged against, written once and published
          to the people who can answer. Submissions land in the same place. Reviewers score them
          there. The record of the round stays with the program for the next one.
        </p>
      </ProductSection>

      <ProductSection
        label="Where it comes apart"
        title="The round outlives the tools that ran it."
        className="mt-[89px]"
        figure={<SourceReveal />}
      >
        <p>
          A solicitation goes out as a document. Submissions come back through a portal or an
          inbox. Review happens in one spreadsheet, scores in another, and the decision memo in a
          third.
        </p>
        <p>
          Each piece works. None of them knows about the others, so when the next round opens, or
          the person who ran the last one moves on, the program starts by reconstructing its own
          history.
        </p>
        <p className="mt-[25px]">The next round shouldn&rsquo;t start with a &hellip;</p>
      </ProductSection>

      <HowItWorks />

      <ProductColumn>
        <Programs />
      </ProductColumn>

      <ProductSection
        label="Who runs it"
        title="Built for programs that ask outside their walls."
        className="mt-[79px]"
      >
        <p>
          Source has run the Department of the Air Force&rsquo;s technology solicitation pipeline
          continuously since FY18. It runs force-wide programs where every Airman and Guardian can
          submit, critique, and upvote. It runs an agency&rsquo;s internal innovation program at
          NASA. And it runs the same way for a research office, a laboratory, or a civilian agency
          that has to ask the market for what it doesn&rsquo;t have.
        </p>
      </ProductSection>

      <ProductColumn className="mt-[59px]">
        <Partners />
      </ProductColumn>

      <ProductSection
        label="Security and hosting"
        title="Source runs where the program needs it to."
        className="mt-[80px]"
        figure={<Hosting />}
      >
        <p>
          Government deployments run on Second Front&rsquo;s Game Warden, hosted in the United
          States, at Impact Level 2 and Impact Level 4, with CAC sign-in on .mil instances. Public
          solicitations run on a public site with account sign-in, so a small business can apply
          without a government credential. On-premises deployment is available for programs that
          require it.
        </p>
      </ProductSection>
    </>
  )
}

/**
 * The three kinds of program Source runs (Figma 173:1541-1561). On desktop
 * the pinned "How it works" above releases with its own space below it, which
 * stands in for the frame's 87px gap.
 */
function Programs() {
  return (
    // Columns in the frame's proportions: 178, 178 and 185 wide, ~61 apart
    <ul className="mt-[87px] grid grid-cols-1 gap-y-12 sm:grid-cols-[178fr_178fr_185fr] sm:gap-x-[61px] lg:mt-0">
      {PROGRAMS.map((program) => (
        <li key={program.name}>
          <LoopingLottie
            src={program.animation}
            canvas={ICON_CANVAS}
            art={ICON_ART}
            width={24.78}
            fallback={
              <Image
                src={program.icon}
                alt=""
                width={25}
                height={25}
                className="absolute left-0 top-0 size-[24.78px]"
              />
            }
          />
          <hr className="mt-[13px] w-[176px] max-w-full border-0 border-t border-white" />
          <h3 className="section-label mt-[21px] block" style={{ lineHeight: '25px' }}>
            {program.name}
          </h3>
          <p className="text-body">{program.summary}</p>
        </li>
      ))}
    </ul>
  )
}

/**
 * The icons are the designer's animated versions (LottieFiles, project CAI:
 * "earth icon", "up arrow", "key-map icon - Internal Programs"; the portal's
 * Lottie JSON exports, unchanged). Each is a 30 x 30 canvas whose ring spans
 * x 2.5-27.4, y 3-27.8, the same ring as the static Figma icons, so it is
 * sized to their 24.78px and the static icon stands in until the player has
 * loaded. They loop while on screen: the globe turns and the arrow lifts
 * continuously; the pin bobs, then rests, every three seconds.
 */
const ICON_CANVAS = { w: 30, h: 30 }
const ICON_ART = { x: 2.5, y: 3, w: 24.9, h: 24.8 }

const PROGRAMS = [
  {
    name: 'Open solicitations',
    icon: '/brand/source/icon-open-solicitations.svg',
    animation: '/animations/icon-earth.json',
    summary:
      'Publish to the market, collect at scale, and advance finalists on the record. The AFWERX and SpaceWERX Challenge runs this way.',
  },
  {
    name: 'Force-wide programs',
    icon: '/brand/source/icon-force-wide.svg',
    animation: '/animations/icon-up-arrow.json',
    summary:
      'Every member submits, critiques, and votes. The Guardians and Airmen Innovation Network runs this way.',
  },
  {
    name: 'Internal programs',
    icon: '/brand/source/icon-internal-programs.svg',
    animation: '/animations/icon-internal.json',
    summary:
      "One organization, its own people, its own problems. NASA Spark and the DAF Digital Transformation Office's Digital Drivers Exchange run this way.",
  },
]

/**
 * The programs Source runs for, by name (Figma: loose over the SOURCE frame,
 * logos 173:1567 / 173:1602 / 173:1655, rules 173:1595 / 173:1601 / 173:1654,
 * circled "+" 173:1657-1659). The same cell as "Who we've helped" on the home
 * page (mark, hairline rule, a circled "+" that opens a summary), on the
 * hosting row's grid. The three marks share a vertical centre (frame y ~2295,
 * midway down the band that ends at the rules), so the band centres them.
 *
 * The design notes that each drop-down still needs its own copy. Until then
 * each opens onto the program type it runs, the three mapping one to one:
 * the AFWERX Challenge is the open solicitation, GAiN the force-wide program,
 * NASA Spark the internal one.
 */
function Partners() {
  return (
    <ul
      aria-label="Programs Source runs"
      className="grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-[64px]"
    >
      {PARTNERS.map((partner) => (
        <li key={partner.name} className="flex flex-col items-center">
          <span
            className="flex h-[78px] max-w-full items-center justify-center"
            role="img"
            aria-label={partner.name}
          >
            {partner.logo}
          </span>
          <hr className="w-full border-0 border-t border-white" />
          <PartnerDisclosure name={partner.name} summary={partner.summary} />
        </li>
      ))}
    </ul>
  )
}

const PARTNERS = [
  {
    name: 'AFWERX Challenge',
    logo: <AfwerxChallengeLogo />,
    summary: PROGRAMS[0].summary,
  },
  {
    name: 'Guardians and Airmen Innovation Network',
    logo: (
      <Image
        src="/brand/logos/gain.svg"
        alt=""
        width={93}
        height={35}
        className="h-[34.53px] w-[92.57px]"
      />
    ),
    summary: PROGRAMS[1].summary,
  },
  {
    name: 'NASA Spark',
    logo: (
      <Image
        src="/brand/logos/nasa-spark.svg"
        alt=""
        width={100}
        height={69}
        className="h-[68.82px] w-[99.68px]"
      />
    ),
    summary: PROGRAMS[2].summary,
  },
]

/**
 * The three ways Source is hosted (Figma 173:1666-1701): a centred two-line
 * label over a rule and the circled "+", laid out like "Who we've helped" on
 * the home page and opening the same way (PartnerDisclosure). Each one opens
 * onto its own sentence from the paragraph above. The labels break where the
 * design breaks them, so all three sit on two lines.
 */
function Hosting() {
  return (
    <ul className="mt-[77px] grid grid-cols-1 gap-y-12 sm:grid-cols-3 sm:gap-x-[64px]">
      {HOSTING.map((option) => (
        <li key={option.name} className="flex flex-col items-center">
          <h3 className="section-label block text-center">{option.label}</h3>
          <hr className="mt-[7px] w-full border-0 border-t border-white" />
          <PartnerDisclosure name={option.name} summary={option.summary} />
        </li>
      ))}
    </ul>
  )
}

const HOSTING = [
  {
    name: 'Government deployments',
    label: (
      <>
        Government
        <br />
        deployments
      </>
    ),
    summary:
      "Government deployments run on Second Front's Game Warden, hosted in the United States, at Impact Level 2 and Impact Level 4, with CAC sign-in on .mil instances.",
  },
  {
    name: 'Public solicitations',
    label: (
      <>
        Public
        <br />
        solicitations
      </>
    ),
    summary:
      'Public solicitations run on a public site with account sign-in, so a small business can apply without a government credential.',
  },
  {
    name: 'On-premises',
    label: (
      <>
        On-
        <br />
        premises
      </>
    ),
    summary: 'On-premises deployment is available for programs that require it.',
  },
]
