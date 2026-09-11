#!/usr/bin/env node
/**
 * Builds public/animations/problem-sequence.json from the designer's
 * "Long Sequence" Lottie export (LottieFiles, project CAI), applying the
 * corrections that make it match the client's reference recording
 * ("Collaboration AI scrub example.mp4") frame for frame.
 *
 * Re-run it whenever the designer re-exports:
 *
 *   node scripts/patch-problem-lottie.mjs "path/to/Long Sequence.json"
 *
 * How the corrections were found: every reference frame was matched against
 * renders of this file (the video is 1400x900, the Figma canvas width, so the
 * Lottie appears at exactly 1:1 and can be compared pixel for pixel). The
 * recording plays this same animation — rows, ticks and slides all line up —
 * but a handful of things differ, and each is patched below. Layers are found
 * by name, not index, so a re-export with reordered layers still patches.
 *
 * What the recording has that the export doesn't — the typed "Submission #34"
 * labels — can't be expressed without text layers, so ProblemAnimation adds
 * those at runtime.
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

const src = process.argv[2]
if (!src) {
  console.error('usage: node scripts/patch-problem-lottie.mjs "path/to/Long Sequence.json"')
  process.exit(1)
}
const out = fileURLToPath(new URL('../public/animations/problem-sequence.json', import.meta.url))
const data = JSON.parse(readFileSync(src, 'utf8'))

const byName = new Map(data.layers.map((l) => [l.nm, l]))
function layer(name) {
  const l = byName.get(name)
  if (!l) throw new Error(`layer "${name}" not found — has the export changed?`)
  return l
}
function eachShape(shapes, fn) {
  for (const s of shapes ?? []) {
    fn(s)
    if (s.ty === 'gr') eachShape(s.it, fn)
  }
}

// 0. The export starts its first animations at frame -1 (the After Effects
//    in-point): the checklist outline and checkbox draw-ons, the first header
//    dot, the first row. So frame 0 is already slightly in — four stray
//    fragments that sit on screen the whole time the section scrolls in.
//    The recording shows nothing there, so start them at 0 instead.
;(function startAtZero(node) {
  if (Array.isArray(node)) return node.forEach(startAtZero)
  if (!node || typeof node !== 'object') return
  if (node.a === 1 && Array.isArray(node.k)) {
    for (const k of node.k) if (typeof k.t === 'number' && k.t < 0) k.t = 0
  }
  Object.values(node).forEach(startAtZero)
})(data.layers)

// 1. Checklist rows: the export fills them white at 35% (a light grey); the
//    recording's rows are near-black — fitting row pixels against the gaps
//    beside them gives colour ~33 at 70% opacity. Same for the copy of the
//    checklist in the zoomed-out finale ("Outlines 5").
//    The 70% lives on the fill, not the layer: the typed labels are drawn
//    inside each row's layer and must come out pure white, so the rising
//    rows' layer fade (0 -> 70) is rescaled to 0 -> 100.
const ROW_GREY = 33 / 255
for (let n = 16; n <= 23; n++) {
  for (const set of [4, 5]) {
    const row = layer(`Layer ${n} Outlines ${set}`)
    eachShape(row.shapes, (s) => {
      if (s.ty !== 'fl') return
      s.c.k = [ROW_GREY, ROW_GREY, ROW_GREY, 1]
      s.o.k = 70
    })
    const o = row.ks.o
    if (set === 4 && o.a === 1) for (const k of o.k) if (k.s) k.s = k.s.map((v) => (v * 100) / 70)
  }
}

// 2. The second window's outline ("Shape Layer 5") draws on 22 frames later
//    in the recording: after the first slide, at its parked position, rather
//    than off to the right before the slide starts.
eachShape(layer('Shape Layer 5').shapes, (s) => {
  if (s.ty !== 'tm') return
  for (const key of ['s', 'e', 'o']) {
    if (s[key]?.a === 1) for (const k of s[key].k) k.t += 22
  }
})

// 3. The recording flies half as many documents into the folder: every other
//    one, 20 frames apart instead of 10. "Layer 45 Outlines 44-59" are the
//    first run, "60-75" the finale's; hide the odd ones of each.
for (let k = 1; k < 16; k += 2) {
  layer(`Layer 45 Outlines ${44 + k}`).hd = true
  layer(`Layer 45 Outlines ${60 + k}`).hd = true
}

// 4. The zoomed-out finale is laid out differently: the checklist copy sits
//    well lower, the other two windows a little lower. Offsets in canvas px,
//    fitted against the recording's last pinned frames.
const FINALE_OFFSETS = {
  'Layer 11 Outlines 5': [-8, 56], // checklist copy
  'Layer 46 Outlines 4': [-2, 32], // third window
  'Shape Layer 6': [-12, 10], // second window copy
}
for (const [name, [dx, dy]] of Object.entries(FINALE_OFFSETS)) {
  const p = layer(name).ks.p
  if (p.a === 1) {
    for (const k of p.k) {
      if (!k.s) continue
      k.s[0] += dx
      k.s[1] += dy
    }
  } else {
    p.k[0] += dx
    p.k[1] += dy
  }
}

writeFileSync(out, JSON.stringify(data))
console.log(`wrote ${out}`)
