import { motion, useReducedMotion } from 'framer-motion'
import { cardLede, type Card } from '../data/cards'

interface CardTooltipProps {
  card: Card
}

/**
 * What a card is asking for, opened by hovering the card itself.
 *
 * The one-line prompt that used to sit under the card is the lede here — but
 * only where it earns its place: on the twelve cards whose detail opens by
 * restating it, `cardLede` returns null and the detail speaks alone.
 */
export function CardTooltip({ card }: CardTooltipProps) {
  const reduced = useReducedMotion()
  const lede = cardLede(card)

  return (
    <motion.div
      className="card-tip"
      role="tooltip"
      initial={reduced ? { opacity: 0 } : { opacity: 0, y: -8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={reduced ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.99 }}
      transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
    >
      <p className="card-tip-title">{card.title}</p>
      {lede ? <p className="card-tip-lede">{lede}</p> : null}
      <p className="card-tip-detail">{card.detail}</p>
      <p className="card-tip-example">
        <span className="card-tip-label">For example</span>
        {card.example}
      </p>
    </motion.div>
  )
}
