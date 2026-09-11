'use client'

import { useEffect, useRef, useState, type CSSProperties } from 'react'
import type { AnimationItem } from 'lottie-web'

/**
 * The designer's "Long Sequence" Lottie (LottieFiles, project CAI), patched to
 * match the client's reference recording by scripts/patch-problem-lottie.mjs —
 * see that file for what was changed and why. Renders the full canvas at 1:1;
 * the caller positions it and decides what clips it.
 *
 * Two modes:
 *   scrub — `progress` given (0..1): the frame follows scroll.
 *   loop  — no `progress`: autoplays and loops, for the unpinned mobile flow.
 *
 * Facts about the file (measured, not read off the export dialog):
 *   - canvas 520 x 1329 at 30fps, frames 0-377; every layer's out-point is
 *     376, so 376-377 render blank.
 *   - drawn at 1:1 with the Figma: the checklist is 297 x 377, same as 3:1616.
 *   - uses 38 expressions (all `loopOut()` on opacity), which lottie-web's
 *     "light" build cannot run, so this imports the full build.
 *
 * The export has no text layers, so the checklist's "Submission #34-41" labels
 * are added here, inside each row's own layer so they move, fade and scale
 * with it. In the recording each row's label types in from the frame the row
 * lands, at ~4.2 characters a frame; the finale's copy of the checklist shows
 * them complete.
 *
 * SCRUB_END_FRAME: the recording's pin releases on frame ~226. Everything
 * after that is a static finale plus the reset to blank.
 *
 * The player is imported dynamically because lottie-web touches `document`
 * at module load and would break the server render.
 */

const SRC = '/animations/problem-sequence.json'
export const CANVAS_W = 520
export const CANVAS_H = 1329
export const SCRUB_END_FRAME = 226
const LOOP_END_FRAME = 375

/** The checklist rows: "Outlines 4" rise in and get typed; "Outlines 5" are
 *  the copy in the zoomed-out finale. Layer 16 is row 1 (#34). */
const ROW_LAYER = /^Layer (1[6-9]|2[0-3]) Outlines ([45])$/
const FIRST_SUBMISSION = 34
const CHARS_PER_FRAME = 4.17
/** Figma 3:1609 — Inter Regular 14, 7px in from the row's left edge. */
const LABEL_INSET = 7
const LABEL_FONT = '400 14px var(--font-inter), Inter, sans-serif'
/** Frames where each set of rows is fully in, so its geometry is drawn. */
const MEASURE_TYPED = 45
const MEASURE_FINALE = 210

type LottieLayer = { nm: string; ks: { p: { a: number; k: unknown } } }
type Label = { node: SVGTextElement; text: string; typedFrom: number | null; shown: number }

export function ProblemAnimation({
  progress,
  className,
  style,
}: {
  progress?: number
  className?: string
  style?: CSSProperties
}) {
  const hostRef = useRef<HTMLDivElement>(null)
  const labelsRef = useRef<Label[]>([])
  const [anim, setAnim] = useState<AnimationItem | null>(null)
  const scrubbed = progress !== undefined

  useEffect(() => {
    let cancelled = false
    let item: AnimationItem | null = null

    ;(async () => {
      const [{ default: lottie }, data] = await Promise.all([
        import('lottie-web'),
        fetch(SRC).then((r) => r.json()),
      ])
      if (cancelled || !hostRef.current) return

      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const loaded = lottie.loadAnimation({
        container: hostRef.current,
        renderer: 'svg',
        loop: !scrubbed && !reduced,
        autoplay: false,
        animationData: data,
      })
      item = loaded
      if (!loaded.isLoaded) {
        await new Promise<void>((resolve) => loaded.addEventListener('DOMLoaded', () => resolve()))
      }
      if (cancelled) return

      const labels = attachLabels(loaded, data.layers)
      labelsRef.current = labels

      // Scrub mode positions itself in the effect below once `anim` is set.
      if (!scrubbed) {
        if (reduced) {
          loaded.goToAndStop(SCRUB_END_FRAME, true)
          typeLabels(labels, SCRUB_END_FRAME)
        } else {
          loaded.addEventListener('enterFrame', () => typeLabels(labels, loaded.currentFrame))
          loaded.playSegments([0, LOOP_END_FRAME], true)
        }
      }
      setAnim(loaded)
    })()

    return () => {
      cancelled = true
      item?.destroy()
    }
  }, [scrubbed])

  useEffect(() => {
    if (!anim || progress === undefined) return
    const frame = progress * SCRUB_END_FRAME
    anim.goToAndStop(frame, true)
    typeLabels(labelsRef.current, frame)
  }, [anim, progress])

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ width: CANVAS_W, height: CANVAS_H, ...style }}
    />
  )
}

/**
 * Puts an empty <text> in every row layer. Leaves the player on
 * MEASURE_FINALE; callers set the frame they want afterwards.
 */
function attachLabels(item: AnimationItem, layers: LottieLayer[]): Label[] {
  const { elements } = (
    item as unknown as { renderer: { elements: ({ layerElement?: SVGGElement } | undefined)[] } }
  ).renderer

  const rows = layers.flatMap((layer, i) => {
    const match = ROW_LAYER.exec(layer.nm)
    const el = elements[i]?.layerElement
    return match && el ? [{ layer, el, row: Number(match[1]) - 16, typed: match[2] === '4' }] : []
  })

  const labels: Label[] = []
  for (const typed of [true, false]) {
    // Lottie only draws a row's path once the row has been on screen, so each
    // set is measured on a frame where all of it is in.
    item.goToAndStop(typed ? MEASURE_TYPED : MEASURE_FINALE, true)

    for (const { layer, el, row } of rows.filter((r) => r.typed === typed)) {
      const box = el.getBBox()
      const node = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      node.setAttribute('x', String(box.x + LABEL_INSET))
      node.setAttribute('y', String(box.y + box.height / 2))
      node.setAttribute('dominant-baseline', 'central')
      node.setAttribute('fill', '#fff')
      node.style.font = LABEL_FONT
      el.appendChild(node)

      // A typed row starts on the frame it lands: its last position keyframe.
      const { p } = layer.ks
      const keys = p.a === 1 ? (p.k as { t: number }[]) : null
      labels.push({
        node,
        text: `Submission #${FIRST_SUBMISSION + row}`,
        typedFrom: typed && keys ? keys[keys.length - 1].t : null,
        shown: -1,
      })
    }
  }
  return labels
}

function typeLabels(labels: Label[], frame: number) {
  for (const label of labels) {
    const shown =
      label.typedFrom === null
        ? label.text.length
        : Math.min(label.text.length, Math.max(0, Math.floor((frame - label.typedFrom) * CHARS_PER_FRAME)))
    if (shown === label.shown) continue
    label.node.textContent = label.text.slice(0, shown)
    label.shown = shown
  }
}
