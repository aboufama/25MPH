import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// The Vite dev server (port 5173) proxies /api requests to the Express
// backend (port 4242) so the frontend and Stripe backend feel like one app.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:4242',
    },
  },
})
