# Reactクライアント

## 機能と範囲

- C1: `/`にAIを使った開発の紹介ページ。OpenAI Codexページの余白・タイポグラフィ・ワークスペース紹介を参考に、独自の日本語コンテンツで実装。
- C2: 設計・実装・検証を切り替える説明用プレビュー、開発手順、FAQ、モバイルメニュー。
- C3: AxiosのAPI処理をsrc/apiに集約。コンポーネントから直接HTTP通信しない。
- C4: AuthProviderとuseAuthでユーザー情報・読み込み・未認証・エラーを共有。リロード時はCookieを使いGET /auth/meで復元。
- C5: 認証済み時は名前（未設定ならemail）とログアウトを表示。未認証401とサーバー通信失敗を区別する。
- C6: React Routerで共通レイアウトとホーム・404を構成。
- C7: Navbarから/loginへ遷移し、メールアドレスとパスワードでログイン。成功時はContextを更新して/dashboardへ進む。認証済みユーザーの/loginアクセスも/dashboardへ案内する。
- ログインフォームはラベル・自動入力・パスワード表示切り替え・エラー表示・送信中の二重送信防止を備える。新規登録用の最小文字数をログインで強制しない。
- C8: Navbarとログインページから/signupへ遷移。任意のname、email、password、確認用パスワードを入力し、登録APIへ接続する。
- パスワード条件はGET /auth/password-policyで取得し、表示と検証に利用。取得失敗時は登録を止め再取得できる。確認不一致、重複メール、バイト数超過、送信中に対応する。
- 登録後は自動ログインせず、成功メッセージとemailを/loginへ渡す。パスワードはルート状態や永続ストレージに保存しない。
- AIへの送信・コード実行は対象外。プレビューはサンプルと明記する。
- ヒーローに、人とAIが協力する挿絵を配置。画像の原本・配信用ファイル・生成プロンプトは [illustrations.md](illustrations.md) を参照。
- C9: /dashboardにログイン中ユーザーの名前とメールアドレスを表示する。名前なしはメールを挨拶に使い、名前欄は未設定とする。
- C10: /case-studiesを公開ページとして追加。Navbarとホームから遷移し、このプロジェクトの概要、開発ループ、7段階の工程、JSON空本文の修正事例、検証済み/未確認を紹介する。
- C11: 未認証のログイン・新規登録リンクをアカウントのドロップダウンにまとめる。ページ/ハッシュ単位で現在位置を強調し、aria-currentで示す。ドロップダウンはボタン・ArrowDown・Tab・Escape・外側クリックに対応。
- C12: DesignContextで既存のforestと新しいsunriseを切り替える。Navbarのパレットボタンで操作し、選択はlocalStorageのloop.design.v1に保存。初期値と不正値はforest。
- C13: Motionで本文の遷移、ホームの表示、工程プレビュー、メニュー/ボタンへ演出を追加。認証・テーマ・フォームの状態を維持し、動きを減らす設定を尊重する。詳細は [motion.md](motion.md) を参照。
- SunriseはHeadspaceを参考にした独自の暖色・丸みのあるデザイン。既存ホームの構造・内容・API機能・挿絵は維持する。認証/フォームを再マウントせず、全ページの共通UIにも選択を反映。
- localStorageが禁止されても画面上の切り替えは継続。aria-pressedと変更通知を設定し、モバイルではナビ内に配置する。
- 参考: https://www.headspace.com/ （デザインの参考。医療コンテンツやロゴ・キャラクターは使用しない）。
- モバイルではアカウントの候補をナビ内に展開。遷移やモバイルメニュー開閉で候補を閉じる。認証済み時は従来のマイページリンクを表示。
- 開発事例の本文とフローはpages/case-studies/content.jsで管理。通常テスト17件などの値は2026-11-03時点の記録とし、リアルタイムCI表示とは区別する。
- RequireAuthで保護する。loadingは待機、errorは再確認、anonymousは/loginへreplace遷移。認証未確認時はプロフィールを描画しない。
- Navbarのマイページとヘッダーのユーザー名から遷移。Contextと/auth/meによる既存の復元処理を利用し、新しい個人情報APIは追加しない。

## 構成

```text
client/src/
  api/                   # Axios共通設定、認証API、ヘルスチェック
  context/               # AuthContext、AuthProvider
  hooks/                 # useAuth
  components/
    layout/              # 共通ヘッダー・フッター・Outlet
    ui/                  # 汎用アイコン
  pages/
    home/                # ホームと専用コンポーネント・データ・CSS
    auth/                # ログインページ・フォームのスタイル
    dashboard/           # 認証済みユーザーのマイページ
    NotFoundPage.jsx
  App.jsx                # ルート定義
  main.jsx               # Router・Providerの組み立て
  index.css              # 共通スタイル・レスポンシブ
```

サーバーは既存のCommonJS、clientはViteのES Modulesを使用する。
JWTをlocalStorageへ保存しない。Contextはメモリ上のユーザー情報だけを保持する。
APIの途中応答による古い状態への巻き戻りを防ぎ、アンマウント時は通信を中断する。

## 起動

リポジトリルートで既存ExpressとMongoDBを起動する。

```powershell
npm.cmd start
```

別ターミナルでReactを起動する。

```powershell
cd client
npm.cmd run dev
```

Reactホーム: http://localhost:5173/ 。既存EJSホームは http://localhost:3000/ に維持。
Viteは/auth・/health・/echoをExpressへプロキシする。
パスの接頭辞を追加しないため、既存のCookie Path=/authと整合する。
ブラウザーのlocalhostと127.0.0.1ではCookieが別扱いになるため、同じホスト名で利用する。

バックエンドPORTを変えた場合はclient/.env.localに以下を設定しViteを再起動する。

```env
API_PROXY_TARGET=http://127.0.0.1:3000
```

API_PROXY_TARGETはVite設定用で、ブラウザーバンドルへ公開しない。
JWT_SECRETやMONGO_URIをclientやVITE_変数へコピーしない。

## CORSで直接接続する場合

ルート `.env` に許可するオリジンをカンマ区切りで設定する。

```env
CLIENT_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

`client/.env.local` にAPIの公開URLを設定する（この開発環境には追記済み）。

```env
VITE_API_BASE_URL=http://localhost:3000
```

両サーバーを再起動する。フロントは http://localhost:5173/ で開く。
VITE_API_BASE_URLが空欄・未指定なら従来のViteプロキシを使用する。
AxiosのwithCredentialsを有効にし、サーバーはcredentials=trueと具体的な許可オリジンを返す。
未許可Originは403。OriginなしのPostmanや同一オリジンのEJS通信は維持する。
CookieはSameSite=Strictのため、localhostと127.0.0.1を混在させない。
ヘッダーのプリフライトはContent-TypeとX-Requested-With、メソッドはGET/HEAD/POST/OPTIONSに対応。

## 検証

clientフォルダーで実行する。

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run test:render
```

- APIテスト: リクエストパス、JSON、Cookie送信、必須ヘッダー、キャンセル信号、不正なヘルス応答。
- 描画確認: ViteでJSXを変換し、Reactのサーバー描画でホーム・認証Context・エラー表示・404を確認。ブラウザー操作テストではない。
- 既存サーバーのテストはリポジトリルートのnpm test。

## 本番配信について

今回はローカル開発構成。Viteのdevプロキシはビルド後に存在しない。別オリジンで配信する場合もCookieの同一サイト要件を満たす構成にする。
本番はReactとAPIを同じオリジンで配信し、/auth・/health・/echoをAPIへ転送する設定が必要。
SPAのフォールバックはAPIより後に置く。既存EJSホームの置き換え・デプロイは今回行わない。

## 参考

- https://openai.com/ja-JP/codex/ （デザイン参考。OpenAI公式サイトとしての表示は行わない）
- https://react.dev/reference/react/createContext
- https://vite.dev/config/server-options.html#server-proxy
- https://axios-http.com/docs/instance
- https://reactrouter.com/start/declarative/routing
