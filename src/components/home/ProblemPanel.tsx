'use client'

import { useRef } from 'react'
import { usePinnedProgress } from './usePinnedProgress'
import { CENTER_PL, CENTER_PR, PROBLEM_SCRUB_RUNWAY } from './constants'

/**
 * "Where it comes apart" (Figma 8:8 "Animation", fileKey eHoARd8PfbDv5akaaawZ7M).
 *
 * Pin mechanics, confirmed against the client's scrub reference recording: the
 * heading sits at an identical pixel position across ~12s of the clip while
 * only the card strip beside it changes — i.e. the section pins (like
 * HeroPanel's left column) and the strip scrubs horizontally against scroll,
 * rather than each card animating in on its own timeline. usePinnedProgress
 * drives that; see its doc comment for the mechanism.
 *
 * Card geometry and every non-trivial shape (the overlapping document cards,
 * the folder tab, the device casing + bars, the two miniatures in the finale)
 * are the actual Figma vectors, pulled via get_design_context/download_assets
 * on 8:8 and its children (3:1606, 3:1616, 3:1682, 3:1683, 3:1727 and the
 * seven vector layers under it) and inlined at their real path data — per
 * figma-design-to-code, hand-drawing those would be guessing at art that
 * already exists. The checklist window, the plain rack bars, and the arrow
 * connectors are genuine primitives (axis-aligned rects, straight lines) with
 * nothing to lose by hand-authoring, so those are plain CSS instead — the
 * fetched assets confirm they really are just that (e.g. checklist_border.svg
 * is a bare unrotated rect) rather than something disguising more detail.
 *
 * KNOWN SIMPLIFICATION: the "PROBLEM" wordmark is a distressed/fragmented
 * display face in the design. No asset for it came back (it renders as
 * ordinary text, not vector shapes), so this ships as a plain bold heading.
 * Swap in the real font (or a vector export, the way KnowsMissingDiagram
 * handles KNOWS/MISSING) if the client supplies one.
 */
export function ProblemPanel() {
  const pinRef = useRef<HTMLDivElement>(null)
  const p = usePinnedProgress(pinRef, PROBLEM_SCRUB_RUNWAY)

  return (
    <>
      {/* Desktop — pinned, scroll-scrubbed strip */}
      <section
        ref={pinRef}
        className="relative hidden lg:block"
        style={{ height: `calc(100vh + ${PROBLEM_SCRUB_RUNWAY}px)` }}
      >
        <div
          className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden px-8 lg:pl-[var(--pl)] lg:pr-[var(--pr)]"
          style={{ '--pl': CENTER_PL, '--pr': CENTER_PR } as React.CSSProperties}
        >
          <div className="grid grid-cols-[17rem_1px_1fr] gap-x-10">
            <Intro />
            <div className="self-stretch bg-white/20" />

            <div className="max-w-[34rem] overflow-hidden" style={{ width: `${VIEWPORT_W_REM}rem` }}>
              <div
                className="flex items-center gap-6"
                style={{
                  width: `${STRIP_W_REM}rem`,
                  transform: `translateX(-${(p * MAX_SCROLL_REM).toFixed(2)}rem)`,
                }}
              >
                <ChecklistCard />
                <Arrow />
                <RackCard />
                <Arrow />
                <FolderPairCard />
                <Arrow />
                <FolderPairCard flip />
                <Arrow />
                <DeviceCard />
                <Arrow />
                <FinaleCard />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile/tablet — normal flow, no pin; swipe the strip instead */}
      <section className="px-8 py-16 lg:hidden">
        <Intro />
        <div className="mt-10 flex items-center gap-6 overflow-x-auto pb-4">
          <ChecklistCard />
          <Arrow />
          <RackCard />
          <Arrow />
          <FolderPairCard />
          <Arrow />
          <FolderPairCard flip />
          <Arrow />
          <DeviceCard />
          <Arrow />
          <FinaleCard />
        </div>
      </section>
    </>
  )
}

function Intro() {
  return (
    <div className="min-w-0">
      {/* Simplification noted at the top of this file — see KNOWN SIMPLIFICATION */}
      <p className="text-5xl font-extrabold uppercase leading-none tracking-tight text-white">
        Problem
      </p>
      <p className="section-label mt-6">Where it comes apart</p>
      <h2 className="display-md mt-2">No system holds the whole program.</h2>

      <div className="text-body mt-6 space-y-0.5">
        <p className="text-white">A portal takes the submissions.</p>
        <p className="text-[--color-text-muted]">A spreadsheet tracks them.</p>
        <p className="text-[--color-text-muted]">A working group holds the relationships.</p>
        <p className="text-[--color-text-muted]">Program files hold the history.</p>
      </div>

      <p className="text-body mt-6 text-[--color-text-muted]">
        Every piece has an owner and the program has none, so it gets reassembled
        at each step, and again at the start of every cycle.
      </p>
    </div>
  )
}

/* ─── Shared card-strip geometry ──────────────────────────────────────────── */

const ROW_H = '23.6rem' // 378px — the checklist card's real Figma height

/** Card widths (rem) + 5 arrow connectors (2rem each) = total strip width. */
const CARD_W = { checklist: 21.1, rack: 10.5, folder: 11.25, device: 8.1, finale: 21.25 }
const STRIP_W_REM =
  CARD_W.checklist + CARD_W.rack + CARD_W.folder * 2 + CARD_W.device + CARD_W.finale + 5 * 3.5
const VIEWPORT_W_REM = 34
const MAX_SCROLL_REM = STRIP_W_REM - VIEWPORT_W_REM

/** Between-card connector — three chevrons, matching the design's ">>>" beats. */
function Arrow() {
  return (
    <div className="flex shrink-0 gap-0.5 text-white/50" aria-hidden="true" style={{ width: '2rem' }}>
      {[0, 1, 2].map((i) => (
        <svg key={i} viewBox="0 0 8 12" className="h-3 w-2">
          <path d="M1 1l5 5-5 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </div>
  )
}

/** Checkbox + checkmark — real Figma vectors (3:1606 row group), recombined into one glyph. */
function CheckedBox({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 19 19" className={className} fill="none" aria-hidden="true">
      <rect x="0.5" y="0.5" width="18" height="18" stroke="white" strokeOpacity="0.9" />
      <path
        d="M4.5 9.7L7.48 12.68L14.57 5.6"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

/* ─── Card 1 — Submission checklist (3:1566/3:1616, plain unrotated window) ── */

const SUBMISSIONS = [35, 36, 37, 38, 39, 40, 41, 42]

function ChecklistCard() {
  return (
    <div
      className="flex shrink-0 flex-col border border-white/80 text-[13px]"
      style={{ width: `${CARD_W.checklist}rem`, height: ROW_H }}
    >
      <div className="flex items-center gap-1 border-b border-white/80 px-3 py-2.5">
        <span className="size-1 rounded-full bg-white" />
        <span className="size-1 rounded-full bg-white" />
        <span className="size-1 rounded-full bg-white" />
      </div>
      <ul className="flex flex-1 flex-col justify-evenly px-3">
        {SUBMISSIONS.map((n) => (
          <li
            key={n}
            className="flex items-center justify-between rounded-sm bg-[#363636]/35 px-2.5 py-1.5"
          >
            <span className="text-white">Submission #{n}</span>
            <CheckedBox className="size-[15px] shrink-0" />
          </li>
        ))}
      </ul>
    </div>
  )
}

/* ─── Card 2 — Rack of bars (3:1651, plain unrotated window) ─────────────── */

function RackCard() {
  return (
    <div
      className="flex shrink-0 flex-col justify-evenly border border-white/80 px-3"
      style={{ width: `${CARD_W.rack}rem`, height: ROW_H }}
    >
      {Array.from({ length: 12 }).map((_, i) => (
        <div key={i} className="h-[13px] rounded-[1px] bg-white/25" />
      ))}
    </div>
  )
}

/* ─── Cards 3 & 4 — Folder pair (real vectors: 3:1683 cards + 3:1682 folder) ─ */

function FolderPairCard({ flip = false }: { flip?: boolean }) {
  return (
    <div
      className="relative shrink-0"
      style={{
        width: `${CARD_W.folder}rem`,
        height: ROW_H,
        transform: flip ? 'scaleX(-1)' : undefined,
      }}
    >
      {/* Three overlapping document cards — exact path data, 3:1683 */}
      <svg
        viewBox="0 0 172.369 249.124"
        className="absolute left-1/2 top-4 w-[10.5rem] -translate-x-1/2"
        style={{ mixBlendMode: 'screen' }}
        aria-hidden="true"
      >
        <path d="M151.111 171.539L14.2786 152.722L3.67816 229.807L140.51 248.624L151.111 171.539Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M157.489 79.6868L21.748 105.213L36.128 181.682L171.869 156.156L157.489 79.6868Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M154.304 37.109L21.1238 0.500126L0.500126 75.5272L133.68 112.136L154.304 37.109Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      {/* Folder, tab notched top-left — exact path data, 3:1682 */}
      <svg
        viewBox="0 0 167.3 107.73"
        className="absolute bottom-2 left-1/2 w-[9.5rem] -translate-x-1/2"
        aria-hidden="true"
      >
        <path
          opacity="0.27"
          fill="white"
          d="M58.96 10.97C58.96 4.91 54.05 0 47.99 0H0V107.73H167.3V10.97H58.96Z"
        />
      </svg>
    </div>
  )
}

/* ─── Card 5 — Device (real vector: casing + 3 bars + dot, 3:1791/1729-family) */

function DeviceCard() {
  return (
    <div
      className="flex shrink-0 items-center justify-center"
      style={{ width: `${CARD_W.device}rem`, height: ROW_H }}
    >
      <svg viewBox="0 0 109.935 190.243" className="h-[85%] w-auto" aria-hidden="true">
        <path
          d="M76.5373 0.50009L0.50009 14.7988L33.3979 189.742L109.435 175.444L76.5373 0.50009Z"
          stroke="white"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M90.5939 129.768L34.3596 140.343L36.5052 151.753L92.7395 141.178L90.5939 129.768Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M87.1004 111.193L30.8661 121.768L33.0117 133.178L89.246 122.603L87.1004 111.193Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M83.6067 92.608L27.3724 103.183L29.518 114.593L85.7524 104.018L83.6067 92.608Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="51.48" cy="76.61" r="5.83" fill="white" opacity="0.27" />
      </svg>
    </div>
  )
}

/* ─── Card 6 — Finale: the whole pipeline in miniature (real vectors, 3:1727) */

function FinaleCard() {
  return (
    <div
      className="grid shrink-0 grid-cols-2 grid-rows-2 items-center justify-items-center gap-3"
      style={{ width: `${CARD_W.finale}rem`, height: ROW_H }}
    >
      {/* Mini checklist-grid — 3:1768, real vector (e5) */}
      <svg viewBox="0 0 168.066 185.12" className="h-[8.5rem] w-auto" aria-hidden="true">
        <circle cx="19.94" cy="9.77" r="2.19" fill="white" />
        <circle cx="27.91" cy="10.3" r="2.19" fill="white" />
        <circle cx="35.89" cy="10.83" r="2.19" fill="white" />
        <path d="M167.566 10.7791L11.9856 0.500019L0.500019 174.341L156.081 184.62L167.566 10.7791Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M166.419 28.0955L10.8386 17.8255" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        {[
          [15.8173, 38.8039, 14.7348, 55.1881, 157.494, 64.6201, 158.576, 48.2358],
          [14.5036, 58.6244, 13.4211, 75.0087, 156.18, 84.4406, 157.262, 68.0564],
          [13.1992, 78.4549, 12.1167, 94.8392, 154.876, 104.271, 155.958, 87.8869],
          [11.8952, 98.2761, 10.8127, 114.66, 153.572, 124.092, 154.654, 107.708],
          [10.5909, 118.107, 9.5084, 134.491, 152.267, 143.923, 153.35, 127.539],
          [9.27706, 137.927, 8.19456, 154.311, 150.953, 163.743, 152.036, 147.359],
          [17.1319, 18.9734, 16.0494, 35.3576, 158.808, 44.7896, 159.891, 28.4053],
          [7.96261, 157.758, 6.88011, 174.142, 149.639, 183.574, 150.721, 167.19],
        ].map(([x1, y1, x2, y2, x3, y3, x4, y4], i) => (
          <path
            key={i}
            opacity="0.35"
            fill="#363636"
            d={`M${x4} ${y4}L${x1} ${y1}L${x2} ${y2}L${x3} ${y3}Z`}
          />
        ))}
      </svg>

      {/* Mini device — reuses the device card's real vector at a smaller size */}
      <svg viewBox="0 0 109.935 190.243" className="h-[8rem] w-auto" aria-hidden="true">
        <path d="M76.5373 0.50009L0.50009 14.7988L33.3979 189.742L109.435 175.444L76.5373 0.50009Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M90.5939 129.768L34.3596 140.343L36.5052 151.753L92.7395 141.178L90.5939 129.768Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M87.1004 111.193L30.8661 121.768L33.0117 133.178L89.246 122.603L87.1004 111.193Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M83.6067 92.608L27.3724 103.183L29.518 114.593L85.7524 104.018L83.6067 92.608Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="51.48" cy="76.61" r="5.83" fill="white" opacity="0.27" />
      </svg>

      {/* Mini rack, skewed casing — 3:1729, real vector (e6), bars thinned for legibility at size */}
      <svg viewBox="0 0 186.559 200.148" className="h-[8.5rem] w-auto" aria-hidden="true">
        <path d="M154.039 0.50009L0.50009 29.3728L32.5201 199.648L186.059 170.776L154.039 0.50009Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        {Array.from({ length: 12 }).map((_, i) => {
          const t = i / 11
          const yTop = 1.54 + t * (164.1 - 1.54)
          const yBot = 9.24 + t * (198.6 - 9.24)
          const xL = 6.02 + t * (36.59 - 6.02)
          const xR = 149.97 + t * (180.54 - 149.97)
          return (
            <path
              key={i}
              opacity="0.27"
              fill="white"
              d={`M${xL} ${yTop}L${xR} ${yTop + 7}L${xR} ${yBot}L${xL} ${yBot - 7}Z`}
            />
          )
        })}
      </svg>

      {/* Mini folder pair — 3:1782, real vector (e7) */}
      <svg viewBox="0 0 82.731 122.255" className="h-[7rem] w-auto" style={{ mixBlendMode: 'screen' }} aria-hidden="true">
        <path d="M71.7237 87.1013L10.2148 69.8583L0.500127 104.512L62.0089 121.755L71.7237 87.1013Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M80.4604 45.3005L16.6577 48.4433L18.4284 84.3897L82.231 81.2469L80.4604 45.3005Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M81.69 25.6651L22.9756 0.500128L8.79762 33.5798L67.512 58.7448L81.69 25.6651Z" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  )
}
