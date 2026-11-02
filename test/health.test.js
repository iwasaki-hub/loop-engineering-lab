const test = require('node:test');
const assert = require('node:assert/strict');
const http = require('node:http');
const { once } = require('node:events');

async function withServer(run) {
  const app = require('../src/app');
  const server = http.createServer(app);
  server.listen(0, '127.0.0.1');
  try {
    await once(server, 'listening');
    const baseUrl = `http://127.0.0.1:${server.address().port}`;
    await run(baseUrl);
  } finally {
    await new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeAllConnections();
    });
  }
}

test('R1・R2: GET /healthは200と所定のJSONを返す', { timeout: 5000 }, async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/health`, {
      signal: AbortSignal.timeout(3000),
    });
    assert.equal(response.status, 200);
    assert.match(response.headers.get('content-type') || '', /application\/json/i);
    assert.deepEqual(await response.json(), { status: 'ok' });
  });
});

test('R3: 未定義パスは404を返す', { timeout: 5000 }, async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/not-found`, {
      signal: AbortSignal.timeout(3000),
    });
    assert.equal(response.status, 404);
    await response.arrayBuffer();
  });
});

test('R7: POST /echoはオブジェクトと配列をJSONで返す', { timeout: 5000 }, async () => {
  await withServer(async (baseUrl) => {
    for (const payload of [{ name: 'テスト', nested: { enabled: true }, value: null }, [1, 'two', false]]) {
      const response = await fetch(`${baseUrl}/echo`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(3000),
      });
      assert.equal(response.status, 200);
      assert.match(response.headers.get('content-type') || '', /application\/json/i);
      assert.deepEqual(await response.json(), payload);
    }
  });
});

test('R8: 不正なJSONは400とJSONエラーを返す', { timeout: 5000 }, async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/echo`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{"broken":',
      signal: AbortSignal.timeout(3000),
    });
    assert.equal(response.status, 400);
    assert.equal(typeof (await response.json()).error, 'string');
  });
});

test('R9: JSON以外は415、本文なしは400を返す', { timeout: 5000 }, async () => {
  await withServer(async (baseUrl) => {
    for (const [headers, body, status] of [
      [{ 'Content-Type': 'text/plain' }, 'hello', 415],
      [{ 'Content-Type': 'application/json' }, undefined, 400],
    ]) {
      const response = await fetch(`${baseUrl}/echo`, {
        method: 'POST', headers, body, signal: AbortSignal.timeout(3000),
      });
      assert.equal(response.status, status);
      assert.equal(typeof (await response.json()).error, 'string');
    }
  });
});
