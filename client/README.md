# Loop Engineering Lab — React client

AIを使った開発を紹介するホームページ。Vite / React / Axios / React Routerを使用。

## 起動

先にリポジトリルートでMongoDBとExpressを起動する。

```powershell
npm.cmd start
```

別ターミナルのclientフォルダーで実行する。

```powershell
npm.cmd ci
npm.cmd run dev
```

http://localhost:5173/ を開く。既存のEJSホームは3000ポート。
API接続先は既定で http://127.0.0.1:3000 。変更する場合は `.env.example` を参考に `.env.local` を作成する。
`VITE_API_BASE_URL=http://localhost:3000` を設定するとCORSで直接接続する。Cookie認証ではフロントもlocalhostで開き、両サーバーを再起動する。未指定時は従来のプロキシを使う。

## フォルダーの役割

アイコンは `@fortawesome/react-fontawesome` と無料のSolidアイコンを利用。
`src/components/ui/Icon.jsx` の名前マッピングで管理し、`<Icon name="login" size={16} />` のように使う。
使うアイコンだけを明示的にimportし、CSSもViteでバンドルする。CDNやKitの設定は不要。
装飾アイコンはaria-hiddenとし、ボタンの文言・ラベルは維持する。

| フォルダー | 役割 |
| --- | --- |
| src/api | Axios共通設定と認証・システムAPI |
| src/context | AuthContextとAuthProvider |
| src/hooks | useAuth |
| src/components/layout | ヘッダー・フッター・共通レイアウト |
| src/components/ui | 汎用UI |
| src/pages/home | ホーム・専用コンポーネント・表示データ・スタイル |
| test | API契約のテスト |
| scripts | React描画のスモーク確認 |

## ユーザー情報

コンポーネントは `useAuth()` で `user`、`status`、`error`、`login`、`register`、`logout`、`refreshSession` を利用できる。
初期表示時にCookieからユーザーを復元。未ログインは401、通信失敗はエラー表示と再確認で扱う。
Navbarのログインから `/login` へ遷移する。成功するとホームに戻り、ユーザー名が表示される。
Navbarの新規登録から `/signup` へ遷移。名前（任意）・メール・パスワード・確認用パスワードを入力する。
登録条件はサーバーから取得し、入力チェックと説明に反映する。登録APIは自動ログインせず、完了後はメール入力済みのログイン画面へ案内する。
JWTやDBの接続文字列をクライアントへ保存しない。

## 検証

```powershell
npm.cmd run build
npm.cmd test
npm.cmd run test:render
```

本番ビルド後の配信では、同一オリジンのAPI転送とSPAフォールバックの設定が必要。
詳しい仕様・制限・Cookieとプロキシの扱いは [docs/client.md](../docs/client.md) を参照。
