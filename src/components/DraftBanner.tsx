import Link from 'next/link'

export function DraftBanner() {
  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full bg-[--color-brand-900] px-5 py-2.5 text-sm text-white shadow-xl ring-1 ring-white/10">
      <span className="inline-flex w-2 h-2 rounded-full bg-yellow-400 shadow-[0_0_6px_theme(colors.yellow.400)]" />
      <span className="font-medium tracking-tight">Draft preview</span>
      <span className="text-white/30">·</span>
      <Link
        href="/api/disable-draft"
        className="text-white/60 hover:text-white transition-colors"
      >
        Exit
      </Link>
    </div>
  )
}
