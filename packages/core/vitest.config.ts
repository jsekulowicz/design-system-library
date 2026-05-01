import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'lcov', 'json-summary'],
      reportsDirectory: './coverage',
      all: true,
      include: ['src/**/*.ts'],
      exclude: [
        ...coverageConfigDefaults.exclude,
        'src/**/*.test.ts',
        'src/**/define.ts',
        'src/**/styles/**',
        'src/**/utils/**',
      ],
      excludeAfterRemap: true,
      reportOnFailure: true,
    },
  },
});
