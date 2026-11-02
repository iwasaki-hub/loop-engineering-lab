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
  assert.ok(home.includes('aria-controls="account-links"'))
  assert.ok(home.includes('id="account-links"'))
  const currentLoginNav = render('/login', {
    user: null,
    status: 'anonymous',
  }).match(/<nav id="main-nav"[\s\S]*?<\/nav>/)?.[0]
  assert.match(
    currentLoginNav,
    /aria-current="page"[^>]*href="\/login"|href="\/login"[^>]*aria-current="page"/,
  )
  assert.equal((currentLoginNav.match(/aria-current=/g) || []).length, 1)
  const currentSignupNav = render('/signup', {
    user: null,
    status: 'anonymous',
  }).match(/<nav id="main-nav"[\s\S]*?<\/nav>/)?.[0]
  assert.match(
    currentSignupNav,
    /aria-current="page"[^>]*href="\/signup"|href="\/signup"[^>]*aria-current="page"/,
  )
  const currentHashNav = render('/#workflow', {
    user: null,
    status: 'anonymous',
  }).match(/<nav id="main-nav"[\s\S]*?<\/nav>/)?.[0]
  assert.match(
    currentHashNav,
    /aria-current="location"[^>]*href="\/#workflow"|href="\/#workflow"[^>]*aria-current="location"/,
  )
  assert.ok(home.includes('href="/case-studies"'))
  const caseStudy = render('/case-studies', { user: null, status: 'anonymous' })
  for (const content of [
    '開発事例',
    '設計書',
    '失敗を確認',
    '空のJSON本文',
    'ブラウザー',
    '17件',
  ]) {
    assert.ok(caseStudy.includes(content), content)
  }
  assert.ok(!caseStudy.includes('ログインが必要です'))
  assert.ok(
    home.includes('human-ai-workshop.webp'),
    'The home illustration is loaded locally',
  )
  assert.ok(
    home.includes('人とAIのパートナーが、設計図やコードのパネル'),
    'The illustration has descriptive alternative text',
  )
  const dashboardUser = {
    name: 'マイページ利用者',
    email: 'dashboard@example.com',
  }
  const dashboard = render('/dashboard', {
    user: dashboardUser,
    status: 'authenticated',
  })
  assert.ok(dashboard.includes('アカウント情報'))
  assert.ok(dashboard.includes(dashboardUser.name))
  assert.ok(dashboard.includes(dashboardUser.email))
  assert.ok(dashboard.includes('href="/dashboard"'))
  const anonymousDashboard = render('/dashboard', {
    user: null,
    status: 'anonymous',
  })
  assert.ok(anonymousDashboard.includes('ログインが必要です'))
  assert.ok(anonymousDashboard.includes('href="/login"'))
  assert.ok(!anonymousDashboard.includes('アカウント情報'))
  const loadingDashboard = render('/dashboard', {
    user: null,
    status: 'loading',
  })
  assert.ok(loadingDashboard.includes('ログイン状態を確認しています'))
  assert.ok(!loadingDashboard.includes('ログインが必要です'))
  const errorDashboard = render('/dashboard', { user: null, status: 'error' })
  assert.ok(errorDashboard.includes('ログイン状態を確認できませんでした'))
  assert.ok(!errorDashboard.includes('ログインが必要です'))
  assert.ok(
    render('/dashboard', {
      user: { name: '', email: 'unnamed@example.com' },
      status: 'authenticated',
    }).includes('名前は未設定です'),
  )
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
