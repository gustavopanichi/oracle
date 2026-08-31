import { useEffect, useState } from 'react'

/**
 * Whether this device has a pointer that can hover.
 *
 * The stage's hints have to tell the truth: on a touch screen there is no
 * hover, so the card's window never turns and only the tap hint applies.
 */
export function useHasHover(): boolean {
  const query = '(hover: hover)'
  const [hasHover, setHasHover] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches,
  )

  useEffect(() => {
    const mq = window.matchMedia(query)
    const update = () => setHasHover(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return hasHover
}
