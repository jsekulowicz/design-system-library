import { test, expect, type Page } from '@playwright/test';

const trailingCheckboxStory = '/iframe.html?id=overlays-dialog--trailing-checkbox&viewMode=story';
const cappedStory = '/iframe.html?id=overlays-dialog--custom-max-height&viewMode=story';

interface DialogMetrics {
  dialogHeight: number;
  cardHeight: number;
  overflow: number;
  bottomFade: string;
}

test.describe('ds-dialog sizing', () => {
  test('a body that fits gets no scroll fade, trailing checkbox included', async ({ page }) => {
    await page.goto(trailingCheckboxStory);
    await openDialog(page, 'Open dialog');

    const metrics = await measure(page);
    expect(metrics.overflow).toBe(0);
    expect(metrics.bottomFade).toBe('rgb(0 0 0)');
  });

  test('--ds-dialog-max-height caps the card, not just the dialog', async ({ page }) => {
    await page.goto(cappedStory);
    await openDialog(page, 'Open capped dialog');

    const metrics = await measure(page);
    expect(metrics.dialogHeight).toBeCloseTo(320, 1);
    expect(metrics.cardHeight).toBeLessThanOrEqual(metrics.dialogHeight);
    expect(metrics.overflow).toBeGreaterThan(0);
  });

  test('exported card and body parts are stylable from the outside', async ({ page }) => {
    await page.goto(cappedStory);
    await openDialog(page, 'Open capped dialog');
    await page.addStyleTag({
      content: 'ds-dialog::part(card) { max-height: 200px } ds-dialog::part(body) { opacity: 0.5 }',
    });

    const styled = await page.evaluate(() => {
      const body = cardShadow().querySelector('[part~="body"]') as HTMLElement;
      const surface = cardShadow().querySelector('[part~="card"]') as HTMLElement;
      return {
        cardHeight: surface.getBoundingClientRect().height,
        bodyOpacity: getComputedStyle(body).opacity,
      };

      function cardShadow(): ShadowRoot {
        const host = document.querySelector('ds-dialog')!;
        return host.shadowRoot!.querySelector('ds-card')!.shadowRoot!;
      }
    });

    // The DS caps the surface from inside ds-dialog's shadow tree; an app's rule
    // lives in an outer tree and has to win.
    expect(styled.cardHeight).toBeCloseTo(200, 1);
    expect(styled.bodyOpacity).toBe('0.5');
  });
});

async function openDialog(page: Page, buttonName: string): Promise<void> {
  await page.getByRole('button', { name: buttonName }).click();
  await page.locator('ds-dialog[open]').waitFor();
}

async function measure(page: Page): Promise<DialogMetrics> {
  return page.evaluate(async () => {
    await new Promise((resolve) => requestAnimationFrame(() => resolve(null)));
    const host = document.querySelector('ds-dialog')!;
    const dialog = host.shadowRoot!.querySelector('dialog')!;
    const cardShadow = host.shadowRoot!.querySelector('ds-card')!.shadowRoot!;
    const surface = cardShadow.querySelector('[part~="card"]') as HTMLElement;
    const body = cardShadow.querySelector('[part~="body"]') as HTMLElement;
    return {
      dialogHeight: dialog.getBoundingClientRect().height,
      cardHeight: surface.getBoundingClientRect().height,
      overflow: body.scrollHeight - body.clientHeight,
      bottomFade: body.style.getPropertyValue('--ds-scroll-fade-bottom'),
    };
  });
}
