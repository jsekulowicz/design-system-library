import { fileURLToPath } from 'node:url';
import type { StorybookConfig } from '@storybook/web-components-vite';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

const configDir = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(configDir, '../public');

const config: StorybookConfig = {
  stories: [
    '../stories/**/*.mdx',
    '../stories/**/*.stories.@(ts|tsx)',
  ],

  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],

  framework: {
    name: '@storybook/web-components-vite',
    options: {},
  },

  staticDirs: existsSync(publicDir) ? ['../public'] : [],
};

export default config;
