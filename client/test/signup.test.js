import test from 'node:test'
import assert from 'node:assert/strict'
import { validateSignup } from '../src/pages/auth/signupValidation.js'
import { getSignupErrorMessage } from '../src/api/http.js'

test('登録条件の変更・UTF-8上限・確認用パスワードを検証する', () => {
  const values = {
    name: '',
    email: 'test@example.com',
    password: '1234',
    confirmPassword: '1234',
  }
  const policy = { minLength: 4, maxBytes: 72 }
  assert.equal(validateSignup(values, policy), '')
  assert.match(validateSignup(values, { ...policy, minLength: 8 }), /8文字/)
  assert.match(validateSignup({ ...values, password: 'abc' }, policy), /4文字/)
  assert.match(
    validateSignup({ ...values, confirmPassword: 'different' }, policy),
    /一致/,
  )
  assert.match(
    validateSignup({ ...values, name: 'x'.repeat(101) }, policy),
    /100文字/,
  )
  assert.match(
    validateSignup({ ...values, email: 'invalid' }, policy),
    /メールアドレス/,
  )
  assert.match(validateSignup(values, null), /確認が完了/)
  assert.equal(
    validateSignup(
      {
        ...values,
        password: 'あ'.repeat(24),
        confirmPassword: 'あ'.repeat(24),
      },
      policy,
    ),
    '',
  )
  assert.match(
    validateSignup({ ...values, password: 'あ'.repeat(25) }, policy),
    /72バイト/,
  )
  assert.match(
    validateSignup(
      { ...values, password: '😀😀', confirmPassword: '😀😀' },
      policy,
    ),
    /4文字/,
  )
  assert.match(
    getSignupErrorMessage({ response: { status: 409 } }),
    /すでに登録/,
  )
  assert.match(getSignupErrorMessage({ response: { status: 400 } }), /登録条件/)
})
