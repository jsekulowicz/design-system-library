import { DOCS_RENDERED, STORY_CHANGED } from 'storybook/internal/core-events';
import { addons } from 'storybook/internal/preview-api';

const DOCS_LAYOUT_QUIET_MS = 250;
const PENDING_DOCS_SELECTOR = '.sbdocs-content pre > div:only-child:empty';
const settledDocsIds = new Set<string>();
let docsLoadGeneration = 0;

function waitForMutation(condition: () => boolean): Promise<void> {
  if (condition()) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const observer = new MutationObserver(() => {
      if (condition()) {
        observer.disconnect();
        resolve();
      }
    });
    observer.observe(document.documentElement, { childList: true, subtree: true });
  });
}

function waitForSelector(selector: string): Promise<void> {
  return waitForMutation(() => Boolean(document.querySelector(selector)));
}

function waitForPendingDocsRenderers(): Promise<void> {
  return waitForMutation(() => !document.querySelector(PENDING_DOCS_SELECTOR));
}

function getUndefinedDocsTags(): Set<string> {
  return new Set(
    Array.from(document.querySelectorAll<HTMLElement>('.sbdocs-content *'))
      .map((element) => element.localName)
      .filter((tag) => tag.startsWith('ds-') && !customElements.get(tag)),
  );
}

function waitForDocsElements(): Promise<void> {
  const tags = getUndefinedDocsTags();
  return Promise.all(Array.from(tags, (tag) => customElements.whenDefined(tag))).then(() => undefined);
}

function waitForImage(image: HTMLImageElement): Promise<void> {
  if (image.complete) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    function finish(): void {
      image.removeEventListener('load', finish);
      image.removeEventListener('error', finish);
      resolve();
    }
    image.addEventListener('load', finish);
    image.addEventListener('error', finish);
    if (image.complete) {
      finish();
    }
  });
}

function getDocsImages(): HTMLImageElement[] {
  return Array.from(document.querySelectorAll<HTMLImageElement>('.sbdocs-content img:not([loading="lazy"])'));
}

function waitForDocsImages(): Promise<void> {
  return Promise.all(getDocsImages().map(waitForImage)).then(() => undefined);
}

function hasPendingDocsLayout(): boolean {
  return (
    Boolean(document.querySelector(PENDING_DOCS_SELECTOR)) ||
    getUndefinedDocsTags().size > 0 ||
    getDocsImages().some((image) => !image.complete)
  );
}

function isDocsLayoutReady(): boolean {
  return document.fonts.status === 'loaded' && !hasPendingDocsLayout();
}

function waitForQuietDocsLayout(): Promise<void> {
  const content = document.querySelector('.sbdocs-content');
  if (!content) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let timer = 0;
    const finish = () => {
      mutationObserver.disconnect();
      resizeObserver.disconnect();
      resolve();
    };
    const restart = () => {
      window.clearTimeout(timer);
      timer = window.setTimeout(finish, DOCS_LAYOUT_QUIET_MS);
    };
    const mutationObserver = new MutationObserver(restart);
    const resizeObserver = new ResizeObserver(restart);
    mutationObserver.observe(content, { attributes: true, childList: true, subtree: true });
    resizeObserver.observe(content);
    restart();
  });
}

async function waitForSettledDocsLayout(): Promise<void> {
  do {
    await waitForPendingDocsRenderers();
    await waitForDocsElements();
    await waitForDocsImages();
    await document.fonts.ready;
    await waitForQuietDocsLayout();
  } while (hasPendingDocsLayout());
}

function beginDocsNavigation(storyId: string): void {
  if (document.documentElement.getAttribute('data-ds-view-mode') !== 'docs') {
    return;
  }
  docsLoadGeneration += 1;
  if (!settledDocsIds.has(storyId)) {
    document.documentElement.setAttribute('data-ds-docs-ready', 'false');
  }
}

async function revealDocsWhenReady(storyId: string, generation = docsLoadGeneration): Promise<void> {
  await waitForSelector('.sbdocs-content');
  if (generation !== docsLoadGeneration) {
    return;
  }
  if (settledDocsIds.has(storyId) && isDocsLayoutReady()) {
    document.documentElement.setAttribute('data-ds-docs-ready', 'true');
    return;
  }
  document.documentElement.setAttribute('data-ds-docs-ready', 'false');
  await waitForSettledDocsLayout();
  if (generation === docsLoadGeneration) {
    settledDocsIds.add(storyId);
    document.documentElement.setAttribute('data-ds-docs-ready', 'true');
  }
}

export function setupDocsReadiness(): void {
  const channel = addons.getChannel();
  channel.on(STORY_CHANGED, beginDocsNavigation);
  channel.on(DOCS_RENDERED, (storyId: string) => void revealDocsWhenReady(storyId));
}
