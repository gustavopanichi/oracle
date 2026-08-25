/* ---------------------------------------------------------------------------
   The reverse of every card. The frame is drawn in CSS so it always matches
   the front's plate exactly; the SVG carries only the medallion, on a square
   field, so it stays correct if the card's proportion ever changes again.
--------------------------------------------------------------------------- */

export function CardBack() {
  return (
    <div className="card-back">
      <div className="card-back-weave" />
      <div className="card-back-plate">
        <svg
          className="card-back-mark"
          viewBox="0 0 200 200"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="100" cy="100" r="72" opacity="0.35" />
          <circle cx="100" cy="100" r="58" opacity="0.85" />
          <rect
            x="59"
            y="59"
            width="82"
            height="82"
            transform="rotate(45 100 100)"
            opacity="0.75"
          />
          <circle cx="100" cy="100" r="34" opacity="0.5" />
          <path
            d="M100 24v-9M154 46l6-6M176 100h9M154 154l6 6M100 176v9M46 154l-6 6M24 100h-9M46 46l-6-6"
            opacity="0.6"
          />
          <path d="M100 78l14 22-14 22-14-22z" opacity="0.95" />
          <circle cx="100" cy="100" r="4.4" fill="currentColor" stroke="none" opacity="0.9" />
        </svg>

        <span className="card-back-pip card-back-pip--top" />
        <span className="card-back-pip card-back-pip--bottom" />
      </div>
      <div className="card-back-sheen" />
    </div>
  )
}
