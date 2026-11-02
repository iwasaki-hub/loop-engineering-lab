import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { config } from '@fortawesome/fontawesome-svg-core'
import {
  faArrowRight,
  faArrowUpRightFromSquare,
  faCheck,
  faCode,
  faTerminal,
  faArrowsRotate,
  faBars,
  faXmark,
  faRightToBracket,
  faRightFromBracket,
  faUserPlus,
  faUser,
  faEnvelope,
  faLock,
  faEye,
  faEyeSlash,
} from '@fortawesome/free-solid-svg-icons'
import '@fortawesome/fontawesome-svg-core/styles.css'
import './Icon.css'

// CSSはViteで管理し、実行時のstyleタグ挿入は行わない。
config.autoAddCss = false

const icons = {
  arrow: faArrowRight,
  diagonal: faArrowUpRightFromSquare,
  check: faCheck,
  code: faCode,
  terminal: faTerminal,
  loop: faArrowsRotate,
  menu: faBars,
  close: faXmark,
  login: faRightToBracket,
  logout: faRightFromBracket,
  signup: faUserPlus,
  user: faUser,
  email: faEnvelope,
  lock: faLock,
  eye: faEye,
  eyeOff: faEyeSlash,
}

export default function Icon({ name = 'arrow', size = 20, className = '' }) {
  return (
    <FontAwesomeIcon
      icon={icons[name] || icons.arrow}
      className={`ui-icon ${className}`}
      style={{ fontSize: size }}
      aria-hidden="true"
      focusable="false"
    />
  )
}
