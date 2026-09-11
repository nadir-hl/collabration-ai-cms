import Image from 'next/image'
import Link from 'next/link'
import { PANEL_SCRIM, TOP_PAD, TOP_ROW_H } from '../home/constants'

/** The NetworkOS products, in the order the panel lists them. */
export const NETWORK_OS_PRODUCTS = [
  { name: 'Intelligence', slug: 'intelligence' },
  { name: 'Source', slug: 'source' },
  { name: 'Decide', slug: 'decide' },
  { name: 'Acquire', slug: 'acquire' },
] as const

export type NetworkOsProduct = (typeof NETWORK_OS_PRODUCTS)[number]['slug']

/**
 * Left panel of a NetworkOS product page (Figma SOURCE 173:3, 173:91 and
 * 173:104). It is the home panel's scrolled state with the product in place
 * of the headline: same wordmark row, CTA and product list, so moving between
 * the home page and a product page only changes the words.
 *
 * Positions are the frame's, on the same 104px top padding as HeroPanel:
 *   eyebrow   y 192, then the name (23px) and, after a blank line, the summary,
 *             all on Poppins' "normal" line height, in a 335px column
 *   CTA       y 366
 *   products  y 468.6 on a 25px rhythm; the current one is marked by the
 *             4 x 7 chevron (173:1709) 9px left of the names
 *
 * `summary` honours line breaks, so the CMS can place them as the design does.
 */
export function ProductPanel({
  eyebrow,
  name,
  summary,
  current,
}: {
  eyebrow: string
  name: string
  summary: string
  current: NetworkOsProduct
}) {
  return (
    <div
      // Hidden from lg to xl, where HeroStrip stands in for it (tablet).
      className="relative z-10 flex h-full flex-col px-8 pb-16 lg:px-14 lg:max-xl:hidden"
      style={{ paddingTop: TOP_PAD, backgroundColor: `rgba(0, 0, 0, ${PANEL_SCRIM})` }}
    >
      {/* Top row — shares a vertical centre with the slide arrows and the menu */}
      <div className="flex items-center" style={{ height: TOP_ROW_H }}>
        <Link
          href="/"
          className="text-sm font-semibold uppercase leading-none tracking-[0.34em] text-white"
        >
          Collaboration.ai
        </Link>
      </div>

      <div className="mt-[57px] w-[335px] max-w-full">
        <p className="section-label">{eyebrow}</p>
        <h1 className="text-[23px] font-semibold leading-normal text-white">{name}</h1>
        <p className="mt-[21px] whitespace-pre-line text-sm font-medium leading-normal text-white">
          {summary}
        </p>
      </div>

      <div className="mt-[32px] max-w-[377px]">
        <Link href="/contact" className="btn btn-primary btn-lg w-full">
          Talk to our team
        </Link>
      </div>

      <nav className="pt-[59px]" aria-label="NetworkOS products">
        {/* .section-label is unlayered, so its line height is set inline */}
        <p className="section-label" style={{ lineHeight: '25px' }}>
          NetworkOS
        </p>
        <ul>
          {NETWORK_OS_PRODUCTS.map((product) => {
            const isCurrent = product.slug === current
            return (
              <li key={product.slug}>
                <Link
                  href={`/products/${product.slug}`}
                  aria-current={isCurrent ? 'page' : undefined}
                  className="relative text-sm font-medium leading-[25px] text-white transition-colors hover:text-[var(--color-brand-500)]"
                >
                  {isCurrent && (
                    <Image
                      src="/brand/source/nav-chevron.svg"
                      alt=""
                      width={4}
                      height={7}
                      className="absolute -left-[9px] top-1/2 h-[7.26px] w-[4.24px] -translate-y-1/2"
                    />
                  )}
                  {product.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </div>
  )
}
