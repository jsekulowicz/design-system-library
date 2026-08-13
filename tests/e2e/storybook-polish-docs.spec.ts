import { expect, test, type Page } from '@playwright/test';

async function openDocs(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=docs`);
  await page.locator('.sbdocs-content').waitFor();
}

test('spacing examples use intrinsic inline-code labels', async ({ page }) => {
  await openDocs(page, 'foundations-spacing--docs');
  const label = page.getByText('Padding with space-2', { exact: true });
  const code = label.locator('code');
  await expect(label).toBeVisible();
  expect(await code.evaluate((element) => element.getBoundingClientRect().width)).toBeLessThan(80);
  await expect(code).not.toHaveCSS('width', '96px');
});

test('Copy code has a visible separator from the preceding action', async ({ page }) => {
  await openDocs(page, 'atoms-divider--docs');
  const copy = page.getByRole('button', { name: 'Copy code' }).first();
  await expect(copy).toHaveCSS('border-left-style', 'solid');
  await expect(copy).toHaveCSS('border-left-width', '1px');
});

test('Heatmap data starts folded and remains expandable', async ({ page }) => {
  await openDocs(page, 'molecules-heatmapcalendar--docs');
  const data = page.getByRole('button', { name: 'data :' });
  await expect(data).toHaveAttribute('aria-expanded', 'false');
  await data.click();
  await expect(data).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByRole('button', { name: '0 :', exact: true })).toBeVisible();
});

test('dark docs root covers overscroll with the active theme', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ds-storybook-theme', 'dark'));
  await openDocs(page, 'foundations-spacing--docs');
  const styles = await page.locator('html').evaluate((html) => ({
    htmlBackground: getComputedStyle(html).backgroundColor,
    bodyBackground: getComputedStyle(document.body).backgroundColor,
    htmlOverscroll: getComputedStyle(html).overscrollBehaviorY,
    bodyOverscroll: getComputedStyle(document.body).overscrollBehaviorY,
  }));
  expect(styles.htmlBackground).not.toBe('rgba(0, 0, 0, 0)');
  expect(styles.htmlBackground).toBe(styles.bodyBackground);
  expect(styles.htmlOverscroll).toBe('none');
  expect(styles.bodyOverscroll).toBe('none');
});

test('story frames preserve scroll chaining', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-tooltip--viewport-constraint&viewMode=story');
  await expect(page.locator('html')).toHaveAttribute('data-ds-view-mode', 'story');
  await expect(page.locator('html')).toHaveCSS('overscroll-behavior-y', 'auto');
  await expect(page.locator('body')).toHaveCSS('overscroll-behavior-y', 'auto');
});

test('wheel input over a Tooltip preview scrolls its documentation page', async ({ page }) => {
  await page.goto('/?path=/docs/atoms-tooltip--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  const docs = preview.locator('.sbdocs-content');
  await expect(docs).toBeVisible();
  const storyFrame = preview.locator('iframe[id^="iframe--"]').first();
  await storyFrame.scrollIntoViewIfNeeded();
  await storyFrame.hover();
  const before = await docs.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => docs.evaluate(() => window.scrollY)).toBeGreaterThan(before);
});

test('Icon docs open Heroicons safely in a new tab', async ({ page }) => {
  await openDocs(page, 'atoms-icon--docs');
  const links = page.locator('a[href="https://heroicons.com"]');
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('List navigation example contains real links', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-list--navigation-links&viewMode=story');
  for (const name of ['Overview', 'Activity', 'Settings']) {
    await expect(page.getByRole('link', { name })).toHaveAttribute('href', `#${name.toLowerCase()}`);
  }
});

test('Menu footer is a link outside the menu role tree', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-menu--with-header-footer&viewMode=story');
  await expect(page.getByRole('link', { name: 'Manage workspaces' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Manage workspaces' })).toHaveCount(0);
});
