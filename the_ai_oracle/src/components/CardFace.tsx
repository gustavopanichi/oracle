import { Sigil, SIGILS } from '../illustrations'
import { cardNumeral, DECK_BY_ID, type Card } from '../data/cards'
import { ARTWORK } from '../data/artwork'
import { SketchdeckMark } from './SketchdeckMark'

/* Titles step down through fixed sizes rather than being measured, so nothing
   reflows after paint and every card in the deck stays optically even. The
   title bar grows to fit, so these only need to keep long titles sensible. */
function titleScale(title: string): number {
  const n = title.length
  if (n <= 11) return 1
  if (n <= 16) return 0.92
  if (n <= 21) return 0.86
  return 0.78
}

interface CardFaceProps {
  card: Card
  /** True once this card is face-up, which starts the sigil drawing itself in. */
  drawing: boolean
}

/**
 * Numeral, category and mark across the head; the artwork in its own window;
 * the title on a bar beneath it. The card's one-line prompt is not printed on
 * the card — it sits under it on the table.
 */
export function CardFace({ card, drawing }: CardFaceProps) {
  const Art = SIGILS[card.id]
  const deck = DECK_BY_ID[card.deck]
  const artwork = ARTWORK[card.id]

  return (
    <div className="card-front" style={{ '--title-scale': titleScale(card.title) } as React.CSSProperties}>
      <div className="card-plate">
        <header className="card-head">
          <span className="card-numeral">{cardNumeral(card)}</span>
          <span className="card-category">{deck.label}</span>
          <span className="card-mark">
            <SketchdeckMark />
          </span>
        </header>

        <figure className={artwork ? 'card-window' : 'card-window card-window--empty'}>
          {artwork ? (
            /* Not lazy: only three cards are ever in the DOM, and they are
               mounted before the deal — so the artwork is decoded well before
               the card turns, instead of popping in mid-flip. */
            <img className="card-image" src={artwork} alt="" />
          ) : (
            <Sigil drawing={drawing}>{Art ? <Art /> : null}</Sigil>
          )}
        </figure>

        <footer className="card-title-bar">
          <h3 className="card-title">{card.title}</h3>
        </footer>
      </div>
    </div>
  )
}
