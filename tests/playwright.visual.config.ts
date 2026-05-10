import { defineConfig, devices } from '@playwright/test';

const port = 6006;
const baseURL = `http://localhost:${port}`;
const isCI = Boolean(process.env['CI']);
const snapshotDir = process.env['VISUAL_SNAPSHOT_DIR'] ?? '{testDir}/__screenshots__';

export default defineConfig({
  testDir: './visual',
  snapshotPathTemplate: `${snapshotDir}/{arg}{ext}`,
  outputDir: './visual-results',
  timeout: 60_000,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI
    ? [['github'], ['html', { open: 'never', outputFolder: 'visual-report' }]]
    : 'list',
  expect: {
    toHaveScreenshot: {
      maxDiffPixelRatio: 0.01,
      threshold: 0.2,
    },
  },
  use: {
    baseURL,
    colorScheme: 'light',
    deviceScaleFactor: 1,
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'visual-chromium', use: { ...devices['Desktop Chrome'] } },
  ],
  webServer: {
    command: 'pnpm -F @ds/storybook preview',
    url: baseURL,
    reuseExistingServer: !isCI,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
});
