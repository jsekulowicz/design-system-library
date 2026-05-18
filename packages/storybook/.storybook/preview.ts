import type { Preview } from '@storybook/web-components-vite';
import { addons } from 'storybook/internal/preview-api';
import { DocsPage } from './docs-page.js';
import '@jsekulowicz/ds-tokens/theme-default.css';
import '@jsekulowicz/ds-components/define';
import './fonts.css';
import './docs-theme.css';

type ThemeKey = 'light' | 'dark';
type ViewportKey = 'mobile' | 'tablet' | 'desktop';
type ViewportPayload = { viewport?: ViewportKey; persist?: boolean } | ViewportKey;

const DS_THEME_CHANGED = 'ds/theme-changed';
const DS_VIEWPORT_CHANGED = 'ds/viewport-changed';
const THEME_ATTR = 'data-ds-theme';
const THEME_STORAGE_KEY = 'ds-storybook-theme';
const VIEWPORT_STORAGE_KEY = 'ds-storybook-viewport';
const STORY_IFRAME_SELECTOR = 'iframe[id^="iframe--"]';

function normalizeTheme(value: unknown): ThemeKey {
  return value === 'dark' ? 'dark' : 'light';
}

function normalizeViewport(value: unknown): ViewportKey {
  return value === 'mobile' || value === 'tablet' || value === 'desktop' ? value : 'desktop';
}

function applyTheme(theme: ThemeKey): void {
  document.documentElement.setAttribute(THEME_ATTR, theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  syncStoryIframeThemes(theme);
}

function applyViewport(viewport: ViewportKey, persist = true): void {
  const width = viewport === 'mobile' ? '360px' : viewport === 'tablet' ? '768px' : '1280px';
  document.documentElement.setAttribute('data-ds-viewport', viewport);
  document.documentElement.style.setProperty('--ds-docs-viewport-width', width);
  if (persist) {
    window.localStorage.setItem(VIEWPORT_STORAGE_KEY, viewport);
  }
}

function isFixedDesktopPreview(): boolean {
  const id = new URLSearchParams(window.location.search).get('id') ?? '';
  return id.startsWith('foundations-') || id.startsWith('introduction--') || id.startsWith('framework-usage--');
}

function readInitialViewport(): ViewportKey {
  if (isFixedDesktopPreview()) {
    return 'desktop';
  }
  return normalizeViewport(window.localStorage.getItem(VIEWPORT_STORAGE_KEY));
}

function readAppliedTheme(): ThemeKey {
  return normalizeTheme(document.documentElement.getAttribute(THEME_ATTR));
}

function syncStoryIframeTheme(iframe: HTMLIFrameElement, theme = readAppliedTheme()): void {
  const root = iframe.contentDocument?.documentElement;
  root?.setAttribute(THEME_ATTR, theme);
}

function attachStoryIframeThemeSync(iframe: HTMLIFrameElement): void {
  if (iframe.dataset['dsThemeSyncAttached'] === 'true') {
    return;
  }
  iframe.dataset['dsThemeSyncAttached'] = 'true';
  iframe.addEventListener('load', () => syncStoryIframeTheme(iframe));
}

function syncStoryIframeThemes(theme = readAppliedTheme()): void {
  const iframes = document.querySelectorAll<HTMLIFrameElement>(STORY_IFRAME_SELECTOR);
  for (const iframe of iframes) {
    attachStoryIframeThemeSync(iframe);
    syncStoryIframeTheme(iframe, theme);
  }
}

function setupStoryIframeThemeSync(): void {
  if (!document.body) {
    window.addEventListener('DOMContentLoaded', setupStoryIframeThemeSync, { once: true });
    return;
  }
  const observer = new MutationObserver(() => syncStoryIframeThemes());
  observer.observe(document.body, { childList: true, subtree: true });
  syncStoryIframeThemes();
}

const channel = addons.getChannel();
channel.on(DS_THEME_CHANGED, (payload: { theme?: ThemeKey } | ThemeKey) => {
  const theme = typeof payload === 'string' ? payload : payload.theme;
  applyTheme(normalizeTheme(theme));
});
channel.on(DS_VIEWPORT_CHANGED, (payload: ViewportPayload) => {
  const viewport = typeof payload === 'string' ? payload : payload.viewport;
  const persist = typeof payload === 'string' ? true : payload.persist !== false;
  applyViewport(normalizeViewport(viewport), persist);
});

applyTheme(normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY)));
applyViewport(readInitialViewport(), false);
setupStoryIframeThemeSync();

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disabled: true },
    viewport: { disable: true },
    docs: {
      page: DocsPage,
      // Render stories inline in docs by default so each example sizes
      // to its content (no fixed iframe height to babysit, expanding
      // controls like SearchableSelect and MenuButton extend the page
      // flow rather than overflowing a small frame). Full-viewport
      // templates and pages opt back into iframe rendering by setting
      // `parameters.docs.story.inline = false` on their meta.
      story: { inline: true },
    },
    options: {
      storySort: {
        method: 'alphabetical',
        order: [
          'Introduction',
          'Framework usage',
          'Foundations',
          'Pages',
          'Templates',
          'Organisms',
          'Molecules',
          'Atoms',
        ],
      },
    },
  },
};

export default preview;
