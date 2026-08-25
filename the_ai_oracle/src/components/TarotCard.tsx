import { useEffect, useRef, useState } from 'react'
import { motion, useTransform, useReducedMotion } from 'framer-motion'
import type { Card } from '../data/cards'
import { useTilt } from '../hooks/useTilt'
import { sound } from '../lib/sound'
import { CardBack } from './CardBack'
import { CardFace } from './CardFace'
import { RevealBurst } from './RevealBurst'
import './card.css'

export type CardPhase = 'stacked' | 'dealt'

interface TarotCardProps {
  card: Card | null
  /** 0, 1, 2 — drives deal order, deal direction and reveal pitch. */
  position: number
  phase: CardPhase
  revealed: boolean
  onReveal?: () => void
  /** Accessible prompt used while the card is still face down. */
  facedownLabel?: string
  className?: string
}

/** Where each card flies in from: the deck sits at the centre of the row. */
const DEAL_FROM = ['112%', '0%', '-112%']

export function TarotCard({
  card,
  position,
  phase,
  revealed,
  onReveal,
  facedownLabel,
  className,
}: TarotCardProps) {
  const reduced = useReducedMotion()
  const [flipping, setFlipping] = useState(false)
  const [burstKey, setBurstKey] = useState(0)
  const revealTimer = useRef<number | undefined>(undefined)

  const interactive = !revealed && phase === 'dealt' && Boolean(card) && Boolean(onReveal)
  const { rotateX, rotateY, offsetX, offsetY, onPointerMove, reset } = useTilt({
    max: 10,
    disabled: flipping,
  })

  // The cast shadow slides opposite the tilt and softens as the card lifts —
  // it is the cue that tells you the card is above the table, not printed on it.
  const shadowX = useTransform(offsetX, (v) => v * -34)
  const shadowY = useTransform(offsetY, (v) => v * -20 + 26)
  const glareX = useTransform(offsetX, (v) => v * 160)
  const glareY = useTransform(offsetY, (v) => v * 130)
  const glareOpacity = useTransform([offsetX, offsetY], ([x, y]: number[]) =>
    reduced ? 0 : Math.min(0.5, 0.14 + (Math.abs(x) + Math.abs(y)) * 0.55),
  )

  useEffect(() => () => window.clearTimeout(revealTimer.current), [])

  useEffect(() => {
    if (!revealed) setFlipping(false)
  }, [revealed])

  const handleReveal = () => {
    if (!interactive) return
    reset()
    setFlipping(true)
    setBurstKey((k) => k + 1)
    sound.unlock()
    sound.flip()
    onReveal?.()

    window.clearTimeout(revealTimer.current)
    revealTimer.current = window.setTimeout(() => {
      sound.reveal(position)
      setFlipping(false)
    }, reduced ? 90 : 430)
  }

  const flipTransition = reduced
    ? { duration: 0.2 }
    : {
        rotateY: { type: 'spring' as const, stiffness: 105, damping: 12.5, mass: 1.15, delay: 0.08 },
        z: { duration: 0.95, times: [0, 0.34, 1], ease: [0.22, 1, 0.36, 1] as const },
        y: { duration: 0.95, times: [0, 0.34, 1], ease: [0.22, 1, 0.36, 1] as const },
      }

  return (
    <div className={['card-slot', className ?? ''].join(' ').trim()}>
      <div className="card-float" style={{ animationDelay: `${position * -2.7}s` }}>
        <motion.div
          className={['card-scene', interactive ? 'is-interactive' : ''].join(' ').trim()}
          initial={false}
          animate={phase === 'dealt' ? 'dealt' : 'stacked'}
          variants={{
            stacked: {
              opacity: 0,
              x: DEAL_FROM[position] ?? '0%',
              y: 34,
              rotate: (position - 1) * 5,
              scale: 0.9,
              transition: { duration: 0.42, ease: [0.65, 0, 0.35, 1] },
            },
            dealt: {
              opacity: 1,
              x: '0%',
              y: 0,
              rotate: 0,
              scale: 1,
              transition: reduced
                ? { duration: 0.25 }
                : {
                    type: 'spring',
                    stiffness: 74,
                    damping: 15,
                    mass: 1.05,
                    delay: 0.16 + position * 0.17,
                  },
            },
          }}
          whileHover={interactive && !reduced ? { y: -14, scale: 1.03 } : undefined}
          onPointerMove={onPointerMove}
          onPointerLeave={reset}
          onClick={handleReveal}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault()
              handleReveal()
            }
          }}
          role={interactive ? 'button' : undefined}
          tabIndex={interactive ? 0 : undefined}
          aria-label={interactive ? facedownLabel : undefined}
        >
          <motion.div className="card-cast" style={{ x: shadowX, y: shadowY }} />

          <motion.div className="card-tilt" style={{ rotateX, rotateY }}>
            <motion.div
              className="card-flip"
              initial={false}
              animate={{
                rotateY: revealed ? 180 : 0,
                z: revealed && !reduced ? [0, 130, 0] : 0,
                y: revealed && !reduced ? [0, -26, 0] : 0,
              }}
              transition={flipTransition}
            >
              <div className="card-face card-face--back">
                <CardBack />
                <motion.div className="card-glare" style={{ x: glareX, y: glareY, opacity: glareOpacity }} />
              </div>

              <div className="card-face card-face--front">
                {card ? <CardFace card={card} drawing={revealed} /> : null}
                <motion.div className="card-glare" style={{ x: glareX, y: glareY, opacity: glareOpacity }} />
              </div>
            </motion.div>
          </motion.div>

          {revealed && burstKey > 0 ? <RevealBurst key={burstKey} /> : null}
        </motion.div>
      </div>
    </div>
  )
}
