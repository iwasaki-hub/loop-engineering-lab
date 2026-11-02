import { useDesign } from '../../hooks/useDesign'
import { designs, getNextDesign } from '../../context/designStore'
import Icon from '../ui/Icon'
import * as m from 'motion/react-m'
import { useReducedMotion } from 'motion/react'

export default function DesignToggle({ onNavigate }) {
  const { design, currentDesign, toggleDesign } = useDesign()
  const nextDesign = getNextDesign(design)
  const reduced = useReducedMotion()
  return (
    <m.button
      whileHover={reduced ? undefined : { y: -1 }}
      whileTap={reduced ? undefined : { scale: 0.96 }}
      type="button"
      className="design-toggle"
      aria-label={`デザイン：${currentDesign.label}。${designs[nextDesign].label}に切り替え`}
      title={currentDesign.description}
      onClick={() => {
        toggleDesign()
        onNavigate?.()
      }}
    >
      <Icon name="palette" size={14} />
      <span>{currentDesign.label}</span>
      <span
        className={`design-swatch swatch-${nextDesign}`}
        aria-hidden="true"
      />
    </m.button>
  )
}
