import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/customer': 'http://localhost:9001',
      '/products': 'http://localhost:9001'
    }
  }
})
