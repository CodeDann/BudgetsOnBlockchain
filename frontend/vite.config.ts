import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
    server: {
    host: true,
    port: 3000,
    watch: {
      usePolling: true, // Crucial for Docker to "see" file changes
    },
  },
  plugins: [react()],
})