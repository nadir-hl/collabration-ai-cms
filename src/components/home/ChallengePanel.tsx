import Image from 'next/image'
import { KnowsMissingDiagram } from './KnowsMissingDiagram'
import { CENTER_PL, CENTER_PR, TOP_ROW_H } from './constants'

/**
 * Center panel of the HOME frame (Figma 2:902) — "THE CHALLENGE".
 *
 * "KNOWS" and "MISSING" ship as the Figma vector exports rather than live text.
 * They are drawn in the file as ~50 per-letter vector nodes (2:1049 / 2:1052),
 * and MISSING's glyph outline uses stroke-dasharray="2 2" — a dashed stroke on
 * letterforms, which CSS cannot apply to text at all. Matching the design
 * exactly therefore requires the assets. Trade-off: this copy is no longer
 * editable from the CMS, so both images carry alt text for accessibility.
 */
export function ChallengePanel() {
  return (
    <section
      className="relative min-w-0 pb-16"
      style={
        {
          '--pl': CENTER_PL,
          '--pr': CENTER_PR,
        } as React.CSSProperties
      }
    >
      {/* The text keeps the column padding; the diagram below manages its own,
          because it grows out to the full width of the panel. */}
      <div className="px-8 lg:pl-[var(--pl)] lg:pr-[var(--pr)]">
        {/* Top row — vertical centre matches the wordmark and the slide arrows */}
        <div className="flex items-center" style={{ height: TOP_ROW_H }}>
          <p className="section-label w-full text-center">The challenge</p>
        </div>

        {/* Rule — Figma y=132, 18px below the top row's centre */}
        <hr className="mt-[4px] border-0 border-t border-white" />

        <KnowsVsMissing />

        {/* What we do — Figma y=301 */}
        <div className="mt-[59px]">
          <p className="section-label">What we do</p>
          <p className="text-body mt-3 max-w-[42rem]">
            Every program runs on two things: what the organization already knows, and
            what it has to find outside. Collaboration.Ai builds the software that
            holds both, carries a solicitation to award, and keeps the record as
            people and priorities change.
          </p>
        </div>
      </div>

      <KnowsMissingDiagram />
    </section>
  )
}

/**
 * The KNOWS / vs / MISSING lockup.
 *
 * Figma geometry: each caption is centred over its word (caption 2:1051 centre
 * x=700.5 vs KNOWS centre x=701.5), the two words share a baseline at y=242,
 * and the "vs" badge sits 24px from each word and ~19px above that baseline.
 */
function KnowsVsMissing() {
  return (
    <div className="mt-[26px] flex flex-col items-center gap-6 sm:flex-row sm:items-end sm:justify-center">
      <figure className="flex min-w-0 flex-1 flex-col items-center gap-[9px] sm:max-w-[269px]">
        <figcaption className="text-center text-xl font-bold leading-none text-white">
          What the organization
        </figcaption>
        <Image
          src="/brand/knows.svg"
          alt="Knows"
          width={269}
          height={51}
          priority
          className="h-auto w-full"
        />
      </figure>

      <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-semibold uppercase text-black sm:mb-[19px]">
        vs
      </span>

      <figure className="flex min-w-0 flex-1 flex-col items-center gap-[9px] sm:max-w-[296px]">
        <figcaption className="text-center text-xl font-bold leading-none text-white">
          What the organization is
        </figcaption>
        <Image
          src="/brand/missing.svg"
          alt="Missing"
          width={296}
          height={52}
          priority
          className="h-auto w-full"
        />
      </figure>
    </div>
  )
}
