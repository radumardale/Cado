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
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.{idea,git,cache,output,temp}/**',
      '.claude/**',
      'docs/**',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/__tests__/',
        '*.config.*',
        '**/types/**',
        '**/enums/**',
        '.next/',
        'dist/',
        '.claude/',
        'scripts/',
        'docs/',
        'src/components/tiptap/',
        '**/*.d.ts',
        // Next.js App Routes (pages, layouts, route handlers)
        'src/app/**/page.tsx',
        'src/app/**/layout.tsx',
        'src/app/**/template.tsx',
        'src/app/**/loading.tsx',
        'src/app/**/route.ts',
        // tRPC infrastructure
        'src/app/_trpc/**',
        'src/server/procedures/routers/**',
        'src/server/index.ts',
        // Server infrastructure
        'src/server/actions/**',
        'src/middleware.ts',
        // State management
        'src/states/**',
        // Auth & AWS utilities
        'src/lib/auth.ts',
        'src/server/procedures/image/deleteObjects/**',
      ],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src',
    },
  },
});
