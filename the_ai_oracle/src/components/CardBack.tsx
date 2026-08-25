import cardBack from '../assets/card-back.jpg'

/* ---------------------------------------------------------------------------
   The reverse of every card. One printed image, shown on all three.

   The artwork is slightly wider than the card, so cover trims a little off each
   side — it is symmetrical about the centre, so that costs nothing. Its own
   rounded corners sit inside the card's larger radius and are clipped away, so
   there is no double-rounded rim.
--------------------------------------------------------------------------- */

export function CardBack() {
  return (
    <div className="card-back">
      <img className="card-back-art" src={cardBack} alt="" />
      <div className="card-back-sheen" />
    </div>
  )
}
