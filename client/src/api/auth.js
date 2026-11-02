import { http } from './http.js'

export const authApi = {
  async passwordPolicy(signal) {
    const { data } = await http.get('/auth/password-policy', { signal })
    if (
      !Number.isInteger(data.minLength) ||
      data.minLength < 1 ||
      data.minLength > 72 ||
      data.maxBytes !== 72
    ) {
      throw new Error('Invalid password policy')
    }
    return data
  },
  async me(signal) {
    const { data } = await http.get('/auth/me', { signal })
    return data.user
  },
  async login(credentials) {
    const { data } = await http.post('/auth/login', credentials)
    return data.user
  },
  async register(details) {
    const { data } = await http.post('/auth/register', details)
    return data.user
  },
  async logout() {
    await http.post('/auth/logout', {})
  },
}
