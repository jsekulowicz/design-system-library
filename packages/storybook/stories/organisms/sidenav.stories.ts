import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/sidenav/define';
import '@ds/components/nav-item/define';
import '@ds/components/button/define';
import '@ds/components/icon/define';
import '@ds/components/icon/home';
import '@ds/components/icon/cog-6-tooth';
import '@ds/components/icon/clock';

const meta: Meta = {
  title: 'Organisms/Sidenav',
  component: 'ds-sidenav',
  tags: ['!dev'],
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
<div style="height:480px;display:flex">
  <ds-sidenav>
    <strong slot="header">Brand</strong>
    <ds-nav-item href="/" current>
      <ds-icon slot="icon" name="home" size="sm"></ds-icon>
      Overview
    </ds-nav-item>
    <ds-nav-item href="/activity">
      <ds-icon slot="icon" name="clock" size="sm"></ds-icon>
      Activity
    </ds-nav-item>
    <ds-nav-item href="/settings">
      <ds-icon slot="icon" name="cog-6-tooth" size="sm"></ds-icon>
      Settings
    </ds-nav-item>
    <ds-nav-item slot="footer" href="/help">
      <ds-icon slot="icon" name="cog-6-tooth" size="sm"></ds-icon>
      Help
    </ds-nav-item>
  </ds-sidenav>
</div>
`,
};

export const WithGroups: Story = {
  render: () => html`
<div style="height:520px;display:flex">
  <ds-sidenav>
    <strong slot="header">Brand</strong>
    <ds-nav-item href="/" current>
      <ds-icon slot="icon" name="home" size="sm"></ds-icon>
      Overview
    </ds-nav-item>
    <ds-nav-group label="Workspace" expanded>
      <ds-nav-item href="/projects">Projects</ds-nav-item>
      <ds-nav-item href="/team">Team</ds-nav-item>
      <ds-nav-item href="/integrations">Integrations</ds-nav-item>
    </ds-nav-group>
    <ds-nav-group label="Account">
      <ds-nav-item href="/settings">Settings</ds-nav-item>
      <ds-nav-item href="/billing">Billing</ds-nav-item>
    </ds-nav-group>
  </ds-sidenav>
</div>
`,
};

export const Collapsed: Story = {
  render: () => html`
<div style="height:480px;display:flex">
  <ds-sidenav collapsed>
    <ds-nav-item href="/" current>
      <ds-icon slot="icon" name="home" size="sm"></ds-icon>
      Overview
    </ds-nav-item>
    <ds-nav-item href="/activity">
      <ds-icon slot="icon" name="clock" size="sm"></ds-icon>
      Activity
    </ds-nav-item>
    <ds-nav-item href="/settings">
      <ds-icon slot="icon" name="cog-6-tooth" size="sm"></ds-icon>
      Settings
    </ds-nav-item>
  </ds-sidenav>
</div>
`,
};

export const CollapseToggle: Story = {
  render: () => html`
<div style="height:520px;display:flex">
  <ds-sidenav id="toggle-sidenav">
    <strong slot="header">Brand</strong>
    <ds-nav-item href="/" current>
      <ds-icon slot="icon" name="home" size="sm"></ds-icon>
      Overview
    </ds-nav-item>
    <ds-nav-item href="/activity">
      <ds-icon slot="icon" name="clock" size="sm"></ds-icon>
      Activity
    </ds-nav-item>
    <ds-nav-item href="/settings">
      <ds-icon slot="icon" name="cog-6-tooth" size="sm"></ds-icon>
      Settings
    </ds-nav-item>
    <ds-button
      slot="footer"
      size="sm"
      variant="ghost"
      @click=${(event: Event) => {
        const sidenav = (event.currentTarget as HTMLElement).closest('ds-sidenav');
        sidenav?.toggleAttribute('collapsed');
      }}
    >
      Toggle collapse
    </ds-button>
  </ds-sidenav>
</div>
`,
};
