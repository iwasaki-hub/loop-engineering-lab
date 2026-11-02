const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

test('認証API: 登録・ログイン・本人取得・失効・異常系', { timeout: 30000 }, async (t) => {
  process.env.JWT_SECRET = 'test-only-secret-not-for-production-0123456789';
  process.env.PASSWORD_MIN_LENGTH = '4';
  const repository = require('../src/repositories/users');
  const users = new Map();
  let nextId = 1;
  t.mock.method(repository, 'create', async (data) => {
    if ([...users.values()].some((u) => u.email === data.email)) {
      throw Object.assign(new Error('duplicate'), { code: 11000 });
    }
    const user = { ...data, _id: String(nextId++), tokenVersion: 0 };
    users.set(user._id, user);
    return user;
  });
  t.mock.method(repository, 'findByEmail', async (email) => [...users.values()].find((u) => u.email === email));
  t.mock.method(repository, 'findById', async (id) => users.get(id));
  t.mock.method(repository, 'revokeSessions', async (id) => { users.get(id).tokenVersion++; });

  const server = http.createServer(require('../src/app'));
  server.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/auth`;
  async function request(path, { method = 'GET', body, cookie, csrf = true } = {}) {
    const headers = {};
    if (method === 'POST') {
      headers['Content-Type'] = 'application/json';
      if (csrf) headers['X-Requested-With'] = 'XMLHttpRequest';
    }
    if (cookie) headers.Cookie = cookie;
    return fetch(base + path, { method, headers, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(5000) });
  }
  const credentials = { name: ' テストユーザー ', email: ' Test@Example.com ', password: 'correct-password-123' };
  try {
    let response = await request('/register', { method: 'POST', body: credentials });
    assert.equal(response.status, 201);
    const registered = await response.json();
    assert.deepEqual(Object.keys(registered.user).sort(), ['email', 'id', 'name']);
    assert.equal(registered.user.name, 'テストユーザー');
    assert.equal(registered.user.email, 'test@example.com');
    const stored = [...users.values()][0];
    assert.notEqual(stored.passwordHash, credentials.password);
    assert.equal(await bcrypt.compare(credentials.password, stored.passwordHash), true);

    response = await request('/register', { method: 'POST', body: credentials });
    assert.equal(response.status, 409);
    response = await request('/login', { method: 'POST', body: { ...credentials, password: 'wrong-password' } });
    assert.equal(response.status, 401);
    response = await request('/login', { method: 'POST', body: { email: 'missing@example.com', password: 'wrong-password' } });
    assert.equal(response.status, 401);

    response = await request('/login', { method: 'POST', body: credentials });
    assert.equal(response.status, 200);
    const setCookie = response.headers.get('set-cookie');
    assert.match(setCookie, /HttpOnly/i);
    assert.match(setCookie, /SameSite=Strict/i);
    assert.match(setCookie, /Path=\/auth/i);
    const cookie = setCookie.split(';')[0];
    const token = decodeURIComponent(cookie.split('=')[1]);
    const claims = jwt.verify(token, process.env.JWT_SECRET, { algorithms: ['HS256'], issuer: 'loop-engineering-lab', audience: 'loop-auth' });
    assert.equal(claims.exp - claims.iat, 3600);
    assert.equal((await response.json()).user.email, 'test@example.com');
    response = await request('/me', { cookie });
    assert.equal(response.status, 200);
    const currentUser = (await response.json()).user;
    assert.deepEqual(Object.keys(currentUser).sort(), ['email', 'id', 'name']);
    assert.equal(currentUser.name, 'テストユーザー');
    assert.equal((await request('/me')).status, 401);
    assert.equal((await request('/me', { cookie: 'auth_token=tampered' })).status, 401);
    const expired = jwt.sign({ ver: 0 }, process.env.JWT_SECRET, { algorithm: 'HS256', subject: stored._id, expiresIn: -1, issuer: 'loop-engineering-lab', audience: 'loop-auth' });
    assert.equal((await request('/me', { cookie: `auth_token=${expired}` })).status, 401);

    const previousNodeEnv = process.env.NODE_ENV;
    try {
      process.env.NODE_ENV = 'production';
      response = await request('/login', { method: 'POST', body: credentials });
      assert.match(response.headers.get('set-cookie'), /; Secure/i);
      assert.equal(response.headers.get('cache-control'), 'no-store');
    } finally {
      if (previousNodeEnv === undefined) delete process.env.NODE_ENV;
      else process.env.NODE_ENV = previousNodeEnv;
    }

    response = await request('/logout', { method: 'POST', body: {}, cookie });
    assert.equal(response.status, 204);
    assert.match(response.headers.get('set-cookie'), /Expires=Thu, 01 Jan 1970/i);
    assert.equal((await request('/me', { cookie })).status, 401);
    assert.equal((await request('/login', { method: 'POST', body: credentials, csrf: false })).status, 403);
    for (const body of [{}, { email: { $ne: null }, password: 'password1234' }, { email: 'bad', password: 'password1234' }, { email: 'a@b.com', password: 'abc' }, { email: 'a@b.com', password: 'あ'.repeat(25) }]) {
      assert.equal((await request('/register', { method: 'POST', body })).status, 400);
    }
    t.mock.method(repository, 'findByEmail', async () => { throw new Error('private DB error'); });
    response = await request('/login', { method: 'POST', body: credentials });
    assert.equal(response.status, 500);
    assert.equal((await response.text()).includes('private DB error'), false);
    for (let i = 0; i < 31; i++) {
      response = await request('/login', { method: 'POST', body: {} });
    }
    assert.equal(response.status, 429);
    assert.ok(Number(response.headers.get('retry-after')) > 0);
  } finally {
    await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); });
  }
});

test('JWT_SECRETは未設定・短い値を拒否する', () => {
  const { getSecret } = require('../src/config/auth');
  const previous = process.env.JWT_SECRET;
  try {
    delete process.env.JWT_SECRET;
    assert.throws(getSecret, /JWT_SECRET/);
    process.env.JWT_SECRET = 'short';
    assert.throws(getSecret, /JWT_SECRET/);
  } finally {
    if (previous === undefined) delete process.env.JWT_SECRET;
    else process.env.JWT_SECRET = previous;
  }
});
