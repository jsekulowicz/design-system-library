import { test, expect, type Page } from '@playwright/test';

const storyUrl = '/iframe.html?id=organisms-form--account-details&viewMode=story';

test.describe('ds-form native submission', () => {
  test('invalid fields block submit and emit ds-invalid', async ({ page }) => {
    const invalidCount = await attachEventCounter(page, 'ds-invalid');
    const submitCount = await attachEventCounter(page, 'ds-submit');

    await page.goto(storyUrl);
    await page.locator('ds-form').waitFor();

    await page.locator('ds-button[type="submit"]').click();

    await expect.poll(invalidCount).toBeGreaterThan(0);
    await expect.poll(submitCount).toBe(0);
  });

  test('valid fields emit ds-submit with FormData payload', async ({ page }) => {
    const payload = await attachSubmitRecorder(page);
    await page.goto(storyUrl);
    await page.locator('ds-form').waitFor();

    await page.locator('ds-text-field[name="name"] input').first().fill('Jan');
    await page.locator('ds-text-field[name="email"] input').first().fill('jan@studio.co');
    await page.locator('ds-button[type="submit"]').click();

    await expect.poll(payload).toMatchObject({
      name: 'Jan',
      email: 'jan@studio.co',
    });
  });
});

async function attachEventCounter(page: Page, event: string) {
  const key = `__${event.replace(/-/g, '_')}_count`;
  await page.addInitScript(
    ({ event, key }) => {
      const store = window as unknown as Record<string, number>;
      store[key] = 0;
      window.addEventListener(
        event,
        () => {
          store[key] += 1;
        },
        true
      );
    },
    { event, key }
  );
  return () => page.evaluate((k) => (window as unknown as Record<string, number>)[k], key);
}

async function attachSubmitRecorder(page: Page) {
  const key = '__submit_payload';
  await page.addInitScript(({ key }) => {
    const store = window as unknown as Record<string, unknown>;
    store[key] = null;
    window.addEventListener(
      'ds-submit',
      (event: Event) => {
        const detail = (event as CustomEvent<{ data: FormData }>).detail;
        const object: Record<string, FormDataEntryValue> = {};
        detail.data.forEach((value, name) => {
          object[name] = value;
        });
        store[key] = object;
      },
      true
    );
  }, { key });
  return () => page.evaluate((k) => (window as unknown as Record<string, unknown>)[k], key);
}
