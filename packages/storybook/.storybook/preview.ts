import type { Preview } from '@storybook/web-components';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { addons } from 'storybook/internal/preview-api';
import { DocsPage } from './docs-page.js';
import '@ds/tokens/theme-default.css';
import '@ds/components/define';
import './fonts.css';
import './docs-theme.css';

// Apply data-ds-theme on every globals change so docs-only pages (no rendered
// story, so no decorator) still respond to the theme toolbar button.
function applyTheme(globals: Record<string, unknown>): void {
  const theme = (globals['theme'] as string) === 'dark' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-ds-theme', theme);
}

function applyViewport(globals: Record<string, unknown>): void {
  const rawViewport = globals['viewport'];
  const viewport = typeof rawViewport === 'string'
    ? rawViewport
    : (rawViewport as { value?: string } | undefined)?.value ?? 'desktop';
  const width = viewport === 'mobile' ? '360px' : viewport === 'tablet' ? '768px' : '1280px';
  document.documentElement.setAttribute('data-ds-viewport', viewport);
  document.documentElement.style.setProperty('--ds-docs-viewport-width', width);
}

const channel = addons.getChannel();
channel.on('globalsUpdated', ({ globals }: { globals: Record<string, unknown> }) =>
  (applyTheme(globals), applyViewport(globals)),
);
channel.on('setGlobals', ({ globals }: { globals: Record<string, unknown> }) =>
  (applyTheme(globals), applyViewport(globals)),
);

const preview: Preview = {
  initialGlobals: {
    viewport: { value: 'desktop', isRotated: false },
  },
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
    viewport: {
      options: {
        mobile: {
          name: 'Mobile (360px)',
          styles: { width: '360px', height: '844px' },
          type: 'mobile',
        },
        tablet: {
          name: 'Tablet (768px)',
          styles: { width: '768px', height: '1024px' },
          type: 'tablet',
        },
        desktop: {
          name: 'Desktop (1280px)',
          styles: { width: '1280px', height: '800px' },
          type: 'desktop',
        },
      },
    },
    docs: { page: DocsPage },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Framework usage',
          'Foundations',
          ['Design intent', 'Tokens', 'Typography', 'Color', 'Spacing', 'Theming'],
          [
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
          ['Molecules', ['Alert', 'BarChart', 'Card', 'Field']],
          ['Organisms', ['Form', 'Navbar', 'Sidenav', 'Footer']],
          'Templates',
          'Pages',
        ],
      },
    },
  },
  decorators: [
    withThemeByDataAttribute({
      themes: { light: 'light', dark: 'dark' },
      defaultTheme: 'light',
      attributeName: 'data-ds-theme',
      parentSelector: 'html',
    }),
  ],
};

export default preview;
