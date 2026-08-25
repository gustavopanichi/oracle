import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import type { DeckId } from './data/cards'
import { drawReading, emptyMemory, type Reading } from './lib/draw'
import { sound } from './lib/sound'
import { usePointerField } from './hooks/usePointerField'
import { Atmosphere } from './components/Atmosphere'
import { Frame } from './components/Frame'
import { Landing } from './components/Landing'
import { ReadingStage } from './components/ReadingStage'
import { SoundToggle } from './components/SoundToggle'
import { Gallery } from './components/Gallery'
import './components/chrome.css'

type Stage = 'landing' | 'shuffling' | 'drawing'

/* Beats of the opening sequence, in ms from the click on BEGIN. The landing
   takes 700ms to dissolve, so the deck is not on the table before then. */
const OPENING = { shuffleSound: 720, deal: 1900 }
const REDRAW = { flipBack: 520, shuffle: 560, deal: 1780 }

const SHOW_GALLERY =
  import.meta.env.DEV && typeof window !== 'undefined' && window.location.search.includes('gallery')

export default function App() {
  const pointer = usePointerField()

  const [stage, setStage] = useState<Stage>('landing')
  const [memory, setMemory] = useState(emptyMemory)
  const [reading, setReading] = useState<Reading | null>(null)
  const [revealed, setRevealed] = useState<DeckId[]>([])

  const timers = useRef<number[]>([])
  const after = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])
  const clearTimers = useCallback(() => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
  }, [])

  useEffect(() => clearTimers, [clearTimers])

  const begin = useCallback(() => {
    clearTimers()
    sound.unlock()

    const drawn = drawReading(memory, null)
    setReading(drawn.reading)
    setMemory(drawn.memory)
    setRevealed([])
    setStage('shuffling')

    after(OPENING.shuffleSound, () => sound.shuffle())
    after(OPENING.deal, () => {
      setStage('drawing')
      sound.deal()
    })
  }, [after, clearTimers, memory])

  // Functional update: two cards turned in the same tick must both land.
  const reveal = useCallback((deck: DeckId) => {
    setRevealed((prev) => (prev.includes(deck) ? prev : [...prev, deck]))
  }, [])

  // The closing chord belongs to the state, not to the click that caused it —
  // an effect keeps it from firing twice and cleans up if the reader redraws.
  useEffect(() => {
    if (revealed.length !== 3 || stage !== 'drawing') return
    const timer = window.setTimeout(() => sound.resolve(), 1500)
    return () => window.clearTimeout(timer)
  }, [revealed.length, stage])

  const drawAgain = useCallback(() => {
    if (stage !== 'drawing') return
    clearTimers()

    // The three on the table turn face-down first, then gather to the centre.
    const previous = reading
    setRevealed([])

    after(REDRAW.flipBack, () => setStage('shuffling'))
    after(REDRAW.shuffle, () => sound.shuffle())
    after(REDRAW.deal, () => {
      const drawn = drawReading(memory, previous)
      setReading(drawn.reading)
      setMemory(drawn.memory)
      setStage('drawing')
      sound.deal()
    })
  }, [after, clearTimers, memory, reading, stage])

  const restart = useCallback(() => {
    clearTimers()
    setStage('landing')
    setRevealed([])
  }, [clearTimers])

  const complete = revealed.length === 3 && stage === 'drawing'
  const intensity = stage === 'landing' ? 0 : complete ? 1 : 0.55

  if (SHOW_GALLERY) {
    return (
      <div className="app">
        <Gallery />
        <div className="grain" />
      </div>
    )
  }

  return (
    <div className="app">
      <Atmosphere pointer={pointer} intensity={intensity} />

      <header className="chrome">
        <div className="chrome-slot">
          {stage === 'landing' ? null : (
            <button
              type="button"
              className="chrome-wordmark"
              onClick={restart}
              aria-label="Return to the start"
            >
              The AI Oracle
            </button>
          )}
        </div>

        <div className="chrome-slot chrome-slot--end">
          <SoundToggle />
        </div>
      </header>

      <AnimatePresence mode="wait">
        {stage === 'landing' || !reading ? (
          <Landing key="landing" pointer={pointer} onBegin={begin} />
        ) : (
          <motion.div
            key="stage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <ReadingStage
              reading={reading}
              revealed={revealed}
              shuffling={stage === 'shuffling'}
              dealt={stage === 'drawing'}
              onReveal={reveal}
              onDrawAgain={drawAgain}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="vignette" />
      <div className="grain" />
      <Frame />
    </div>
  )
}
