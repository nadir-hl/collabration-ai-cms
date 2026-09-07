/**
 * Geometry lifted from the Figma HOME frame (2:902), a fixed 1400px canvas.
 * Kept in one place so the three panels stay in agreement — the top row only
 * lines up if every panel uses the same padding and row height.
 */

/** Left black panel: 478 / 1400 */
export const PANEL_W = '34.142857%'

/** Right white rail: 64px, Figma 3:1930. Stays opaque — no video behind it. */
export const RAIL_W = '4rem'

/**
 * Extra darkening on the left panel, on top of the page-level black/78 scrim.
 *
 * DELIBERATE DEVIATION FROM FIGMA. The file stacks a second black/78 there
 * (2:906 over 2:905), which lands the panel at ~4.8% of the footage — the video
 * is invisible. This value keeps the panel clearly darker than the center for
 * headline legibility while letting the video read through.
 *
 *   left panel brightness = 0.22 * (1 - PANEL_SCRIM)
 *   0.35 -> ~14.3%   (center section is 22%)
 *
 * Single knob: raise it to push the panel back toward the Figma near-black,
 * lower it to bring more of the video through.
 */
export const PANEL_SCRIM = 0.35

/**
 * Scroll distance, in px, over which the left panel scrubs from its landing
 * state to its scrolled state. Must stay in step with the runway spacer in
 * page.tsx, which is what gives the sticky hero something to scroll against.
 */
export const SCROLL_RUNWAY = 600


/**
 * Top row. In Figma the wordmark (2:916), slide arrows (2:996), "THE CHALLENGE"
 * (2:1048) and the menu button (2:911) all share a vertical centre of ~114px.
 * Each panel opens with a row of this height so those centres coincide.
 */
export const TOP_PAD = '6.5rem' // 104px
export const TOP_ROW_H = '29px' // height of the menu button, the tallest item

/**
 * Center panel content column: Figma x=564..1218 inside a panel spanning
 * 478..1333, i.e. 654 wide with 86 left / 115 right of slack.
 */
export const CENTER_PL = '10.06%' // 86 / 855
export const CENTER_PR = '13.45%' // 115 / 855

/**
 * "Where it comes apart" (Figma 8:8 "Animation"). In the client's scrub
 * reference, the section pins for an extended scroll before releasing into
 * "The solution" below — confirmed by the heading sitting at an identical
 * pixel position across many seconds of the recording while only the card
 * strip beside it changes. This is the scroll distance the pin lasts for.
 *
 * Picked by feel (no reference gives an exact px figure): long enough to
 * comfortably read six beats of the strip without either rushing or
 * dragging. Raise it to slow the scrub down, lower it to speed it up.
 */
export const PROBLEM_SCRUB_RUNWAY = 2000

/**
 * "The solution" product-card row. Same pin-then-scrub mechanic as
 * PROBLEM_SCRUB_RUNWAY (heading static, row scrubs beneath it), but far
 * shorter — only 4 cards need to reveal versus six, and the reference shows
 * most of the row already in view from the start of the pin, so the whole
 * scrub only has to travel about one card-width.
 */
export const SOLUTION_SCRUB_RUNWAY = 700
