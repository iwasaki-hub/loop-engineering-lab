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

## UIモーション

Motionでページ遷移、ホームのスクロール表示、工程プレビュー、メニューの開閉、ボタンの押下を演出する。
OSの動きを減らす設定に対応。共通処理は `src/components/motion/` に分離する。
調整方針と検証方法は [docs/motion.md](../docs/motion.md) を参照。

## 2種類のデザイン

Navbarのパレットアイコン付きボタンで切り替える。

- フォレスト: 既存の落ち着いた緑のデザイン（初期値）。
- サンライズ: Headspaceの雰囲気を参考にした、クリーム・オレンジ・ブルー、丸いカードのデザイン。

モバイルではハンバーガーメニュー内にボタンを表示する。
DesignProviderとuseDesignで管理し、ページ移動後も維持。ブラウザーのlocalStorage（loop.design.v1）にデザイン名だけを保存する。
保存できない環境でも切り替えは動作する。ログイン情報やフォーム入力を初期化する処理はない。
定義はcontext/designStore.js、配色・装飾はstyles/designs.css。サンライズのCSSはdata-designで限定し、既存のフォレスト用スタイルはそのまま残す。

## このプロジェクトの開発事例

`/case-studies` はログイン不要のプロジェクト紹介ページ。
Navbarとホームから開ける。設計→テスト→実装→検証→改善のフロー、実装の歩み、JSON空本文の実際の修正例、検証範囲を掲載する。
内容は `src/pages/case-studies/content.js` で管理。テスト件数は開発記録時点の値で、自動更新ではない。

## 認証ユーザーの扱い

Navbarのログイン・新規登録は「アカウント」のドロップダウンに集約。
選択中のページ/セクションを強調し、アカウントメニューのボタンにも現在の項目を表示する。
ボタンで開閉し、ArrowDownで最初のリンクへ、Tabで移動、Escapeで閉じてボタンへ戻る。

コンポーネントは `useAuth()` で `user`、`status`、`error`、`login`、`register`、`logout`、`refreshSession` を利用できる。
初期表示時にCookieからユーザーを復元。未ログインは401、通信失敗はエラー表示と再確認で扱う。
Navbarのログインから `/login` へ遷移する。成功すると `/dashboard` へ進み、名前・メールアドレスを表示する。
認証済みならNavbarのマイページやヘッダーのユーザー名から開ける。未ログイン時はログインへ案内し、認証確認中は待機、通信失敗時は再確認ボタンを表示する。
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
