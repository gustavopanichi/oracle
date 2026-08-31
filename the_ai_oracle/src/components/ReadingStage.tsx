import { Fragment, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { DECKS, type DeckId } from '../data/cards'
import type { Reading } from '../lib/draw'
import { TarotCard } from './TarotCard'
import { ReadingModal } from './ReadingModal'
import { ShuffleDeck } from './ShuffleDeck'
import './stage.css'

interface ReadingStageProps {
  reading: Reading
  revealed: DeckId[]
  shuffling: boolean
  /** True once the deal has finished and the cards are lying on the table. */
  dealt: boolean
  /** The one position currently being replaced, if any. */
  redrawing: DeckId | null
  onReveal: (deck: DeckId) => void
  onRedraw: (deck: DeckId) => void
  onDrawAgain: () => void
}

export function ReadingStage({
  reading,
  revealed,
  shuffling,
  dealt,
  redrawing,
  onReveal,
  onRedraw,
  onDrawAgain,
}: ReadingStageProps) {
  const [interpreting, setInterpreting] = useState(false)
  const complete = revealed.length === DECKS.length && !shuffling
  const cardPhase = shuffling ? 'stacked' : 'dealt'

  // Nothing should be left explaining a reading that is no longer on the table.
  if (interpreting && !complete) setInterpreting(false)

  return (
    <section className={['stage', complete ? 'is-complete' : ''].join(' ').trim()}>
      <div className={['table', complete ? 'is-converged' : ''].join(' ').trim()}>
        <AnimatePresence>
          {shuffling ? (
            <motion.div
              key="deck"
              className="table-deck"
              initial={{ opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.28 } }}
            >
              <ShuffleDeck />
            </motion.div>
          ) : null}
        </AnimatePresence>

        <div className="table-row">
          {DECKS.map((deck, i) => {
            const card = reading[deck.id]
            const pending = redrawing === deck.id
            const turned = revealed.includes(deck.id)
            // Face-down for the moment it takes to swap, but still "revealed"
            // as far as the layout is concerned — otherwise the spread would
            // expand and snap back around a single card.
            const isUp = turned && !pending

            return (
              <div className="column" key={deck.id}>
                <TarotCard
                  card={card}
                  position={i}
                  phase={cardPhase}
                  revealed={isUp}
                  onReveal={() => onReveal(deck.id)}
                  onRedraw={complete && !redrawing ? () => onRedraw(deck.id) : undefined}
                  facedownLabel={`Turn your ${deck.label.toLowerCase()}. ${deck.question}`}
                  faceupLabel={`${card.title}. ${card.prompt} Click to draw a different ${deck.label.toLowerCase()} card.`}
                />

                {/* The category is printed on the card itself, so all that
                    sits under it is one line: the question guides the choice
                    while the card is face down, and the card's own prompt takes
                    over once it has been turned. Reserved height, so nothing
                    shifts as they swap. */}
                <div className="column-label">
                  <div className="column-line">
                    <AnimatePresence mode="wait">
                      {dealt ? (
                        <motion.p
                          /* Keyed on the card, not on whether it is currently
                             face-up: through a redraw the line holds the old
                             prompt and crossfades when the new card is swapped
                             in, which lands as the card turns back over. A
                             placeholder here only ever flashed. */
                          key={turned ? card.id : 'question'}
                          className="column-line-text"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{
                            duration: 0.42,
                            /* On the first showing, wait for the last card to
                               land before the questions arrive. */
                            delay: turned ? 0 : 0.3 + i * 0.09,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {turned ? card.prompt : deck.question}
                        </motion.p>
                      ) : null}
                    </AnimatePresence>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="stage-foot">
        <AnimatePresence>
          {complete ? (
            <motion.div
              key="summary"
              className="summary"
              initial={{ opacity: 0, y: 22 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 14, transition: { duration: 0.3 } }}
              transition={{ duration: 0.75, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              <p className="summary-eyebrow meta">Your reading</p>

              <p className="summary-formula">
                {DECKS.map((deck, i) => (
                  <Fragment key={deck.id}>
                    {i > 0 ? <em aria-hidden="true">×</em> : null}
                    <span className={redrawing === deck.id ? 'is-pending' : undefined}>
                      {reading[deck.id].title}
                    </span>
                  </Fragment>
                ))}
              </p>


              <div className="summary-actions">
                <button type="button" className="btn btn--solid" onClick={() => setInterpreting(true)}>
                  Interpret it for me
                </button>
                <button type="button" className="btn" onClick={onDrawAgain}>
                  Draw again
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {interpreting && complete ? (
          <ReadingModal reading={reading} onClose={() => setInterpreting(false)} />
        ) : null}
      </AnimatePresence>
    </section>
  )
}
