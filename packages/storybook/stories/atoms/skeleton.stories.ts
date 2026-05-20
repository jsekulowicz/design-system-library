import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/skeleton/define';

const meta: Meta = {
  title: 'Atoms/Skeleton',
  component: 'ds-skeleton',
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['text', 'rectangle', 'circle'],
    },
  },
  args: {
    variant: 'text',
    lines: 3,
    width: '',
    height: '',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-skeleton
  variant=${args['variant']}
  lines=${args['lines']}
  width=${args['width']}
  height=${args['height']}
></ds-skeleton>
`,
};

export const TextBlock: Story = {
  render: () => html`<ds-skeleton lines="4"></ds-skeleton>`,
};

export const AvatarRow: Story = {
  render: () => html`
<div style="display:grid;grid-template-columns:auto 1fr;gap:var(--ds-space-3);align-items:center;max-width:24rem">
  <ds-skeleton variant="circle" width="2.75rem"></ds-skeleton>
  <ds-skeleton lines="2"></ds-skeleton>
</div>
`,
};

export const CardPlaceholder: Story = {
  render: () => html`
<div style="display:grid;gap:var(--ds-space-3);max-width:28rem">
  <ds-skeleton variant="rectangle" height="10rem"></ds-skeleton>
  <ds-skeleton width="60%"></ds-skeleton>
  <ds-skeleton lines="3"></ds-skeleton>
</div>
`,
};
