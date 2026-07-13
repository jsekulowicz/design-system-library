import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/nav-item/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/home';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';

const meta: Meta = {
  title: 'Atoms/NavItem',
  component: 'ds-nav-item',
  argTypes: {
    href: { control: 'text' },
    target: {
      control: 'select',
      options: [undefined, '_self', '_blank', '_parent', '_top'],
    },
    rel: { control: 'text' },
    current: { control: 'boolean' },
    disabled: { control: 'boolean' },
    compact: { control: 'boolean' },
    compactHoverTooltipDelay: {
      control: { type: 'number', min: 0, step: 100 },
    },
  },
  args: {
    href: '/docs',
    current: false,
    disabled: false,
    compact: false,
    compactHoverTooltipDelay: 1000,
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: function render(args) {
    return html`
      <ds-nav-item
        .href=${args['href']}
        .target=${args['target']}
        .rel=${args['rel']}
        ?current=${args['current']}
        ?disabled=${args['disabled']}
        ?compact=${args['compact']}
        .compactHoverTooltipDelay=${args['compactHoverTooltipDelay']}
      >
        <ds-icon slot="icon" name="home" size="lg"></ds-icon>
        Documentation
      </ds-nav-item>
    `;
  },
};

export const WithIcon: Story = {
  render: () => html`
    <ds-nav-item href="/">
      <ds-icon slot="icon" name="home" size="lg"></ds-icon>
      Home
    </ds-nav-item>
  `,
};

export const Current: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--ds-space-1);width:240px">
      <ds-nav-item href="/">
        <ds-icon slot="icon" name="home" size="lg"></ds-icon>
        Home
      </ds-nav-item>
      <ds-nav-item href="/settings" current>
        <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
        Settings
      </ds-nav-item>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-nav-item href="/billing" disabled>
      <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
      Billing (coming soon)
    </ds-nav-item>
  `,
};

export const NewTab: Story = {
  render: () => html`
    <ds-nav-item href="https://example.com" target="_blank" rel="noopener">
      External docs
    </ds-nav-item>
  `,
};

export const Compact: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--ds-space-1);width:64px">
      <ds-nav-item href="/" compact current compact-hover-tooltip-delay="1000">
        <ds-icon slot="icon" name="home" size="lg"></ds-icon>
        Home
      </ds-nav-item>
      <ds-nav-item href="/settings" compact>
        <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
        Settings
      </ds-nav-item>
    </div>
    <p
      style="margin-top:var(--ds-space-4);color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-sm)"
    >
      Hover an item for ~1s to see the tooltip with the original label. Customize the delay with
      <code>compactHoverTooltipDelay</code>.
    </p>
  `,
};
