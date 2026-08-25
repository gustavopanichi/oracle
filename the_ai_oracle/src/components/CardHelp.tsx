import { useEffect, useId, useRef, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import type { Card } from '../data/cards'
import './help.css'

interface CardHelpProps {
  card: Card
}

/**
 * The help dot beside a card's prompt: what the card is really asking for, and
 * one concrete example.
 *
 * Opens on hover and on focus for pointer and keyboard, and toggles on click
 * so it is reachable on a touch screen, where hover never happens. Escape and
 * an outside tap close it.
 */
export function CardHelp({ card }: CardHelpProps) {
  const [open, setOpen] = useState(false)
  const [pinned, setPinned] = useState(false)
  const reduced = useReducedMotion()
  const id = useId()
  const wrapRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    if (!open) return

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
        setPinned(false)
      }
    }
    const onPointerDown = (event: PointerEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setPinned(false)
      }
    }

    window.addEventListener('keydown', onKey)
    window.addEventListener('pointerdown', onPointerDown)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('pointerdown', onPointerDown)
    }
  }, [open])

  return (
    <span className="help" ref={wrapRef}>
      <button
        type="button"
        className="help-dot"
        aria-label={`More about ${card.title}`}
        aria-expanded={open}
        aria-describedby={open ? id : undefined}
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setOpen(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === 'mouse' && !pinned) setOpen(false)
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          if (!pinned) setOpen(false)
        }}
        onClick={() => {
          setPinned((was) => !was)
          setOpen((was) => !was || !pinned)
        }}
      >
        <span aria-hidden="true">?</span>
      </button>

      <AnimatePresence>
        {open ? (
          <motion.span
            key="tip"
            id={id}
            role="tooltip"
            className="help-tip"
            initial={reduced ? { opacity: 0 } : { opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduced ? { opacity: 0 } : { opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="help-tip-title">{card.title}</span>
            <span className="help-tip-detail">{card.detail}</span>
            <span className="help-tip-example">
              <span className="help-tip-label">For example</span>
              {card.example}
            </span>
          </motion.span>
        ) : null}
      </AnimatePresence>
    </span>
  )
}
