export const workflowSteps = [
  {
    id: 'plan',
    number: '01',
    label: '設計する',
    icon: 'code',
    title: '曖昧なアイデアを、明確な設計へ。',
    description:
      'つくりたいものを言葉にする。AIと対話しながら、要件と完了条件を整理します。',
    file: 'docs/spec.md',
    prompt: 'ユーザーが安心して使える、認証APIをつくりたい。',
    answer:
      'まずは、期待する動作を整理しましょう。登録・ログイン・本人確認を小さな要件に分けます。',
    lines: [
      '# ユーザー認証API',
      '',
      '## 完了条件',
      '- 名前とメールでユーザーを登録できる',
      '- パスワードをハッシュ化して保存する',
      '- ログイン後に本人情報を取得できる',
      '- 未認証のリクエストは401を返す',
    ],
    note: '設計書を、開発の共通言語に。',
  },
  {
    id: 'build',
    number: '02',
    label: '実装する',
    icon: 'terminal',
    title: '小さく実装して、動くものに。',
    description:
      '設計書をもとに、AIとコードを書く。変更の理由を読み解きながら、機能を積み上げます。',
    file: 'src/routes/auth.js',
    prompt: '設計書に沿って、本人情報を取得するAPIを実装して。',
    answer:
      '認証チェックを共通化し、ルートの責務をシンプルに保ちます。差分を確認してみましょう。',
    lines: [
      'const router = express.Router();',
      '',
      "router.get('/me', requireAuth, (req, res) => {",
      '  res.json({',
      '    user: auth.publicUser(req.user)',
      '  });',
      '});',
      '',
      'module.exports = router;',
    ],
    note: '変更を読み、意図を確かめる。',
  },
  {
    id: 'verify',
    number: '03',
    label: '確かめる',
    icon: 'check',
    title: 'テストして、次の改善へ。',
    description:
      '期待どおりに動くかを検証。失敗の原因を調べ、修正し、もう一度確かめる。その繰り返しです。',
    file: 'test/auth.test.js',
    prompt: '未認証のアクセスと、ログアウト後の動作も確認して。',
    answer:
      '正常系だけでなく、不正入力や認証の失効もテストします。結果を見て、必要な修正へ進みます。',
    lines: [
      "test('未認証アクセスを拒否する', async () => {",
      "  const response = await request('/auth/me');",
      '  assert.equal(response.status, 401);',
      '});',
      '',
      "test('ログアウト後は認証を失効する', async () => {",
      '  await logout();',
      '  assert.equal((await getMe()).status, 401);',
      '});',
    ],
    note: '検証の結果を、次の一歩に。',
  },
]

export const questions = [
  {
    title: 'AIにすべてを任せる開発ですか？',
    answer:
      'AIに設計案や実装、テストを手伝ってもらいながら、人が要件を決め、差分を読み、最終的な動作を確認します。判断と検証を含めて、一緒につくる開発です。',
  },
  {
    title: '何からはじめればよいですか？',
    answer:
      'まずは小さな機能を一つ選び、「どんな入力に何を返すか」を書いてみましょう。このプロジェクトならヘルスチェックやJSONの送受信から、設計・実装・テストの一周を体験できます。',
  },
  {
    title: 'このページからAIに依頼できますか？',
    answer:
      'このページは開発方法を紹介するホームページです。ワークスペースは説明用のプレビューで、AIへの送信やコード実行は行いません。実際の開発はCodexなどの開発環境で行います。',
  },
  {
    title: '既存のAPIとは接続されていますか？',
    answer:
      'はい。サーバー接続の確認とログイン中ユーザーの復元は、Axiosを通じて既存のExpress APIに接続します。Navbarの新規登録・ログインから、アカウントを作成してログインできます。',
  },
]
