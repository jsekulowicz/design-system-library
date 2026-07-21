import { test, expect } from '@playwright/test';

test('ds-button variants story renders all variants', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-button--variants&viewMode=story');
  const variants = ['primary', 'secondary', 'ghost'];
  const buttons = page.locator('ds-button');
  await expect(buttons).toHaveCount(variants.length);
  for (const variant of variants) {
    await expect(page.locator(`ds-button[variant="${variant}"]`)).toBeVisible();
  }
});

test('loading never shrinks the button, and loading-label pins its width', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-button--loading-label&viewMode=story');
  const demos = page.locator('ds-button[data-demo]');
  await expect(demos).toHaveCount(3);

  const widths = async () => demos.evaluateAll((els) => els.map((el) => el.getBoundingClientRect().width));
  const idle = await widths();
  await page.locator('#toggle').click();
  await expect(demos.first()).toHaveAttribute('loading', '');
  const loading = await widths();

  expect(loading[0]).toBeCloseTo(idle[0]!, 1);
  expect(loading[1]).toBeGreaterThanOrEqual(idle[1]!);
  expect(loading[2]).toBeCloseTo(idle[2]!, 1);
});

test('spinner keeps animating under prefers-reduced-motion', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/iframe.html?id=atoms-button--loading&viewMode=story');

  const duration = await page.locator('ds-button').evaluate((el) => {
    const spinner = el.shadowRoot!.querySelector('.spinner')!;
    return getComputedStyle(spinner).animationDuration;
  });

  expect(duration).toBe('1.6s');
});

test('disabled ds-button does not emit ds-click', async ({ page }) => {
  await page.goto('/iframe.html?id=atoms-button--disabled&viewMode=story');
  const counter = '__click_count';
  await page.evaluate((key) => {
    (window as unknown as Record<string, number>)[key] = 0;
    document.querySelectorAll('ds-button').forEach((el) => {
      el.addEventListener('ds-click', () => {
        const store = window as unknown as Record<string, number>;
        store[key] = (store[key] ?? 0) + 1;
      });
    });
  }, counter);

  await page.locator('ds-button').click({ force: true });
  const count = await page.evaluate((k) => (window as unknown as Record<string, number>)[k], counter);
  expect(count).toBe(0);
});
