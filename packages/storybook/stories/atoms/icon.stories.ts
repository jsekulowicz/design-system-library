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
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] },
  },
  args: { name: 'check', size: 'lg', label: '' },
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
<div style="
  display:grid;
  grid-template-columns:repeat(7, minmax(4rem, 1fr));
  gap:var(--ds-space-4);
  align-items:end;
  max-width:40rem;
">
  ${(['sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl'] as const).map((size) => html`
    <figure style="
      display:flex;
      flex-direction:column;
      align-items:center;
      gap:var(--ds-space-2);
      margin:0;
    ">
      <ds-icon name="arrow-right" size=${size}></ds-icon>
      <figcaption style="
        color:var(--ds-color-fg-muted);
        font-family:var(--ds-font-body);
        font-size:var(--ds-font-size-xs);
        font-weight:var(--ds-font-weight-medium);
      ">${size}</figcaption>
    </figure>
  `)}
</div>
  `,
};
