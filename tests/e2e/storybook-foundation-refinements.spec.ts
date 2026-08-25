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

test('dark-mode shadow examples remain visibly distinct', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ds-storybook-theme', 'dark'));
  await openDocs(page, 'foundations-tokens--docs');
  const labels = ['shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg'];
  const samples = labels.map((label) => storyCode(page, label).locator('xpath=preceding-sibling::div[1]'));
  const appearances = await Promise.all(
    samples.map((sample) =>
      sample.evaluate((element) => ({
        canvas: getComputedStyle(element).backgroundColor,
        surface: getComputedStyle(element.firstElementChild!).backgroundColor,
        shadow: getComputedStyle(element.firstElementChild!).boxShadow,
      })),
    ),
  );

  expect(new Set(appearances.map(({ shadow }) => shadow)).size).toBe(labels.length);
  expect(new Set(appearances.map(({ canvas }) => canvas))).toEqual(new Set(['rgb(226, 226, 227)']));
  expect(new Set(appearances.map(({ surface }) => surface))).toEqual(new Set(['rgb(250, 248, 245)']));
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

test('Props tables prioritize names and controls up to tablet width', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 760 });
  await openDocs(page, 'forms-radiogroup--docs');
  const table = page.locator('.docblock-argstable').first();

  await expect(table.locator('th').nth(1)).toBeHidden();
  await expect(table.locator('th').nth(2)).toBeHidden();
  await expect(table.locator('th').nth(3)).toHaveText('Control');
  expect(
    await table
      .locator('textarea')
      .first()
      .evaluate((element) => element.getBoundingClientRect().width),
  ).toBeGreaterThan(180);
  expect(await table.locator('xpath=..').evaluate((element) => element.scrollWidth <= element.clientWidth)).toBe(true);
  await table.locator('textarea').first().fill('Mobile billing');
  await expect(page.getByRole('group', { name: 'Mobile billing' })).toBeVisible();

  await page.setViewportSize({ width: 1024, height: 760 });
  await expect(table.locator('th').nth(1)).toBeHidden();
  await expect(table.locator('th').nth(2)).toBeHidden();
  await page.setViewportSize({ width: 1025, height: 760 });
  await expect(table.locator('th').nth(1)).toBeVisible();
  await expect(table.locator('th').nth(2)).toBeVisible();
});

test('Breakpoints hides its Preview below 1024px and wraps large values', async ({ page }) => {
  await page.setViewportSize({ width: 1023, height: 760 });
  await openDocs(page, 'foundations-tokens--docs');
  const fullTable = page.locator('.ds-breakpoints-table-full');
  const compactTable = page.locator('.ds-breakpoints-table-compact');

  await expect(fullTable).toBeHidden();
  await expect(compactTable).toBeVisible();
  await expect(compactTable.locator('th')).toHaveText(['Token', 'Value']);

  await page.setViewportSize({ width: 1024, height: 760 });
  await expect(fullTable).toBeVisible();
  await expect(compactTable).toBeHidden();
  await expect(fullTable.locator('th')).toHaveText(['Token', 'Value', 'Preview']);

  const largeBreakpoint = fullTable.locator('tr').filter({ hasText: 'breakpoint-lg' });
  const segments = largeBreakpoint.locator('.ds-breakpoint-preview-segment');
  await expect(segments).toHaveCount(2);
  const boxes = await segments.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect()));
  expect(boxes.map(({ width }) => width)).toEqual([512, 512]);
  expect(boxes[1]!.top).toBeGreaterThan(boxes[0]!.top);
});

test('Font family cards stay compact, left-aligned, and wrap when needed', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 760 });
  await openDocs(page, 'foundations-typography--docs');
  const cards = page.locator('.ds-font-family-card');
  const wideBoxes = await cards.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect()));

  expect(wideBoxes).toHaveLength(3);
  expect(new Set(wideBoxes.map(({ width }) => width)).size).toBe(1);
  expect(new Set(wideBoxes.map(({ height }) => height)).size).toBe(1);
  expect(wideBoxes[0]!.width).toBe(320);
  expect(wideBoxes.map(({ top }) => top)).toEqual([wideBoxes[0]!.top, wideBoxes[0]!.top, wideBoxes[0]!.top]);

  await page.setViewportSize({ width: 760, height: 760 });
  const narrowBoxes = await cards.evaluateAll((elements) => elements.map((element) => element.getBoundingClientRect()));
  expect(new Set(narrowBoxes.map(({ width }) => width)).size).toBe(1);
  expect(new Set(narrowBoxes.map(({ height }) => height)).size).toBe(1);
  expect(narrowBoxes[2]!.top).toBeGreaterThan(narrowBoxes[0]!.top);
  expect(narrowBoxes[2]!.left).toBe(narrowBoxes[0]!.left);
});

test('API table descriptions render backtick-delimited content as inline code', async ({ page }) => {
  await openDocs(page, 'navigation-menubutton--docs');
  const slotsTable = page.getByRole('heading', { name: 'Slots' }).locator('xpath=following-sibling::div[1]');
  const eventsTable = page.getByRole('heading', { name: 'Events' }).locator('xpath=following-sibling::div[1]');

  await expect(slotsTable.locator('code').filter({ hasText: /^<ds-button>$/ })).toBeVisible();
  await expect(slotsTable.locator('code').filter({ hasText: /^ds-menu-item$/ })).toBeVisible();
  await expect(eventsTable.locator('code').filter({ hasText: /^\{ value, originalEvent \}$/ })).toBeVisible();
  expect(await slotsTable.textContent()).not.toContain('`');
  expect(await eventsTable.textContent()).not.toContain('`');
});
