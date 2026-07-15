import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/tooltip/define';
import '@jsekulowicz/ds-components/button/define';

const meta: Meta = {
  title: 'Atoms/Tooltip',
  component: 'ds-tooltip',
  parameters: {
    layout: 'fullscreen',
    docs: { story: { inline: false, height: '180px' } },
  },
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

const CENTERED_FRAME_STYLE =
  'box-sizing:border-box;height:100vh;display:flex;align-items:center;justify-content:center';
const PLACEMENTS_FRAME_STYLE = `${CENTERED_FRAME_STYLE};padding:var(--ds-space-4);gap:var(--ds-space-4);flex-wrap:wrap`;
const EDGE_FRAME_STYLE = `${CENTERED_FRAME_STYLE};padding:var(--ds-space-4);justify-content:flex-start`;
const WRAPPING_FRAME_STYLE = `${CENTERED_FRAME_STYLE};text-align:right;white-space:nowrap`;

export const Playground: Story = {
  render: (args) => html`
<div style=${CENTERED_FRAME_STYLE}>
  <ds-tooltip placement=${args['placement']} ?open=${args['open']}>
    <ds-button variant="secondary">Hover me</ds-button>
    <span slot="tip">Helpful context</span>
  </ds-tooltip>
</div>
  `,
};

export const RichContent: Story = {
  render: () => html`
<div style=${CENTERED_FRAME_STYLE}>
  <ds-tooltip placement="top">
    <ds-button variant="ghost" size="sm">What's this?</ds-button>
    <span slot="tip">
      <strong>Keyboard shortcut:</strong> ⌘K to open the command palette.
    </span>
  </ds-tooltip>
</div>
  `,
};

export const WrappingContent: Story = {
  render: () => html`
<div style=${WRAPPING_FRAME_STYLE}>
  <ds-tooltip placement="bottom">
    <ds-button variant="ghost" size="sm">Contributions</ds-button>
    <span slot="tip">
      Approved crosswords created by the player and accepted word or clue suggestions
    </span>
  </ds-tooltip>
</div>
  `,
};

export const ViewportConstraint: Story = {
  render: () => html`
<div style=${EDGE_FRAME_STYLE}>
  <ds-tooltip placement="right" open>
    <ds-button variant="ghost" size="sm">Info</ds-button>
    <span slot="tip">
      This intentionally long tooltip demonstrates how content wraps before it can exceed the viewport,
      even when its preferred placement is to the right.
    </span>
  </ds-tooltip>
</div>
  `,
};

export const Placements: Story = {
  render: () => html`
<div style=${PLACEMENTS_FRAME_STYLE}>
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
