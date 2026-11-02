import { Link, Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Icon from '../ui/Icon'
import './requireAuth.css'

export default function RequireAuth() {
  const { user, status, refreshSession } = useAuth()
  if (status === 'loading') {
    return (
      <section className="auth-gate container" role="status">
        <Icon name="loop" size={28} />
        <h1>ログイン状態を確認しています</h1>
        <p>しばらくお待ちください。</p>
      </section>
    )
  }
  if (status === 'error') {
    return (
      <section className="auth-gate container">
        <Icon name="loop" size={28} />
        <h1>ログイン状態を確認できませんでした</h1>
        <p role="alert">APIとの接続を確認して、もう一度お試しください。</p>
        <button className="button button-dark" onClick={refreshSession}>
          再確認する
        </button>
        <Link className="inline-link" to="/">
          ホームへ戻る
        </Link>
      </section>
    )
  }
  if (status !== 'authenticated' || !user) {
    return (
      <>
        <Navigate to="/login" replace />
        <section className="auth-gate container">
          <h1>ログインが必要です</h1>
          <Link className="button button-dark" to="/login">
            ログインページへ
          </Link>
        </section>
      </>
    )
  }
  return <Outlet />
}
