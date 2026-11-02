import { useEffect, useRef, useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { authApi } from '../../api/auth'
import { getSignupErrorMessage } from '../../api/http'
import Icon from '../../components/ui/Icon'
import { validateSignup } from './signupValidation'
import './auth.css'

export default function SignupPage() {
  const { register, status } = useAuth()
  const navigate = useNavigate()
  const [fields, setFields] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [policy, setPolicy] = useState(null)
  const [policyError, setPolicyError] = useState(false)
  const [attempt, setAttempt] = useState(0)
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
    const controller = new AbortController()
    authApi
      .passwordPolicy(controller.signal)
      .then((data) => {
        if (!controller.signal.aborted) setPolicy(data)
      })
      .catch(() => {
        if (!controller.signal.aborted) setPolicyError(true)
      })
    return () => controller.abort()
  }, [attempt])
  useEffect(() => {
    if (error) errorElement.current?.focus()
  }, [error])

  function changeField(event) {
    setFields((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }))
  }
  function retryPolicy() {
    setPolicyError(false)
    setAttempt((value) => value + 1)
  }
  async function handleSubmit(event) {
    event.preventDefault()
    if (inFlight.current || !policy || status === 'loading') return
    const validationError = validateSignup(fields, policy)
    if (validationError) {
      setError(validationError)
      return
    }
    inFlight.current = true
    setSubmitting(true)
    setError('')
    try {
      await register({
        name: fields.name.trim(),
        email: fields.email.trim(),
        password: fields.password,
      })
      if (active.current)
        navigate('/login', {
          replace: true,
          state: { signupComplete: true, email: fields.email.trim() },
        })
    } catch (failure) {
      if (active.current) setError(getSignupErrorMessage(failure))
    } finally {
      inFlight.current = false
      if (active.current) setSubmitting(false)
    }
  }

  if (status === 'authenticated') return <Navigate to="/" replace />

  return (
    <section className="auth-page container">
      <div className="auth-story">
        <p className="eyebrow">START YOUR FIRST LOOP</p>
        <h1>
          つくる一歩を、
          <br />
          ここから。
        </h1>
        <p>
          ひとつのアイデアから、広がる可能性。
          <br />
          あなたのアカウントで、新しいループを。
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
        <p className="eyebrow">JOIN THE WORKSPACE</p>
        <h2>アカウントを作成</h2>
        <p className="auth-form-intro">
          メールアドレスとパスワードで登録できます。
        </p>
        <form onSubmit={handleSubmit} aria-busy={submitting}>
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
            <label htmlFor="signup-name">
              <Icon name="user" size={14} />
              名前 <span className="optional-label">任意</span>
            </label>
            <input
              id="signup-name"
              name="name"
              autoComplete="name"
              maxLength={100}
              value={fields.name}
              onChange={changeField}
              disabled={submitting}
              placeholder="山田太郎"
            />
          </div>
          <div className="form-field">
            <label htmlFor="signup-email">
              <Icon name="email" size={14} />
              メールアドレス
            </label>
            <input
              id="signup-email"
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
              value={fields.email}
              onChange={changeField}
              disabled={submitting}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-field">
            <label htmlFor="signup-password">
              <Icon name="lock" size={14} />
              パスワード
            </label>
            <div className="password-field">
              <input
                id="signup-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="new-password"
                required
                value={fields.password}
                onChange={changeField}
                disabled={submitting}
                aria-describedby="password-policy"
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
            <p className="form-hint" id="password-policy" role="status">
              {policy
                ? `${policy.minLength}文字以上・UTF-8で${policy.maxBytes}バイト以下`
                : policyError
                  ? '登録条件を取得できませんでした。'
                  : 'パスワードの登録条件を確認中…'}
            </p>
            {policyError && (
              <button
                type="button"
                className="policy-retry"
                onClick={retryPolicy}
              >
                条件を再取得する
              </button>
            )}
          </div>
          <div className="form-field">
            <label htmlFor="signup-confirm">
              <Icon name="lock" size={14} />
              パスワード（確認）
            </label>
            <input
              id="signup-confirm"
              name="confirmPassword"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              value={fields.confirmPassword}
              onChange={changeField}
              disabled={submitting}
            />
          </div>
          <button
            type="submit"
            className="button button-dark auth-submit"
            disabled={submitting || !policy || status === 'loading'}
          >
            {submitting ? '登録中…' : 'アカウントを作成する'}
            <Icon name="arrow" size={17} />
          </button>
        </form>
        <p className="auth-form-note">登録後、ログイン画面へ移動します。</p>
        <p className="auth-switch">
          アカウントをお持ちですか？ <Link to="/login">ログイン</Link>
        </p>
      </div>
    </section>
  )
}
