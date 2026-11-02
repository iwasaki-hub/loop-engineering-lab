const test = require('node:test');
const assert = require('node:assert/strict');
const { once } = require('node:events');

test('H1: ホームと静的アセットを公開し、JSON APIを維持する', async () => {
  const app = require('../src/app');
  const server = app.listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}`;
  try {
    const response = await fetch(base, { signal: AbortSignal.timeout(5000) });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.match(response.headers.get('content-type'), /text\/html/);
    const html = await response.text();
    for (const value of ['Loop Engineering Lab', '/auth/register', '/auth/login', '/auth/me', '/auth/logout', '/health', '/echo']) {
      assert.ok(html.includes(value), value);
    }
    assert.ok(!html.includes('<%'));
    assert.ok(!html.includes('/static/js/bundle.js'));
    assert.ok(!html.includes('logo192.png'));
    for (const [asset, type] of [
      ['/assets/home.css', /text\/css/],
      ['/assets/home.js', /javascript/],
      ['/assets/fontawesome/css/fontawesome.min.css', /text\/css/],
      ['/assets/fontawesome/css/solid.min.css', /text\/css/],
      ['/assets/fontawesome/webfonts/fa-solid-900.woff2', /font\/woff2/],
    ]) {
      const result = await fetch(base + asset, { signal: AbortSignal.timeout(5000) });
      assert.equal(result.status, 200);
      assert.match(result.headers.get('content-type'), type);
      await result.text();
    }
    const health = await fetch(base + '/health', { signal: AbortSignal.timeout(5000) });
    assert.deepEqual(await health.json(), { status: 'ok' });
  } finally {
    await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); });
  }
});
