import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/admin/',
  publicDir: 'public',
  build: {
    copyPublicDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5146',
        changeOrigin: true,
        secure: false,
      },
      // Direct API endpoints without /api prefix
      '/Hotels': {
        target: 'http://localhost:5146/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/Hotels', '/hotels')
      },
      '/Currency': {
        target: 'http://localhost:5146/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/Currency', '/currency')
      },
      '/Suppliers': {
        target: 'http://localhost:5146/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/Suppliers', '/suppliers')
      },
      '/GuestMaster': {
        target: 'http://localhost:5146/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/GuestMaster', '/guestmaster')
      },
      '/RoomTypes': {
        target: 'http://localhost:5146/api',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace('/RoomTypes', '/roomtypes')
      }
    }
  }
})
