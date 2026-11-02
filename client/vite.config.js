import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  const target = env.API_PROXY_TARGET || 'http://127.0.0.1:3000'
  return {
    plugins: [react()],
    server: {
      port: 5173,
      strictPort: true,
      proxy: Object.fromEntries(
        ['/auth', '/health', '/echo'].map((route) => [
          route,
          { target, changeOrigin: true },
        ]),
      ),
    },
  }
})
