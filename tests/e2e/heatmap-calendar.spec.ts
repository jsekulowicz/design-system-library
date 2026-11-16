import { expect, test, type Locator, type Page } from '@playwright/test';

async function mountCalendar(page: Page): Promise<Locator> {
  await page.goto('/iframe.html?id=data-display-heatmapcalendar--activity&viewMode=story');
  await page.locator('ds-heatmap-calendar .cell').first().waitFor();
  await page.evaluate(() => {
    document.body.innerHTML = `<ds-heatmap-calendar end-date="2026-07-13" months="12"></ds-heatmap-calendar>
      <button>After calendar</button>`;
  });
  const calendar = page.locator('ds-heatmap-calendar');
  await calendar.locator('.cell').first().waitFor();
  return calendar;
}

test('a clicked day stays visible after pointer exit and owns the single Tab stop', async ({ page }) => {
  const calendar = await mountCalendar(page);
  const cell = calendar.locator('.cell').nth(5);
  await cell.hover();
  await cell.click();
  await page.mouse.move(0, 0);

  await expect(cell).toHaveAttribute('tabindex', '0');
  await expect(calendar.locator('.cell[tabindex="0"]')).toHaveCount(1);
  await expect(calendar.locator('.point-tooltip')).toBeVisible();
  await page.keyboard.press('Escape');
  await expect(calendar.locator('.point-tooltip')).toBeHidden();
  await expect(cell).toBeFocused();
  await cell.click();
  await expect(calendar.locator('.point-tooltip')).toBeVisible();
  await page.keyboard.press('Tab');
  await expect(page.getByRole('button', { name: 'After calendar' })).toBeFocused();
  await expect(calendar.locator('.point-tooltip')).toBeHidden();
});

test('a shorter range restores keyboard entry after removing the focused day', async ({ page }) => {
  const calendar = await mountCalendar(page);
  await calendar.locator('.cell').nth(100).click();
  await calendar.evaluate((element) => element.setAttribute('months', '1'));

  await expect(calendar.locator('.cell[tabindex="0"]')).toHaveCount(1);
  await expect(calendar.locator('.point-tooltip')).toBeHidden();
  await page.getByRole('button', { name: 'After calendar' }).focus();
  await page.keyboard.press('Shift+Tab');
  await expect(calendar.locator('.cell').first()).toBeFocused();
});

test('the calendar resizes and reveals its last day using CSS alone', async ({ page }) => {
  const calendar = await mountCalendar(page);
  for (const width of [1000, 320, 768]) {
    await page.setViewportSize({ width, height: 480 });
    await calendar.locator('.cell').first().focus();
    await page.keyboard.press('End');
    const lastCell = calendar.locator('.cell').last();
    await expect(lastCell).toBeFocused();
    await expect(lastCell).toBeInViewport();
    const sizes = await calendar.evaluate((element) => {
      const scroller = element.shadowRoot!.querySelector<HTMLElement>('.scroller')!;
      return {
        hostWidth: element.getBoundingClientRect().width,
        frameWidth: element.shadowRoot!.querySelector('.frame')!.getBoundingClientRect().width,
        scrollHeight: scroller.scrollHeight,
        clientHeight: scroller.clientHeight,
        pageWidth: document.documentElement.scrollWidth,
        viewportWidth: window.innerWidth,
      };
    });
    expect(sizes.frameWidth).toBeLessThanOrEqual(sizes.hostWidth);
    expect(sizes.scrollHeight).toBe(sizes.clientHeight);
    expect(sizes.pageWidth).toBe(sizes.viewportWidth);
  }
});
