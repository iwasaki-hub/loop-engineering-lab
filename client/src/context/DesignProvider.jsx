import { useCallback, useEffect, useMemo, useState } from 'react'
import { DesignContext } from './DesignContext'
import {
  DEFAULT_DESIGN,
  designs,
  getNextDesign,
  normalizeDesign,
  readDesign,
  saveDesign,
} from './designStore'
import '../styles/designs.css'
import '../styles/prism.css'

function initialValue(initialDesign) {
  if (initialDesign !== undefined) return normalizeDesign(initialDesign)
  try {
    return readDesign(window.localStorage)
  } catch {
    return DEFAULT_DESIGN
  }
}

export function DesignProvider({ children, initialDesign }) {
  const [design, setDesignState] = useState(() => initialValue(initialDesign))
  useEffect(() => {
    try {
      saveDesign(window.localStorage, design)
    } catch {
      /* SSR・ストレージ制限に対応。 */
    }
  }, [design])
  const setDesign = useCallback(
    (value) => setDesignState(normalizeDesign(value)),
    [],
  )
  const toggleDesign = useCallback(() => setDesignState(getNextDesign), [])
  const value = useMemo(
    () => ({ design, currentDesign: designs[design], setDesign, toggleDesign }),
    [design, setDesign, toggleDesign],
  )

  // keyを変更せず、認証やフォームを含む既存の画面状態を保持する。
  return (
    <DesignContext.Provider value={value}>
      <div className="design-root" data-design={design}>
        {children}
        <span className="design-announcement" role="status">
          デザイン：{designs[design].label}
        </span>
      </div>
    </DesignContext.Provider>
  )
}
