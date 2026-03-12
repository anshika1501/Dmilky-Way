import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Allow requests from the production domain used for testing
    allowedHosts: ['milkman.anshikapriya.online']
  },
})
