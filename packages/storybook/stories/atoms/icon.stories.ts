import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/all';

const meta: Meta = {
  title: 'Atoms/Icon',
  component: 'ds-icon',
  argTypes: {
    name: {
      control: { type: 'text' },
      description: 'Heroicon name in kebab-case. Browse all icons at [heroicons.com](https://heroicons.com).',
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl'] },
  },
  args: { name: 'check', size: 'md', label: '' },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-icon name=${args['name']} size=${args['size']} label=${args['label']}></ds-icon>
  `,
};

export const Sizes: Story = {
  render: () => html`
<div style="display:flex;gap:var(--ds-space-3);align-items:center">
  <ds-icon name="arrow-right" size="sm"></ds-icon>
  <ds-icon name="arrow-right" size="md"></ds-icon>
  <ds-icon name="arrow-right" size="lg"></ds-icon>
  <ds-icon name="arrow-right" size="xl"></ds-icon>
  <ds-icon name="arrow-right" size="2xl"></ds-icon>
  <ds-icon name="arrow-right" size="3xl"></ds-icon>
</div>
  `,
};
