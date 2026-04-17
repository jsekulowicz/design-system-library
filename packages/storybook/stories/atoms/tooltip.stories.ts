import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/tooltip/define';
import '@ds/components/button/define';

const meta: Meta = {
  title: 'Atoms/Tooltip',
  component: 'ds-tooltip',
  tags: ['autodocs'],
  argTypes: {
    content: { control: 'text' },
    placement: {
      control: { type: 'inline-radio' },
      options: ['top', 'right', 'bottom', 'left'],
    },
    open: { control: 'boolean' },
  },
  args: { content: 'Helpful context', placement: 'top', open: false },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <div style="padding: 3rem; display: flex; justify-content: center;">
      <ds-tooltip content=${args.content} placement=${args.placement} ?open=${args.open}>
        <ds-button variant="secondary">Hover me</ds-button>
      </ds-tooltip>
    </div>
  `,
};

export const Placements: Story = {
  render: () => html`
    <div style="padding: 4rem; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
      <ds-tooltip content="Appears above" placement="top">
        <ds-button variant="ghost" size="sm">Top</ds-button>
      </ds-tooltip>
      <ds-tooltip content="Appears below" placement="bottom">
        <ds-button variant="ghost" size="sm">Bottom</ds-button>
      </ds-tooltip>
      <ds-tooltip content="Appears left" placement="left">
        <ds-button variant="ghost" size="sm">Left</ds-button>
      </ds-tooltip>
      <ds-tooltip content="Appears right" placement="right">
        <ds-button variant="ghost" size="sm">Right</ds-button>
      </ds-tooltip>
    </div>
  `,
};

export const OnIcon: Story = {
  name: 'On icon-like trigger',
  render: () => html`
    <div style="padding: 3rem; display: flex; gap: 2rem; justify-content: center;">
      <ds-tooltip content="Delete permanently" placement="top">
        <ds-button variant="ghost" size="sm" aria-label="Delete">✕</ds-button>
      </ds-tooltip>
      <ds-tooltip content="Copy to clipboard" placement="top">
        <ds-button variant="ghost" size="sm" aria-label="Copy">⎘</ds-button>
      </ds-tooltip>
    </div>
  `,
};
