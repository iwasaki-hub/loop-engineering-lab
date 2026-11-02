import { useEffect, useRef, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import Icon from '../ui/Icon'

const links = [
  { to: '/login', label: 'ログイン', icon: 'login' },
  { to: '/signup', label: '新規登録', icon: 'signup' },
]

export default function AccountDropdown({ onNavigate }) {
  const [open, setOpen] = useState(false)
  const root = useRef(null)
  const trigger = useRef(null)
  const focusFirst = useRef(false)
  const { pathname } = useLocation()
  const current = links.find((link) => link.to === pathname)

  useEffect(() => {
    if (!open) return
    if (focusFirst.current) {
      root.current?.querySelector('a')?.focus()
      focusFirst.current = false
    }
    function onPointerDown(event) {
      if (!root.current?.contains(event.target)) setOpen(false)
    }
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        setOpen(false)
        trigger.current?.focus()
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  function navigate() {
    setOpen(false)
    onNavigate?.()
  }

  return (
    <div
      className="account-dropdown"
      ref={root}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false)
      }}
    >
      <button
        type="button"
        ref={trigger}
        className={`account-trigger ${current ? 'is-active' : ''}`}
        aria-expanded={open}
        aria-controls="account-links"
        aria-label={
          current
            ? `アカウントメニュー：${current.label}`
            : 'アカウントメニュー'
        }
        onClick={() => setOpen(!open)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault()
            if (open) root.current?.querySelector('a')?.focus()
            else {
              focusFirst.current = true
              setOpen(true)
            }
          }
        }}
      >
        <Icon name="user" size={14} />
        <span>{current?.label || 'アカウント'}</span>
        <Icon
          name="chevronDown"
          size={10}
          className={open ? 'dropdown-chevron is-open' : 'dropdown-chevron'}
        />
      </button>
      <div id="account-links" className="account-links" hidden={!open}>
        <p>アカウント</p>
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end
            className={({ isActive }) =>
              `account-link ${isActive ? 'is-active' : ''}`
            }
            onClick={navigate}
          >
            {({ isActive }) => (
              <>
                <Icon name={link.icon} size={15} />
                <span>{link.label}</span>
                {isActive && (
                  <Icon
                    name="check"
                    size={12}
                    className="account-current-check"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </div>
  )
}
