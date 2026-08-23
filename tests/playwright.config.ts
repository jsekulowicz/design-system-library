import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env['STORYBOOK_PORT'] ?? 6007);
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
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `pnpm -F @ds/storybook exec http-server storybook-static -p ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
});
