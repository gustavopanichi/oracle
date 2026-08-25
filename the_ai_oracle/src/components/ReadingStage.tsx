import { AnimatePresence, motion } from 'framer-motion'
import { DECKS, type DeckId } from '../data/cards'
import type { Reading } from '../lib/draw'
import { TarotCard } from './TarotCard'
import { CardHelp } from './CardHelp'
import { ShuffleDeck } from './ShuffleDeck'
import './stage.css'

interface ReadingStageProps {
  reading: Reading
  revealed: DeckId[]
  shuffling: boolean
  /** True once the deal has finished and the cards are lying on the table. */
  dealt: boolean
  onReveal: (deck: DeckId) => void
  onDrawAgain: () => void
}

export function ReadingStage({
  reading,
  revealed,
  shuffling,
  dealt,
  onReveal,
  onDrawAgain,
}: ReadingStageProps) {
  const complete = revealed.length === DECKS.length && !shuffling
  const cardPhase = shuffling ? 'stacked' : 'dealt'

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
            const isUp = revealed.includes(deck.id)

            return (
              <div className="column" key={deck.id}>
                <TarotCard
                  card={card}
                  position={i}
                  phase={cardPhase}
                  revealed={isUp}
                  onReveal={() => onReveal(deck.id)}
                  facedownLabel={`Turn your ${deck.label.toLowerCase()}. ${deck.question}`}
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
                          key={isUp ? card.id : 'question'}
                          className="column-line-text"
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{
                            duration: 0.42,
                            /* On the first showing, wait for the last card to
                               land before the questions arrive. */
                            delay: isUp ? 0 : 0.3 + i * 0.09,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                        >
                          {isUp ? card.prompt : deck.question}
                          {isUp ? <CardHelp card={card} /> : null}
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
                <span>{reading.focus.title}</span>
                <em aria-hidden="true">×</em>
                <span>{reading.goal.title}</span>
                <em aria-hidden="true">×</em>
                <span>{reading.twist.title}</span>
              </p>

              <div className="summary-actions">
                <button type="button" className="btn" onClick={onDrawAgain}>
                  Draw again
                </button>
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </div>
    </section>
  )
}
