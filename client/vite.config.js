import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

const apiProxy = {
  target: 'http://localhost:9001',
  changeOrigin: true,
  bypass(request) {
    if (request.headers.accept?.includes('text/html')) {
      return request.url
    }
  }
}

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/customer': {
        target: 'http://localhost:9001',
        changeOrigin: true
      },
      '/products': apiProxy,
      '/cart': apiProxy,
      '/wishlist': apiProxy
    }
  }
})
