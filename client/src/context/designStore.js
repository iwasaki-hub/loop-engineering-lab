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
  prism: {
    label: 'プリズム',
    description: '白と濃紺に、鮮やかなグラデーションを重ねるデザイン',
  },
}

export function normalizeDesign(value) {
  return Object.hasOwn(designs, value) ? value : DEFAULT_DESIGN
}

export function getNextDesign(value) {
  const keys = Object.keys(designs)
  return keys[(keys.indexOf(normalizeDesign(value)) + 1) % keys.length]
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
