import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    port: 5173,
    open: false,
    // 本地开发时把 /api 代理到 wrangler pages dev（npm run api）
    proxy: {
      '/api': 'http://localhost:8788',
    },
  },
})
