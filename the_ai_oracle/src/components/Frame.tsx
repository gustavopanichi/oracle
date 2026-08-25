/**
 * A hairline border held off the viewport edge on every screen size, the way a
 * card is bordered. Purely decorative, so it stays out of the accessibility
 * tree and never takes a pointer event.
 */
export function Frame() {
  return (
    <div className="frame" aria-hidden="true">
      <span className="frame-corner frame-corner--tl" />
      <span className="frame-corner frame-corner--tr" />
      <span className="frame-corner frame-corner--br" />
      <span className="frame-corner frame-corner--bl" />
    </div>
  )
}
