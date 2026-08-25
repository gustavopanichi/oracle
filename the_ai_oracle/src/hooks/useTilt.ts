import { useCallback } from 'react'
import { useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

interface TiltOptions {
  /** Maximum rotation in degrees at the edge of the element. */
  max?: number
  /** Turn the whole thing off (e.g. while a card is mid-flip). */
  disabled?: boolean
}

/**
 * Pointer-driven 3D tilt for a single element.
 *
 * Returns the raw normalised offsets alongside the rotations, so callers can
 * drive a moving specular highlight off the same value the geometry uses —
 * which is what sells the card as a physical object rather than a div.
 */
export function useTilt({ max = 9, disabled = false }: TiltOptions = {}) {
  const reduced = useReducedMotion()
  const off = reduced || disabled

  const px = useMotionValue(0)
  const py = useMotionValue(0)

  const config = { stiffness: 220, damping: 20, mass: 0.55 }
  const sx = useSpring(px, config)
  const sy = useSpring(py, config)

  const rotateX = useTransform(sy, (v) => (off ? 0 : -v * max))
  const rotateY = useTransform(sx, (v) => (off ? 0 : v * max))

  const onPointerMove = useCallback(
    (event: React.PointerEvent<HTMLElement>) => {
      if (off) return
      const rect = event.currentTarget.getBoundingClientRect()
      px.set((event.clientX - rect.left) / rect.width - 0.5)
      py.set((event.clientY - rect.top) / rect.height - 0.5)
    },
    [off, px, py],
  )

  const reset = useCallback(() => {
    px.set(0)
    py.set(0)
  }, [px, py])

  return { rotateX, rotateY, offsetX: sx, offsetY: sy, onPointerMove, reset }
}
