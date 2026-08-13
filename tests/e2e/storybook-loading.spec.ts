import { expect, test } from '@playwright/test';

test('story loading is themed before the story module resolves', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ds-storybook-theme', 'dark'));
  await page.route(/\/assets\/tooltip\.stories-[^/]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  const navigation = page.goto('/iframe.html?id=atoms-tooltip--playground&viewMode=story');
  const loader = page.locator('.sb-preparing-story .sb-loader');
  await expect(loader).toBeVisible();
  await expect(page.locator('.sb-preparing-story')).toHaveAttribute('role', 'status');
  await expect(page.locator('.sb-preparing-story')).toHaveAttribute('aria-label', 'Loading story...');
  await expect(page.locator('html')).toHaveAttribute('data-ds-theme', 'dark');
  await expect(page.locator('html')).toHaveCSS('background-color', 'rgb(34, 36, 37)');
  await navigation;
});

test('docs use a stable loading gate until content and fonts are ready', async ({ page }) => {
  await page.route(/\/assets\/spacing(?:\.mdx)?-[^/]+\.js$/, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    await route.continue();
  });
  const navigation = page.goto('/iframe.html?id=foundations-spacing--docs&viewMode=docs');
  const loader = page.locator('.sb-preparing-docs');
  await expect(loader).toBeVisible();
  await expect(loader).toHaveAttribute('role', 'status');
  await expect(loader).toHaveAttribute('aria-label', 'Loading documentation...');
  await expect
    .poll(() => loader.evaluate((element) => getComputedStyle(element, '::after').content))
    .toContain('Loading documentation...');
  await navigation;
  await expect(page.locator('html')).toHaveAttribute('data-ds-docs-ready', 'true');
  await expect(loader).toBeHidden();
  await expect(page.locator('.sbdocs-content')).toBeVisible();
});

test('docs remain hidden while asynchronous code blocks render', async ({ page }) => {
  let releaseHighlighter: (() => void) | undefined;
  let signalHighlighter: (() => void) | undefined;
  const highlighterRequested = new Promise<void>((resolve) => {
    signalHighlighter = resolve;
  });
  const highlighterReleased = new Promise<void>((resolve) => {
    releaseHighlighter = resolve;
  });
  await page.route(/\/assets\/syntaxhighlighter-[^/]+\.js$/, async (route) => {
    signalHighlighter?.();
    await highlighterReleased;
    await route.continue();
  });

  const navigation = page.goto('/iframe.html?id=molecules-heatmapcalendar--docs&viewMode=docs');
  await highlighterRequested;
  await expect(page.locator('.sbdocs-content pre > div:only-child:empty')).toHaveCount(1);
  await expect(page.locator('html')).toHaveAttribute('data-ds-docs-ready', 'false');
  await expect(page.locator('.sb-preparing-docs')).toBeVisible();
  await expect(page.locator('#storybook-docs')).toHaveCSS('visibility', 'hidden');

  releaseHighlighter?.();
  await navigation;
  await expect(page.locator('.sbdocs-content > pre .docblock-source')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-ds-docs-ready', 'true');
});

test('docs remain hidden until the initial layout stops changing', async ({ page }) => {
  const navigation = page.goto('/iframe.html?id=atoms-button--docs&viewMode=docs');
  await page.locator('.sbdocs-content').waitFor({ state: 'attached' });
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        window.setTimeout(() => {
          const block = document.createElement('div');
          block.dataset['layoutTest'] = 'true';
          block.style.height = '100px';
          document.querySelector('.sbdocs-content')?.append(block);
          resolve();
        }, 100);
      }),
  );
  await expect(page.locator('html')).toHaveAttribute('data-ds-docs-ready', 'false');
  await expect(page.locator('#storybook-docs')).toHaveCSS('visibility', 'hidden');
  await navigation;
  await expect(page.locator('html')).toHaveAttribute('data-ds-docs-ready', 'true');
  const heightAtReveal = await page
    .locator('.sbdocs-content')
    .evaluate((element) => element.getBoundingClientRect().height);
  await page.waitForTimeout(400);
  const settledHeight = await page
    .locator('.sbdocs-content')
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(settledHeight).toBe(heightAtReveal);
});

test('docs navigation reapplies the loading gate before revealing the next page', async ({ page }) => {
  let releaseHighlighter: (() => void) | undefined;
  let signalHighlighter: (() => void) | undefined;
  const highlighterRequested = new Promise<void>((resolve) => {
    signalHighlighter = resolve;
  });
  const highlighterReleased = new Promise<void>((resolve) => {
    releaseHighlighter = resolve;
  });
  await page.route(/\/assets\/syntaxhighlighter-[^/]+\.js$/, async (route) => {
    signalHighlighter?.();
    await highlighterReleased;
    await route.continue();
  });

  await page.goto('/?path=/docs/atoms-button--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.locator('html')).toHaveAttribute('data-ds-docs-ready', 'true');

  const link = page.locator('a[href*="/docs/molecules-heatmapcalendar--docs"]').first();
  await link.click();
  await highlighterRequested;
  await expect(preview.locator('html')).toHaveAttribute('data-ds-docs-ready', 'false');
  await expect(preview.locator('#storybook-docs')).toHaveCSS('visibility', 'hidden');
  await expect(preview.locator('.sb-preparing-docs')).toBeVisible();
  releaseHighlighter?.();
  await expect(preview.locator('html')).toHaveAttribute('data-ds-docs-ready', 'true');
  await expect(preview.locator('.sbdocs-content > pre .docblock-source')).toBeVisible();

  const heightAtReveal = await preview
    .locator('.sbdocs-content')
    .evaluate((element) => element.getBoundingClientRect().height);
  await page.waitForTimeout(400);
  const settledHeight = await preview
    .locator('.sbdocs-content')
    .evaluate((element) => element.getBoundingClientRect().height);
  expect(settledHeight).toBe(heightAtReveal);
});

test('cached docs navigation skips the stability overlay', async ({ page }) => {
  await page.goto('/?path=/docs/atoms-button--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.getByRole('heading', { name: 'Button', level: 1 })).toBeVisible();

  await page.locator('a[href*="/docs/molecules-heatmapcalendar--docs"]').first().click();
  await expect(preview.getByRole('heading', { name: 'HeatmapCalendar', level: 1 })).toBeVisible();
  await page.locator('a[href*="/docs/atoms-button--docs"]').first().click();
  await expect(preview.getByRole('heading', { name: 'Button', level: 1 })).toBeVisible();

  await preview.locator('html').evaluate((root) => {
    root.setAttribute('data-ready-history', root.getAttribute('data-ds-docs-ready') ?? '');
    const observer = new MutationObserver(() => {
      const history = root.getAttribute('data-ready-history') ?? '';
      const ready = root.getAttribute('data-ds-docs-ready') ?? '';
      root.setAttribute('data-ready-history', `${history},${ready}`);
    });
    observer.observe(root, { attributeFilter: ['data-ds-docs-ready'], attributes: true });
  });

  await page.locator('a[href*="/docs/molecules-heatmapcalendar--docs"]').first().click();
  await expect(preview.getByRole('heading', { name: 'HeatmapCalendar', level: 1 })).toBeVisible();
  await page.waitForTimeout(400);
  const readyHistory = await preview
    .locator('html')
    .evaluate((root) => (root.getAttribute('data-ready-history') ?? '').split(','));
  expect(readyHistory).not.toContain('false');
  await expect(preview.locator('.sb-preparing-docs')).toBeHidden();
});

test('nested story frames show a themed spinner before their document loads', async ({ page }) => {
  await page.addInitScript(() => localStorage.setItem('ds-storybook-theme', 'dark'));
  let releaseRequest: (() => void) | undefined;
  let signalRequest: (() => void) | undefined;
  const requestStarted = new Promise<void>((resolve) => {
    signalRequest = resolve;
  });
  const requestReleased = new Promise<void>((resolve) => {
    releaseRequest = resolve;
  });
  let blocked = false;
  await page.route(/\/iframe\.html\?.*viewMode=story/, async (route) => {
    if (!blocked) {
      blocked = true;
      signalRequest?.();
      await requestReleased;
    }
    await route.continue();
  });

  const navigation = page.goto('/iframe.html?id=atoms-tooltip--docs&viewMode=docs');
  await requestStarted;
  const loadingFrame = page.locator('iframe[data-ds-story-loading="true"]').first();
  await expect(loadingFrame).toBeVisible();
  const loadingFrameId = await loadingFrame.getAttribute('id');
  expect(loadingFrameId).not.toBeNull();
  const story = loadingFrame.locator('xpath=ancestor::*[contains(@class,"docs-story")][1]');
  await expect
    .poll(() => story.evaluate((element) => getComputedStyle(element, '::after').animationName))
    .toBe('ds-loading-spin');
  await expect
    .poll(() => story.evaluate((element) => getComputedStyle(element, '::before').backgroundColor))
    .toBe('rgb(34, 36, 37)');
  const outerSpinner = await story.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return [style.width, style.height, style.borderTopWidth, style.animationDuration];
  });
  expect(outerSpinner).toEqual(['40px', '40px', '3px', '0.7s']);
  const handoff = story.evaluate((element) => {
    const iframe = element.querySelector('iframe')!;
    return new Promise<boolean>((resolve) => {
      const observer = new MutationObserver(() => {
        if (iframe.getAttribute('data-ds-story-loading') !== 'true') {
          observer.disconnect();
          resolve(
            Boolean(iframe.contentDocument?.body.matches('.sb-show-main, .sb-show-nopreview, .sb-show-errordisplay')),
          );
        }
      });
      observer.observe(iframe, { attributeFilter: ['data-ds-story-loading'], attributes: true });
    });
  });
  releaseRequest?.();
  await expect(handoff).resolves.toBe(true);
  await navigation;
  await expect(page.locator(`[id="${loadingFrameId}"]`)).not.toHaveAttribute('data-ds-story-loading', 'true');
});

test('preview initialization survives unavailable local storage', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => {
      throw new DOMException('Storage disabled', 'SecurityError');
    };
    Storage.prototype.setItem = () => {
      throw new DOMException('Storage disabled', 'SecurityError');
    };
  });
  await page.goto('/iframe.html?id=atoms-tooltip--playground&viewMode=story');
  await expect(page.locator('ds-tooltip')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-ds-theme', 'light');
});
