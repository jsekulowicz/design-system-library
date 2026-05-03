import { test, expect, type Locator, type Page } from '@playwright/test';

const storyUrl = '/iframe.html?id=molecules-colorpicker--playground&viewMode=story';

test.describe('ds-color-picker', () => {
  test('selects a predefined swatch', async ({ page }) => {
    await page.goto(storyUrl);
    const picker = page.locator('ds-color-picker').first();

    await page.getByRole('button', { name: 'Accent color' }).click();
    await page.getByRole('radio', { name: /Violet #7C3AED/ }).click();

    await expect.poll(() => readPickerValue(picker)).toBe('#7C3AED');
  });

  test('commits a custom Hex RGB color', async ({ page }) => {
    await page.goto(storyUrl);
    const picker = page.locator('ds-color-picker').first();

    await page.getByRole('button', { name: 'Accent color' }).click();
    await page.getByRole('textbox', { name: 'Hex' }).fill('#123456');
    await page.getByRole('button', { name: 'Done' }).click();

    await expect.poll(() => readPickerValue(picker)).toBe('#123456');
  });

  test('submits normalized color through native form data', async ({ page }) => {
    await page.goto(storyUrl);
    await page.getByRole('button', { name: 'Accent color' }).waitFor();
    await mountFormFixture(page);

    const picker = page.locator('ds-color-picker');
    await page.getByRole('button', { name: 'Accent' }).click();
    await page.getByRole('radio', { name: /Brand #7C3AED/ }).click();
    await page.locator('button[type="submit"]').click();

    await expect.poll(() => readPickerValue(picker)).toBe('#7C3AED');
    await expect.poll(() => readPayload(page)).toMatchObject({ accent: '#7C3AED' });
  });

  test('keeps the popover within a mobile viewport', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto(storyUrl);

    await page.getByRole('button', { name: 'Accent color' }).click();
    const box = await page.getByRole('dialog', { name: 'Accent color' }).boundingBox();

    expect(box).not.toBeNull();
    expect(box!.x).toBeGreaterThanOrEqual(0);
    expect(box!.x + box!.width).toBeLessThanOrEqual(375);
  });
});

async function mountFormFixture(page: Page): Promise<void> {
  await page.evaluate(async () => {
    document.body.className = 'sb-main-padded sb-show-main';
    document.body.hidden = false;
    document.body.style.display = 'block';
    document.body.style.visibility = 'visible';

    await customElements.whenDefined('ds-color-picker');
    const root = document.getElementById('storybook-root') ?? document.body;
    root.innerHTML = `
      <form id="fixture" style="max-width: 360px">
        <ds-color-picker label="Accent" name="accent"></ds-color-picker>
        <button type="submit">Submit</button>
      </form>
    `;
    const picker = document.querySelector('ds-color-picker') as HTMLElement & {
      colors: Array<{ label: string; value: string }>;
      updateComplete?: Promise<unknown>;
    };
    picker.colors = [{ label: 'Brand', value: '#7C3AED' }];
    await picker.updateComplete;
    document.querySelector('form')?.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget as HTMLFormElement);
      (window as unknown as { __colorPickerPayload: Record<string, FormDataEntryValue> })
        .__colorPickerPayload = Object.fromEntries(data.entries());
    });
  });
}

async function readPickerValue(picker: Locator): Promise<unknown> {
  return picker.evaluate((element) => {
    return (element as HTMLInputElement).value;
  });
}

async function readPayload(page: Page): Promise<unknown> {
  return page.evaluate(() => {
    return (window as unknown as { __colorPickerPayload?: unknown }).__colorPickerPayload;
  });
}
