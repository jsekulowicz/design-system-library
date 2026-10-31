import { expect, test, type Locator, type Page } from '@playwright/test';

const OPTION_COUNT = 16;

async function openTopics(page: Page): Promise<Locator> {
  await page.goto('/iframe.html?id=forms-searchableselect--options-of-different-lengths&viewMode=story');
  const select = page.locator('ds-searchable-select');
  await select.locator('.trigger').click();
  await expect(select.locator('[part="listbox"]:popover-open')).toHaveCount(1);
  return select;
}

async function isWhollyInsideListbox(select: Locator, index: number): Promise<boolean> {
  return select.evaluate((element, optionIndex) => {
    const listbox = element.shadowRoot!.querySelector('[part="listbox"]')!.getBoundingClientRect();
    const hint = element.shadowRoot!.querySelector('[part="hint"]')?.getBoundingClientRect();
    const option = element.shadowRoot!.querySelector(`#option-${optionIndex}`)!.getBoundingClientRect();
    const visibleTop = hint ? hint.bottom : listbox.top;
    return option.top >= visibleTop - 0.5 && option.bottom <= listbox.bottom + 0.5;
  }, index);
}

async function expectArrowKeysToShowEveryOption(page: Page, select: Locator): Promise<void> {
  for (let step = 1; step < OPTION_COUNT; step += 1) {
    await page.keyboard.press('ArrowDown');
    expect(await isWhollyInsideListbox(select, step)).toBe(true);
  }
  for (let step = OPTION_COUNT - 2; step >= 0; step -= 1) {
    await page.keyboard.press('ArrowUp');
    expect(await isWhollyInsideListbox(select, step)).toBe(true);
  }
}

test.use({ viewport: { width: 360, height: 640 } });

test('every option renders at its own height', async ({ page }) => {
  const select = await openTopics(page);
  const heights = await select
    .locator('ds-select-option')
    .evaluateAll((options) => options.map((option) => option.getBoundingClientRect().height));

  expect(heights).toHaveLength(OPTION_COUNT);
  expect(Math.max(...heights)).toBeGreaterThan(Math.min(...heights) * 1.5);
});

test('the arrow keys bring a tall option fully into view', async ({ page }) => {
  const select = await openTopics(page);

  await expectArrowKeysToShowEveryOption(page, select);
});

test('the arrow keys keep each option clear of a hint pinned above the list', async ({ page }) => {
  await page.goto('/iframe.html?id=forms-searchableselect--options-of-different-lengths&viewMode=story');
  const select = page.locator('ds-searchable-select');
  await select.evaluate((element) => element.setAttribute('hint', 'Topics are updated every month.'));
  await select.locator('.trigger').click();

  await expectArrowKeysToShowEveryOption(page, select);
});

test('a list grown well past its first page still shows every tall option whole', async ({ page }) => {
  const select = await openTopics(page);
  await select.evaluate((element: HTMLElement & { options: { value: string; label: string }[] }) => {
    const firstPage = element.options;
    element.options = [0, 1, 2, 3, 4].flatMap((pageIndex) =>
      firstPage.map((option) => ({ value: `${option.value}-${pageIndex}`, label: option.label })),
    );
  });

  for (let step = 1; step < OPTION_COUNT * 5; step += 1) {
    await page.keyboard.press('ArrowDown');
    expect(await isWhollyInsideListbox(select, step)).toBe(true);
  }
});

test('reopening shows the chosen option whole, under the options before it', async ({ page }) => {
  const select = await openTopics(page);
  for (let step = 0; step < 10; step += 1) {
    await page.keyboard.press('ArrowDown');
  }
  await page.keyboard.press('Enter');
  await select.locator('.trigger').click();

  expect(await isWhollyInsideListbox(select, 10)).toBe(true);
  expect(await select.locator('[part="listbox"]').evaluate((listbox) => listbox.scrollTop)).toBeGreaterThan(0);
});
