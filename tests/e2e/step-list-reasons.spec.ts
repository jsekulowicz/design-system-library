import { expect, test, type Locator, type Page } from '@playwright/test';

const layouts = [
  { name: 'full row', story: 'with-steps-the-answers-ruled-out', selector: 'ol .step-control' },
  { name: 'compact rail', story: 'compact-with-steps-the-answers-ruled-out', selector: '.rail .segment' },
];

test('a pinned reason moves into the compact rail when the layout changes', async ({ page }) => {
  const steps = await openDisabledSteps(page, layouts[0]!.story, layouts[0]!.selector);
  await steps.first().click({ force: true });
  await page.mouse.move(0, 0);

  await page.locator('ds-step-list').evaluate((list) => list.setAttribute('compact', ''));

  const segments = page.locator('ds-step-list .rail .segment[aria-disabled="true"]');
  await expectOnlyReasonFor(segments, 0);
});

test('a reason shown only by hover closes when the layout changes', async ({ page }) => {
  const steps = await openDisabledSteps(page, layouts[0]!.story, layouts[0]!.selector);
  await steps.first().hover();
  await expectOnlyReasonFor(steps, 0);

  await page.locator('ds-step-list').evaluate((list) => list.setAttribute('compact', ''));

  await expect(page.locator('ds-step-list [part="tooltip"]:popover-open')).toHaveCount(0);
  await expect(page.locator('ds-step-list ds-tooltip[open]')).toHaveCount(0);
});

async function openDisabledSteps(page: Page, story: string, selector: string): Promise<Locator> {
  await page.setViewportSize({ width: 1400, height: 900 });
  await page.goto(`/iframe.html?id=navigation-steplist--${story}&viewMode=story`);
  const list = page.locator('ds-step-list');
  await expect(list).toBeVisible();
  return list.locator(`${selector}[aria-disabled="true"]`);
}

async function expectOnlyReasonFor(steps: Locator, index: number): Promise<void> {
  const tooltips = steps.page().locator('ds-step-list [part="tooltip"]:popover-open');
  await expect(tooltips).toHaveCount(1);
  await expect(steps.page().locator('ds-step-list ds-tooltip[open]')).toHaveCount(1);
  await expect(steps.nth(index).locator('..').getByRole('tooltip')).toBeVisible();
}

async function dragAcrossTheOpenReason(page: Page): Promise<void> {
  const tip = page.locator('ds-step-list [part="tooltip"]:popover-open');
  const box = (await tip.boundingBox())!;
  await page.mouse.move(box.x + 8, box.y + box.height / 2);
  await page.mouse.down();
  await page.mouse.move(box.x + box.width - 8, box.y + box.height / 2, { steps: 5 });
  await page.mouse.up();
}

for (const { name, story, selector } of layouts) {
  test.describe(`a StepList reason in the ${name}`, () => {
    test('stays pinned while its text is selected, once the pointer leaves', async ({ page }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await steps.first().click({ force: true });

      await dragAcrossTheOpenReason(page);
      await page.mouse.move(0, 0);

      expect(await page.evaluate(() => getSelection()!.toString().length)).toBeGreaterThan(0);
      await expectOnlyReasonFor(steps, 0);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('tooltip')).toHaveCount(0);
    });

    test('stays pinned when a selection is dragged out of it across another ruled-out step', async ({ page }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await steps.first().click({ force: true });
      const tip = (await page.locator('ds-step-list [part="tooltip"]:popover-open').boundingBox())!;
      const other = (await steps.nth(1).boundingBox())!;

      await page.mouse.move(tip.x + 8, tip.y + tip.height / 2);
      await page.mouse.down();
      await page.mouse.move(other.x + other.width / 2, other.y + other.height / 2, { steps: 12 });

      await expectOnlyReasonFor(steps, 0);
      await page.mouse.up();
      await expectOnlyReasonFor(steps, 0);
    });

    test('is no longer held by a finished press inside it once focus moves on', async ({ page }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await steps.first().click({ force: true });
      await dragAcrossTheOpenReason(page);
      await page.mouse.move(0, 0);

      await steps.first().focus();
      await page.keyboard.press('Shift+Tab');

      await expect(page.getByRole('tooltip')).toHaveCount(0);
    });

    test('stays visible while focused when its own hover ends', async ({ page }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await steps.first().focus();
      await steps.first().hover();
      await page.mouse.move(0, 0);

      await expectOnlyReasonFor(steps, 0);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('tooltip')).toHaveCount(0);
    });

    test('closes when clicked again while pinned, though focus and hover remain on its trigger', async ({ page }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await steps.first().click({ force: true });
      await expectOnlyReasonFor(steps, 0);

      await steps.first().click({ force: true });

      await expect(steps.first()).toBeFocused();
      await expect(page.getByRole('tooltip')).toHaveCount(0);
    });

    test('gives way to keyboard focus while only hovered', async ({ page }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await steps.first().hover();
      await expectOnlyReasonFor(steps, 0);

      await steps.nth(1).focus();

      await expectOnlyReasonFor(steps, 1);
    });

    test('closes after a click once another disabled step is hovered, even while its trigger keeps focus', async ({
      page,
    }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await expect(steps).toHaveCount(2);
      await steps.first().click({ force: true });
      await expectOnlyReasonFor(steps, 0);

      await steps.nth(1).hover();

      await expectOnlyReasonFor(steps, 1);
      await expect(steps.first()).toBeFocused();
      await page.mouse.move(0, 0);
      await expect(page.getByRole('tooltip')).toHaveCount(0);
    });

    test('closes when shown by keyboard focus once another disabled step is hovered', async ({ page }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await steps.first().focus();
      await expectOnlyReasonFor(steps, 0);

      await steps.nth(1).hover();

      await expectOnlyReasonFor(steps, 1);
      await steps.first().hover();
      await expectOnlyReasonFor(steps, 0);
    });

    test('stays pinned after a click while the same step is hovered, until Escape', async ({ page }) => {
      const steps = await openDisabledSteps(page, story, selector);
      await steps.first().click({ force: true });
      await page.mouse.move(0, 0);

      await steps.first().hover();
      await page.mouse.move(0, 0);

      await expectOnlyReasonFor(steps, 0);
      await page.keyboard.press('Escape');
      await expect(page.getByRole('tooltip')).toHaveCount(0);
    });
  });
}
