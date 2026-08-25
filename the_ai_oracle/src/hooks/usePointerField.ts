import { useEffect } from 'react'
import { useMotionValue, useSpring, useReducedMotion, type MotionValue } from 'framer-motion'

export interface PointerField {
  /** -1 (left edge) to 1 (right edge), spring-smoothed. */
  x: MotionValue<number>
  /** -1 (top) to 1 (bottom), spring-smoothed. */
  y: MotionValue<number>
}

/**
 * A single spring-smoothed reading of where the pointer is in the viewport,
 * shared by every parallax layer so they all move off the same value.
 */
export function usePointerField(): PointerField {
  const rawX = useMotionValue(0)
  const rawY = useMotionValue(0)
  const reduced = useReducedMotion()

  const config = { stiffness: 42, damping: 20, mass: 1.1 }
  const x = useSpring(rawX, config)
  const y = useSpring(rawY, config)

  useEffect(() => {
    if (reduced) return
    const onMove = (event: PointerEvent) => {
      rawX.set((event.clientX / window.innerWidth) * 2 - 1)
      rawY.set((event.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    return () => window.removeEventListener('pointermove', onMove)
  }, [rawX, rawY, reduced])

  return { x, y }
}
