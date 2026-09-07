'use client'

import { CENTER_PL, CENTER_PR } from './constants'

/**
 * "Next steps" — the intake form (Figma HOME 2:902, y=3117..3622).
 *
 * Geometry from the file: the fields are 649 wide (the full content column)
 * and 37.34 tall with a plain 1px white stroke and no fill (asset 3:2069 is
 * literally `stroke="white"` on a sharp-cornered rect), stacked ~20px apart,
 * with the textarea at 116.2. The SEND button is 649.9 x 52.5 and its offset
 * outline 657.9 — exactly 8px wider, which is what .btn-primary's ::after
 * already draws, so the button reuses that class rather than redoing it.
 *
 * NOT WIRED UP. There is no submit destination yet: the PRD puts leads in
 * HubSpot (with a copy in Payload), and that integration does not exist in
 * this repo — /contact carries the same placeholder. So onSubmit only blocks
 * the default GET-reload, which would otherwise splatter the field values
 * into the URL and look like a broken send. Wiring needed before launch:
 *   1. POST to a route handler under src/app/api/
 *   2. that forwards to the HubSpot Forms API, and
 *   3. writes a copy into a Payload `leads` collection.
 * Until then this is presentational — clicking SEND does nothing.
 *
 * The design labels the fields by placeholder alone, which leaves a screen
 * reader with four unlabelled inputs, so each carries an sr-only <label>.
 * That is additive: nothing about the visual design changes.
 */

const FIELDS = [
  { name: 'name', label: 'Your name', placeholder: 'name', type: 'text', autoComplete: 'name' },
  { name: 'email', label: 'Your email', placeholder: 'email', type: 'email', autoComplete: 'email' },
  {
    name: 'organization',
    label: 'Your organization',
    placeholder: 'organization',
    type: 'text',
    autoComplete: 'organization',
  },
]

/** Figma 3:2069-3:2071 — 649 x 37.34, 1px white stroke, no fill, square corners. */
const FIELD_CLASS =
  'w-full border border-white bg-transparent px-4 text-base text-white outline-none placeholder:text-[var(--color-neutral-400)] focus-visible:border-[var(--color-brand-500)]'

export function NextSteps() {
  return (
    <section
      className="relative min-w-0 px-8 pt-20 lg:pl-[var(--pl)] lg:pr-[var(--pr)]"
      style={{ '--pl': CENTER_PL, '--pr': CENTER_PR } as React.CSSProperties}
      aria-labelledby="next-steps"
    >
      <p id="next-steps" className="section-label">
        Next steps
      </p>
      <p className="text-body mt-2 max-w-[42rem]">
        Bring the solicitation you&rsquo;re planning, the change you&rsquo;re
        managing, or the statutory program you have to carry through the next
        cycle. We work through it with you, and you leave knowing what would run
        today and what wouldn&rsquo;t.
      </p>

      <form
        className="mt-11 space-y-5"
        onSubmit={(e) => e.preventDefault()} // see NOT WIRED UP above
      >
        {FIELDS.map((field) => (
          <div key={field.name}>
            <label htmlFor={`next-${field.name}`} className="sr-only">
              {field.label}
            </label>
            <input
              id={`next-${field.name}`}
              name={field.name}
              type={field.type}
              autoComplete={field.autoComplete}
              placeholder={field.placeholder}
              className={`${FIELD_CLASS} h-[37px]`}
            />
          </div>
        ))}

        <div>
          <label htmlFor="next-program" className="sr-only">
            What program is this about?
          </label>
          {/* Figma 3:2072 — same field, 116.2 tall */}
          <textarea
            id="next-program"
            name="program"
            rows={4}
            placeholder="program this is about..."
            className={`${FIELD_CLASS} h-[116px] resize-none py-2.5 leading-[25px]`}
          />
        </div>

        <div className="pt-2">
          <button type="submit" className="btn btn-primary h-[53px] w-full">
            Send
          </button>
        </div>
      </form>
    </section>
  )
}
