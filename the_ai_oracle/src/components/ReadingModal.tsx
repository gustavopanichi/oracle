import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { DECKS } from '../data/cards'
import type { Reading } from '../lib/draw'
import { loadCombinations, combinationKey, type Combination } from '../lib/combinations'
import './modal.css'

interface ReadingModalProps {
  reading: Reading
  onClose: () => void
}

/**
 * The written reading for this particular combination.
 *
 * Portalled to the body so its fixed positioning and stacking never depend on
 * whatever transforms the stage happens to be running.
 */
export function ReadingModal({ reading, onClose }: ReadingModalProps) {
  const reduced = useReducedMotion()
  const [entry, setEntry] = useState<Combination | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    let live = true
    loadCombinations().then((table) => {
      if (live) setEntry(table[combinationKey(reading)] ?? null)
    })
    return () => {
      live = false
    }
  }, [reading])

  useEffect(() => {
    closeRef.current?.focus()

    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      // Small, self-contained focus trap — the panel holds two controls.
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>('button, [href]')
      if (!focusable?.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  return createPortal(
    <motion.div
      className="modal"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="modal-scrim" onClick={onClose} />

      <motion.div
        ref={panelRef}
        className="modal-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="reading-modal-title"
        initial={reduced ? { opacity: 0 } : { opacity: 0, y: 22, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={reduced ? { opacity: 0 } : { opacity: 0, y: 14, scale: 0.985 }}
        transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
      >
        <button ref={closeRef} type="button" className="modal-close" onClick={onClose} aria-label="Close">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>

        <p className="modal-eyebrow meta">Your reading</p>

        <h2 className="modal-formula" id="reading-modal-title">
          {DECKS.map((deck, i) => (
            <span key={deck.id} className="modal-formula-part">
              {i > 0 ? <em aria-hidden="true">×</em> : null}
              {reading[deck.id].title}
            </span>
          ))}
        </h2>

        <div className="modal-body">
          {entry ? (
            <>
              <p className="modal-interpretation">{entry.interpretation}</p>
              <p className="modal-example">
                <span className="modal-example-label">For example</span>
                {entry.example}
              </p>
            </>
          ) : (
            <p className="modal-loading">Reading the cards…</p>
          )}
        </div>
      </motion.div>
    </motion.div>,
    document.body,
  )
}
