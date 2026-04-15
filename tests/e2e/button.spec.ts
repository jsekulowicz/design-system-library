import { test, expect } from '@playwright/test';

test('ds-button variants story renders all four variants', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-button--variants&viewMode=story');
  const buttons = page.locator('ds-button');
  await expect(buttons).toHaveCount(4);
  for (const variant of ['primary', 'secondary', 'ghost', 'danger']) {
    await expect(page.locator(`ds-button[variant="${variant}"]`)).toBeVisible();
  }
});

test('disabled ds-button does not emit ds-click', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-button--disabled&viewMode=story');
  const counter = '__click_count';
  await page.evaluate((key) => {
    (window as unknown as Record<string, number>)[key] = 0;
    document.querySelectorAll('ds-button').forEach((el) => {
      el.addEventListener('ds-click', () => {
        (window as unknown as Record<string, number>)[key] += 1;
      });
    });
  }, counter);

  await page.locator('ds-button').click({ force: true });
  const count = await page.evaluate((k) => (window as unknown as Record<string, number>)[k], counter);
  expect(count).toBe(0);
});
