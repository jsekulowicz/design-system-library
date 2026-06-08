import { expect, type Page } from '@playwright/test';
import type { ThemeName, ViewportName, VisualScenario } from './types.js';
import { visualViewports } from './viewports.js';

const stableStyles = `
  *, *::before, *::after {
    animation-delay: 0s !important;
    animation-duration: 0s !important;
    caret-color: transparent !important;
    scroll-behavior: auto !important;
    transition-delay: 0s !important;
    transition-duration: 0s !important;
  }
`;

export async function prepareScenario(
  page: Page,
  scenario: VisualScenario,
  viewport: ViewportName,
  theme: ThemeName,
): Promise<void> {
  await page.setViewportSize(scenario.viewportSize ?? visualViewports[viewport]);
  await seedStorybookState(page, viewport, theme);
  await page.goto(`/iframe.html?id=${scenario.storyId}&viewMode=story`);
  await assertStorybookReady(page, scenario);
  await page.addStyleTag({ content: stableStyles });
  await waitForRender(page);
  await scenario.beforeCapture?.(page);
  await waitForRender(page);
}

export async function expectScenarioScreenshot(
  page: Page,
  scenario: VisualScenario,
  viewport: ViewportName,
  theme: ThemeName,
): Promise<void> {
  const screenshotName = `${scenario.name}-${theme}-${viewport}.png`;
  if (scenario.selector) {
    await expect(page.locator(scenario.selector).first()).toHaveScreenshot(screenshotName);
    return;
  }
  await expect(page).toHaveScreenshot(screenshotName, { fullPage: scenario.fullPage ?? false });
}

async function seedStorybookState(
  page: Page,
  viewport: ViewportName,
  theme: ThemeName,
): Promise<void> {
  await page.addInitScript(
    ({ theme, viewport }) => {
      window.localStorage.setItem('ds-storybook-theme', theme);
      window.localStorage.setItem('ds-storybook-viewport', viewport);
      window.localStorage.setItem('ds-storybook-visual-test', 'true');
    },
    { theme, viewport },
  );
}

export async function waitForRender(page: Page): Promise<void> {
  await page.locator('body').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
    const elements = Array.from(document.querySelectorAll('*'));
    const updates = elements
      .map((element) => {
        return (element as { updateComplete?: Promise<unknown> }).updateComplete;
      })
      .filter((value): value is Promise<unknown> => {
        return value !== undefined;
      });
    await Promise.all(updates);
  });
  await page.waitForTimeout(100);
}

async function assertStorybookReady(page: Page, scenario: VisualScenario): Promise<void> {
  const hasError = await page.locator('body.sb-show-errordisplay').count();
  if (hasError > 0) {
    throw new Error(`Storybook failed to render visual scenario "${scenario.name}" (${scenario.storyId}).`);
  }
}
