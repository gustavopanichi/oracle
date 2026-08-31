import { motion, useTransform, useReducedMotion } from 'framer-motion'
import type { PointerField } from '../hooks/usePointerField'
import './landing.css'

interface LandingProps {
  pointer: PointerField
  onBegin: () => void
}

const rise = {
  hidden: { opacity: 0, y: 26, filter: 'blur(7px)' },
  shown: { opacity: 1, y: 0, filter: 'blur(0px)' },
}

export function Landing({ pointer, onBegin }: LandingProps) {
  const reduced = useReducedMotion()
  const titleX = useTransform(pointer.x, (v) => (reduced ? 0 : v * 16))
  const titleY = useTransform(pointer.y, (v) => (reduced ? 0 : v * 9))
  const markX = useTransform(pointer.x, (v) => (reduced ? 0 : v * 34))
  const markY = useTransform(pointer.y, (v) => (reduced ? 0 : v * 20))

  return (
    <motion.section
      className="landing"
      initial="hidden"
      animate="shown"
      exit={{
        opacity: 0,
        filter: 'blur(10px)',
        scale: 1.06,
        transition: { duration: 0.7, ease: [0.65, 0, 0.35, 1] },
      }}
      transition={{ staggerChildren: 0.13, delayChildren: 0.15 }}
    >
      <motion.div className="landing-mark" variants={rise} style={{ x: markX, y: markY }}>
        <svg viewBox="0 0 120 60" fill="none" stroke="currentColor" strokeWidth="1" aria-hidden="true">
          <path d="M4 40h34" opacity="0.5" />
          <path d="M82 40h34" opacity="0.5" />
          <circle className="landing-mark-ring" cx="60" cy="34" r="19" opacity="0.5" />
          <circle cx="60" cy="34" r="11" opacity="0.8" />
          <path d="M60 24l7 10-7 10-7-10z" />
          <circle cx="60" cy="34" r="2" fill="currentColor" stroke="none" />
        </svg>
      </motion.div>

      <motion.h1 className="landing-title" variants={rise} style={{ x: titleX, y: titleY }}>
        The Deck
      </motion.h1>

      <motion.div variants={rise} className="landing-action">
        <button type="button" className="btn btn--primary" onClick={onBegin}>
          Draw the cards
        </button>
      </motion.div>
    </motion.section>
  )
}
