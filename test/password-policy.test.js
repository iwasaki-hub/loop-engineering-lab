const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

test('パスワード設定が登録チェック・エラー・画面に反映される', async (t) => {
  const { getPasswordPolicy } = require('../src/config/auth');
  const auth = require('../src/services/auth');
  const users = require('../src/repositories/users');
  const previous = process.env.PASSWORD_MIN_LENGTH;
  const previousSecret = process.env.JWT_SECRET;
  process.env.JWT_SECRET = 'password-policy-test-secret-0123456789';
  let stored;
  t.mock.method(users, 'create', async (data) => {
    stored = { ...data, _id: 'test-user', tokenVersion: 0 };
    return stored;
  });
  t.mock.method(users, 'findByEmail', async () => stored);
  let server;
  try {
    delete process.env.PASSWORD_MIN_LENGTH;
    assert.equal(getPasswordPolicy().minLength, 4);
    process.env.PASSWORD_MIN_LENGTH = '4';
    await assert.rejects(auth.register({ email: 'test@example.com', password: '123' }), /4 characters minimum/);
    assert.equal((await auth.register({ email: 'test@example.com', password: '1234' })).email, 'test@example.com');
    process.env.PASSWORD_MIN_LENGTH = '8';
    await assert.rejects(auth.register({ email: 'test@example.com', password: '1234' }), /8 characters minimum/);
    assert.equal((await auth.login({ email: 'test@example.com', password: '1234' })).user.email, 'test@example.com');
    await auth.register({ email: 'test@example.com', password: '12345678' });

    server = require('../src/app').listen(0, '127.0.0.1');
    await once(server, 'listening');
    const base = `http://127.0.0.1:${server.address().port}`;
    let response = await fetch(base);
    assert.match(await response.text(), /パスワードは8文字以上/);
    process.env.PASSWORD_MIN_LENGTH = '4';
    response = await fetch(base);
    assert.match(await response.text(), /パスワードは4文字以上/);
    for (const value of ['', '0', '-1', '4.5', 'abc', '73']) {
      process.env.PASSWORD_MIN_LENGTH = value;
      assert.throws(getPasswordPolicy, /PASSWORD_MIN_LENGTH/);
    }
  } finally {
    if (previous === undefined) delete process.env.PASSWORD_MIN_LENGTH;
    else process.env.PASSWORD_MIN_LENGTH = previous;
    if (previousSecret === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previousSecret;
    if (server) await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); });
  }
});
