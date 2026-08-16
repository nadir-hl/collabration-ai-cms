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
    <header
      className="sticky top-0 z-50 w-full border-b border-[--color-border]"
      style={{
        background: 'rgba(245,247,255,0.82)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      <nav className="container flex h-16 items-center justify-between gap-6">
        {/* Logo — icon mark only */}
        <Link href="/" aria-label="Collaboration.AI home">
          <svg
            width="52" height="40"
            viewBox="2 8 38 26"
            fill="none"
            role="img"
            aria-label="Collaboration.AI"
          >
            <circle cx="15" cy="21" r="11" fill="#0D0D12"/>
            <circle cx="29" cy="21" r="11" fill="#2563EB"/>
            <clipPath id="nav-venn"><circle cx="15" cy="21" r="11"/></clipPath>
            <circle cx="29" cy="21" r="11" fill="#fff" clipPath="url(#nav-venn)" opacity="0.22"/>
          </svg>
        </Link>

        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-0.5">
          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
          >
            <button
              className="flex items-center gap-1 rounded-full px-4 py-2 text-sm font-medium text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-bg-pill] transition-all duration-150"
              aria-expanded={open}
            >
              Products
              <svg
                className={`h-3.5 w-3.5 transition-transform duration-150 ${open ? 'rotate-180' : ''}`}
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M4 6l4 4 4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            {open && (
              <div className="absolute left-0 top-full mt-1.5 w-72 rounded-2xl border border-[--color-border] bg-white p-2 shadow-[--shadow-dropdown]">
                {products.map((p) => (
                  <Link
                    key={p.name}
                    href={p.href}
                    className="flex flex-col rounded-xl px-4 py-3 hover:bg-[--color-bg-subtle] transition-colors duration-150"
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
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-150 ${
                pathname?.startsWith(link.href)
                  ? 'text-[--color-text] bg-[--color-bg-pill]'
                  : 'text-[--color-text-muted] hover:text-[--color-text] hover:bg-[--color-bg-pill]'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-2">
          <Link href="/contact" className="btn btn-outline btn-sm">
            Contact us
          </Link>
          <Link href="/get-started" className="btn btn-primary btn-sm">
            Get started
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden rounded-full p-2 text-[--color-text-muted] hover:bg-[--color-bg-pill] transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            {mobileOpen ? (
              <path
                fillRule="evenodd"
                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t border-[--color-border] px-4 py-4 flex flex-col gap-1"
          style={{
            background: 'rgba(245,247,255,0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          <p className="px-4 py-1 text-xs font-semibold uppercase tracking-wider text-[--color-text-muted]">
            Products
          </p>
          {products.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-[--color-text] hover:bg-[--color-bg-subtle] transition-colors"
            >
              {p.name}
            </Link>
          ))}
          <div className="my-1.5 border-t border-[--color-border]" />
          {[
            { label: 'About', href: '/about' },
            { label: 'Resources', href: '/resources' },
          ].map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="rounded-xl px-4 py-2.5 text-sm font-medium text-[--color-text] hover:bg-[--color-bg-subtle] transition-colors"
            >
              {link.label}
            </Link>
          ))}
          <div className="my-1.5 border-t border-[--color-border]" />
          <div className="flex flex-col gap-2 px-1 pt-1">
            <Link href="/contact" className="btn btn-outline btn-sm justify-center">
              Contact us
            </Link>
            <Link href="/get-started" className="btn btn-primary btn-sm justify-center">
              Get started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
