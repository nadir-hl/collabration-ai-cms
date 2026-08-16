import { getPayload } from 'payload'
import configPromise from '@payload-config'

type Stat = {
  label: string
  published: number
  drafts: number
  pendingReview: number
  color: string
}

async function fetchStat(
  payload: Awaited<ReturnType<typeof getPayload>>,
  collection: 'posts' | 'case-studies' | 'competitors',
): Promise<{ published: number; drafts: number; pendingReview: number }> {
  const [publishedRes, draftsRes, pendingRes] = await Promise.all([
    payload.find({
      collection,
      where: { _status: { equals: 'published' } },
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection,
      where: { _status: { equals: 'draft' } },
      draft: true,
      limit: 0,
      overrideAccess: true,
    }),
    payload.find({
      collection,
      where: { reviewStatus: { equals: 'pending' } },
      draft: true,
      limit: 0,
      overrideAccess: true,
    }),
  ])
  return {
    published: publishedRes.totalDocs,
    drafts: draftsRes.totalDocs,
    pendingReview: pendingRes.totalDocs,
  }
}

export default async function DashboardStats() {
  const payload = await getPayload({ config: configPromise })

  const [posts, caseStudies, competitors] = await Promise.all([
    fetchStat(payload, 'posts'),
    fetchStat(payload, 'case-studies'),
    fetchStat(payload, 'competitors'),
  ])

  const stats: Stat[] = [
    { label: 'Blog Posts', color: '#2563eb', ...posts },
    { label: 'Case Studies', color: '#16a34a', ...caseStudies },
    { label: 'Competitor Pages', color: '#9333ea', ...competitors },
  ]

  return (
    <div
      style={{
        padding: '1.5rem',
        marginBottom: '2rem',
        borderRadius: '0.75rem',
        border: '1px solid var(--theme-elevation-150, #e5e7eb)',
        background: 'var(--theme-elevation-50, #f9fafb)',
      }}
    >
      <p
        style={{
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--theme-elevation-500, #6b7280)',
          marginBottom: '1rem',
        }}
      >
        Content at a glance
      </p>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
        }}
      >
        {stats.map((s) => (
          <div
            key={s.label}
            style={{
              background: 'var(--theme-elevation-0, #ffffff)',
              border: '1px solid var(--theme-elevation-150, #e5e7eb)',
              borderRadius: '0.625rem',
              padding: '1rem 1.25rem',
              borderLeft: `3px solid ${s.color}`,
            }}
          >
            <p
              style={{
                fontSize: '0.8125rem',
                fontWeight: 600,
                color: 'var(--theme-elevation-800, #1f2937)',
                marginBottom: '0.75rem',
              }}
            >
              {s.label}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem' }}>
              <div>
                <p
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: s.color,
                    lineHeight: 1,
                  }}
                >
                  {s.published}
                </p>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--theme-elevation-500, #6b7280)',
                    marginTop: '0.25rem',
                  }}
                >
                  Published
                </p>
              </div>
              <div>
                <p
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    color: 'var(--theme-elevation-500, #6b7280)',
                    lineHeight: 1,
                  }}
                >
                  {s.drafts}
                </p>
                <p
                  style={{
                    fontSize: '0.6875rem',
                    color: 'var(--theme-elevation-500, #6b7280)',
                    marginTop: '0.25rem',
                  }}
                >
                  Drafts
                </p>
              </div>
              {s.pendingReview > 0 && (
                <div>
                  <p
                    style={{
                      fontSize: '1.5rem',
                      fontWeight: 700,
                      color: '#d97706',
                      lineHeight: 1,
                    }}
                  >
                    {s.pendingReview}
                  </p>
                  <p
                    style={{
                      fontSize: '0.6875rem',
                      color: 'var(--theme-elevation-500, #6b7280)',
                      marginTop: '0.25rem',
                    }}
                  >
                    Need review
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
