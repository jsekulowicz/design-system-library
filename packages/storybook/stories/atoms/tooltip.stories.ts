import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/tooltip/define';
import '@ds/components/button/define';

const meta: Meta = {
  title: 'Atoms/Tooltip',
  component: 'ds-tooltip',
  tags: ['!dev'],
  argTypes: {
    placement: {
      control: { type: 'inline-radio' },
      options: ['top', 'right', 'bottom', 'left'],
    },
    open: { control: 'boolean' },
  },
  args: { placement: 'top', open: false },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<div style="padding: 3rem; display: flex; justify-content: center;">
  <ds-tooltip placement=${args['placement']} ?open=${args['open']}>
    <ds-button variant="secondary">Hover me</ds-button>
    <span slot="tip">Helpful context</span>
  </ds-tooltip>
</div>
  `,
};

export const RichContent: Story = {
  render: () => html`
<div style="padding: 3rem; display: flex; justify-content: center;">
  <ds-tooltip placement="top">
    <ds-button variant="ghost" size="sm">What's this?</ds-button>
    <span slot="tip">
      <strong>Keyboard shortcut:</strong> ⌘K to open the command palette.
    </span>
  </ds-tooltip>
</div>
  `,
};

export const Placements: Story = {
  render: () => html`
<div style="padding: 4rem; display: flex; gap: 2rem; justify-content: center; flex-wrap: wrap;">
  <ds-tooltip placement="top">
    <ds-button variant="ghost" size="sm">Top</ds-button>
    <span slot="tip">Appears above</span>
  </ds-tooltip>
  <ds-tooltip placement="bottom">
    <ds-button variant="ghost" size="sm">Bottom</ds-button>
    <span slot="tip">Appears below</span>
  </ds-tooltip>
  <ds-tooltip placement="left">
    <ds-button variant="ghost" size="sm">Left</ds-button>
    <span slot="tip">Appears left</span>
  </ds-tooltip>
  <ds-tooltip placement="right">
    <ds-button variant="ghost" size="sm">Right</ds-button>
    <span slot="tip">Appears right</span>
  </ds-tooltip>
</div>
  `,
};
