const test = require('node:test');
const assert = require('node:assert/strict');

test('nameは任意で空白を除去し、不正型・長すぎる値は保存しない', async (t) => {
  const auth = require('../src/services/auth');
  const users = require('../src/repositories/users');
  const User = require('../src/models/User');
  const previous = process.env.PASSWORD_MIN_LENGTH;
  process.env.PASSWORD_MIN_LENGTH = '4';
  const create = t.mock.method(users, 'create', async (data) => ({ ...data, _id: 'user' }));
  const credentials = { email: 'name@example.com', password: '1234' };
  try {
    for (const name of [123, null, {}, 'x'.repeat(101)]) {
      await assert.rejects(auth.register({ ...credentials, name }), { status: 400 });
    }
    assert.equal(create.mock.callCount(), 0);
    assert.equal((await auth.register(credentials)).name, '');
    assert.equal((await auth.register({ ...credentials, name: 'x'.repeat(100) })).name.length, 100);
    assert.equal(auth.publicUser({ _id: 'old', email: credentials.email }).name, '');
    const user = new User({ name: ' 名前 ', email: credentials.email, passwordHash: 'fixture' });
    assert.equal(user.name, '名前');
    await user.validate();
    user.name = 'x'.repeat(101);
    await assert.rejects(user.validate(), (error) => Boolean(error.errors.name));
  } finally {
    if (previous === undefined) delete process.env.PASSWORD_MIN_LENGTH;
    else process.env.PASSWORD_MIN_LENGTH = previous;
  }
});
