import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../ui/Icon'
import Navbar from './Navbar'

export default function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [logoutError, setLogoutError] = useState('')
  const [loggingOut, setLoggingOut] = useState(false)
  const { user, status, logout, refreshSession } = useAuth()
  useEffect(() => {
    if (!menuOpen) return
    function closeOnScroll() {
      setMenuOpen(false)
    }
    window.addEventListener('scroll', closeOnScroll, { passive: true })
    return () => window.removeEventListener('scroll', closeOnScroll)
  }, [menuOpen])

  async function handleLogout() {
    setLoggingOut(true)
    setLogoutError('')
    try {
      await logout()
    } catch {
      setLogoutError('ログアウトできませんでした。再度お試しください。')
    } finally {
      setLoggingOut(false)
    }
  }
  return (
    <header className="site-header">
      <div className="header-inner container">
        <Link
          className="wordmark"
          to="/"
          aria-label="Loop Engineering Lab ホーム"
        >
          <Icon name="loop" size={25} />
          <strong>
            loop<span> / </span>
          </strong>
          <span className="wordmark-caption">engineering lab</span>
        </Link>
        <button
          className="menu-toggle"
          type="button"
          aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          aria-expanded={menuOpen}
          aria-controls="main-nav"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} />
        </button>
        <Navbar menuOpen={menuOpen} onNavigate={() => setMenuOpen(false)} />
        <div className="header-action">
          {status === 'authenticated' && user ? (
            <>
              <Link className="user-name" to="/dashboard">
                {user.name || user.email}
              </Link>
              <button
                className="small-button"
                onClick={handleLogout}
                disabled={loggingOut}
              >
                <Icon name="logout" size={14} />
                {loggingOut ? '処理中…' : 'ログアウト'}
              </button>
            </>
          ) : status === 'error' ? (
            <button className="small-button" onClick={refreshSession}>
              <Icon name="loop" size={14} />
              接続を再確認
            </button>
          ) : (
            <a className="small-button" href="/#guide">
              {status === 'loading' ? '接続を確認中…' : '開発をはじめる'}
              <Icon name="diagonal" size={14} />
            </a>
          )}
        </div>
      </div>
      {logoutError && (
        <p className="header-error" role="alert">
          {logoutError}
        </p>
      )}
    </header>
  )
}
