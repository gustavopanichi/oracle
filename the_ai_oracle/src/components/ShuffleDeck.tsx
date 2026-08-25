import { motion, useReducedMotion } from 'framer-motion'
import { CardBack } from './CardBack'
import './shuffle.css'

const SPRITES = 7

/**
 * The deck riffling between readings. Half the stack lifts and fans right,
 * the other half fans left, and they interleave back down — the physical
 * gesture that tells you the next three cards are genuinely new ones.
 */
export function ShuffleDeck() {
  const reduced = useReducedMotion()

  return (
    <div className="shuffle" aria-hidden="true">
      {Array.from({ length: SPRITES }, (_, i) => {
        const half = i % 2 === 0 ? 1 : -1
        const depth = i - (SPRITES - 1) / 2

        return (
          <motion.div
            key={i}
            className="shuffle-card"
            initial={{ x: 0, y: depth * 1.5, rotate: depth * 0.8, opacity: 0 }}
            animate={
              reduced
                ? { opacity: 1, x: 0, y: depth * 1.5, rotate: depth * 0.8 }
                : {
                    opacity: [0, 1, 1, 1, 1],
                    x: [0, half * (34 + i * 5), half * (16 + i * 3), 0, 0],
                    y: [depth * 1.5, -depth * 4 - 8, depth * 2, depth * 1.5, depth * 1.5],
                    rotate: [depth * 0.8, half * (7 + i * 1.4), half * 3, depth * 0.8, depth * 0.8],
                  }
            }
            transition={
              reduced
                ? { duration: 0.2 }
                : {
                    duration: 1.15,
                    times: [0, 0.22, 0.52, 0.78, 1],
                    ease: [0.33, 1, 0.4, 1],
                    delay: i * 0.028,
                  }
            }
          >
            <CardBack />
          </motion.div>
        )
      })}
    </div>
  )
}
