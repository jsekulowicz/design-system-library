import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const stories = [
  'atoms-button--variants',
  'atoms-badge--tones',
  'atoms-link--variants',
  'atoms-textfield--inside-field',
  'atoms-checkbox--states',
  'atoms-radio--group',
  'atoms-select--playground',
  'molecules-field--playground',
  'molecules-card--playground',
  'molecules-alert--tones',
  'organisms-form--account-details',
];

for (const id of stories) {
  test(`@a11y ${id} has no axe violations`, async ({ page }) => {
    await page.goto(`/iframe.html?id=${id}&viewMode=story`);
    await page.locator('body').waitFor();
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .disableRules(['color-contrast'])
      .analyze();
    expect(results.violations, JSON.stringify(results.violations, null, 2)).toEqual([]);
  });
}
