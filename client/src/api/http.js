import axios from 'axios'

// URL未設定ならViteプロキシを利用。設定時はCORS経由でAPIへ直接接続する。
export const http = axios.create({
  baseURL: import.meta.env?.VITE_API_BASE_URL || '/',
  withCredentials: true,
  timeout: 10000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
})

export function getApiErrorMessage(error) {
  if (!error.response)
    return 'APIに接続できません。サーバーの起動を確認してください。'
  if (error.response.status === 429)
    return 'リクエストが多すぎます。時間をおいてお試しください。'
  return '処理に失敗しました。もう一度お試しください。'
}

export function getLoginErrorMessage(error) {
  if (error.response?.status === 401)
    return 'メールアドレスまたはパスワードが正しくありません。'
  if (error.response?.status === 400)
    return 'メールアドレスとパスワードの入力内容を確認してください。'
  return getApiErrorMessage(error)
}

export function getSignupErrorMessage(error) {
  if (error.response?.status === 409)
    return 'このメールアドレスはすでに登録されています。ログインするか、別のメールアドレスをお使いください。'
  if (error.response?.status === 400)
    return '入力内容が登録条件を満たしていません。名前・メールアドレス・パスワードを確認してください。'
  return getApiErrorMessage(error)
}
