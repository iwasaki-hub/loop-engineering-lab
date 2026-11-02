export function validateSignup(
  { name, email, password, confirmPassword },
  policy,
) {
  if (!policy) return 'パスワード条件の確認が完了するまでお待ちください。'
  if (name.trim().length > 100) return '名前は100文字以内で入力してください。'
  if (
    email.trim().length > 254 ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())
  ) {
    return 'メールアドレスの形式を確認してください。'
  }
  if (Array.from(password).length < policy.minLength)
    return `パスワードは${policy.minLength}文字以上で入力してください。`
  if (new TextEncoder().encode(password).length > policy.maxBytes)
    return `パスワードはUTF-8で${policy.maxBytes}バイト以内にしてください。`
  if (password !== confirmPassword)
    return '確認用パスワードが一致していません。'
  return ''
}
