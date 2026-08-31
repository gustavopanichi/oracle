import { motion, useSpring, useTransform, useReducedMotion } from 'framer-motion'
import type { PointerField } from '../hooks/usePointerField'
import { Logo } from './Logo'
import nebula from '../assets/landing-nebula.jpg'
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
  /* The sky itself never moves — it has to stay full bleed. What follows the
     pointer is the smudge: a soft window onto a warped copy of the same plate.
     A second spring on top of the shared one makes it lag behind the cursor,
     which is what sells it as smearing rather than as a spotlight. */
  const dragX = useSpring(pointer.x, { stiffness: 38, damping: 26, mass: 1.3 })
  const dragY = useSpring(pointer.y, { stiffness: 38, damping: 26, mass: 1.3 })
  const smudgeX = useTransform(dragX, (v) => `${50 + v * 52}%`)
  const smudgeY = useTransform(dragY, (v) => `${50 + v * 52}%`)

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
      <div className="landing-sky" aria-hidden="true">
        <div className="landing-sky-inner">
          {/* Two passes of the same plate: one drifting, one counter-drifting
              and screened over it. Where the two sets of filaments cross, the
              light swells and fades — which is what makes it read as alive
              rather than as a photograph being panned. */}
          <img className="landing-sky-plate" src={nebula} alt="" />
          <img className="landing-sky-glow" src={nebula} alt="" />
        </div>

        {reduced ? null : (
          <motion.div
            className="landing-sky-smudge"
            style={{ ['--mx' as string]: smudgeX, ['--my' as string]: smudgeY }}
          >
            <img src={nebula} alt="" />
          </motion.div>
        )}

        <div className="landing-sky-scrim" />
      </div>

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
        <Logo className="landing-logo" />
      </motion.h1>

      <motion.div variants={rise} className="landing-action">
        <button type="button" className="btn btn--primary" onClick={onBegin}>
          Draw the cards
        </button>
      </motion.div>
    </motion.section>
  )
}
