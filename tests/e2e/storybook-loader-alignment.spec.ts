import { expect, test } from '@playwright/test';
import { collectDocumentationLoaderSamplesDuringRefresh } from './storybook-loader-sampling';

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

  const navigation = page.goto('/iframe.html?id=navigation-topbar--docs&viewMode=docs');
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

test('manager and preview documentation loaders share visual styling', async ({ page }) => {
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
  await expect(managerLoader).toHaveCSS('overflow-y', 'scroll');
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
  const previewLabelStyle = await docsLoader.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return [style.color, style.fontFamily, style.fontSize, style.fontWeight, style.lineHeight];
  });
  expect(previewSpinnerStyle.slice(2)).toEqual(managerSpinnerStyle);
  expect(previewLabelStyle).toEqual(managerLabelStyle);
  releaseDocsModule?.();
  await navigation;
  await expect(preview.locator('.sbdocs-content')).toBeVisible();
  await expect(preview.locator('.sb-preparing-docs')).toBeHidden();
});

test('ordinary docs refresh keeps the manager and preview loaders aligned', async ({ page }) => {
  const samples = await collectDocumentationLoaderSamplesDuringRefresh(page);
  const preview = page.frameLocator('#storybook-preview-iframe');
  const scrollport = await preview.locator('html').evaluate((root) => ({
    overflowY: getComputedStyle(root).overflowY,
  }));
  const managerSamples = samples.filter(({ kind }) => kind === 'manager');
  const previewSamples = samples.filter(({ kind }) => kind === 'preview');
  const centers = samples.map(({ centerX }) => centerX);

  expect(managerSamples.length).toBeGreaterThan(0);
  expect(previewSamples.length).toBeGreaterThan(0);
  expect(scrollport.overflowY).toBe('scroll');
  expect(Math.max(...centers) - Math.min(...centers)).toBeLessThan(0.1);
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
  await page.goto('/iframe.html?id=overlays-tooltip--playground&viewMode=story');
  await expect(page.locator('ds-tooltip')).toBeVisible();
  await expect(page.locator('html')).toHaveAttribute('data-ds-theme', 'light');
});
