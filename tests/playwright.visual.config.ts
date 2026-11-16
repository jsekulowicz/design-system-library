import { defineConfig, devices } from '@playwright/test';

const port = Number(process.env['STORYBOOK_PORT'] ?? 6007);
const baseURL = `http://localhost:${port}`;
const isCI = Boolean(process.env['CI']);
const snapshotDir = process.env['VISUAL_SNAPSHOT_DIR'] ?? '{testDir}/__screenshots__';

assertCiArchitectureBaselines();

function isWritingBaselines(): boolean {
  return process.argv.some((arg: string) => {
    return arg === '-u' || arg === '--update-snapshots' || arg.startsWith('--update-snapshots=');
  });
}

function isCiArchitecture(): boolean {
  return process.platform === 'linux' && process.arch === 'x64';
}

function assertCiArchitectureBaselines(): void {
  if (!isWritingBaselines() || isCiArchitecture() || process.env['ALLOW_HOST_VISUAL_BASELINES'] === 'true') {
    return;
  }
  throw new Error(
    `Refusing to write visual baselines on ${process.platform}/${process.arch}: text anti-aliasing ` +
      'differs from the linux/x64 container CI compares against, so host-written PNGs pass locally ' +
      'and fail every CI run. Use `pnpm test:visual:update:docker` or `pnpm test:visual:update:ci`. ' +
      'Set ALLOW_HOST_VISUAL_BASELINES=true only for throwaway experiments.',
  );
}

const ABSOLUTE_DIFF_CUSHION_PX = 10;
const DETERMINISTIC_RASTER_FLAGS = [
  '--disable-gpu',
  '--disable-skia-runtime-opts',
  '--disable-partial-raster',
  '--disable-checker-imaging',
  '--disable-lcd-text',
  '--font-render-hinting=none',
  '--force-color-profile=srgb',
];

export default defineConfig({
  testDir: './visual',
  snapshotPathTemplate: `${snapshotDir}/{arg}{ext}`,
  outputDir: './visual-results',
  timeout: 60_000,
  forbidOnly: isCI,
  retries: isCI ? 1 : 0,
  reporter: isCI ? [['github'], ['html', { open: 'never', outputFolder: 'visual-report' }]] : 'list',
  expect: {
    toHaveScreenshot: {
      maxDiffPixels: ABSOLUTE_DIFF_CUSHION_PX,
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
          args: DETERMINISTIC_RASTER_FLAGS,
        },
      },
    },
  ],
  webServer: {
    command: `pnpm -F @ds/storybook exec http-server storybook-static -p ${port}`,
    url: baseURL,
    reuseExistingServer: false,
    stdout: 'pipe',
    stderr: 'pipe',
    timeout: 120_000,
  },
});
