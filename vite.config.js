import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8000,
    allowedHosts: [
      'unruffled-reconcile-rival.ngrok-free.dev' // Явно разрешаем твой хост
    ]
  }
})