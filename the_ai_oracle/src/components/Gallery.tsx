import { ALL_CARDS } from '../data/cards'
import { CardFace } from './CardFace'
import './card.css'

/**
 * Dev-only contact sheet of the whole deck, at /?gallery — the fastest way to
 * check that 42 sigils still read as one family after any of them is edited.
 */
export function Gallery() {
  return (
    <div
      style={{
        position: 'relative',
        zIndex: 2,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(var(--card-w), 1fr))',
        gap: '2rem',
        padding: '3rem',
      }}
    >
      {ALL_CARDS.map((card) => (
        <div key={card.id} className="card-slot" style={{ position: 'relative' }}>
          <div className="card-face" style={{ position: 'absolute', inset: 0 }}>
            <CardFace card={card} drawing />
          </div>
        </div>
      ))}
    </div>
  )
}
