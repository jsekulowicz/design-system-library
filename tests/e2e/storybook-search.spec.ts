import { expect, test, type Page } from '@playwright/test';

const recentDocs = [
  { id: 'introduction--docs', label: 'Introduction', path: 'Introduction' },
  { id: 'organisms-topbar--docs', label: 'TopBar', path: 'Organisms/TopBar' },
  { id: 'templates-pageshell--docs', label: 'PageShell', path: 'Templates/PageShell' },
  { id: 'pages-settingspage--docs', label: 'SettingsPage', path: 'Pages/SettingsPage' },
] as const;

test('empty search recent docs use page names instead of Docs', async ({ page }) => {
  await seedRecentDocs(page);
  await openSearch(page);

  const topBarLabel = page.locator('[data-ds-docs-label="TopBar"]');
  await expect(topBarLabel).toBeVisible();
  await expect(topBarLabel).toHaveJSProperty('textContent', 'Docs');
  await expect(topBarLabel).toHaveAttribute('data-ds-docs-label', 'TopBar');
  await expectRenderedLabel(topBarLabel, 'TopBar');
  await expect(page.locator('[data-ds-docs-label="OrganismsTopBar"]')).toHaveCount(0);
});

test('empty search recent docs labels stay centered without growing rows', async ({ page }) => {
  await seedRecentDocs(page);
  await openSearch(page);

  const label = page.locator('[data-ds-docs-label="TopBar"]');
  const item = label.locator('xpath=ancestor::*[@role="option"][1]');
  const initialBox = await getBox(item);
  const labelBox = await getBox(label);

  await expectRenderedLabel(label, 'TopBar');
  expect(Math.abs(getCenter(initialBox) - getCenter(labelBox))).toBeLessThan(4);
  await page.waitForTimeout(500);
  await expect(item).toHaveJSProperty('offsetHeight', initialBox.height);
});

test('typing in search after relabeling recent docs does not crash the manager', async ({ page }) => {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  await seedRecentDocs(page);
  const search = await openSearch(page);
  await expect(page.locator('[data-ds-docs-label="TopBar"]')).toBeVisible();

  await search.press('s');

  await expect(search).toHaveValue('s');
  await expect(page.getByText('Something went wrong')).toHaveCount(0);
  await expect(page.getByRole('option', { name: /Sidenav/ })).toBeVisible();
  expect(errors).not.toContain("Failed to execute 'removeChild' on 'Node': The node to be removed is not a child of this node.");
});

async function openDocs(page: Page, id: string): Promise<void> {
  await page.goto(`/?path=/docs/${id}`);
  await expect(page.locator('#storybook-preview-iframe')).toBeAttached();
}

async function seedRecentDocs(page: Page): Promise<void> {
  await page.goto('/');
  for (const doc of recentDocs) {
    await page.getByRole('link', { name: doc.label, exact: true }).click();
    await expect(page).toHaveURL(new RegExp(`/docs/${doc.id}`));
    await expect(page.locator('#storybook-preview-iframe')).toBeAttached();
  }
}

async function openSearch(page: Page) {
  const search = page.getByRole('searchbox', { name: /Search|Find components/ });
  await search.click();
  await expect(page.getByText('Recently opened')).toBeVisible();
  return search;
}

async function getBox(locator: ReturnType<Page['locator']>) {
  const box = await locator.boundingBox();
  expect(box).not.toBeNull();
  return box!;
}

function getCenter(box: { y: number; height: number }): number {
  return box.y + box.height / 2;
}

async function expectRenderedLabel(locator: ReturnType<Page['locator']>, label: string): Promise<void> {
  await expect(locator).toHaveAttribute('data-ds-docs-label', label);
  const metrics = await locator.evaluate((element) => {
    const styles = window.getComputedStyle(element, '::after');
    const box = element.getBoundingClientRect();
    return {
      color: styles.color,
      content: styles.content,
      fontSize: Number.parseFloat(styles.fontSize),
      height: box.height,
      width: box.width,
    };
  });
  expect(metrics.content).toBe(JSON.stringify(label));
  expect(metrics.color).not.toBe('rgba(0, 0, 0, 0)');
  expect(metrics.fontSize).toBeGreaterThan(10);
  expect(metrics.height).toBeGreaterThan(10);
  expect(metrics.width).toBeGreaterThan(30);
}
