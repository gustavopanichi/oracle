import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

/**
 * The small discharge when a card turns face-up: a ring of light leaving the
 * card edge, and a scatter of motes thrown off the sigil.
 */
export function RevealBurst() {
  const reduced = useReducedMotion()

  const motes = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => {
        const angle = (i / 18) * Math.PI * 2 + Math.random() * 0.35
        const distance = 60 + Math.random() * 120
        return {
          x: Math.cos(angle) * distance,
          y: Math.sin(angle) * distance * 0.9,
          size: 1.5 + Math.random() * 2.5,
          delay: Math.random() * 0.12,
          duration: 0.9 + Math.random() * 0.7,
        }
      }),
    [],
  )

  if (reduced) return null

  return (
    <div className="burst" aria-hidden="true">
      <motion.span
        className="burst-ring"
        initial={{ scale: 0.55, opacity: 0.85 }}
        animate={{ scale: 1.5, opacity: 0 }}
        transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
      />
      <motion.span
        className="burst-glow"
        initial={{ opacity: 0.55, scale: 0.8 }}
        animate={{ opacity: 0, scale: 1.25 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      />
      {motes.map((m, i) => (
        <motion.span
          key={i}
          className="burst-mote"
          style={{ width: m.size, height: m.size }}
          initial={{ x: 0, y: 0, opacity: 0 }}
          animate={{ x: m.x, y: m.y, opacity: [0, 1, 0] }}
          transition={{ duration: m.duration, delay: m.delay, ease: [0.16, 1, 0.3, 1] }}
        />
      ))}
    </div>
  )
}
