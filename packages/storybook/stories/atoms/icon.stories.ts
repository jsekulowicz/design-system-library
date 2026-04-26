import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/icon/define';
import { registerIcon, getIcon } from '@ds/components/icon';

const HEROICONS_CDN = 'https://cdn.jsdelivr.net/npm/heroicons@2/16/solid';

async function fetchHeroicon(name: string): Promise<void> {
  if (!name || getIcon(name)) return;
  try {
    const res = await fetch(`${HEROICONS_CDN}/${name}.svg`);
    if (res.ok) registerIcon(name, await res.text());
  } catch {
    // name may be incomplete while the user is still typing
  }
}

fetchHeroicon('check');
fetchHeroicon('arrow-right');

const meta: Meta = {
  title: 'Atoms/Icon',
  component: 'ds-icon',
  tags: ['!dev'],
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Heroicon name in kebab-case. Browse all icons at [heroicons.com](https://heroicons.com).',
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  args: { name: 'check', size: 'md', label: '' },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  loaders: [
    async ({ args }) => {
      await fetchHeroicon(args['name'] as string);
      return {};
    },
  ],
  render: (args) => html`
<ds-icon name=${args['name']} size=${args['size']} label=${args['label']}></ds-icon>
  `,
};

export const Sizes: Story = {
  loaders: [
    async () => {
      await fetchHeroicon('arrow-right');
      return {};
    },
  ],
  render: () => html`
<div style="display:flex;gap:var(--ds-space-3);align-items:center">
  <ds-icon name="arrow-right" size="sm"></ds-icon>
  <ds-icon name="arrow-right" size="md"></ds-icon>
  <ds-icon name="arrow-right" size="lg"></ds-icon>
</div>
  `,
};
