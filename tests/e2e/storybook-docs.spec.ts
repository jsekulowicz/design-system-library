import { expect, test, type Page } from '@playwright/test';

const foundationDocs = [
  'foundations-color--docs',
  'foundations-spacing--docs',
  'foundations-theming--docs',
  'foundations-tokens--docs',
  'foundations-typography--docs',
  'foundations-utilities--docs',
];

async function openDocs(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=docs`);
  await page.locator('.sbdocs-content').waitFor();
}

async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.locator('#storybook-root').waitFor();
  await page.evaluate(async () => {
    await document.fonts.ready;
  });
}

test('docs prose follows the design-system type scale', async ({ page }) => {
  await openDocs(page, 'foundations-typography--docs');
  const docs = page.locator('.sbdocs-content');

  await expect(docs.locator('h1').first()).toHaveCSS('font-size', '24px');
  await expect(docs.locator('h2').first()).toHaveCSS('font-size', '24px');
  await expect(docs.locator('h3').first()).toHaveCSS('font-size', '20px');
  await expect(docs.locator(':scope > p').first()).toHaveCSS('font-size', '16px');
  await expect(docs.locator('h2').filter({ hasText: 'Type scale' })).toHaveCount(1);
});

test('foundation examples render inline without Canvas chrome', async ({ page }) => {
  for (const id of foundationDocs) {
    await openDocs(page, id);
    await expect(page.locator('.sbdocs-preview')).toHaveCount(0);
    await expect(page.locator('.sb-story').first()).toBeVisible();
  }
});

test('foundation tables use ds-table instead of hand-built or Markdown tables', async ({ page }) => {
  const expectedTableCounts = {
    'foundations-spacing--docs': 1,
    'foundations-theming--docs': 1,
    'foundations-tokens--docs': 7,
    'foundations-typography--docs': 4,
    'foundations-utilities--docs': 3,
  };

  for (const [id, count] of Object.entries(expectedTableCounts)) {
    await openDocs(page, id);
    await expect(page.locator('ds-table')).toHaveCount(count);
    await expect(page.getByText(/^\| Token group/)).toHaveCount(0);
    await expect(page.getByText(/^\| Size range/)).toHaveCount(0);
  }
});

test('ScrollablePage and PageShell examples use the documented typography', async ({ page }) => {
  for (const id of [
    'layout-scrollablepage--with-non-scrolling-header',
    'layout-pageshell--non-scrolling-page-header',
  ]) {
    await openStory(page, id);
    const root = page.locator('#storybook-root');
    const h1 = root.locator('h1').first();
    const h2 = root.locator('h2').first();
    const paragraph = root.locator('p').first();

    await expect(h1).toHaveCSS('font-size', '24px');
    await expect(h1).toHaveCSS('font-family', /Source Serif 4/);
    await expect(h2).toHaveCSS('font-size', '20px');
    await expect(h2).toHaveCSS('font-family', /Source Serif 4/);
    await expect(paragraph).toHaveCSS('font-size', '16px');
    await expect(paragraph).toHaveCSS('font-family', /General Sans/);
  }
});

test('component documentation introduces every structure with Anatomy', async ({ page }) => {
  for (const id of [
    'feedback-skeleton--docs',
    'data-display-heatmapcalendar--docs',
    'data-display-stattile--docs',
    'layout-scrollablepage--docs',
  ]) {
    await openDocs(page, id);
    const anatomy = page.getByRole('heading', { level: 2, name: 'Anatomy' });
    await expect(anatomy).toHaveCount(1);
    await expect(anatomy.locator('xpath=following-sibling::*[1][self::p]')).toBeVisible();
  }
});
