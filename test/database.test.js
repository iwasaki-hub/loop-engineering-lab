const test = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');

test('R10: MONGO_URIをMongooseに渡して接続完了を待つ', async (t) => {
  const connectDatabase = require('../src/config/database');
  const uri = 'mongodb://127.0.0.1:27017/test';
  t.mock.method(mongoose, 'connect', async (value) => {
    assert.equal(value, uri);
    return mongoose;
  });
  assert.equal(await connectDatabase(uri), mongoose);
});

test('R10: URI未設定では接続を試みず失敗する', async (t) => {
  const connectDatabase = require('../src/config/database');
  const connect = t.mock.method(mongoose, 'connect', async () => {});
  await assert.rejects(connectDatabase(''), /MONGO_URI/);
  assert.equal(connect.mock.callCount(), 0);
});

test('R10: 接続失敗を呼び出し元に伝える', async (t) => {
  const connectDatabase = require('../src/config/database');
  const error = new Error('Connection failed');
  t.mock.method(mongoose, 'connect', async () => { throw error; });
  await assert.rejects(connectDatabase('mongodb://127.0.0.1:27017/test'), error);
});
