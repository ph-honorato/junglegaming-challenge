import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}'],
    globals: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@components/*': path.resolve(__dirname, './src/components/*'),
      '@lib/*': path.resolve(__dirname, './src/lib/*'),
      '@hooks/*': path.resolve(__dirname, './src/hooks/*'),
      '@mocks/*': path.resolve(__dirname, './src/mocks/*'),
    },
  },
})