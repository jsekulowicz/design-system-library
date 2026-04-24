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

const channel = addons.getChannel();
channel.on('globalsUpdated', ({ globals }: { globals: Record<string, unknown> }) => applyTheme(globals));
channel.on('setGlobals', ({ globals }: { globals: Record<string, unknown> }) => applyTheme(globals));

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
    docs: { page: DocsPage },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Framework usage',
          'Foundations',
          ['Design intent', 'Tokens', 'Typography', 'Color', 'Spacing', 'Theming'],
          ['Atoms', ['Breadcrumb', 'CheckboxGroup', 'Checkbox', 'RadioGroup', 'Radio', 'Select', 'SearchableSelect', 'Tabs', 'Table']],
          ['Molecules', ['Alert', 'BarChart', 'Card', 'Field']],
          'Organisms',
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
