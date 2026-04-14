import { defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

export default defineConfig({
  resolve: {
    alias: {
      '@ds/core': resolve(__dirname, '../core/src/index.ts'),
      '@ds/tokens': resolve(__dirname, '../tokens/src/index.ts'),
    },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
  },
});
