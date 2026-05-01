import type { StorybookConfig } from '@storybook/web-components-vite';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';

const publicDir = resolve(__dirname, '../public');

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
  ],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
  staticDirs: existsSync(publicDir) ? ['../public'] : [],
};

export default config;
