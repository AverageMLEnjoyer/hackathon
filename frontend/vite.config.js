import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    allowedHosts: [
      'gentleman-penalize-slashing.ngrok-free.dev'
    ]
  }
})