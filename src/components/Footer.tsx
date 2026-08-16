import Link from 'next/link'

const products = [
  { name: 'Source', href: '/products/source' },
  { name: 'Decide', href: '/products/decide' },
  { name: 'Acquire', href: '/products/acquire' },
  { name: 'Intelligence', href: '/products/intelligence' },
]

const company = [
  { name: 'About', href: '/about' },
  { name: 'Team', href: '/about#team' },
  { name: 'Careers', href: '/careers' },
  { name: 'Contact', href: '/contact' },
]

const resources = [
  { name: 'Blog', href: '/resources' },
  { name: 'Case Studies', href: '/resources/case-studies' },
  { name: 'Competitor Map', href: '/resources/compare' },
]

export function Footer() {
  return (
    <footer className="border-t border-[--color-border] bg-[--color-bg-subtle]">
      <div className="container py-12 md:py-16">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-lg font-semibold text-[--color-brand-700] tracking-tight">
              Collaboration<span className="text-[--color-brand-500]">.AI</span>
            </Link>
            <p className="mt-3 text-sm text-[--color-text-muted] leading-relaxed max-w-xs">
              AI-powered tools for the full revenue cycle.
            </p>
          </div>

          {/* Products */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[--color-text-muted] mb-3">Products</h3>
            <ul className="space-y-2">
              {products.map((p) => (
                <li key={p.name}>
                  <Link href={p.href} className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[--color-text-muted] mb-3">Company</h3>
            <ul className="space-y-2">
              {company.map((p) => (
                <li key={p.name}>
                  <Link href={p.href} className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-[--color-text-muted] mb-3">Resources</h3>
            <ul className="space-y-2">
              {resources.map((p) => (
                <li key={p.name}>
                  <Link href={p.href} className="text-sm text-[--color-text-muted] hover:text-[--color-text] transition-colors">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-[--color-border] pt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs text-[--color-text-muted]">
            © {new Date().getFullYear()} Collaboration.AI. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="text-xs text-[--color-text-muted] hover:text-[--color-text]">Privacy</Link>
            <Link href="/terms" className="text-xs text-[--color-text-muted] hover:text-[--color-text]">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
