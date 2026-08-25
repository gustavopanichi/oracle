import type { ReactNode } from 'react'
import './sigil.css'

/* ---------------------------------------------------------------------------
   Every card's illustration is drawn into this same instrument dial: a faint
   guide circle with cardinal ticks and diagonal points. It is the one element
   shared by all 42 sigils, and it is what makes them read as a single deck.

   Sigils are authored as bare SVG children on a 120x120 field, centred on
   (60, 60), stroked in currentColor. Every drawable element carries
   pathLength="1" so the reveal can draw them all in at the same rate
   regardless of their real length.
--------------------------------------------------------------------------- */

interface SigilProps {
  children: ReactNode
  /** Set once the card face is showing, to run the ink-drawing animation. */
  drawing?: boolean
  className?: string
}

export function Sigil({ children, drawing = false, className }: SigilProps) {
  return (
    <svg
      className={['sigil', drawing ? 'is-drawing' : '', className ?? ''].join(' ').trim()}
      viewBox="0 0 120 120"
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <g className="sigil-dial">
        <circle cx="60" cy="60" r="54" pathLength="1" />
        <path d="M60 2.5v6M117.5 60h-6M60 117.5v-6M2.5 60h6" pathLength="1" />
        <circle cx="21.8" cy="21.8" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="98.2" cy="21.8" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="98.2" cy="98.2" r="0.9" fill="currentColor" stroke="none" />
        <circle cx="21.8" cy="98.2" r="0.9" fill="currentColor" stroke="none" />
      </g>
      <g className="sigil-ink">{children}</g>
    </svg>
  )
}
