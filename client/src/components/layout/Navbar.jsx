import { NavLink } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../ui/Icon'

export default function Navbar({ menuOpen, onNavigate }) {
  const { status } = useAuth()
  return (
    <nav
      id="main-nav"
      className={`main-nav ${menuOpen ? 'is-open' : ''}`}
      aria-label="メインナビゲーション"
    >
      <a href="/#approach" onClick={onNavigate}>
        AIとつくる
      </a>
      <a href="/#workflow" onClick={onNavigate}>
        開発の流れ
      </a>
      <a href="/#guide" onClick={onNavigate}>
        はじめかた
      </a>
      {status !== 'authenticated' && (
        <>
          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? 'nav-login is-active' : 'nav-login'
            }
            onClick={onNavigate}
          >
            <Icon name="login" size={14} /> ログイン
          </NavLink>
          <NavLink
            to="/signup"
            className={({ isActive }) =>
              isActive ? 'nav-login is-active' : 'nav-login'
            }
            onClick={onNavigate}
          >
            <Icon name="signup" size={14} /> 新規登録
          </NavLink>
        </>
      )}
    </nav>
  )
}
