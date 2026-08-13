import { expect, test, type Page } from '@playwright/test';

async function openStory(page: Page, id: string): Promise<void> {
  await page.goto(`/iframe.html?id=${id}&viewMode=story`);
  await page.locator('#storybook-root').waitFor();
}

test('Sidenav collapse controls stay outside the collapsed navigation', async ({ page }) => {
  await openStory(page, 'organisms-sidenav--collapse-toggle');
  await page.getByRole('button', { name: 'Collapse navigation' }).click();
  await expect(page.locator('ds-sidenav')).toHaveAttribute('collapsed', '');
  await expect(page.getByText('Brand', { exact: true })).toBeVisible();
  await expect(page.getByRole('button', { name: 'Expand navigation' })).toBeVisible();
});

test('static toasts restore while imperative toasts dismiss', async ({ page }) => {
  await openStory(page, 'molecules-toast--playground');
  await page.getByRole('button', { name: 'Dismiss' }).click();
  await expect(page.locator('ds-toast')).toHaveCount(1);

  await openStory(page, 'molecules-toast--imperative');
  await page.getByRole('button', { name: 'Success' }).click();
  await expect(page.locator('ds-toast')).toHaveCount(1);
  await page.getByRole('button', { name: 'Dismiss' }).click();
  await expect(page.locator('ds-toast')).toHaveCount(0);
});

for (const [theme, expectedBackground] of [
  ['light', 'rgb(250, 248, 245)'],
  ['dark', 'rgb(34, 36, 37)'],
] as const) {
  test(`Toast tones use opaque ${theme} surfaces`, async ({ page }) => {
    await page.addInitScript((nextTheme) => localStorage.setItem('ds-storybook-theme', nextTheme), theme);
    await openStory(page, 'molecules-toast--tones');
    const surfaces = await page.locator('ds-toast').evaluateAll((toasts) =>
      toasts.map((toast) => {
        const notice = toast.shadowRoot!.querySelector('.notice')!;
        return {
          background: getComputedStyle(notice).backgroundColor,
          opacity: getComputedStyle(toast).opacity,
        };
      }),
    );
    expect(surfaces).toHaveLength(4);
    expect(surfaces).toEqual(Array.from({ length: 4 }, () => ({ background: expectedBackground, opacity: '1' })));
  });
}

for (const story of ['atoms-select--multiple', 'atoms-searchableselect--multiple-countries']) {
  test(`${story} keeps its height when the first tile is selected`, async ({ page }) => {
    await openStory(page, story);
    const host = page.locator(story.includes('searchable') ? 'ds-searchable-select' : 'ds-select');
    const combobox = page.getByRole('combobox');
    const triggerHeight = () =>
      host.evaluate((element) => element.shadowRoot!.querySelector('.trigger')!.getBoundingClientRect().height);
    for (const [size, expectedHeight] of [
      ['sm', 32],
      ['md', 40],
      ['lg', 48],
    ] as const) {
      await host.evaluate((element, nextSize) => element.setAttribute('size', nextSize), size);
      await expect.poll(triggerHeight).toBe(expectedHeight);
    }
    await host.evaluate((element) => element.setAttribute('size', 'md'));
    const initialHeight = await triggerHeight();
    await combobox.click();
    const firstOption = page.getByRole('option').first();
    await firstOption.click();
    await expect.poll(triggerHeight).toBe(initialHeight);
    await firstOption.click();
    await expect.poll(triggerHeight).toBe(initialHeight);
  });
}

test('vertical Divider fills the inline row height', async ({ page }) => {
  await openStory(page, 'atoms-divider--inline-with-text');
  const dimensions = await page
    .locator('ds-divider')
    .first()
    .evaluate((host) => {
      const line = host.shadowRoot?.querySelector('[part="line"]');
      return {
        host: host.getBoundingClientRect().height,
        line: line?.getBoundingClientRect().height,
        row: host.parentElement?.getBoundingClientRect().height,
      };
    });
  expect(dimensions.line).toBeCloseTo(dimensions.host, 1);
  expect(dimensions.host).toBeCloseTo(dimensions.row ?? 0, 1);
});

test('Tooltip expands on desktop and remains viewport-safe on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 500 });
  await openStory(page, 'atoms-tooltip--viewport-constraint');
  const tooltip = page.getByRole('tooltip');
  const desktopWidth = await tooltip.evaluate((element) => element.getBoundingClientRect().width);
  expect(desktopWidth).toBeGreaterThan(256);

  await page.setViewportSize({ width: 320, height: 500 });
  const mobileBox = await tooltip.evaluate((element) => element.getBoundingClientRect().toJSON());
  expect(mobileBox.width).toBeLessThanOrEqual(304);
  expect(mobileBox.left).toBeGreaterThanOrEqual(0);
  expect(mobileBox.right).toBeLessThanOrEqual(320);
});
