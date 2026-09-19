import { expect, test, type Page } from '@playwright/test';

const selects = [
  ['ds-select', 'forms-select--playground'],
  ['ds-searchable-select', 'forms-searchableselect--playground'],
] as const;

async function mountField(page: Page, tag: string, story: string): Promise<void> {
  await page.goto(`/iframe.html?id=${story}&viewMode=story`);
  await page.locator(`${tag} .label`).first().waitFor();
  await page.evaluate(async (fieldTag) => {
    document.getElementById('storybook-root')!.innerHTML = `
      <form>
        <button type="button" id="before">Before</button>
        <${fieldTag} label="Choice" required description="A note">
          <span slot="description">A note with <a href="#details">details</a></span>
        </${fieldTag}>
        <button type="submit">Submit</button>
      </form>`;
    const field = document.querySelector(fieldTag) as HTMLElement & {
      updateComplete: Promise<unknown>;
      options: { label: string; value: string }[];
    };
    field.options = [{ label: 'First option', value: 'first' }];
    await field.updateComplete;
    document.querySelector('form')!.addEventListener('submit', (event) => event.preventDefault());
  }, tag);
}

for (const [tag, story] of selects) {
  test(`${tag} leaves an open list unchanged when its label is clicked again`, async ({ page }) => {
    await mountField(page, tag, story);
    const control = page.getByRole('combobox');
    const label = page.locator(`${tag} .label`);
    await label.click();
    if (tag === 'ds-searchable-select') {
      await control.fill('First');
    }
    const listbox = await page.getByRole('listbox').elementHandle();
    await label.click();

    expect(await listbox!.evaluate((element) => element.isConnected)).toBe(true);
    await expect(control).toBeFocused();
    await expect(control).toHaveAttribute('aria-expanded', 'true');
    if (tag === 'ds-searchable-select') {
      await expect(control).toHaveValue('First');
    }
  });

  test(`${tag} opens from its label and keeps message clicks outside the control`, async ({ page }) => {
    await mountField(page, tag, story);
    const control = page.getByRole('combobox');
    await page.locator(`${tag} .label`).click();
    await expect(control).toBeFocused();
    await expect(control).toHaveAttribute('aria-expanded', 'true');
    await page.keyboard.press('Escape');
    await page.getByRole('link', { name: 'details' }).click();
    await expect(page.getByRole('link', { name: 'details' })).toBeFocused();
    await expect(control).not.toBeFocused();
    await expect(control).toHaveAttribute('aria-expanded', 'false');
    await page.locator(`${tag} .description`).click({ position: { x: 3, y: 3 } });
    await expect(control).not.toBeFocused();
    await expect(control).toHaveAttribute('aria-expanded', 'false');
  });

  test(`${tag} focuses its control on invalid native submission`, async ({ page }) => {
    await mountField(page, tag, story);
    await page.getByRole('button', { name: 'Submit' }).click();
    await expect(page.getByRole('combobox')).toBeFocused();
    await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
  });

  test(`${tag} selects an option with a pointer while retaining control focus`, async ({ page }) => {
    await mountField(page, tag, story);
    await page.getByRole('combobox').click();
    await page.getByRole('option', { name: 'First option' }).click();
    await expect(page.getByRole('combobox')).toBeFocused();
    await expect(page.getByRole('combobox')).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(() => page.locator(tag).evaluate((field) => (field as HTMLInputElement).value)).toBe('first');
  });
}

test('searchable select stays closed on Tab and searches the first typed character', async ({ page }) => {
  await mountField(page, ...selects[1]);
  await page.locator('#before').focus();
  await page.keyboard.press('Tab');
  const input = page.getByRole('combobox');
  await expect(input).toBeFocused();
  await expect(input).toHaveAttribute('aria-expanded', 'false');
  await page.keyboard.type('v');
  await expect(input).toHaveValue('v');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
});

test('searchable select opens for text inserted without a character keydown', async ({ page }) => {
  await mountField(page, ...selects[1]);
  const input = page.getByRole('combobox');
  await input.focus();
  await page.keyboard.insertText('pasted query');
  await expect(input).toHaveAttribute('aria-expanded', 'true');
  await expect(input).toHaveValue('pasted query');
});

test('color picker opens from its label and ignores a disabled label', async ({ page }) => {
  await mountField(page, 'ds-color-picker', 'forms-colorpicker--playground');
  const label = page.locator('ds-color-picker .label');
  const trigger = page.locator('ds-color-picker #trigger button');
  await label.click();
  await expect(trigger).toBeFocused();
  await expect(page.locator('ds-color-picker #panel')).toBeVisible();
  await page.keyboard.press('Escape');
  await page.locator('ds-color-picker').evaluate((field) => field.setAttribute('disabled', ''));
  await label.click();
  await expect(page.locator('ds-color-picker #panel')).toHaveCount(0);
});
