'use client'

export function AdminLogo() {
  return (
    <svg width="200" height="33" viewBox="0 0 264 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Collaboration.AI">
      <circle cx="15" cy="22" r="13" fill="#0D0D12" />
      <circle cx="31" cy="22" r="13" fill="#2563EB" />
      <clipPath id="admin-venn"><circle cx="15" cy="22" r="13" /></clipPath>
      <circle cx="31" cy="22" r="13" fill="#ffffff" clipPath="url(#admin-venn)" opacity="0.22" />
      <text x="54" y="29" fontFamily="-apple-system, system-ui, 'Segoe UI', sans-serif" fontSize="19" fontWeight="700" letterSpacing="-0.5" fill="#0D0D12">Collaboration</text>
      <text x="206" y="29" fontFamily="-apple-system, system-ui, 'Segoe UI', sans-serif" fontSize="19" fontWeight="800" letterSpacing="-0.5" fill="#2563EB">.AI</text>
    </svg>
  )
}

export function AdminIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 44 44" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="Collaboration.AI">
      <circle cx="15" cy="22" r="13" fill="#0D0D12" />
      <circle cx="29" cy="22" r="13" fill="#2563EB" />
      <clipPath id="admin-icon-venn"><circle cx="15" cy="22" r="13" /></clipPath>
      <circle cx="29" cy="22" r="13" fill="#ffffff" clipPath="url(#admin-icon-venn)" opacity="0.22" />
    </svg>
  )
}
