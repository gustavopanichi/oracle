import { useMemo } from 'react'
import { motion, useTransform, useReducedMotion } from 'framer-motion'
import type { PointerField } from '../hooks/usePointerField'
import './atmosphere.css'

interface Mote {
  left: number
  size: number
  delay: number
  duration: number
  drift: number
  opacity: number
}

function buildMotes(count: number): Mote[] {
  return Array.from({ length: count }, () => ({
    left: Math.random() * 100,
    size: 1 + Math.random() * 1.8,
    delay: -Math.random() * 34,
    duration: 30 + Math.random() * 34,
    drift: (Math.random() - 0.5) * 80,
    opacity: 0.1 + Math.random() * 0.32,
  }))
}

interface AtmosphereProps {
  pointer: PointerField
  /** Rises as the experience gets more charged: landing → drawing → read. */
  intensity?: number
}

/**
 * The table the reading happens on: midnight silk, its weave, its folds, and
 * the sheen that moves across it. The symbols sit *in* the cloth rather than
 * floating over it — they read as printed on the fabric, not as scenery.
 */
export function Atmosphere({ pointer, intensity = 0 }: AtmosphereProps) {
  const reduced = useReducedMotion()
  const motes = useMemo(() => buildMotes(reduced ? 10 : 26), [reduced])

  const farX = useTransform(pointer.x, (v) => v * -10)
  const farY = useTransform(pointer.y, (v) => v * -7)
  const midX = useTransform(pointer.x, (v) => v * -22)
  const midY = useTransform(pointer.y, (v) => v * -14)
  const sheenX = useTransform(pointer.x, (v) => v * -70)
  const sheenY = useTransform(pointer.y, (v) => v * -40)

  return (
    <div className="atmos" aria-hidden="true" style={{ '--intensity': intensity } as React.CSSProperties}>
      <div className="cloth" />
      <div className="cloth-folds" />
      <motion.div className="cloth-sheen" style={{ x: sheenX, y: sheenY }} />
      <div className="cloth-weave" />

      <motion.svg
        className="atmos-glyphs atmos-glyphs--far"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        style={{ x: farX, y: farY }}
        fill="none"
        stroke="currentColor"
        strokeWidth="0.8"
      >
        <circle cx="180" cy="150" r="118" />
        <circle cx="180" cy="150" r="74" opacity="0.6" />
        <path d="M820 520l86 150H734z" />
        <rect x="742" y="86" width="132" height="132" transform="rotate(22 808 152)" opacity="0.7" />
        <path d="M60 560h180M150 470v180" opacity="0.5" />
      </motion.svg>

      <motion.svg
        className="atmos-glyphs atmos-glyphs--near"
        viewBox="0 0 1000 700"
        preserveAspectRatio="xMidYMid slice"
        style={{ x: midX, y: midY }}
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
      >
        <circle className="atmos-orbit" cx="500" cy="350" r="300" strokeDasharray="2 26" />
        <circle cx="920" cy="330" r="42" />
        <path d="M96 250l52 90-52 90-52-90z" opacity="0.8" />
      </motion.svg>

      <motion.div className="atmos-motes" style={{ x: midX, y: midY }}>
        {motes.map((m, i) => (
          <span
            key={i}
            className="mote"
            style={
              {
                left: `${m.left}%`,
                width: `${m.size}px`,
                height: `${m.size}px`,
                opacity: m.opacity,
                animationDelay: `${m.delay}s`,
                animationDuration: `${m.duration}s`,
                '--drift': `${m.drift}px`,
              } as React.CSSProperties
            }
          />
        ))}
      </motion.div>
    </div>
  )
}
