import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const stories = [
  'atoms-button--variants',
  'atoms-badge--tones',
  'atoms-link--variants',
  'atoms-textfield--playground',
  'atoms-checkbox--states',
  'atoms-radio--group',
  'atoms-select--playground',
  'atoms-textfield--with-description',
  'molecules-card--playground',
  'molecules-colorpicker--playground',
  'molecules-alert--tones',
  'organisms-form--account-details',
];

for (const id of stories) {
  test(`@a11y ${id} has no axe violations`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await page.locator('body').waitFor();
    const results = await analyzeStory(page);
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}

async function analyzeStory(page: Page) {
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      return await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
        .disableRules(['color-contrast'])
        .analyze();
    } catch (error) {
      if (!String(error).includes('Axe is already running') || attempt === 2) {
        throw error;
      }
      await page.waitForTimeout(250);
    }
  }
  throw new Error('Axe analysis did not complete.');
}
