import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/claude-code-explorer/',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 5173,
  },
})
