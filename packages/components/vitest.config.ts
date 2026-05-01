import { coverageConfigDefaults, defineConfig } from 'vitest/config';
import { resolve } from 'node:path';

function suppressKnownTestNoise(log: string, type: 'stdout' | 'stderr'): boolean | void {
  if (type === 'stderr' && log.includes('Lit is in dev mode. Not recommended for production!')) {
    return false;
  }
}

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
    onConsoleLog: suppressKnownTestNoise,
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/**/*.test.ts',
        'src/**/*.stories.ts',
        'src/**/define.ts',
        'src/**/utils/**',
        'src/test-utils/**',
        'src/**/*.styles.ts',
        'src/atoms/icon/icons/**',
      ],
      excludeAfterRemap: true,
      reportOnFailure: true,
    },
  },
});
