import { useEffect } from 'react'
import * as m from 'motion/react-m'
import { useInView, useReducedMotion } from 'motion/react'
import { useAnimate } from 'motion/react-mini'

const elements = {
  section: m.section,
  article: m.article,
  figure: m.figure,
  div: m.div,
}

export default function Reveal({
  as = 'section',
  children,
  delay = 0,
  lift = false,
  ...props
}) {
  const [scope, animate] = useAnimate()
  const inView = useInView(scope, { once: true, amount: 0.12 })
  const reduced = useReducedMotion()
  const Element = elements[as] || elements.section
  useEffect(() => {
    if (!inView || reduced) return
    const animation = animate(
      scope.current,
      {
        opacity: [0.65, 1],
        transform: ['translateY(16px)', 'translateY(0px)'],
      },
      { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
    )
    return () => {
      animation.stop()
      if (scope.current) {
        scope.current.style.opacity = '1'
        scope.current.style.transform = 'none'
      }
    }
  }, [inView, reduced, animate, scope, delay])
  // 初期状態では隠さず、SSRや動きを減らす設定でも本文を読めるようにする。
  return (
    <Element
      {...props}
      ref={scope}
      initial={false}
      whileHover={lift && !reduced ? { y: -5 } : undefined}
    >
      {children}
    </Element>
  )
}
