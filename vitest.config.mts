import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';

// Import the default export and destructure loadEnvConfig
import pkg from '@next/env';
const { loadEnvConfig } = pkg;

loadEnvConfig(process.cwd());

export default defineConfig({
  plugins: [tsconfigPaths(), react()],
  test: {
    environment: 'jsdom',
    testTimeout: 30000,
    setupFiles: ['./src/__tests__/setup.ts'],
    css: false, // Disable CSS processing in tests
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
