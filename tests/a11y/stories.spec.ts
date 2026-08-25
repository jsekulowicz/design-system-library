import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const stories = [
  'actions-button--variants',
  'data-display-badge--tones',
  'actions-link--variants',
  'data-display-list--navigation-links',
  'navigation-menu--with-header-footer',
  'data-display-divider--inline-with-text',
  'forms-segmentedcontrol--with-icons',
  'overlays-tooltip--viewport-constraint',
  'forms-textfield--playground',
  'forms-rangeinput--playground',
  'forms-rangeinput--with-value',
  'forms-checkbox--states',
  'forms-checkbox--wrapping-label',
  'forms-radio--group',
  'forms-radio--wrapping-label',
  'forms-select--playground',
  'forms-select--multiple',
  'forms-searchableselect--multiple-countries',
  'forms-textfield--with-description',
  'data-display-card--playground',
  'forms-colorpicker--playground',
  'feedback-alert--tones',
  'data-display-piechart--playground',
  'data-display-piechart--donut',
  'data-display-barchart--grouped',
  'data-display-heatmapcalendar--activity',
  'forms-form--account-details',
  'navigation-sidenav--collapse-toggle',
  'foundations-spacing--scale',
  'foundations-theming--overridable-tokens',
  'foundations-tokens--shape',
  'foundations-tokens--motion',
  'foundations-tokens--breakpoints-and-z-index',
  'foundations-typography--type-scale',
  'foundations-typography--size-guidance',
  'foundations-typography--font-weights',
  'foundations-typography--letter-spacing',
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
