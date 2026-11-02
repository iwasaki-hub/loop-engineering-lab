# ヘルスチェックAPI 設計書

状態: 実装・受け入れテスト・起動確認済み（2026-11-02）。

## 目的

小さなHTTP APIで、設計→テスト→実装→検証→修正のループを実践する。

### ホームページ

- H1: GET /はEJSでHTMLを返す。API一覧・使用例・認証手順を表示する。
- H2: JSONPlaceholderの余白、見出し、コード例とAPIガイドの構成を参考に、独自の日本語デザインとする。
- H3: /assetsからCSS・JavaScriptを配信する。ページ上でGET /healthとPOST /echoを実行し、実際の応答とエラーを表示する。
- H4: モバイル向けレイアウト、キーボード操作、実行結果の読み上げに対応する。
- H5: Font Awesome Freeのアイコンを使用。CSSとフォントは自サーバーから配信し、装飾アイコンはaria-hiddenで読み上げ対象から外す。
- 参考: https://jsonplaceholder.typicode.com/ 、 https://expressjs.com/en/guide/using-template-engines/

認証の要件A1〜A11と利用手順は [auth.md](auth.md) を参照する。

## 要件

| ID | 内容 |
| --- | --- |
| R1 | `GET /health` はHTTP 200を返す。 |
| R2 | レスポンスはJSONで、本文は `{ "status": "ok" }` とする。 |
| R3 | 未定義のパスはHTTP 404を返す。本文の形式は問わない。 |
| R4 | `src/app.js` はExpressアプリをCommonJSでexportし、読み込みだけではポート待ち受けを開始しない。 |
| R5 | `src/server.js` がアプリを読み込み、`npm start` でPORT環境変数のポートで待ち受ける。未指定時は3000。 |
| R6 | 起動時にdotenvで作業ディレクトリの `.env` を読み込む。既存の環境変数を優先する。 |
| R7 | `POST /echo` はContent-Type: application/jsonのオブジェクト・配列を読み取り、HTTP 200で同じJSONを返す。保存はしない。 |
| R8 | 不正なJSONはHTTP 400とJSONエラーを返す。 |
| R9 | `POST /echo` のContent-TypeがJSONでなければ415、本文がなければ400とJSONエラーを返す。 |
| R11 | MorganでHTTPメソッド、パス、ステータス、応答時間を標準出力へ記録する。クエリ文字列、ヘッダー、本文は記録しない。JSONパーサーより先に登録する。 |

## ファイルの役割

### MongoDB接続

- R10: dotenv読み込み後のMONGO_URIをMongooseに渡し、接続成功後にHTTP待ち受けを開始する。
- URI未設定・初期接続失敗時は待ち受けを開始せず、終了コード1で終了する。
- 接続文字列や認証情報をログに出力しない。
- app.js単体の読み込みやHTTPテストではDBへ接続しない。

- `src/app.js`: ルーティングとアプリ設定。
- `src/server.js`: HTTPサーバー起動。
- `test/health.test.js`: 実際にHTTP要求を送り、R1〜R3を検証。R4の構成を利用する。

テストはOSが割り当てる空きポートを使用し、終了時にサーバーを閉じる。

## 完了条件

- `npm.cmd run check` と `npm.cmd test` が成功し、スキップがない。
- `npm.cmd start` 後に `http://localhost:3000/health` を手動確認する。
- R4の待ち受け分離とR5の起動処理をコードレビューする。
- 実際の結果を `docs/loop-log.md` に記録する。

## 今回の対象外

認証以外の業務データ保存、外部API、ホーム以外の画面、デプロイ。認証の対象外機能はauth.mdを参照。
