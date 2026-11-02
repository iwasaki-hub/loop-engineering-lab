import { useEffect, useRef } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'
import { useAnimate } from 'motion/react-mini'

export default function AnimatedOutlet() {
  const { pathname, hash } = useLocation()
  const [scope, animate] = useAnimate()
  const reduced = useReducedMotion()
  const previousPath = useRef(pathname)
  const entered = useRef(false)
  useEffect(() => {
    if (entered.current && previousPath.current === pathname) return
    entered.current = true
    if (previousPath.current !== pathname && !hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      document.getElementById('main-content')?.focus({ preventScroll: true })
    }
    previousPath.current = pathname
    if (reduced) return
    const animation = animate(
      scope.current,
      { opacity: [0.8, 1], transform: ['translateY(8px)', 'translateY(0px)'] },
      { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
    )
    return () => {
      animation.stop()
      if (scope.current) {
        scope.current.style.opacity = '1'
        scope.current.style.transform = 'none'
      }
    }
  }, [pathname, hash, reduced, animate, scope])
  return (
    <m.div ref={scope} className="page-transition" initial={false}>
      <Outlet />
    </m.div>
  )
}
