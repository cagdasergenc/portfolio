// Build config. React plugin, Tailwind 4's Vite plugin, and the Vitest
// settings (jsdom, and only *.test.js files under src/).

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.js'],
  },
})
