'use client'

import { useEffect, useRef, useState } from 'react'

function easeOutCubic(t: number) {
  return 1 - Math.pow(1 - t, 3)
}

function useCountUp(
  target: number,
  duration: number,
  delay: number,
  enabled: boolean,
) {
  const [value, setValue] = useState(0)
  const startedRef = useRef(false)

  useEffect(() => {
    if (!enabled || startedRef.current) return
    startedRef.current = true
    let raf: number
    const startTs = performance.now() + delay
    const tick = (now: number) => {
      if (now < startTs) { raf = requestAnimationFrame(tick); return }
      const p = Math.min((now - startTs) / duration, 1)
      setValue(Math.round(easeOutCubic(p) * target))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [enabled]) // eslint-disable-line react-hooks/exhaustive-deps

  return value
}

function Sparkline({ data, color }: { data: number[]; color: string }) {
  const W = 52, H = 22
  const pts = data
    .map((v, i) => `${(i / (data.length - 1)) * W},${H - v * (H - 4) - 2}`)
    .join(' ')
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} fill="none" className="shrink-0">
      <polyline
        points={pts}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.85"
      />
    </svg>
  )
}

const STAGES = [
  { label: 'Sourcing',   count: 94, flex: 4, g: 'linear-gradient(90deg,#2563eb,#60a5fa)', dot: '#3b82f6' },
  { label: 'Qualifying', count: 72, flex: 3, g: 'linear-gradient(90deg,#6d28d9,#a78bfa)', dot: '#7c3aed' },
  { label: 'Proposing',  count: 51, flex: 2, g: 'linear-gradient(90deg,#0e7490,#22d3ee)', dot: '#0e7490' },
  { label: 'Closing',    count: 30, flex: 1, g: 'linear-gradient(90deg,#b45309,#fbbf24)', dot: '#b45309' },
]

export function DashboardCard() {
  const [entered, setEntered] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setEntered(true); obs.disconnect() } },
      { threshold: 0.2 },
    )
    if (rootRef.current) obs.observe(rootRef.current)
    return () => obs.disconnect()
  }, [])

  const deals    = useCountUp(247, 1500, 350, entered)
  const pipeline = useCountUp(42,  1700, 450, entered) // 42 = 4.2 × 10
  const win      = useCountUp(68,  1400, 550, entered)
  const cycle    = useCountUp(22,  1300, 650, entered)

  const stats = [
    {
      label: 'Active deals',
      display: String(deals),
      change: '+12%', arrow: '▲', positive: true,
      spark: [0.4, 0.5, 0.45, 0.62, 0.58, 0.7, 0.8, 0.75, 0.9, 1],
      color: '#3b82f6',
    },
    {
      label: 'Pipeline value',
      display: `$${Math.floor(pipeline / 10)}.${pipeline % 10}M`,
      change: '+28%', arrow: '▲', positive: true,
      spark: [0.3, 0.4, 0.55, 0.5, 0.65, 0.7, 0.72, 0.85, 0.92, 1],
      color: '#7c3aed',
    },
    {
      label: 'Win rate',
      display: `${win}%`,
      change: '+5 pts', arrow: '▲', positive: true,
      spark: [0.6, 0.55, 0.65, 0.7, 0.62, 0.75, 0.78, 0.8, 0.88, 1],
      color: '#0891b2',
    },
    {
      label: 'Avg. cycle',
      display: `${cycle} days`,
      change: '−8 days', arrow: '▼', positive: true,
      spark: [1, 0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55, 0.5],
      color: '#d97706',
    },
  ]

  return (
    <div ref={rootRef}>
      <div
        className="rounded-3xl overflow-hidden w-full"
        style={{
          background: 'rgba(255,255,255,0.54)',
          backdropFilter: 'blur(28px)',
          WebkitBackdropFilter: 'blur(28px)',
          border: '1px solid rgba(255,255,255,0.80)',
          boxShadow:
            '0 40px 80px -20px rgba(99,102,241,0.22), 0 8px 32px -8px rgba(0,0,0,0.09), inset 0 1px 0 rgba(255,255,255,0.95)',
          opacity: entered ? 1 : 0,
          transform: entered ? 'translateY(0) scale(1)' : 'translateY(20px) scale(0.97)',
          transition: 'opacity 0.6s ease, transform 0.7s cubic-bezier(0.34,1.56,0.64,1)',
        }}
      >
        {/* Window chrome */}
        <div
          className="flex items-center gap-2 px-6 py-4 border-b"
          style={{ borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.35)' }}
        >
          <div className="h-3 w-3 rounded-full" style={{ background: '#ff5f57' }} />
          <div className="h-3 w-3 rounded-full" style={{ background: '#ffbd2e' }} />
          <div className="h-3 w-3 rounded-full" style={{ background: '#28c840' }} />
          <span className="ml-4 text-xs font-medium text-[--color-text-muted] truncate">
            Collaboration.AI — Revenue Intelligence
          </span>
          <div className="ml-auto flex items-center gap-2 shrink-0">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: '#22c55e', animation: 'livePulse 1.8s ease-in-out infinite' }}
            />
            <span className="text-xs font-bold" style={{ color: '#15803d' }}>Live</span>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {/* 2×2 stat tiles */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            {stats.map((s, i) => (
              <div
                key={s.label}
                className="rounded-2xl p-4 md:p-5"
                style={{
                  background: 'rgba(255,255,255,0.68)',
                  border: '1px solid rgba(255,255,255,0.85)',
                  opacity: entered ? 1 : 0,
                  transform: entered ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.5s ease ${i * 90 + 300}ms, transform 0.5s ease ${i * 90 + 300}ms`,
                }}
              >
                <div className="flex items-start justify-between mb-2">
                  <p className="text-xs font-medium text-[--color-text-muted]">{s.label}</p>
                  <Sparkline data={s.spark} color={s.color} />
                </div>
                <p
                  className="text-2xl md:text-3xl font-bold text-[--color-text] tabular-nums leading-none"
                >
                  {s.display}
                </p>
                <p
                  className="text-xs font-semibold mt-2"
                  style={{ color: s.positive ? '#15803d' : '#dc2626' }}
                >
                  {s.arrow} {s.change}
                </p>
              </div>
            ))}
          </div>

          {/* Pipeline bar */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: 'rgba(255,255,255,0.55)',
              border: '1px solid rgba(255,255,255,0.78)',
              opacity: entered ? 1 : 0,
              transition: 'opacity 0.5s ease 680ms',
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-[--color-text]">Pipeline stages</p>
              <span
                className="text-xs font-bold px-3 py-1 rounded-full"
                style={{ background: '#EEF2FF', color: '#4338ca' }}
              >
                Q4 2025
              </span>
            </div>

            {/* Animated wipe-reveal bar */}
            <div
              className="flex gap-1 h-8 rounded-full overflow-hidden mb-4"
              style={{
                clipPath: entered
                  ? 'inset(0 0% 0 0 round 9999px)'
                  : 'inset(0 100% 0 0 round 9999px)',
                transition: 'clip-path 1.1s cubic-bezier(0.4,0,0.2,1) 780ms',
              }}
            >
              {STAGES.map((s, i) => (
                <div
                  key={s.label}
                  style={{
                    flex: s.flex,
                    background: s.g,
                    borderRadius:
                      i === 0
                        ? '9999px 0 0 9999px'
                        : i === STAGES.length - 1
                        ? '0 9999px 9999px 0'
                        : undefined,
                  }}
                />
              ))}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 gap-x-6 gap-y-2">
              {STAGES.map((s, i) => (
                <div
                  key={s.label}
                  className="flex items-center gap-2"
                  style={{
                    opacity: entered ? 1 : 0,
                    transform: entered ? 'translateX(0)' : 'translateX(-8px)',
                    transition: `opacity 0.4s ease ${i * 75 + 1050}ms, transform 0.4s ease ${i * 75 + 1050}ms`,
                  }}
                >
                  <div className="h-2.5 w-2.5 rounded-full shrink-0" style={{ background: s.dot }} />
                  <span className="text-xs text-[--color-text-muted]">
                    {s.label}{' '}
                    <span className="font-semibold text-[--color-text]">{s.count}</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
