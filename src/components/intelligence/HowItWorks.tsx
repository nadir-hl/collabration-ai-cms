'use client'

import Image from 'next/image'
import { useRef, useSyncExternalStore, type CSSProperties } from 'react'
import { ProductColumn } from '../product/ProductSection'
import { usePinnedProgress } from '../home/usePinnedProgress'
import { useElementProgress } from '../home/useElementProgress'

/**
 * "How it works" (Figma INTELLIGENCE 208:37 + 208:920, and the state boards
 * beside the frame, 208:924, texts 208:1038-1045): five stages, each with its
 * own title, copy and figure —
 *
 *   What you know, plus what's public.   your circle beside the platform's (208:920)
 *   Bring it in.                         your files and systems around your circle (208:926)
 *   Connect.                             your circle, linked into a network (208:1040)
 *   Ask                                  the question, a person, the cited answer (208:982-1000)
 *   Keep                                 the saved report, passed to the next people (208:1002)
 *
 * The Ask board is 17 loose layers rather than a group, so how-ask.svg nests
 * each layer's own Figma export, unchanged, at its Figma position. Every
 * export from these boards carries the canvas's #F5F5F5 rectangle, which is
 * dropped so the art sits on the page.
 *
 * The same pin-and-scrub as Source's "How it works": on desktop the section
 * pins and the scroll steps through the stages across RUNWAY px, starting
 * LEAD px before the pin; below lg there is no pin and the stages change as
 * the figure rises through the screen. There is no Lottie for this one yet, so
 * the stages cross-fade the board artwork (the Figma exports, unchanged apart
 * from dropping the export's canvas rectangle from 208:1040).
 *
 * Every stage's title, copy and figure share one grid cell / one box, so the
 * swaps never reflow.
 */

/** ~500px of scroll per stage. */
const RUNWAY = 2500
const LEAD = 300

/** The figure box: the column's 668 wide, as tall as the tallest board (243). */
const BOX_W = 668
const BOX_H = 243

const STAGES = [
  {
    title: 'What you know, plus what’s public.',
    body: 'Every workspace holds two kinds of knowledge. Yours: the people, organizations, files, and past programs you connect or upload. And the platform’s: curated federal records, from awards and funding to agency structures and technical reports. Ask a question, and it’s answered from both, with the sources cited.',
    // x 636 in the frame, 69 into the column
    figure: { src: '/brand/intelligence/how-circles.svg', w: 465.87, h: 181.88, left: 69 },
  },
  {
    title: 'Bring it in.',
    body: 'Connect the systems you already use, or upload the spreadsheet, the deck, or the capability statement. Contacts become people, vendors become organizations, and documents stay available as source material.',
    figure: { src: '/brand/intelligence/how-bring-in.svg', w: 607.28, h: 180.88, left: 0 },
  },
  {
    title: 'Connect.',
    body: 'The workspace links what you brought to a curated library of organizations across industry, academia, and government, and to federal award, funding, and agency records the platform maintains.',
    // centred on the board's column
    figure: { src: '/brand/intelligence/how-connect.svg', w: 249, h: 243, left: (BOX_W - 249) / 2 },
  },
  {
    title: 'Ask',
    body: 'Find who has worked on a problem before it’s rebuilt. Match options against your own criteria. Trace every finding back to its source. Answers come back as considerations with their sources, not as decisions. Your experts stay the decision-makers.',
    // the ring at x 85.94 into the board's column
    figure: { src: '/brand/intelligence/how-ask.svg', w: 448.13, h: 181.44, left: 85.94 },
  },
  {
    title: 'Keep',
    body: 'Anything worth keeping is saved as a report the next person and the next question can build on. Context carries forward with the workspace, not with whoever leaves.',
    // x 97 into the board's column
    figure: { src: '/brand/intelligence/how-keep.svg', w: 452, h: 182, left: 97 },
  },
] as const

const FADE =
  'transition-opacity duration-300 ease-[var(--ease-out-expo)] motion-reduce:transition-none'

const pct = (n: number, of: number) => `${(n / of) * 100}%`

export function HowItWorks() {
  const pinRef = useRef<HTMLDivElement>(null)
  const riseRef = useRef<HTMLDivElement>(null)
  const desktop = useDesktop()
  const pinned = usePinnedProgress(pinRef, RUNWAY, LEAD)
  const rising = useElementProgress(riseRef, 0.9)
  const progress = desktop ? pinned : rising

  const current = Math.min(STAGES.length - 1, Math.floor(progress * STAGES.length))

  return (
    <div
      ref={pinRef}
      // Below lg there is no pin, so the frame's 155px gap is set directly
      className="relative mt-[155px] lg:mt-0 lg:h-[var(--pin-h)]"
      style={{ '--pin-h': `calc(100vh + ${RUNWAY}px)` } as CSSProperties}
    >
      <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center">
        <ProductColumn>
          <section aria-labelledby="section-how-it-works">
            {/* .section-label is unlayered, so its line height is set inline */}
            <p className="section-label" style={{ lineHeight: '25px' }}>
              How it works
            </p>
            <h2
              id="section-how-it-works"
              className="grid text-[23px] font-semibold leading-[25px] text-white"
            >
              {STAGES.map((stage, i) => (
                <span
                  key={stage.title}
                  aria-hidden={i !== current}
                  className={`[grid-area:1/1] ${FADE}`}
                  style={{ opacity: i === current ? 1 : 0 }}
                >
                  {stage.title}
                </span>
              ))}
            </h2>

            <div className="text-body mt-[25px] grid">
              {STAGES.map((stage, i) => (
                <p
                  key={stage.title}
                  aria-hidden={i !== current}
                  className={`[grid-area:1/1] ${FADE}`}
                  style={{ opacity: i === current ? 1 : 0 }}
                >
                  {stage.body}
                </p>
              ))}
            </div>

            {/* Figma: the figure starts 37px under the copy */}
            <div
              ref={riseRef}
              aria-hidden="true"
              className="relative mt-[37px] w-full"
              style={{ maxWidth: BOX_W, aspectRatio: `${BOX_W} / ${BOX_H}` }}
            >
              {STAGES.map(({ title, figure }, i) => (
                <Image
                  key={title}
                  src={figure.src}
                  alt=""
                  width={Math.round(figure.w)}
                  height={Math.round(figure.h)}
                  className={`absolute max-w-none ${FADE}`}
                  style={{
                    left: pct(figure.left, BOX_W),
                    top: pct((BOX_H - figure.h) / 2, BOX_H),
                    width: pct(figure.w, BOX_W),
                    height: pct(figure.h, BOX_H),
                    opacity: i === current ? 1 : 0,
                  }}
                />
              ))}
            </div>
          </section>
        </ProductColumn>
      </div>
    </div>
  )
}

/** True from lg up, where the section pins; false on the server and below lg. */
function useDesktop() {
  return useSyncExternalStore(
    (onChange) => {
      const query = window.matchMedia('(min-width: 64rem)')
      query.addEventListener('change', onChange)
      return () => query.removeEventListener('change', onChange)
    },
    () => window.matchMedia('(min-width: 64rem)').matches,
    () => false,
  )
}
