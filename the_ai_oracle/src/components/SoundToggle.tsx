import { useState } from 'react'
import { sound } from '../lib/sound'
import './chrome.css'

export function SoundToggle() {
  const [on, setOn] = useState(() => sound.enabled)

  const toggle = () => {
    const next = !on
    sound.setEnabled(next)
    setOn(next)
  }

  return (
    <button
      type="button"
      className="sound-toggle"
      onClick={toggle}
      aria-pressed={on}
      aria-label={on ? 'Turn sound off' : 'Turn sound on'}
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" aria-hidden="true">
        <path d="M6 15V9h3l4.5-3.6v13.2L9 15z" />
        {on ? (
          <>
            <path d="M17 9.4a4 4 0 0 1 0 5.2" opacity="0.9" />
            <path d="M19.6 7a7.4 7.4 0 0 1 0 10" opacity="0.5" />
          </>
        ) : (
          <path d="M17 10l5 4M22 10l-5 4" opacity="0.75" />
        )}
      </svg>
      <span className="sound-toggle-label">{on ? 'Sound on' : 'Sound off'}</span>
    </button>
  )
}
