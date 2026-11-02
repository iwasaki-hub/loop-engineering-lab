import { LazyMotion, MotionConfig } from 'motion/react'
import './motion.css'

const loadFeatures = () => import('./features').then((module) => module.default)

export default function UiMotionProvider({ children }) {
  return (
    <MotionConfig
      reducedMotion="user"
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
    >
      <LazyMotion features={loadFeatures} strict>
        {children}
      </LazyMotion>
    </MotionConfig>
  )
}
