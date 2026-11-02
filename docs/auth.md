# ユーザー認証API

メールアドレスとパスワードで認証し、JWTをHttpOnly Cookieに保存する。

## 要件

- A1: POST /auth/registerで登録。emailとpassword、任意のnameを受け取り201と公開ユーザー情報を返す。nameは文字列・前後空白除去・最大100文字。未指定と既存ユーザーの名前なしは空文字として返す。自動ログインは行わない。
- A2: メールはtrim・小文字化し、形式と254文字以下を検証。新規登録パスワードの最小文字数はPASSWORD_MIN_LENGTH（未指定時4）。Unicodeコードポイントで数え、UTF-8で72バイト以下。bcrypt（コスト12）でハッシュ化する。
- A3: emailはDBのuniqueインデックスで一意にし、重複は409。
- A4: POST /auth/loginで認証。誤った資格情報は一律401。成功時は200とユーザー情報、1時間有効なJWT Cookie。
- A5: GET /auth/meは署名・有効期限・issuer・audience・ユーザー存在・tokenVersionを確認。未認証、改ざん、失効、期限切れは401。
- A6: POST /auth/logoutは認証必須。Cookie削除とtokenVersion更新で当該ユーザーの全ログインを失効し204。
- A7: 公開ユーザー情報はid、name、emailのみ。パスワード・ハッシュ・JWTを本文やログに含めない。
- A8: CookieはHttpOnly、SameSite=Strict、Path=/auth。本番NODE_ENV=productionではSecure。JWT_SECRETは32バイト以上必須、既定値なし。
- A9: POSTはapplication/jsonとX-Requested-With: XMLHttpRequest必須（415/403）。CLIENT_ORIGINSで指定したクライアントのCORS・Cookie付き通信のみ許可する。未知のOriginは403。
- A10: 登録・ログインをIPごとに15分30回までに制限。超過は429。単一プロセス内の制限で、再起動でリセット。
- A11: 不正入力は400。内部エラーは詳細を含まない500 JSON。認証レスポンスはCache-Control: no-store。

## ローカル設定

`GET /auth/password-policy` は認証不要で `{ "minLength": 4, "maxBytes": 72 }` の形式で現在の登録条件を返す。minLengthは環境変数に追従し、Reactのsignupページもこの値を参照する。レスポンスはno-store。

開発用の最小文字数を `.env` で設定する。

```env
PASSWORD_MIN_LENGTH=4
```

1〜72の整数を設定可能。変更後はサーバーを再起動する。未指定時は4、空欄・不正値は起動時にエラーとする。
登録チェック、エラーメッセージ、ホームページの説明は同じ設定を参照する。
設定を増やした後も既存ユーザーがログインできるよう、ログインでは新しい最小文字数を強制せず、空文字と72バイト超過を拒否する。
既存パスワードの変更は行わない。

既存.envにJWT_SECRETを追加する。次のコマンドで生成し、出力を.envへ保存する。秘密値は共有しない。

```powershell
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

## PowerShellで確認

サーバーを起動し、PORTに合わせてURLを変更する。

```powershell
$base = 'http://localhost:3000/auth'
$headers = @{ 'X-Requested-With' = 'XMLHttpRequest' }
$body = @{ name = 'テストユーザー'; email = 'you@example.com'; password = 'your-long-password' } | ConvertTo-Json
Invoke-RestMethod "$base/register" -Method Post -Headers $headers -ContentType 'application/json' -Body $body
Invoke-RestMethod "$base/login" -Method Post -Headers $headers -ContentType 'application/json' -Body $body -SessionVariable authSession
Invoke-RestMethod "$base/me" -WebSession $authSession
Invoke-RestMethod "$base/logout" -Method Post -Headers $headers -ContentType 'application/json' -Body '{}' -WebSession $authSession
```

本番はHTTPSを使用する。開発中はlocalhost:5173の画面からlocalhost:3000へCookie認証で接続できる。localhostと127.0.0.1を混在させず、同じホスト名を使う。別サイトへのCookie送信はSameSite=Strictで許可しない。
現在はメール確認、パスワード再設定、MFA、分散レート制限を対象外とする。
