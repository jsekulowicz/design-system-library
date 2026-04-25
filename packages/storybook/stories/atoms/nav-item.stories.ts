import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/nav-item/define';
import '@ds/components/icon/define';
import '@ds/components/icon/home';
import '@ds/components/icon/cog-6-tooth';

const meta: Meta = {
  title: 'Atoms/NavItem',
  component: 'ds-nav-item',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <ds-nav-item href="/docs">Documentation</ds-nav-item>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <ds-nav-item href="/">
      <ds-icon slot="icon" name="home" size="sm"></ds-icon>
      Home
    </ds-nav-item>
  `,
};

export const Current: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--ds-space-1);width:240px">
      <ds-nav-item href="/">
        <ds-icon slot="icon" name="home" size="sm"></ds-icon>
        Home
      </ds-nav-item>
      <ds-nav-item href="/settings" current>
        <ds-icon slot="icon" name="cog-6-tooth" size="sm"></ds-icon>
        Settings
      </ds-nav-item>
    </div>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-nav-item href="/billing" disabled>
      <ds-icon slot="icon" name="cog-6-tooth" size="sm"></ds-icon>
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
