import { expect, test, type Locator, type Page } from '@playwright/test';

async function openDocs(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=docs`);
  await page.locator('.sbdocs-content').waitFor();
}

function storyCode(page: Page, text: string): Locator {
  return page
    .locator('.sb-story code')
    .filter({ hasText: new RegExp(`^${text}$`) })
    .first();
}

test('Theming shows clearly labeled brand examples with their token overrides', async ({ page }) => {
  await openDocs(page, 'foundations-theming--docs');

  await expect(page.getByRole('heading', { name: 'Live playground' })).toHaveCount(0);
  await expect(page.getByRole('heading', { name: 'Brand examples' })).toBeVisible();
  await expect(page.getByText(/not themes included with the design system/)).toBeVisible();
  await expect(page.locator('.ds-brand-example-code')).toHaveCount(3);
  await expect(page.locator('.ds-brand-example-code').filter({ hasText: '--ds-color-accent: #4A72CC;' })).toBeVisible();
  await expect(page.locator('.ds-brand-example-code').filter({ hasText: '--ds-radius-xs: 12px;' })).toBeVisible();
});

test('dark-mode shadow examples use a contrasting preview surface', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ds-storybook-theme', 'dark'));
  await openDocs(page, 'foundations-tokens--docs');
  const label = storyCode(page, 'shadow-md');
  const preview = label.locator('xpath=preceding-sibling::div[1]');
  const tile = preview.locator(':scope > div');

  await expect(preview).toBeVisible();
  const colors = await preview.evaluate((element) => ({
    preview: getComputedStyle(element).backgroundColor,
    tile: getComputedStyle(element.firstElementChild!).backgroundColor,
    shadow: getComputedStyle(element.firstElementChild!).boxShadow,
  }));
  expect(colors.preview).not.toBe(colors.tile);
  expect(colors.shadow).not.toBe('none');
});

test('foundation descriptions and token labels use the 14px body size', async ({ page }) => {
  await openDocs(page, 'foundations-typography--docs');
  const familyToken = storyCode(page, '--ds-font-display');
  const familyDescription = page.getByText('Serif font for headings and page titles.');
  const lineHeightValue = storyCode(page, 'line-height-none').locator('xpath=following-sibling::span[1]');

  await expect(familyToken).toHaveCSS('font-size', '14px');
  await expect(familyDescription).toHaveCSS('font-size', '14px');
  await expect(lineHeightValue).toHaveCSS('font-size', '14px');
});

test('mobile docs reserve only 16px on each side of the content', async ({ page }) => {
  await page.setViewportSize({ width: 380, height: 760 });
  await openDocs(page, 'foundations-typography--docs');
  const heading = page.locator('.sbdocs-content > h1');

  expect(await heading.evaluate((element) => element.getBoundingClientRect().left)).toBe(16);
  await expect(page.locator('.sbdocs-wrapper')).toHaveCSS('padding-left', '0px');
  await expect(page.locator('.sbdocs-content')).toHaveCSS('padding-left', '16px');
  await expect(page.locator('.sbdocs-content')).toHaveCSS('padding-right', '16px');
});

test('component API sections use 12px heading gaps and an intrinsic import background', async ({ page }) => {
  await openDocs(page, 'forms-colorpicker--docs');
  const heading = page.getByRole('heading', { name: 'Import' });
  const importBlock = page.locator('.ds-component-import');
  const metrics = await importBlock.evaluate((element) => {
    const headingRect = element.previousElementSibling!.getBoundingClientRect();
    const blockRect = element.getBoundingClientRect();
    const codeRect = element.firstElementChild!.getBoundingClientRect();
    return { gap: blockRect.top - headingRect.bottom, widthDifference: blockRect.width - codeRect.width };
  });

  await expect(heading).toBeVisible();
  expect(metrics.gap).toBe(12);
  expect(Math.abs(metrics.widthDifference)).toBeLessThan(1);
  await expect(importBlock).toHaveCSS('padding-right', '0px');
  await expect(importBlock).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
});

test('Props tables fit their container and text controls resize vertically', async ({ page }) => {
  for (const id of ['actions-button--docs', 'forms-checkboxgroup--docs', 'forms-colorpicker--docs']) {
    await openDocs(page, id);
    const tables = await page.locator('.docblock-argstable').all();

    for (const table of tables) {
      const fits = await table.locator('xpath=..').evaluate((element) => element.scrollWidth <= element.clientWidth);
      expect(fits).toBe(true);
      const textarea = table.locator('textarea').first();
      if ((await textarea.count()) > 0) {
        await expect(textarea).toHaveCSS('resize', 'vertical');
      }
    }
  }
});
