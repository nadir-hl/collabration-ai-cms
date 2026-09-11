'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { ASSISTANT_EASE, ASSISTANT_W, PANEL_HOLD_W, PANEL_W_VAR, RAIL_W } from './constants'

/**
 * Open/closed state for the rail assistant (Figma 138:1031) and the layout
 * switch it drives: the right rail widens from RAIL_W to ASSISTANT_W and the
 * left panel collapses to nothing, handing its width to the center column.
 *
 * Rather than every fixed/sticky piece reading React state, the shell
 * publishes the two widths as CSS variables:
 *
 *   --panel   left panel width   --panel-w -> 0px
 *   --rail    right rail width   RAIL_W    -> ASSISTANT_W
 *
 * --panel-w is the resting left-panel width, set per breakpoint by
 * PANEL_W_VAR: the full PANEL_W from xl, the tablet strip (STRIP_W) below.
 *
 * so the video, the divider, the slide arrows, the menu trigger and the menu
 * dialog all position off var(--panel) / var(--rail) and follow along — the
 * page stays a Server Component. The same element carries `data-assistant`
 * as the named group `group/shell`, for purely visual toggles.
 */

type AssistantState = {
  open: boolean
  setOpen: (open: boolean) => void
}

const AssistantContext = createContext<AssistantState | null>(null)

export function useAssistant() {
  const ctx = useContext(AssistantContext)
  if (!ctx) throw new Error('useAssistant must be used inside <AssistantShell>')
  return ctx
}

export function AssistantShell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false)

  // The rail (and so the assistant) only exists from lg up. Close on the way
  // down so the left panel isn't left collapsed and inert on mobile.
  useEffect(() => {
    const lg = window.matchMedia('(min-width: 64rem)')
    const onChange = () => {
      if (!lg.matches) setOpen(false)
    }
    lg.addEventListener('change', onChange)
    return () => lg.removeEventListener('change', onChange)
  }, [])

  return (
    <AssistantContext value={{ open, setOpen }}>
      <div
        className={`group/shell relative ${PANEL_W_VAR}`}
        data-assistant={open ? 'open' : 'closed'}
        style={
          {
            '--panel': open ? '0px' : 'var(--panel-w)',
            '--rail': open ? ASSISTANT_W : RAIL_W,
          } as React.CSSProperties
        }
      >
        {children}
      </div>
    </AssistantContext>
  )
}

/**
 * The left panel's column. Sticky for the whole page, and collapses to zero
 * width while the assistant is open. The panel inside keeps its open width
 * (PANEL_HOLD_W) so it slides out behind the clip instead of reflowing;
 * `inert` removes it from the tab order and the accessibility tree.
 */
export function LeftPanelSlot({ children }: { children: React.ReactNode }) {
  const { open } = useAssistant()

  return (
    <div
      inert={open}
      className={`lg:sticky lg:top-0 lg:h-screen lg:w-[var(--panel)] lg:shrink-0 lg:overflow-x-clip lg:transition-[width] ${ASSISTANT_EASE}`}
    >
      <div className={`h-full ${PANEL_HOLD_W}`}>{children}</div>
    </div>
  )
}
