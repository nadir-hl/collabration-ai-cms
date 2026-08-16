import type { CollectionAfterChangeHook } from 'payload'

export const writeAuditLog =
  (collectionSlug: string): CollectionAfterChangeHook =>
  async ({ doc, req, previousDoc, operation }) => {
    try {
      const label = doc.title ?? doc.name ?? doc.client ?? doc.id
      let action: string
      if (operation === 'create') {
        action = 'create'
      } else if (doc._status === 'published' && previousDoc?._status !== 'published') {
        action = 'publish'
      } else if (doc._status !== 'published' && previousDoc?._status === 'published') {
        action = 'unpublish'
      } else {
        action = 'update'
      }

      await req.payload.create({
        collection: 'audit-log',
        data: {
          summary: `${action} — ${collectionSlug} — "${label}"`,
          action,
          collection: collectionSlug,
          documentId: String(doc.id),
          user: req.user?.id ?? null,
        },
        overrideAccess: true,
      })
    } catch {
      // Audit logging must never break the save
    }
    return doc
  }
