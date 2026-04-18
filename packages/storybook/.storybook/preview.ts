import type { Preview } from '@storybook/web-components';
import { withThemeByDataAttribute } from '@storybook/addon-themes';
import { DocsPage } from './docs-page.js';
import '@ds/tokens/theme-default.css';
import '@ds/components/define';
import './fonts.css';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    backgrounds: { disable: true },
    docs: { page: DocsPage },
    options: {
      storySort: {
        order: [
          'Introduction',
          'Foundations',
          ['Design intent', 'Tokens', 'Typography', 'Color', 'Theming'],
          'Atoms',
          'Molecules',
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
