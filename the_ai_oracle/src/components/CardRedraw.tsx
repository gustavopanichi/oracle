interface CardRedrawProps {
  /** The position's label, for the accessible name: "your focus". */
  label: string
  /** True while any card on the table is mid-redraw. */
  busy: boolean
  onRedraw: () => void
}

/**
 * Replaces one card without disturbing the other two. Sits beside the help dot
 * on the card's prompt line, and only once the whole reading is on the table —
 * during the draw itself the only thing to do is turn cards.
 */
export function CardRedraw({ label, busy, onRedraw }: CardRedrawProps) {
  const name = `Draw a different ${label.toLowerCase()} card`

  return (
    <button
      type="button"
      className="redraw-dot"
      onClick={onRedraw}
      disabled={busy}
      aria-label={name}
      title={name}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M20.5 12a8.5 8.5 0 1 1-2.46-6" />
        <path d="M20.5 3.5V8h-4.5" />
      </svg>
    </button>
  )
}
