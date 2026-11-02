import test from 'node:test'
import assert from 'node:assert/strict'
import {
  http,
  getApiErrorMessage,
  getLoginErrorMessage,
} from '../src/api/http.js'
import { authApi } from '../src/api/auth.js'
import { getServerHealth } from '../src/api/system.js'

test('API層は既存の認証契約・Cookie・JSONヘッダーを維持する', async () => {
  const original = http.defaults.adapter
  const requests = []
  const user = { id: 'test', name: 'テスト', email: 'test@example.com' }
  let health = { status: 'ok' }
  let policy = { minLength: 4, maxBytes: 72 }
  http.defaults.adapter = async (config) => {
    requests.push(config)
    return {
      data:
        config.url === '/health'
          ? health
          : config.url === '/auth/password-policy'
            ? policy
            : { user },
      status: 200,
      statusText: 'OK',
      headers: {},
      config,
    }
  }
  try {
    const controller = new AbortController()
    assert.deepEqual(await authApi.me(controller.signal), user)
    const credentials = { email: user.email, password: 'test-password' }
    assert.deepEqual(await authApi.login(credentials), user)
    assert.deepEqual(
      await authApi.register({ ...credentials, name: user.name }),
      user,
    )
    await authApi.logout()
    assert.deepEqual(await getServerHealth(), { status: 'ok' })
    assert.deepEqual(await authApi.passwordPolicy(controller.signal), policy)
    assert.deepEqual(
      requests.map(({ method, url }) => [method, url]),
      [
        ['get', '/auth/me'],
        ['post', '/auth/login'],
        ['post', '/auth/register'],
        ['post', '/auth/logout'],
        ['get', '/health'],
        ['get', '/auth/password-policy'],
      ],
    )
    assert.equal(requests[0].signal, controller.signal)
    for (const config of requests) {
      assert.equal(config.withCredentials, true)
      assert.equal(config.headers['X-Requested-With'], 'XMLHttpRequest')
    }
    assert.deepEqual(JSON.parse(requests[1].data), credentials)
    assert.equal(requests[1].headers['Content-Type'], 'application/json')
    assert.deepEqual(JSON.parse(requests[3].data), {})
    health = { status: 'broken' }
    await assert.rejects(getServerHealth(), /Unexpected health response/)
    policy = { minLength: 8, maxBytes: 72 }
    assert.deepEqual(await authApi.passwordPolicy(), policy)
    policy = { minLength: 'invalid', maxBytes: 72 }
    await assert.rejects(authApi.passwordPolicy(), /Invalid password policy/)
    assert.match(getApiErrorMessage({}), /接続できません/)
    assert.match(
      getApiErrorMessage({ response: { status: 429 } }),
      /時間をおいて/,
    )
    assert.match(
      getLoginErrorMessage({ response: { status: 401 } }),
      /メールアドレスまたはパスワード/,
    )
    assert.match(
      getLoginErrorMessage({ response: { status: 400 } }),
      /入力内容/,
    )
    assert.match(
      getLoginErrorMessage({ response: { status: 429 } }),
      /時間をおいて/,
    )
  } finally {
    http.defaults.adapter = original
  }
})
