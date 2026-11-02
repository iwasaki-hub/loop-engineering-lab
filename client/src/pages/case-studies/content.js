export const repo = 'https://github.com/iwasaki-hub/loop-engineering-lab'

export const developmentLoop = [
  {
    label: '設計する',
    detail: '目的と完了条件を言葉に',
    icon: 'code',
    href: '#milestones',
  },
  {
    label: 'テストを書く',
    detail: 'まず、失敗を確認',
    icon: 'terminal',
    href: '#learning',
  },
  {
    label: '実装する',
    detail: '小さな機能から形に',
    icon: 'code',
    href: '#milestones',
  },
  {
    label: '確かめる',
    detail: '実際の結果と期待を比較',
    icon: 'check',
    href: '#verification',
  },
  {
    label: '記録して改善',
    detail: '気づきを次の設計へ',
    icon: 'loop',
    href: '#learning',
  },
]

export const milestones = [
  {
    number: '01',
    phase: 'DEFINE',
    title: 'コードの前に、ゴールを決める。',
    description:
      '最初の題材はGET /health。入力と期待する応答を設計書に書き、Codexの作業ルールと実装手順を用意しました。最初はapp.jsがなく、テスト2件が失敗する状態から始めています。',
    files: ['docs/spec.md', 'AGENTS.md', 'prompts/implement.md'],
    result: '「完成した」の判断基準を、先に共有。',
  },
  {
    number: '02',
    phase: 'FIRST API',
    title: '小さなAPIで、一周させる。',
    description:
      'Expressアプリと起動処理を分離し、/healthを実装。続いてPOST /echoでJSONを送受信できるようにしました。正常系だけでなく、不正なJSONや空本文の処理もテストに含めました。',
    files: ['src/app.js', 'src/server.js', 'test/health.test.js'],
    result: 'テストの失敗から実装へ、実装から検証へ。',
  },
  {
    number: '03',
    phase: 'DATA & AUTH',
    title: 'データと認証を、実際につなぐ。',
    description:
      'dotenvで設定を読み、MongooseでMongoDBに接続。ユーザー登録・ログイン・本人情報・ログアウトを追加しました。パスワードはハッシュ化し、JWTはHttpOnly Cookieで扱います。',
    files: [
      'src/config/database.js',
      'src/models/User.js',
      'src/services/auth.js',
    ],
    result: '専用テストDBで、登録から認証失効までを確認。',
  },
  {
    number: '04',
    phase: 'MAKE IT VISIBLE',
    title: 'APIを、触って理解できるものへ。',
    description:
      'MorganのログとEJSのAPIホームを追加。エンドポイント一覧、認証の使い方、実際に/healthと/echoを試すデモを作り、通信の結果を見えるようにしました。',
    files: ['src/views/home.ejs', 'src/views/partials/', 'src/public/home.js'],
    result: 'APIの動作を、コード以外からも確かめられるように。',
  },
  {
    number: '05',
    phase: 'REACT CLIENT',
    title: '画面とAPIの責務を分ける。',
    description:
      'ViteとReactでクライアントを作成。Axiosの通信をapiフォルダーに集約し、AuthProviderでユーザー情報を共有。React Routerでページを分け、CORSで許可した画面からCookie付き通信ができるようにしました。',
    files: ['client/src/api/', 'client/src/context/', 'src/config/cors.js'],
    result: '変更する場所が分かる、育てやすい構成に。',
  },
  {
    number: '06',
    phase: 'USER EXPERIENCE',
    title: '登録からマイページまで、つなげる。',
    description:
      'ログイン・新規登録・マイページを実装。登録条件はAPIで取得し、環境変数の変更を表示にも反映します。認証確認中、未ログイン、通信失敗を分けて扱い、Font Awesomeと挿絵で画面も整えました。',
    files: [
      'client/src/pages/auth/',
      'client/src/pages/dashboard/',
      'client/src/components/auth/',
    ],
    result: '機能だけでなく、待機や失敗の体験も設計。',
  },
  {
    number: '07',
    phase: 'REVIEW & RECORD',
    title: '結果を残して、次へ進む。',
    description:
      '構文チェック、通常テスト、React描画確認、本番ビルドで確かめ、変更理由と結果を開発記録へ。GitHubへ保存する際は、環境変数や秘密情報が含まれないことも確認しました。',
    files: [
      'docs/loop-log.md',
      'client/scripts/smoke-render.js',
      'scripts/smoke-auth.js',
    ],
    result: '確認できたことと、まだ確認していないことを明確に。',
  },
]

export const verification = [
  {
    title: '通常テスト',
    value: '17件',
    detail: 'API、認証、CORS、登録条件を検証。失敗・スキップ0件。',
    command: 'npm test',
  },
  {
    title: 'React描画確認',
    value: '確認済み',
    detail:
      'ホーム・ログイン・登録・マイページと、認証状態別の描画を確認。実ブラウザー操作の代替ではありません。',
    command: 'npm run test:render',
  },
  {
    title: '本番ビルド',
    value: '成功',
    detail:
      'クライアントのビルドとアセット出力を確認。デプロイ完了を意味するものではありません。',
    command: 'npm run build',
  },
]
