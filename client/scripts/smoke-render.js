import assert from 'node:assert/strict'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { MemoryRouter } from 'react-router-dom'
import { createServer } from 'vite'

// JSXはViteで変換。ブラウザー操作ではなく、描画とContextの結合を確認する。
const vite = await createServer({
  server: { middlewareMode: true },
  appType: 'custom',
})
try {
  const { default: App } = await vite.ssrLoadModule('/src/App.jsx')
  const { AuthContext } = await vite.ssrLoadModule(
    '/src/context/AuthContext.js',
  )
  function render(route, session) {
    return renderToString(
      createElement(
        MemoryRouter,
        { initialEntries: [route] },
        createElement(
          AuthContext.Provider,
          { value: { ...session, refreshSession() {}, logout() {} } },
          createElement(App),
        ),
      ),
    )
  }
  const home = render('/', { user: null, status: 'anonymous' })
  assert.ok(
    home.includes('data-icon="arrows-rotate"'),
    'Font Awesome icons are rendered',
  )
  assert.ok(home.includes('href="/login"'), 'Navbar has a login link')
  assert.ok(home.includes('href="/signup"'), 'Navbar has a signup link')
  const signupPage = render('/signup', { user: null, status: 'anonymous' })
  for (const value of [
    'name="name"',
    'type="email"',
    'autoComplete="new-password"',
    'name="confirmPassword"',
    'アカウントを作成',
  ]) {
    assert.ok(signupPage.includes(value), value)
  }
  const loginPage = render('/login', { user: null, status: 'anonymous' })
  assert.ok(loginPage.includes('type="email"'))
  assert.ok(loginPage.includes('name="password"'))
  assert.ok(loginPage.includes('autoComplete="current-password"'))
  const signupComplete = render(
    {
      pathname: '/login',
      state: { signupComplete: true, email: 'registered@example.com' },
    },
    { user: null, status: 'anonymous' },
  )
  assert.ok(signupComplete.includes('登録が完了しました'))
  assert.ok(signupComplete.includes('value="registered@example.com"'))
  assert.ok(
    !loginPage.includes('minLength='),
    'Existing short passwords remain valid for login',
  )
  for (const text of [
    'アイデアを、',
    '動くものへ。',
    '開発をはじめる',
    '説明用サンプル',
  ]) {
    assert.ok(home.includes(text), text)
  }
  assert.ok(
    render('/', {
      user: { name: 'テストユーザー', email: 'test@example.com' },
      status: 'authenticated',
    }).includes('テストユーザー'),
  )
  assert.ok(
    render('/', { user: null, status: 'error' }).includes('接続を再確認'),
  )
  assert.ok(
    render('/missing', { user: null, status: 'anonymous' }).includes(
      'ページは見つかりませんでした',
    ),
  )
  console.log(
    'React rendering, auth Context, error state and 404 route: passed',
  )
} finally {
  await vite.close()
}
