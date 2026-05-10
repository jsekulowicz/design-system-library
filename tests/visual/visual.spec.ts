import { test, type Page } from '@playwright/test';
import { expectScenarioScreenshot, prepareScenario } from './helpers.js';
import { visualScenarios } from './scenarios.js';
import type { ThemeName, ViewportName, VisualScenario } from './types.js';

for (const scenario of visualScenarios) {
  for (const theme of scenario.themes ?? ['light']) {
    for (const viewport of scenario.viewports ?? ['desktop']) {
      test(`${scenario.name} ${theme} ${viewport}`, async ({ page }) => {
        await captureVisualScenario(page, scenario, viewport, theme);
      });
    }
  }
}

async function captureVisualScenario(
  page: Page,
  scenario: VisualScenario,
  viewport: ViewportName,
  theme: ThemeName,
): Promise<void> {
  await prepareScenario(page, scenario, viewport, theme);
  await expectScenarioScreenshot(page, scenario, viewport, theme);
}
