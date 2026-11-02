require('dotenv').config({ quiet: true });
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const mongoose = require('mongoose');
const { once } = require('node:events');

// 通常のDBから分離した、この実行専用のDBだけを作成・削除する。
const dbName = `loop_auth_test_${crypto.randomBytes(12).toString('hex')}`;
process.env.JWT_SECRET = crypto.randomBytes(32).toString('hex');
process.env.NODE_ENV = 'test';
process.env.CLIENT_ORIGINS = 'http://localhost:5173';
let server;

async function run() {
  if (!process.env.MONGO_URI) throw new Error('Missing configuration');
  await mongoose.connect(process.env.MONGO_URI, { dbName, serverSelectionTimeoutMS: 10000 });
  const User = require('../src/models/User');
  await User.init();
  server = require('../src/app').listen(0, '127.0.0.1');
  await once(server, 'listening');
  const base = `http://127.0.0.1:${server.address().port}/auth`;
  const credentials = { name: 'Smoke Test', email: 'smoke@example.com', password: crypto.randomBytes(24).toString('hex') };
  async function post(route, body, cookie) {
    return fetch(base + route, {
      method: 'POST',
      headers: { Origin: 'http://localhost:5173', 'Content-Type': 'application/json', 'X-Requested-With': 'XMLHttpRequest', ...(cookie ? { Cookie: cookie } : {}) },
      body: JSON.stringify(body), signal: AbortSignal.timeout(5000),
    });
  }
  assert.equal((await post('/register', credentials)).status, 201);
  assert.equal((await post('/register', credentials)).status, 409);
  const stored = await User.findOne({ email: credentials.email }).select('+passwordHash').lean();
  assert.ok(stored);
  assert.notEqual(stored.passwordHash, credentials.password);
  let response = await post('/login', credentials);
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('access-control-allow-origin'), 'http://localhost:5173');
  assert.equal(response.headers.get('access-control-allow-credentials'), 'true');
  const cookie = response.headers.get('set-cookie').split(';')[0];
  response = await fetch(base + '/me', { headers: { Cookie: cookie }, signal: AbortSignal.timeout(5000) });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { user: { id: String(stored._id), name: credentials.name, email: credentials.email } });
  assert.equal((await post('/logout', {}, cookie)).status, 204);
  assert.equal((await fetch(base + '/me', { headers: { Cookie: cookie }, signal: AbortSignal.timeout(5000) })).status, 401);
  console.log('MongoDB auth flow: passed');
}

async function cleanup() {
  if (server) await new Promise((resolve) => { server.close(resolve); server.closeAllConnections(); });
  if (mongoose.connection.readyState === 1 && mongoose.connection.name === dbName && /^loop_auth_test_[a-f0-9]{24}$/.test(dbName)) {
    await mongoose.connection.dropDatabase();
    console.log('Isolated auth test database: removed');
  }
  await mongoose.disconnect();
}

run().catch(() => {
  console.error('MongoDB auth flow failed (private details suppressed)');
  process.exitCode = 1;
}).finally(async () => {
  try { await cleanup(); } catch {
    console.error('Auth test cleanup failed (private details suppressed)');
    process.exitCode = 1;
  }
});
