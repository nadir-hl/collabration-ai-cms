'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useElementProgress } from './useElementProgress'
import { CENTER_PL, CENTER_PR } from './constants'

const clamp01 = (n: number) => Math.min(1, Math.max(0, n))
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3)

/**
 * "By the numbers" (Figma HOME 2:902, y=2369..3044).
 *
 * Normal-flow section, not pinned — the reference recording carries it up the
 * viewport like any other content, so this uses useElementProgress (an element
 * rising through the viewport) rather than usePinnedProgress.
 *
 * It animates because the file says to: the designer's note parked beside the
 * frame (3:2101) reads "These should animate in as we scroll". So the stats
 * stagger in and the two bars grow from their shared baseline, and each
 * figure counts up from zero as it appears (useCountUp).
 *
 * The second half of that note — "the need to be editable and change over
 * time" — is a CMS concern. These figures are hard-coded for now; they want to
 * move to Payload (a `stats` group on a home-page global) before launch, since
 * "current as of June 2026" is going to go stale on its own.
 *
 * Geometry is all taken from the file rather than eyeballed: the left column
 * is 331 wide against the chart's 285 (hence the 331/285 grid tracks), the
 * rule sits between them, and the bars are 131 wide with the tall one at 347
 * and the short one at 16.1 — a 4.6% ratio that is the whole point of the
 * chart, so it is expressed as exactly that rather than re-guessed.
 */

const STATS = [
  { value: '57', label: 'challenges launched' },
  { value: '8,000+', label: 'solutions received' },
  { value: '50,000+', label: 'innovators in one searchable ecosystem' },
  { value: '200', label: 'contract awards' },
  { value: '$1.62B', label: 'follow-on investment' },
]

/** Figma 3:2051 / 3:2052 — both bars share a baseline; 16.1 / 347 = 4.64%. */
const BAR_TALL_PX = 347
const BAR_SHORT_RATIO = 16.1 / 347

export function ByTheNumbers() {
  const ref = useRef<HTMLElement>(null)
  const p = useElementProgress(ref)

  // Bars trail the stats slightly so the eye lands on the numbers first.
  const bars = easeOutCubic(clamp01((p - 0.25) / 0.45))

  return (
    <section
      ref={ref}
      className="relative min-w-0 px-8 py-20 lg:pl-[var(--pl)] lg:pr-[var(--pr)]"
      style={{ '--pl': CENTER_PL, '--pr': CENTER_PR } as React.CSSProperties}
      aria-labelledby="by-the-numbers"
    >
      <p id="by-the-numbers" className="section-label">
        By the numbers
      </p>
      <p className="text-body mt-2 max-w-[37rem]">
        Nine years on one of the Department&rsquo;s largest programs. On the
        AFWERX and SpaceWERX Challenge, continuously since FY18
      </p>

      {/* 331 / rule / 285, per the file */}
      <div className="mt-14 grid gap-x-9 sm:grid-cols-[minmax(0,331fr)_1px_minmax(0,285fr)]">
        <ul className="space-y-7">
          {STATS.map((stat, i) => (
            <Stat key={stat.label} {...stat} p={p} index={i} />
          ))}

          <li className="pt-3">
            <p className="text-body">
              Award and investment figures reported by the program. All figures
              current as of June 2026.
            </p>
            {/* Not `.section-label` — unlayered, so its brand colour would win.
                Same reason as the muted paragraph in ProblemPanel. */}
            <p className="mt-8 inline-block text-sm font-semibold uppercase tracking-[var(--tracking-label)] text-[var(--color-neutral-400)]">
              Source
            </p>
          </li>
        </ul>

        {/* Figma 3:2050 — a hairline the full height of the two columns */}
        <div aria-hidden="true" className="hidden bg-white sm:block" />

        <div className="mt-12 sm:mt-0">
          <p className="section-label">1 week vs 1 hour</p>
          <p className="text-body mt-2">
            Time needed for full market research report:
          </p>

          <div className="mt-10 flex items-end gap-6" style={{ height: BAR_TALL_PX }}>
            <Bar label="Without CAI" fraction={1} progress={bars} tone="neutral" />
            <Bar label="With CAI" fraction={BAR_SHORT_RATIO} progress={bars} tone="brand" />
          </div>
        </div>
      </div>
    </section>
  )
}

function Stat({
  value,
  label,
  p,
  index,
}: {
  value: string
  label: string
  p: number
  index: number
}) {
  // Each stat opens 0.08 after the one above it, over a 0.4-wide window.
  const t = easeOutCubic(clamp01((p - index * 0.08) / 0.4))

  // Latch the count's start the first time this stat begins to appear, so
  // scrolling back up mid-count doesn't stop it (React's "adjust state while
  // rendering" pattern, rather than an effect).
  const [started, setStarted] = useState(false)
  if (t > 0 && !started) setStarted(true)
  const shown = useCountUp(value, started)

  return (
    <li
      style={{
        opacity: t,
        transform: `translateY(${((1 - t) * 14).toFixed(1)}px)`,
      }}
    >
      <p className="text-2xl font-bold leading-none tabular-nums text-[var(--color-brand-500)]">
        {/* The count is decoration; assistive tech gets the real figure. */}
        <span aria-hidden="true">{shown}</span>
        <span className="sr-only">{value}</span>
      </p>
      <p className="text-body mt-2">{label}</p>
    </li>
  )
}

/**
 * Count-up length: long enough to read as counting, short enough that a
 * reader scrolling at a normal pace sees each figure land.
 */
const COUNT_MS = 1600

/**
 * Splits a display figure into prefix / number / suffix ("$1.62B" -> "$",
 * 1.62, "B"), keeping its decimals and thousands separators so every frame of
 * the count is formatted like the final figure.
 */
function parseStat(value: string) {
  const m = value.match(/^(\D*)(\d[\d,]*(?:\.\d+)?)(.*)$/)
  if (!m) return null
  const [, prefix, digits, suffix] = m
  const decimals = digits.split('.')[1]?.length ?? 0
  return {
    prefix,
    suffix,
    target: Number(digits.replace(/,/g, '')),
    format: new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: digits.includes(','),
    }),
  }
}

/**
 * Counts a figure up from zero once `start` turns true, eased to settle on
 * the exact value. Time-based rather than tied to scroll progress like the
 * rest of the section: a scrubbed count would park on figures like "4,213+"
 * wherever the reader stops scrolling. Reduced motion jumps to the final value.
 */
function useCountUp(value: string, start: boolean) {
  const stat = useMemo(() => parseStat(value), [value])
  const [n, setN] = useState(0)

  useEffect(() => {
    if (!start || !stat) return
    const duration = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      ? 0
      : COUNT_MS
    const t0 = performance.now()
    let raf = requestAnimationFrame(function tick(now) {
      const k = duration ? clamp01((now - t0) / duration) : 1
      setN(stat.target * easeOutCubic(k))
      if (k < 1) raf = requestAnimationFrame(tick)
    })
    return () => cancelAnimationFrame(raf)
  }, [start, stat])

  if (!stat) return value
  return `${stat.prefix}${stat.format.format(n)}${stat.suffix}`
}

/**
 * One column of the comparison. The bar grows from the baseline, so the
 * wrapper is bottom-aligned and only the height is animated — scaling would
 * distort the 1px-crisp top edge the design has.
 */
function Bar({
  label,
  fraction,
  progress,
  tone,
}: {
  label: string
  fraction: number
  progress: number
  tone: 'neutral' | 'brand'
}) {
  return (
    <div className="flex h-full flex-1 flex-col justify-end">
      <div
        className={tone === 'brand' ? 'bg-[var(--color-brand-500)]' : 'bg-[#636363]'}
        style={{ height: `${(fraction * progress * BAR_TALL_PX).toFixed(1)}px` }}
      />
      <p className="text-body mt-3">{label}</p>
    </div>
  )
}
