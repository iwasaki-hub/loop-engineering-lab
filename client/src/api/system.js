import { http } from './http.js'

export async function getServerHealth(signal) {
  const { data } = await http.get('/health', { signal })
  if (data.status !== 'ok') throw new Error('Unexpected health response')
  return data
}
