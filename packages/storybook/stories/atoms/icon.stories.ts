import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/icon/define';
import { registerIcon } from '@ds/components/icon';

registerIcon(
  'check',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5L20 7"/></svg>'
);
registerIcon(
  'arrow-right',
  '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 12h16M13 5l7 7-7 7"/></svg>'
);
registerIcon(
  'spark',
  '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.5 6.5L21 11l-6.5 2.5L12 20l-2.5-6.5L3 11l6.5-2.5z"/></svg>'
);

const meta: Meta = {
  title: 'Atoms/Icon',
  component: 'ds-icon',
  tags: ['autodocs'],
  argTypes: {
    name: { control: { type: 'select' }, options: ['check', 'arrow-right', 'spark'] },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
  },
  args: { name: 'spark', size: 'md', label: '' },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-icon name=${args.name} size=${args.size} label=${args.label}></ds-icon>
  `,
};

export const Sizes: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--ds-space-3);align-items:center">
      <ds-icon name="spark" size="sm"></ds-icon>
      <ds-icon name="spark" size="md"></ds-icon>
      <ds-icon name="spark" size="lg"></ds-icon>
    </div>
  `,
};
