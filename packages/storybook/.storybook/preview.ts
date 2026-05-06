import type { Preview } from '@storybook/web-components-vite';
import { addons } from 'storybook/internal/preview-api';
import { DocsPage } from './docs-page.js';
import '@ds/tokens/theme-default.css';
import '@ds/components/define';
import './fonts.css';
import './docs-theme.css';

type ThemeKey = 'light' | 'dark';
type ViewportKey = 'mobile' | 'tablet' | 'desktop';
type ViewportPayload = { viewport?: ViewportKey; persist?: boolean } | ViewportKey;

const DS_THEME_CHANGED = 'ds/theme-changed';
const DS_VIEWPORT_CHANGED = 'ds/viewport-changed';
const THEME_STORAGE_KEY = 'ds-storybook-theme';
const VIEWPORT_STORAGE_KEY = 'ds-storybook-viewport';

function normalizeTheme(value: unknown): ThemeKey {
  return value === 'dark' ? 'dark' : 'light';
}

function normalizeViewport(value: unknown): ViewportKey {
  return value === 'mobile' || value === 'tablet' || value === 'desktop' ? value : 'desktop';
}

function applyTheme(theme: ThemeKey): void {
  document.documentElement.setAttribute('data-ds-theme', theme);
  window.localStorage.setItem(THEME_STORAGE_KEY, theme);
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

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disabled: true },
    viewport: { disable: true },
    docs: { page: DocsPage },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Framework usage',
          'Foundations',
          ['Design intent', 'Tokens', 'Typography', 'Color', 'Spacing', 'Theming'],
          'Pages',
          'Templates',
          'Organisms',
          ['Form', 'Navbar', 'Sidenav', 'Footer'],
          'Molecules',
          ['Alert', 'BarChart', 'Card', 'Field'],
          'Atoms',
          [
            'Breadcrumb',
            'CheckboxGroup',
            'Checkbox',
            'NavItem',
            'RadioGroup',
            'Radio',
            'Select',
            'SearchableSelect',
            'Tabs',
            'Table',
          ],
        ],
      },
    },
  },
};

export default preview;
