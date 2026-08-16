import type { AccessArgs, Where } from 'payload'

type Role = 'admin' | 'approver' | 'reviewer' | 'editor'

const getRole = (req: AccessArgs['req']): Role | undefined =>
  (req.user as { role?: Role } | null)?.role

export const isAdmin = ({ req }: AccessArgs) => getRole(req) === 'admin'

export const isAdminOrApprover = ({ req }: AccessArgs) =>
  ['admin', 'approver'].includes(getRole(req) ?? '')

export const isAdminApproverOrReviewer = ({ req }: AccessArgs) =>
  ['admin', 'approver', 'reviewer'].includes(getRole(req) ?? '')

export const isAuthenticated = ({ req }: AccessArgs) => Boolean(req.user)

// Public read: unauthenticated only sees published; authenticated sees all
export const publishedOrAuthenticated = ({ req }: AccessArgs): boolean | Where => {
  if (req.user) return true
  return { _status: { equals: 'published' } }
}

// Update access: admins/approvers/reviewers can edit anything; editors only edit their own docs
export const editorOwnsOrAdmin = ({ req }: AccessArgs): boolean | Where => {
  if (!req.user) return false
  const role = getRole(req)
  if (role && ['admin', 'approver', 'reviewer'].includes(role)) return true
  if (role === 'editor') return { createdBy: { equals: req.user.id } }
  return false
}
