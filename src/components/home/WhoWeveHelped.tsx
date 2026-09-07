import Image from 'next/image'
import { CENTER_PL, CENTER_PR, TOP_ROW_H } from './constants'

/**
 * "Who we've helped" — Figma HOME (2:902), y=883..1054.
 *
 * Each partner cell (2:1205 / 2:1206 / 2:1207) holds three things: the logo
 * art, a hairline rule, and a circled "+". The rule and the "+" do not show up
 * as separate nodes in the frame metadata — those groups report as leaves — but
 * they are there in the design context as 2:1204/2:1202/2:1200 (a 1px rule
 * spanning the cell) and 2:1203/2:1201/2:1199 (a ~16px circle).
 *
 * The logos are real organisational marks, so they ship as the Figma vector
 * exports. AFWERX and the DoW seal each come back as separate fragments, and
 * their offsets below are derived from the Figma insets — which are expressed
 * against the whole 1400x3866 frame, not the cell — converted to each mark's
 * own bounding box.
 *
 * The logos are optically centred on a shared line (centres ~984.5, 986.4,
 * 983.5) rather than aligned on their tops or bottoms, so the row centres them.
 */

type Partner = {
  name: string
  href?: string
  render: () => React.ReactNode
}

const partners: Partner[] = [
  {
    name: 'AFWERX Challenge',
    render: () => (
      // bbox 148.54 x 27.45
      <span className="relative block h-[27.45px] w-[148.54px]">
        <Image
          src="/brand/logos/afwerx-mark.svg"
          alt=""
          width={27}
          height={27}
          className="absolute left-0 top-0 h-[27.07px] w-[26.81px]"
        />
        <Image
          src="/brand/logos/afwerx-word.svg"
          alt=""
          width={49}
          height={6}
          className="absolute left-[35.28px] top-[3.87px] h-[6.24px] w-[48.67px]"
        />
        <Image
          src="/brand/logos/afwerx-challenge.svg"
          alt=""
          width={113}
          height={13}
          className="absolute left-[35.28px] top-[14.69px] h-[12.5px] w-[113.3px]"
        />
      </span>
    ),
  },
  {
    name: 'U.S. Department of War',
    render: () => (
      // bbox 195.3 x 35.4
      <span className="relative block h-[35.4px] w-[195.3px]">
        <Image
          src="/brand/logos/dow-seal.svg"
          alt=""
          width={53}
          height={35}
          className="absolute left-0 top-0 h-[35.4px] w-[53.46px]"
        />
        <Image
          src="/brand/logos/dow-word.svg"
          alt=""
          width={135}
          height={12}
          className="absolute left-[60.2px] top-[12.37px] h-[12.3px] w-[135.09px]"
        />
      </span>
    ),
  },
  {
    name: 'SpaceWERX',
    render: () => (
      <Image
        src="/brand/logos/spacewerx.svg"
        alt=""
        width={140}
        height={43}
        className="h-[42.99px] w-[140.28px]"
      />
    ),
  },
]

export function WhoWeveHelped() {
  return (
    <section
      className="relative min-w-0 px-8 pb-16 lg:pl-[var(--pl)] lg:pr-[var(--pr)]"
      style={
        {
          '--pl': CENTER_PL,
          '--pr': CENTER_PR,
        } as React.CSSProperties
      }
      aria-labelledby="who-weve-helped"
    >
      <div className="flex items-center" style={{ height: TOP_ROW_H }}>
        <p id="who-weve-helped" className="section-label w-full text-center">
          Who we&rsquo;ve helped
        </p>
      </div>

      <hr className="mt-[4px] border-0 border-t border-white" />

      <ul className="mt-[42px] grid grid-cols-1 gap-x-[53px] gap-y-14 sm:grid-cols-3">
        {partners.map((partner) => (
          <li key={partner.name} className="flex flex-col items-center">
            {/* Fixed row so the three marks share an optical centre line */}
            <span
              className="flex h-[44px] max-w-full items-center justify-center"
              role="img"
              aria-label={partner.name}
            >
              {partner.render()}
            </span>

            <hr className="mt-4 w-full border-0 border-t border-white" />

            {/*
              Figma 2:1203 / 2:1201 / 2:1199 — a 16.4px circled "+".
              The design implies each partner expands to reveal more, but that
              content and behaviour are not specified yet, so this is inert.
            */}
            <button
              type="button"
              aria-label={`More about ${partner.name}`}
              aria-expanded={false}
              className="mt-[15px] flex size-[16.4px] items-center justify-center rounded-full border border-white text-white transition-colors hover:bg-white hover:text-black"
            >
              <span aria-hidden="true" className="relative block size-[7px]">
                <span className="absolute left-0 top-1/2 h-px w-full -translate-y-1/2 bg-current" />
                <span className="absolute left-1/2 top-0 h-full w-px -translate-x-1/2 bg-current" />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}
