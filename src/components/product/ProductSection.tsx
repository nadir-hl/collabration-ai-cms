import { CENTER_PL } from '../home/constants'

/**
 * Right padding of a product page's centre column. The home page's copy column
 * is 654 wide (CENTER_PR), but the product frames set their text boxes 668
 * wide (Figma SOURCE 173:516 and on), ending 101 of the panel's 855 short of
 * the rail — and the wider measure is what makes the copy wrap as designed.
 */
export const PRODUCT_PR = '11.81%' // 101 / 855

/** The frame's content width: the widest text box, and what figures fill. */
const CONTENT_W = 668

const COLUMN_CLASS = 'relative min-w-0 px-8 lg:pl-[var(--pl)] lg:pr-[var(--pr)]'
const COLUMN_VARS = { '--pl': CENTER_PL, '--pr': PRODUCT_PR } as React.CSSProperties

/**
 * One labelled block of a product page's centre column (Figma SOURCE 173:92,
 * 173:516, 173:903, 173:1563, 173:1660): orange label, 23px heading, a blank
 * line, then the body copy, all on the frame's 25px rhythm. Paragraphs inside
 * `children` run on without gaps, as in the design; a figure, list or other
 * artwork that belongs to the block goes in `figure`, after the copy.
 *
 * `measure` is the copy's text-box width in the frame (668 unless a block's
 * box is narrower), so lines break where the design breaks them. Figures and
 * grids are held to the frame's 668 as well, so on screens wider than the
 * 1400 design they keep its proportions rather than stretching to the column.
 *
 * `.section-label` is unlayered CSS, so its line height is set inline rather
 * than with a utility it would outrank.
 */
export function ProductSection({
  label,
  title,
  measure = CONTENT_W,
  className,
  figure,
  children,
}: {
  label: string
  title: string
  measure?: number
  className?: string
  figure?: React.ReactNode
  children: React.ReactNode
}) {
  const headingId = `section-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`

  return (
    <section
      className={`${COLUMN_CLASS} ${className ?? ''}`}
      style={COLUMN_VARS}
      aria-labelledby={headingId}
    >
      <div style={{ maxWidth: CONTENT_W }}>
        <p className="section-label" style={{ lineHeight: '25px' }}>
          {label}
        </p>
        <h2 id={headingId} className="text-[23px] font-semibold leading-[25px] text-white">
          {title}
        </h2>
        <div className="text-body mt-[25px]" style={{ maxWidth: measure }}>
          {children}
        </div>
        {figure}
      </div>
    </section>
  )
}

/** The same column, for a block that isn't a titled section of its own. */
export function ProductColumn({
  className,
  children,
}: {
  className?: string
  children: React.ReactNode
}) {
  return (
    <div className={`${COLUMN_CLASS} ${className ?? ''}`} style={COLUMN_VARS}>
      <div style={{ maxWidth: CONTENT_W }}>{children}</div>
    </div>
  )
}
