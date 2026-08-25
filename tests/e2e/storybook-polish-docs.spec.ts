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

test('foundation grid token labels keep intrinsic backgrounds', async ({ page }) => {
  for (const [id, label] of [
    ['foundations-tokens--docs', 'radius-none'],
    ['foundations-tokens--docs', 'shadow-none'],
    ['foundations-typography--docs', '--ds-font-display'],
    ['foundations-typography--docs', '--ds-font-body'],
    ['foundations-typography--docs', '--ds-font-mono'],
    ['foundations-color--docs', '--ds-color-bg'],
  ] as const) {
    await openDocs(page, id);
    const code = page
      .locator('.sb-story code')
      .filter({ hasText: new RegExp(`^${label}$`) })
      .first();
    await expect(code).toBeVisible();
    const widths = await code.evaluate((element) => {
      const range = document.createRange();
      range.selectNodeContents(element);
      return { background: element.getBoundingClientRect().width, text: range.getBoundingClientRect().width };
    });
    expect(widths.text).toBeGreaterThan(0);
    expect(widths.background).toBeGreaterThanOrEqual(widths.text);
    expect(widths.background - widths.text).toBeLessThan(12);
  }
});

test('font family token backgrounds have the same height and no padding', async ({ page }) => {
  await openDocs(page, 'foundations-typography--docs');
  const tokens = ['--ds-font-display', '--ds-font-body', '--ds-font-mono'];
  const metrics = [];

  for (const token of tokens) {
    const code = page
      .locator('.sb-story code')
      .filter({ hasText: new RegExp(`^${token}$`) })
      .first();
    await expect(code).toBeVisible();
    metrics.push(
      await code.evaluate((element) => {
        const styles = getComputedStyle(element);
        return {
          height: element.getBoundingClientRect().height,
          paddingBlock: Number.parseFloat(styles.paddingTop) + Number.parseFloat(styles.paddingBottom),
        };
      }),
    );
  }

  expect(metrics.every(({ paddingBlock }) => paddingBlock === 0)).toBe(true);
  expect(Math.max(...metrics.map(({ height }) => height)) - Math.min(...metrics.map(({ height }) => height))).toBe(0);
});

test('Copy code has a visible separator from the preceding action', async ({ page }) => {
  await openDocs(page, 'data-display-divider--docs');
  const copy = page.getByRole('button', { name: 'Copy code' }).first();
  await expect(copy).toHaveCSS('border-left-style', 'solid');
  await expect(copy).toHaveCSS('border-left-width', '1px');
});

test('Heatmap data starts folded and remains expandable', async ({ page }) => {
  await openDocs(page, 'data-display-heatmapcalendar--docs');
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
  await page.goto('/iframe.html?id=overlays-tooltip--viewport-constraint&viewMode=story');
  await expect(page.locator('html')).toHaveAttribute('data-ds-view-mode', 'story');
  await expect(page.locator('html')).toHaveCSS('overscroll-behavior-y', 'auto');
  await expect(page.locator('body')).toHaveCSS('overscroll-behavior-y', 'auto');
});

test('wheel input over an inline Tooltip preview scrolls its documentation page', async ({ page }) => {
  await page.goto('/?path=/docs/overlays-tooltip--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  const docs = preview.locator('.sbdocs-content');
  await expect(docs).toBeVisible();
  const story = preview.locator('.sb-story').first();
  await expect(preview.locator('iframe[id^="iframe--"]')).toHaveCount(0);
  await story.scrollIntoViewIfNeeded();
  await story.hover();
  const before = await docs.evaluate(() => window.scrollY);
  await page.mouse.wheel(0, 500);
  await expect.poll(() => docs.evaluate(() => window.scrollY)).toBeGreaterThan(before);
});

test('Icon docs open Heroicons safely in a new tab', async ({ page }) => {
  await openDocs(page, 'data-display-icon--docs');
  const links = page.locator('a[href="https://heroicons.com"]');
  await expect(links).toHaveCount(2);
  for (const link of await links.all()) {
    await expect(link).toHaveAttribute('target', '_blank');
    await expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  }
});

test('List navigation example contains real links', async ({ page }) => {
  await page.goto('/iframe.html?id=data-display-list--navigation-links&viewMode=story');
  for (const name of ['Overview', 'Activity', 'Settings']) {
    await expect(page.getByRole('link', { name })).toHaveAttribute('href', `#${name.toLowerCase()}`);
  }
});

test('Menu footer is a link outside the menu role tree', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-menu--with-header-footer&viewMode=story');
  await expect(page.getByRole('link', { name: 'Manage workspaces' })).toBeVisible();
  await expect(page.getByRole('menuitem', { name: 'Manage workspaces' })).toHaveCount(0);
});
