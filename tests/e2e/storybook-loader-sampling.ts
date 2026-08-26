import { expect, type Page } from '@playwright/test';

interface DocumentationLoaderSample {
  centerX: number;
  kind: 'manager' | 'preview';
}

async function collectDocumentationLoaderSamplesDuringRefresh(page: Page): Promise<DocumentationLoaderSample[]> {
  const samples: DocumentationLoaderSample[] = [];
  await page.exposeFunction('recordDocumentationLoaderSample', (sample: DocumentationLoaderSample) =>
    samples.push(sample),
  );
  await page.addInitScript(() => {
    function recordVisibleLoader(selector: string, kind: DocumentationLoaderSample['kind']): void {
      const loader = document.querySelector<HTMLElement>(selector);
      if (loader) {
        const rect = loader.getBoundingClientRect();
        const frameRect = window.frameElement?.getBoundingClientRect();
        const style = getComputedStyle(loader);
        if (rect.width > 0 && rect.height > 0 && style.display !== 'none' && style.visibility !== 'hidden') {
          void (
            window as Window & {
              recordDocumentationLoaderSample: (sample: DocumentationLoaderSample) => Promise<void>;
            }
          ).recordDocumentationLoaderSample({
            centerX: (frameRect?.left ?? 0) + rect.left + rect.width / 2,
            kind,
          });
        }
      }
    }

    function sampleVisibleDocumentationLoaders(): void {
      recordVisibleLoader('#preview-loader', 'manager');
      recordVisibleLoader('.sb-preparing-docs .sb-loader', 'preview');
    }
    const loaderSamplingInterval = window.setInterval(sampleVisibleDocumentationLoaders, 4);
    window.setTimeout(() => window.clearInterval(loaderSamplingInterval), 2000);
    sampleVisibleDocumentationLoaders();
  });
  await page.goto('/?path=/docs/foundations-spacing--docs');
  const preview = page.frameLocator('#storybook-preview-iframe');
  await expect(preview.locator('.sbdocs-content')).toBeVisible();
  await page.reload();
  await expect(preview.locator('.sbdocs-content')).toBeVisible();
  await page.waitForTimeout(200);
  return samples;
}

export { collectDocumentationLoaderSamplesDuringRefresh };
