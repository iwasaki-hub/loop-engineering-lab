import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { getLoginErrorMessage } from '../../api/http'
import Icon from '../../components/ui/Icon'
import './auth.css'

export default function LoginPage() {
  const { login, status } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState(() =>
    typeof location.state?.email === 'string' ? location.state.email : '',
  )
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const active = useRef(true)
  const inFlight = useRef(false)
  const errorElement = useRef(null)

  useEffect(() => {
    active.current = true
    return () => {
      active.current = false
    }
  }, [])
  useEffect(() => {
    if (error) errorElement.current?.focus()
  }, [error])

  async function handleSubmit(event) {
    event.preventDefault()
    if (inFlight.current || status === 'loading') return
    inFlight.current = true
    setSubmitting(true)
    setError('')
    try {
      await login({ email: email.trim(), password })
      if (active.current) navigate('/', { replace: true })
    } catch (failure) {
      if (active.current) setError(getLoginErrorMessage(failure))
    } finally {
      inFlight.current = false
      if (active.current) setSubmitting(false)
    }
  }

  if (status === 'authenticated') return <Navigate to="/" replace />

  return (
    <section className="auth-page container">
      <div className="auth-story">
        <p className="eyebrow">WELCOME BACK TO THE LOOP</p>
        <h1>
          つくる時間に、
          <br />
          戻ろう。
        </h1>
        <p>
          アイデアの続きも、新しい挑戦も。
          <br />
          AIと一緒に、次のループへ。
        </p>
        <div className="auth-loop" aria-hidden="true">
          <Icon name="loop" size={55} />
          <span>IDEA</span>
          <span>BUILD</span>
          <span>LEARN</span>
        </div>
        <Link className="inline-link" to="/">
          ホームへ戻る <Icon name="arrow" size={17} />
        </Link>
      </div>
      <div className="auth-form-panel">
        <p className="eyebrow">YOUR WORKSPACE</p>
        <h2>ログイン</h2>
        <p className="auth-form-intro">
          登録済みのアカウントでログインしてください。
        </p>
        <form onSubmit={handleSubmit} aria-busy={submitting}>
          {location.state?.signupComplete && (
            <p className="auth-success" role="status">
              登録が完了しました。メールアドレスとパスワードでログインしてください。
            </p>
          )}
          {error && (
            <p
              className="auth-error"
              role="alert"
              tabIndex={-1}
              ref={errorElement}
            >
              {error}
            </p>
          )}
          <div className="form-field">
            <label htmlFor="login-email">
              <Icon name="email" size={14} />
              メールアドレス
            </label>
            <input
              id="login-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={submitting}
            />
          </div>
          <div className="form-field">
            <label htmlFor="login-password">
              <Icon name="lock" size={14} />
              パスワード
            </label>
            <div className="password-field">
              <input
                id="login-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                disabled={submitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                aria-pressed={showPassword}
                aria-label={
                  showPassword
                    ? 'パスワードを非表示にする'
                    : 'パスワードを表示する'
                }
              >
                <Icon name={showPassword ? 'eyeOff' : 'eye'} size={14} />
                {showPassword ? '非表示' : '表示'}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="button button-dark auth-submit"
            disabled={submitting || status === 'loading'}
          >
            {submitting
              ? 'ログイン中…'
              : status === 'loading'
                ? 'セッション確認中…'
                : 'ログインする'}
            <Icon name="arrow" size={17} />
          </button>
        </form>
        <p className="auth-form-note">
          登録したメールアドレスとパスワードを使用します。
          <br />
          ログイン状態はCookieで保持されます。
        </p>
        <p className="auth-switch">
          はじめてご利用ですか？ <Link to="/signup">新規登録</Link>
        </p>
      </div>
    </section>
  )
}
