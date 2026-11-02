export const DESIGN_STORAGE_KEY = 'loop.design.v1'
export const DEFAULT_DESIGN = 'forest'
export const designs = {
  forest: {
    label: 'フォレスト',
    description: '落ち着いた緑のオリジナルデザイン',
  },
  sunrise: {
    label: 'サンライズ',
    description: '暖色と丸みのある、親しみやすいデザイン',
  },
}

export function normalizeDesign(value) {
  return Object.hasOwn(designs, value) ? value : DEFAULT_DESIGN
}

export function getNextDesign(value) {
  return normalizeDesign(value) === 'forest' ? 'sunrise' : 'forest'
}

export function readDesign(storage) {
  try {
    return normalizeDesign(storage?.getItem(DESIGN_STORAGE_KEY))
  } catch {
    return DEFAULT_DESIGN
  }
}

export function saveDesign(storage, value) {
  try {
    storage?.setItem(DESIGN_STORAGE_KEY, normalizeDesign(value))
  } catch {
    /* 保存できない環境でも画面上の切り替えは継続する。 */
  }
}
