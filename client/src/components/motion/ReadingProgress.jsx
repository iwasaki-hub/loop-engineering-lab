import * as m from 'motion/react-m'
import { useReducedMotion, useScroll, useSpring } from 'motion/react'

export default function ReadingProgress() {
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 32 })
  const reduced = useReducedMotion()
  if (reduced) return null
  return (
    <m.div
      className="reading-progress"
      style={{ scaleX: progress }}
      aria-hidden="true"
    />
  )
}
