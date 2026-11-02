import test from 'node:test'
import assert from 'node:assert/strict'
import {
  DEFAULT_DESIGN,
  DESIGN_STORAGE_KEY,
  getNextDesign,
  normalizeDesign,
  readDesign,
  saveDesign,
} from '../src/context/designStore.js'

test('デザイン設定を保存・復元し、不明な値と保存禁止に対応する', () => {
  const values = new Map()
  const storage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
  }
  assert.equal(readDesign(storage), 'forest')
  assert.equal(getNextDesign('forest'), 'sunrise')
  assert.equal(getNextDesign('sunrise'), 'forest')
  saveDesign(storage, 'sunrise')
  assert.equal(values.get(DESIGN_STORAGE_KEY), 'sunrise')
  assert.equal(readDesign(storage), 'sunrise')
  saveDesign(storage, 'forest')
  assert.equal(readDesign(storage), 'forest')
  for (const invalid of [null, undefined, 'invalid', '__proto__', 'toString'])
    assert.equal(normalizeDesign(invalid), DEFAULT_DESIGN)
  const blocked = {
    getItem() {
      throw Error('blocked')
    },
    setItem() {
      throw Error('blocked')
    },
  }
  assert.equal(readDesign(blocked), 'forest')
  assert.doesNotThrow(() => saveDesign(blocked, 'sunrise'))
})
