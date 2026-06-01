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
      // Absolute budget, not a ratio: small real changes (e.g. a button border-radius)
      // must not be diluted on large screenshots. With the deterministic launch flags
      // below the run-to-run noise floor is 0px, so 10 is a cushion, not a tolerance.
      maxDiffPixels: 10,
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
    {
      name: 'visual-chromium',
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          // Force deterministic software rasterization. Without these, Chromium's
          // GPU/threaded raster produces non-deterministic anti-aliasing on curved
          // edges and text (4-80px of jitter run-to-run), which makes real
          // regressions indistinguishable from noise. With them the noise floor is 0.
          args: [
            '--disable-gpu',
            '--disable-skia-runtime-opts',
            '--disable-partial-raster',
            '--disable-checker-imaging',
            '--disable-lcd-text',
            '--font-render-hinting=none',
            '--force-color-profile=srgb',
          ],
        },
      },
    },
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
