'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const products = [
  { name: 'Source', href: '/products/source', tagline: 'Find the right people, faster' },
  { name: 'Decide', href: '/products/decide', tagline: 'Structured decisions at scale' },
  { name: 'Acquire', href: '/products/acquire', tagline: 'Turn pipeline into revenue' },
  { name: 'Intelligence', href: '/products/intelligence', tagline: 'Know what your market is doing' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[--color-border] bg-white/90 backdrop-blur-sm">
      <nav className="container flex h-16 items-center justify-between gap-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 font-semibold text-[--color-brand-700] text-lg tracking-tight">
          Collaboration<span className="text-[--color-brand-500]">.AI</span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-1">
          {/* Products dropdown */}
          <div className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}>
            <button
              className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-[--color-text-muted] hover:text-[--color-text] transition-colors"
              aria-expanded={open}
            >
              Products
              <svg className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 16 16" fill="none">
                <path d="M4 6l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            {open && (
              <div className="absolute left-0 top-full mt-1 w-72 rounded-xl border border-[--color-border] bg-white p-2 shadow-[--shadow-dropdown]">
                {products.map((p) => (
                  <Link
                    key={p.name}
                    href={p.href}
                    className="flex flex-col rounded-lg px-4 py-3 hover:bg-[--color-bg-subtle] transition-colors"
                  >
                    <span className="text-sm font-semibold text-[--color-text]">{p.name}</span>
                    <span className="text-xs text-[--color-text-muted] mt-0.5">{p.tagline}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {[
            { label: 'About', href: '/about' },
            { label: 'Resources', href: '/resources' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                pathname?.startsWith(link.href)
                  ? 'text-[--color-text]'
                  : 'text-[--color-text-muted] hover:text-[--color-text]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTA */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/contact"
            className="rounded-lg bg-[--color-brand-600] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[--color-brand-700] transition-colors"
          >
            Get in touch
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden rounded-md p-2 text-[--color-text-muted]"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen
              ? <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              : <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            }
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-[--color-border] bg-white px-4 py-4 flex flex-col gap-1">
          <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[--color-text-muted]">Products</p>
          {products.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[--color-text] hover:bg-[--color-bg-subtle]"
            >
              {p.name}
            </Link>
          ))}
          <div className="my-1 border-t border-[--color-border]" />
          {[
            { label: 'About', href: '/about' },
            { label: 'Resources', href: '/resources' },
            { label: 'Contact', href: '/contact' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[--color-text] hover:bg-[--color-bg-subtle]"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
