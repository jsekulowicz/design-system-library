import { coverageConfigDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
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
        'src/**/utils/**',
        'src/build.ts',
      ],
      excludeAfterRemap: true,
      reportOnFailure: true,
    },
  },
});
