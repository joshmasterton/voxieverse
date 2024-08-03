/// <reference types='vitest'/>
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 9000
  },
  base: '/voxieverse/',
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: 'vitest.setup.ts'
  }
});
