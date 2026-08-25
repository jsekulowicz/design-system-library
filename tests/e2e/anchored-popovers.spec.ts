import { expect, test, type Locator, type Page } from '@playwright/test';

interface Bounds {
  bottom: number;
  left: number;
  right: number;
  top: number;
}

async function panelBounds(component: Locator): Promise<Bounds> {
  return component.evaluate((element) => {
    const panel = element.shadowRoot?.querySelector('#panel');
    const bounds = panel?.getBoundingClientRect();
    if (!bounds) {
      throw new Error('Popover panel is missing');
    }
    return {
      bottom: bounds.bottom,
      left: bounds.left,
      right: bounds.right,
      top: bounds.top,
    };
  });
}

function expectWithinViewport(bounds: Bounds, width: number, height: number): void {
  expect(bounds.left).toBeGreaterThanOrEqual(0);
  expect(bounds.right).toBeLessThanOrEqual(width);
  expect(bounds.top).toBeGreaterThanOrEqual(0);
  expect(bounds.bottom).toBeLessThanOrEqual(height);
}

async function openFixture(page: Page, selector: string): Promise<Locator> {
  const component = page.locator(selector);
  await component.locator('[slot="trigger"]').click();
  return component;
}

test.use({ viewport: { width: 320, height: 480 } });

test('menu button flips above a trigger at the bottom edge', async ({ page }) => {
  await page.goto('/iframe.html?id=navigation-menubutton--playground&viewMode=story');
  await page.locator('ds-menu-button').waitFor();
  await page.evaluate(() => {
    document.body.innerHTML = `<ds-menu-button placement="bottom-end" style="position:fixed;right:0;bottom:0">
      <ds-button slot="trigger">Actions</ds-button>
      <ds-menu-item value="edit">Edit</ds-menu-item>
      <ds-menu-item value="delete">Delete</ds-menu-item>
    </ds-menu-button>`;
  });
  const component = await openFixture(page, 'ds-menu-button');
  const trigger = await component.locator('[slot="trigger"]').boundingBox();
  const bounds = await panelBounds(component);

  expectWithinViewport(bounds, 320, 480);
  expect(bounds.bottom).toBeLessThanOrEqual(trigger!.y);
});

test('popover button constrains wide content to a small viewport', async ({ page }) => {
  await page.goto('/iframe.html?id=overlays-popoverbutton--playground&viewMode=story');
  await page.locator('ds-popover-button').waitFor();
  await page.evaluate(() => {
    document.body.innerHTML = `<ds-popover-button placement="bottom-end" style="position:fixed;right:0;top:0">
      <ds-button slot="trigger">Notifications</ds-button>
      <section style="box-sizing:border-box;width:352px;padding:16px">Notifications</section>
    </ds-popover-button>`;
  });
  const component = await openFixture(page, 'ds-popover-button');
  const bounds = await panelBounds(component);

  expectWithinViewport(bounds, 320, 480);
  expect(bounds.right - bounds.left).toBeLessThanOrEqual(304);
});
