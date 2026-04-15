import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/badge/define';

const meta: Meta = {
  title: 'Atoms/Badge',
  component: 'ds-badge',
  tags: ['autodocs'],
  argTypes: {
    tone: {
      control: { type: 'select' },
      options: ['neutral', 'accent', 'success', 'warning', 'danger'],
    },
  },
  args: { tone: 'neutral' },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`<ds-badge tone=${args.tone}>New</ds-badge>`,
};

export const Tones: Story = {
  render: () => html`
    <div style="display:flex;gap:var(--ds-space-2);flex-wrap:wrap">
      <ds-badge tone="neutral">Draft</ds-badge>
      <ds-badge tone="accent">Featured</ds-badge>
      <ds-badge tone="success">Paid</ds-badge>
      <ds-badge tone="warning">Pending</ds-badge>
      <ds-badge tone="danger">Overdue</ds-badge>
    </div>
  `,
};
