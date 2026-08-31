import { Sigil, SIGILS } from '../illustrations'
import { cardLede, cardNumeral, DECK_BY_ID, type Card } from '../data/cards'
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
  /** Pointer is over the card: the window turns to show what it is asking for. */
  peeking?: boolean
}

/**
 * Numeral, category and mark across the head; the artwork in its own window;
 * the title on a bar beneath it. The card's one-line prompt is not printed on
 * the card — it sits under it on the table.
 */
export function CardFace({ card, drawing, peeking = false }: CardFaceProps) {
  const Art = SIGILS[card.id]
  const deck = DECK_BY_ID[card.deck]
  const artwork = ARTWORK[card.id]
  const lede = cardLede(card)

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

        {/* The window turns on its own axis, inside the card. The artwork is
            on one side and what the card is asking for is on the other. */}
        <figure className={['card-window', peeking ? 'is-peeking' : ''].join(' ').trim()}>
          <div className="card-window-turn">
            <div
              className={[
                'card-window-face',
                'card-window-face--art',
                artwork ? '' : 'card-window--empty',
              ].join(' ').trim()}
            >
              {artwork ? (
                /* Not lazy: only three cards are ever in the DOM, and they are
                   mounted before the deal — so the artwork is decoded well
                   before the card turns, instead of popping in mid-flip. */
                <img className="card-image" src={artwork} alt="" />
              ) : (
                <Sigil drawing={drawing}>{Art ? <Art /> : null}</Sigil>
              )}
            </div>

            <div className="card-window-face card-window-face--read">
              {/* The prompt opens the paragraph rather than heading it — one
                  block of prose, not a title and a body. */}
              <p className="card-read-detail">
                {lede ? `${lede} ` : ''}
                {card.detail}
              </p>
              <p className="card-read-example">
                <span className="card-read-label">For example</span>
                {card.example}
              </p>
            </div>
          </div>
        </figure>

        <footer className="card-title-bar">
          <h3 className="card-title">{card.title}</h3>
        </footer>
      </div>
    </div>
  )
}
