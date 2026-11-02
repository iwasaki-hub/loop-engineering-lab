# フォルダー構成の方針

## 基準

Express 5の公式ドキュメントを参照する。
公式FAQは固定のフォルダー構成を定めていない。規模とチームに合わせて構成を選ぶ。
以下は公式のRouter・ミドルウェアの仕組みに基づく、このプロジェクトの設計方針である。

- [Express公式サイト](https://expressjs.com/)
- [FAQ: アプリケーションの構成](https://expressjs.com/en/starter/faq/#how-should-i-structure-my-application)
- [Routing / express.Router](https://expressjs.com/en/guide/routing/)
- [Using middleware](https://expressjs.com/en/guide/using-middleware/)
- [Error handling](https://expressjs.com/en/guide/error-handling/)

## 現在の構成

Reactクライアントは `client/` に分離。API層・認証Context・共通部品・ページ単位の構成とし、詳細は [client.md](client.md) を参照する。
ReactのFont Awesomeは `client/src/components/ui/Icon.jsx` に集約する。サーバーEJSのWebフォント配信とは独立したSVGコンポーネント方式。

- `src/server.js`: dotenvによる設定読み込みとポート待ち受け。
- `src/config/database.js`: MONGO_URIを受け取り、Mongooseで接続。server.jsで接続完了後にHTTPを起動する。
- `src/config/auth.js`: JWT秘密鍵の検証とCookie設定。
- `src/config/cors.js`: CLIENT_ORIGINSの許可リスト、Cookie付きCORS、プリフライト。JSONパーサーより前に登録。
- `src/routes/auth.js`: 認証APIとHTTP応答。
- `src/routes/home.js`: ホームページ用データとEJS描画。
- `src/views/home.ejs`: APIホームページのテンプレート。
- `src/views/partials/header.ejs` と `footer.ejs`: home.ejsからincludeする共通ヘッダー・フッター。
- `src/public/`: /assetsで公開するCSS・ブラウザー用JavaScript。環境設定やサーバーコードは置かない。
- Font Awesome: npmパッケージのcssとwebfontsだけを `/assets/fontawesome/` 配下で公開。node_modules全体は公開しない。
- `src/middleware/`: 認証チェックと登録・ログインのレート制限。
- `src/services/auth.js`: 入力検証、ハッシュ化、JWT発行・検証。
- `src/repositories/users.js`: Mongooseによるユーザー取得・保存・失効更新。
- `src/models/User.js`: ユーザースキーマとemailのuniqueインデックス。
- `src/app.js`: Expressアプリ、JSONパーサー、ルート、エラー処理の組み立て。listenは呼ばない。
- `test/health.test.js`: HTTP経由の受け入れテスト。
- `docs/`: 設計書、構成方針、検証記録。
- `prompts/`: Codexへ渡す作業手順。

認証追加に伴い、Router・サービス・永続化処理を分割した。ヘルスチェックとechoは小規模なのでapp.jsに維持する。

## 機能が増えたときの分割先

以下は拡張例。各フォルダーは実際に必要になった段階で作成する。

```text
src/
  server.js
  app.js
  routes/          # 機能単位のexpress.RouterとHTTP処理
  middleware/      # 共通処理・エラーハンドラー
  services/        # 業務ルール・ユースケース
  repositories/    # DBや外部ストレージへのアクセス
test/
  routes/          # HTTP経由のテスト
  services/        # 業務ルールの単体テスト
docs/
prompts/
```

### 分割するタイミング

- 機能別のエンドポイントが増えたら、`express.Router()` を使って `routes/` に移す。
- 再利用するミドルウェアやエラー処理は `middleware/` に移す。
- HTTP処理と独立した業務ルールが生まれたら `services/` に分ける。
- DB・永続化を追加したら `repositories/` にアクセス処理を分ける。
- ルート内のHTTP処理自体が大きくなった場合に限り、`controllers/` の導入を検討する。
- テストが増えたら対象機能ごとに分割する。Node.js標準テストランナーを継続する。

## 実装時の約束

- CommonJSを継続し、フォルダー整理だけを目的とした依存追加はしない。
- app.jsではパーサーなどの前処理、ルート、必要な404処理、エラーハンドラーの順序を意識する。
- エラーハンドラーは4引数 `(err, req, res, next)` とする。
- 404はエラーハンドラーだけでは捕捉されない。専用処理が必要になったらルートの後に置く。
- servicesやrepositoriesはreq/resに依存させない。
- フォルダー分割時は既存APIのURL・応答を維持し、受け入れテストで確認する。
- ファイルを移した場合はrequireのパスと構文チェック対象も更新する。
