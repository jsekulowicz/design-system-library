import { expect, test, type Page } from '@playwright/test';

interface TriggerLayout {
  lineCount: number;
  lastLineRight: number;
  lastLineTop: number;
  commaLeft: number;
  commaTop: number;
  triggerColor: string;
  sentenceColor: string;
}

async function openInlineStory(page: Page): Promise<void> {
  await page.goto('/iframe.html?id=overlays-tooltip--inline-in-text&viewMode=story');
  await page.locator('ds-tooltip[inline]').waitFor();
}

async function measureTriggerLayout(page: Page): Promise<TriggerLayout> {
  return page.locator('ds-tooltip[inline]').evaluate((tooltip) => {
    const trigger = tooltip.querySelector('[tabindex="0"]')!;
    const lines = [...trigger.getClientRects()];
    const lastLine = lines.at(-1)!;
    const comma = document.createRange();
    comma.setStart(tooltip.nextSibling!, 0);
    comma.setEnd(tooltip.nextSibling!, 1);
    const commaBox = comma.getBoundingClientRect();
    return {
      lineCount: lines.length,
      lastLineRight: lastLine.right,
      lastLineTop: lastLine.top,
      commaLeft: commaBox.left,
      commaTop: commaBox.top,
      triggerColor: getComputedStyle(trigger).color,
      sentenceColor: getComputedStyle(tooltip.parentElement!).color,
    };
  });
}

test('an inline tooltip wraps with its sentence and leaves the comma after it flush', async ({ page }) => {
  await openInlineStory(page);

  const layout = await measureTriggerLayout(page);

  expect(layout.lineCount).toBeGreaterThan(1);
  expect(Math.abs(layout.commaLeft - layout.lastLineRight)).toBeLessThan(1);
  expect(Math.abs(layout.commaTop - layout.lastLineTop)).toBeLessThan(4);
  expect(layout.triggerColor).toBe(layout.sentenceColor);
});

test('an inline tooltip shows its tip when the text trigger takes focus', async ({ page }) => {
  await openInlineStory(page);

  await page.locator('ds-tooltip[inline] [tabindex="0"]').focus();

  await expect(page.locator('ds-tooltip[inline] [part="tooltip"]:popover-open')).toHaveCount(1);
});
