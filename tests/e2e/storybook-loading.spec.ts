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
  await expect(loader).toHaveCSS('width', '40px');
  await expect(loader).toHaveCSS('height', '40px');
  await expect(loader).toHaveCSS('position', 'absolute');
  await expect(loader).toHaveCSS('border-top-width', '3px');
  await expect(loader).toHaveCSS('animation-duration', '0.7s');
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
  await expect(loader).toHaveCSS('display', 'flex');
  await expect(loader).toHaveCSS('align-items', 'center');
  await expect(loader).toHaveCSS('justify-content', 'center');
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

  const navigation = page.goto('/iframe.html?id=organisms-topbar--docs&viewMode=docs');
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

test('manager and preview use the same centered documentation loader', async ({ page }) => {
  let releaseDocsModule: (() => void) | undefined;
  let signalDocsModule: (() => void) | undefined;
  const docsModuleRequested = new Promise<void>((resolve) => {
    signalDocsModule = resolve;
  });
  const docsModuleReleased = new Promise<void>((resolve) => {
    releaseDocsModule = resolve;
  });
  await page.route(/\/assets\/spacing(?:\.mdx)?-[^/]+\.js$/, async (route) => {
    signalDocsModule?.();
    await docsModuleReleased;
    await route.continue();
  });
  let releasePreview: (() => void) | undefined;
  let signalPreview: (() => void) | undefined;
  const previewRequested = new Promise<void>((resolve) => {
    signalPreview = resolve;
  });
  const previewReleased = new Promise<void>((resolve) => {
    releasePreview = resolve;
  });
  await page.route(/\/iframe\.html(?:\?|$)/, async (route) => {
    signalPreview?.();
    await previewReleased;
    await route.continue();
  });

  const navigation = page.goto('/?path=/docs/foundations-spacing--docs');
  await previewRequested;
  const managerLoader = page.locator('div:has(> #preview-loader)');
  await expect(managerLoader).toBeVisible();
  await expect(managerLoader).toHaveAttribute('role', 'status');
  await expect(managerLoader).toHaveAttribute('aria-label', 'Loading documentation...');
  await expect(managerLoader).toHaveCSS('align-items', 'center');
  await expect(managerLoader).toHaveCSS('justify-content', 'center');
  await expect(managerLoader).toHaveCSS('scrollbar-gutter', 'stable');
  await expect(page.locator('html')).toHaveAttribute('data-ds-loading-kind', 'docs');
  await expect
    .poll(() => managerLoader.evaluate((element) => getComputedStyle(element, '::after').content))
    .toContain('Loading documentation...');
  const managerSpinner = page.locator('#preview-loader');
  await expect(managerSpinner).toHaveCSS('position', 'static');
  await expect(managerSpinner).toHaveCSS('margin', '0px');
  const managerSpinnerStyle = await managerSpinner.evaluate((element) => {
    const style = getComputedStyle(element);
    return [
      style.width,
      style.height,
      style.borderTopWidth,
      style.animationDuration,
      style.borderTopColor,
      style.borderRightColor,
    ];
  });
  const managerSpinnerCenter = await managerSpinner.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    return { x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 };
  });
  const managerLabelStyle = await managerLoader.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return [style.color, style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight];
  });
  releasePreview?.();
  await docsModuleRequested;

  const preview = page.frameLocator('#storybook-preview-iframe');
  const docsLoader = preview.locator('.sb-preparing-docs');
  const previewSpinner = docsLoader.locator('.sb-loader');
  await expect(preview.locator('html')).toHaveCSS('scrollbar-gutter', 'stable');
  await expect(docsLoader).toBeVisible();
  await expect
    .poll(() => docsLoader.evaluate((element) => getComputedStyle(element, '::after').content))
    .toContain('Loading documentation...');
  const previewSpinnerStyle = await previewSpinner.evaluate((element) => {
    const style = getComputedStyle(element);
    return [
      style.position,
      style.margin,
      style.width,
      style.height,
      style.borderTopWidth,
      style.animationDuration,
      style.borderTopColor,
      style.borderRightColor,
    ];
  });
  expect(previewSpinnerStyle.slice(0, 2)).toEqual(['static', '0px']);
  const previewSpinnerCenter = await previewSpinner.evaluate((element) => {
    const rect = element.getBoundingClientRect();
    const frameRect = window.frameElement?.getBoundingClientRect();
    return {
      x: rect.x + (frameRect?.x ?? 0) + rect.width / 2,
      y: rect.y + (frameRect?.y ?? 0) + rect.height / 2,
    };
  });
  const previewLabelStyle = await docsLoader.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return [style.color, style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight];
  });
  expect(previewSpinnerStyle.slice(2)).toEqual(managerSpinnerStyle);
  expect(previewSpinnerCenter.x).toBeCloseTo(managerSpinnerCenter.x, 1);
  expect(previewSpinnerCenter.y).toBeCloseTo(managerSpinnerCenter.y, 1);
  expect(previewLabelStyle).toEqual(managerLabelStyle);
  releaseDocsModule?.();
  await navigation;
  await expect(preview.locator('.sbdocs-content')).toBeVisible();
  await expect(preview.locator('.sb-preparing-docs')).toBeHidden();
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
