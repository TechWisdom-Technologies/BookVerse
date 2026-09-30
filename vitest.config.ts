import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.{ts,tsx}'],
    exclude: ['node_modules', '.next', 'Archive'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'text-summary', 'html'],
      include: ['src/**/*.ts', 'src/**/*.tsx', 'middleware.ts'],
      exclude: [
        'src/lib/prisma.ts', 
        'src/lib/firebase.ts', 
        'src/lib/firebase-admin.ts',
        'src/generated/**',
        'src/app/api/**', // Excluding API routes as they require integration tests
        'src/app/robots.ts',
        'src/app/sitemap.ts'
      ],
      all: true,
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@prisma/client': path.resolve(__dirname, './src/generated/client'),
    },
  },
});
