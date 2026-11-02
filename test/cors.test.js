const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

test('CORSは指定clientのCookie付き通信とプリフライトのみ許可する', async () => {
  process.env.CLIENT_ORIGINS = 'http://localhost:5173,http://127.0.0.1:5173';
  const app = require('../src/app');
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    for (const origin of ['http://localhost:5173', 'http://127.0.0.1:5173']) {
      const response = await fetch(base + '/health', { headers: { Origin: origin } });
      assert.equal(response.status, 200);
      assert.equal(response.headers.get('access-control-allow-origin'), origin);
      assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
      const preflight = await fetch(base + '/auth/login', { method: 'OPTIONS', headers: {
        Origin: origin, 'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'content-type,x-requested-with',
      } });
      assert.equal(preflight.status, 204);
      assert.match(preflight.headers.get('access-control-allow-methods'), /POST/);
      assert.match(preflight.headers.get('access-control-allow-headers').toLowerCase(), /x-requested-with/);
    }
    const rejected = await fetch(base + '/echo', { method: 'POST', headers: { Origin: 'https://untrusted.example', 'Content-Type': 'application/json' }, body: '{}' });
    assert.equal(rejected.status, 403);
    assert.equal(rejected.headers.get('access-control-allow-origin'), null);
    assert.equal((await fetch(base + '/health')).status, 200);
    assert.equal((await fetch(base + '/echo', { method: 'POST', headers: { Origin: base, 'Content-Type': 'application/json' }, body: '{}' })).status, 200);
    const unauthenticated = await fetch(base + '/auth/me', { headers: { Origin: 'http://localhost:5173' } });
    assert.equal(unauthenticated.status, 401);
    assert.equal(unauthenticated.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  } finally {
    await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); });
  }
});

test('CORS許可リストは環境変数を読み、不正値・ワイルドカードを拒否する', () => {
  const { getClientOrigins } = require('../src/config/cors');
  const previous = process.env.CLIENT_ORIGINS;
  try {
    process.env.CLIENT_ORIGINS = 'https://client.example';
    assert.deepEqual(getClientOrigins(), ['https://client.example']);
    for (const value of ['*', '', 'bad-url', 'https://client.example/path', 'null']) {
      process.env.CLIENT_ORIGINS = value;
      assert.throws(getClientOrigins, /CLIENT_ORIGINS/);
    }
  } finally { process.env.CLIENT_ORIGINS = previous; }
});
