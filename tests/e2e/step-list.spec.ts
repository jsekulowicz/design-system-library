import { test, expect, type Page } from '@playwright/test';

const storyUrl = '/iframe.html?id=navigation-steplist--switches-to-compact-when-the-row-does-not-fit&viewMode=story';

interface RowLayout {
  compact: boolean;
  wrappedLabels: number;
  shortestConnector: number;
  containerScrollsSideways: boolean;
}

async function fitIntoWidth(page: Page, width: number): Promise<RowLayout> {
  return page.evaluate(async (containerWidth) => {
    const stepList = document.querySelector('ds-step-list')!;
    stepList.parentElement!.style.inlineSize = `${containerWidth}px`;
    await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
    const root = stepList.shadowRoot!;
    const labels = [...root.querySelectorAll<HTMLElement>('ol .step-label')];
    const connectors = [...root.querySelectorAll('ol .step:not(:first-child)')];
    return {
      compact: root.querySelector('nav')!.classList.contains('showing-compact'),
      wrappedLabels: labels.filter(
        (label) => label.getBoundingClientRect().height > parseFloat(getComputedStyle(label).lineHeight) * 1.5,
      ).length,
      shortestConnector: Math.min(...connectors.map((step) => parseFloat(getComputedStyle(step, '::before').width))),
      containerScrollsSideways: stepList.parentElement!.scrollWidth > stepList.parentElement!.clientWidth,
    };
  }, width);
}

test.describe('ds-step-list fitting its row', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1400, height: 900 });
    await page.goto(storyUrl);
    await page.locator('ds-step-list').waitFor();
  });

  test('keeps every label on one line and every connector at its minimum or longer in the full row', async ({
    page,
  }) => {
    const layout = await fitIntoWidth(page, 1200);

    expect(layout.compact).toBe(false);
    expect(layout.wrappedLabels).toBe(0);
    expect(layout.shortestConnector).toBeGreaterThanOrEqual(32);
  });

  test('switches to the compact layout once the row cannot fit on one line', async ({ page }) => {
    const layout = await fitIntoWidth(page, 600);

    expect(layout.compact).toBe(true);
    await expect(page.locator('ds-step-list').locator('ol')).toBeHidden();
    await expect(page.locator('ds-step-list').locator('.compact-current')).toBeVisible();
  });

  test('returns to the full row when its container widens again', async ({ page }) => {
    await fitIntoWidth(page, 600);
    const layout = await fitIntoWidth(page, 1200);

    expect(layout.compact).toBe(false);
    await expect(page.locator('ds-step-list').locator('ol')).toBeVisible();
  });

  test('never makes its container scroll sideways, whichever layout it shows', async ({ page }) => {
    for (const width of [1200, 960, 900, 600, 400]) {
      expect((await fitIntoWidth(page, width)).containerScrollsSideways).toBe(false);
    }
  });
});
