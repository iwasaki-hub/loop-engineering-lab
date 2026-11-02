# loop-engineering-lab

## Reactホームページ

AIを使った開発を紹介するReactページを `client/` に追加。
Expressを起動後、別ターミナルで `cd client` → `npm.cmd run dev` を実行し http://localhost:5173/ を開く。
AxiosのAPI層・認証Context・React Routerを分離。構成と検証方法は [docs/client.md](docs/client.md) を参照。
既存のEJSページは3000ポートに維持。
クライアントからAPIへ直接接続するCORS設定も追加。ルートの `CLIENT_ORIGINS` とclientの `VITE_API_BASE_URL` を変更したら両サーバーを再起動する。Cookie認証ではlocalhost同士で利用する。

Windows、Node.js、Codexで設計→実装→テスト→修正を練習するプロジェクト。

## APIホームページ

`npm.cmd start` 後に http://localhost:3000/ を開く（PORTを変更した場合はURLも変更）。
EJSのホームページにAPI一覧・認証手順を表示し、GET /healthとPOST /echoをその場で試せる。
起動にはMongoDBとJWT_SECRETの設定が必要。テンプレートはsrc/views、公開アセットはsrc/public。
デザイン参考: [JSONPlaceholder](https://jsonplaceholder.typicode.com/)。外部アセットへの依存はない。
アイコンはFont Awesome Freeをnpmで管理し、`/assets/fontawesome/css/` と `/assets/fontawesome/webfonts/` から配信する。
無料版のSolidアイコンを使用し、CDN・Kitの設定は不要。

## 開発環境の準備

Node.js LTSとGitを使用する。PowerShellでプロジェクトルートから実行する。

```powershell
npm.cmd ci
npm.cmd run check
npm.cmd test
```

ホームページ・ヘルスチェック・JSON送受信・ユーザー認証APIは実装済み。通常テスト11件が成功する。
初回の実装では、未実装によるテスト失敗を確認してから実装し、成功を確認した。
実行結果は `docs/loop-log.md` を参照する。

## 実装ループの開始

Codexでこのフォルダーを開き、次の指示を送る。

```text
prompts/implement.mdの手順に従って実装・検証・修正を行ってください。
```

Codexが設計とテストを読み、実装、検証、最大3サイクルの修正を行う。
今回の構成では外側の自動実行プログラムは使わず、Codexへの指示でループを回す。

## 実装後の手動確認

起動時にdotenvがプロジェクトルートの `.env` を読み込む。
新規環境では `.env.example` を参考に `.env` を作成する（既存ファイルは上書きしない）。
`PORT=3000` のようにポートを設定でき、未指定時は3000を使用する。
OS側で設定済みの環境変数が優先される。別のポートを指定した場合は確認URLも変更する。

```powershell
npm.cmd start
```

別のPowerShellで実行する。

```powershell
Invoke-RestMethod http://localhost:3000/health
```

`status` が `ok` であることを確認し、起動したターミナルでCtrl+Cを押して終了する。
開発中の自動再起動には `npm.cmd run dev` を使用する。

## ユーザー認証

開発中の新規登録パスワードは4文字以上。`.env` の `PASSWORD_MIN_LENGTH=4` を変更して再起動すると、登録チェック・エラー・ホームページの説明が連動する。設定を増やしても既存パスワードでのログインは継続できる。

メールアドレス＋パスワード、JWTのHttpOnly Cookieで認証する。
起動にはMONGO_URIと、32バイト以上のランダムなJWT_SECRETが必要。
JWT_SECRETは `.env.example` の空欄を参考に既存の `.env` へ設定する。
生成方法・PowerShell実行例・制限事項は [docs/auth.md](docs/auth.md) を参照。

| メソッド | URL | 内容 |
| --- | --- | --- |
| POST | /auth/register | ユーザー登録 |
| POST | /auth/login | ログイン・Cookie発行 |
| GET | /auth/me | ログイン中のユーザー |
| POST | /auth/logout | 全ログインの失効・Cookie削除 |

POSTでは `Content-Type: application/json` と `X-Requested-With: XMLHttpRequest` を送る。
ログアウト時は本文 `{}` を送る。

```powershell
npm.cmd run test:integration
```

MongoDBを使う統合テスト。設定された接続先にランダム名の専用DBを作成し、確認後にそのDBのみ削除する。
通常テストはDB接続不要。統合テストのJWT鍵はプロセス内だけで生成する。

## アクセスログ

MorganでHTTPメソッド・パス・ステータス・応答時間をコンソールへ出力する。
例: `GET /health 200 1.234 ms`。クエリ文字列・ヘッダー・本文は出力しない。
JSONパーサーより先に登録しているため、不正なJSONによる400応答も記録する。
参考: [Morgan公式ドキュメント](https://expressjs.com/en/resources/middleware/morgan/)

## データベース接続

`.env` の `MONGO_URI` に接続文字列を設定し、MongoDBを起動してから `npm.cmd start` を実行する。
MongoDBの接続成功後にHTTPサーバーが起動する。接続失敗・未設定の場合は起動しない。
初期接続の待機はMongooseの標準設定（通常30秒）。接続文字列はログに表示しない。
HTTPテストはDB接続を必要としない。

## JSONリクエスト

`POST /echo` は受け取ったJSONオブジェクト・配列をそのまま返す（保存しない）。
サーバー起動後、別のPowerShellで実行する。PORTを変更した場合はURLも変更する。

```powershell
Invoke-RestMethod -Uri http://localhost:3000/echo -Method Post -ContentType 'application/json' -Body '{"message":"hello","count":1}'
```

不正なJSONと本文なしは400、JSON以外のContent-Typeは415となり、JSONのerrorを返す。

## ファイル一覧

- `AGENTS.md`: Codexの作業ルール。
- `docs/spec.md`: 要件と完了条件。
- `docs/architecture.md`: Express公式ドキュメントを参考にしたフォルダー構成・拡張方針。
- `test/health.test.js`: HTTP受け入れテスト。
- `prompts/implement.md`: 実装ループを開始する指示。
- `docs/loop-log.md`: 検証と修正の記録。

完了時はテスト結果、実際のAPI応答、`git diff`、新規ファイルを確認する。
