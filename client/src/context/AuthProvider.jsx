import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { authApi } from '../api/auth'
import { getApiErrorMessage } from '../api/http'
import { AuthContext } from './AuthContext'

export function AuthProvider({ children }) {
  const [session, setSession] = useState({
    user: null,
    status: 'loading',
    error: null,
  })
  const [refreshKey, setRefreshKey] = useState(0)
  const requestVersion = useRef(0)
  useEffect(() => {
    const controller = new AbortController()
    const version = ++requestVersion.current
    authApi
      .me(controller.signal)
      .then((user) => {
        if (!controller.signal.aborted && version === requestVersion.current)
          setSession({ user, status: 'authenticated', error: null })
      })
      .catch((error) => {
        if (controller.signal.aborted || version !== requestVersion.current)
          return
        setSession(
          error.response?.status === 401
            ? { user: null, status: 'anonymous', error: null }
            : { user: null, status: 'error', error: getApiErrorMessage(error) },
        )
      })
    return () => controller.abort()
  }, [refreshKey])
  const refreshSession = useCallback(() => {
    requestVersion.current++
    setSession((previous) => ({ ...previous, status: 'loading', error: null }))
    setRefreshKey((key) => key + 1)
  }, [])
  const login = useCallback(
    async (credentials) => {
      const version = ++requestVersion.current
      try {
        const user = await authApi.login(credentials)
        if (version === requestVersion.current)
          setSession({ user, status: 'authenticated', error: null })
        return user
      } catch (error) {
        if (version === requestVersion.current) refreshSession()
        throw error
      }
    },
    [refreshSession],
  )
  const logout = useCallback(async () => {
    const version = ++requestVersion.current
    try {
      await authApi.logout()
      if (version === requestVersion.current)
        setSession({ user: null, status: 'anonymous', error: null })
    } catch (error) {
      if (version === requestVersion.current) refreshSession()
      throw error
    }
  }, [refreshSession])
  // 登録APIは自動ログインしないため、登録結果をセッションに入れない。
  const register = useCallback((details) => authApi.register(details), [])
  const value = useMemo(
    () => ({ ...session, login, logout, register, refreshSession }),
    [session, login, logout, register, refreshSession],
  )
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
