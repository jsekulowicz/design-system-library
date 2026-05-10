import { defineConfig, devices } from '@playwright/test';

const port = 6006;
const baseURL = `http://localhost:${port}`;
const isCI = Boolean(process.env['CI']);

export default defineConfig({
  testDir: './',
  testIgnore: ['visual/**'],
  timeout: 30_000,
  forbidOnly: isCI,
  retries: isCI ? 2 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never' }]] : 'list',
  use: {
    baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
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
