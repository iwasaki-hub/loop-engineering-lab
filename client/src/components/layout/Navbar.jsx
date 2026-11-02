import { useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../ui/Icon'
import AccountDropdown from './AccountDropdown'
import './navbar.css'

const sections = [
  { hash: '#approach', label: 'AIとつくる' },
  { hash: '#workflow', label: '開発の流れ' },
  { hash: '#guide', label: 'はじめかた' },
]

export default function Navbar({ menuOpen, onNavigate }) {
  const { status } = useAuth()
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (pathname === '/' && hash)
      document.getElementById(hash.slice(1))?.scrollIntoView({ block: 'start' })
  }, [pathname, hash])

  return (
    <nav
      id="main-nav"
      className={`main-nav ${menuOpen ? 'is-open' : ''}`}
      aria-label="メインナビゲーション"
    >
      {sections.map((section) => {
        const active = pathname === '/' && hash === section.hash
        return (
          <Link
            key={section.hash}
            to={`/${section.hash}`}
            className={`nav-item ${active ? 'is-active' : ''}`}
            aria-current={active ? 'location' : undefined}
            onClick={onNavigate}
          >
            {section.label}
          </Link>
        )
      })}
      <NavLink
        to="/case-studies"
        className={({ isActive }) => `nav-item ${isActive ? 'is-active' : ''}`}
        onClick={onNavigate}
      >
        開発事例
      </NavLink>
      {status !== 'authenticated' ? (
        <AccountDropdown
          key={`${pathname}:${menuOpen}`}
          onNavigate={onNavigate}
        />
      ) : (
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            `nav-item ${isActive ? 'is-active' : ''}`
          }
          onClick={onNavigate}
        >
          <Icon name="user" size={14} /> マイページ
        </NavLink>
      )}
    </nav>
  )
}
