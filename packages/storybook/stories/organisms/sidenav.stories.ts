import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/sidenav/define';
import '@jsekulowicz/ds-components/nav-item/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/home';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';
import '@jsekulowicz/ds-components/icon/clock';
import '@jsekulowicz/ds-components/icon/chevron-left';
import '@jsekulowicz/ds-components/icon/chevron-right';
import { joinStyles } from '../shared/styles';

const COLLAPSE_SHELL = joinStyles(
  'width:min(100%,32rem)',
  'height:520px',
  'display:grid',
  'grid-template-rows:auto 1fr',
  'border:1px solid var(--ds-color-border)',
);
const COLLAPSE_HEADER = joinStyles(
  'display:flex',
  'align-items:center',
  'justify-content:space-between',
  'padding:var(--ds-space-3)',
  'border-bottom:1px solid var(--ds-color-border)',
);

const meta: Meta = {
  title: 'Organisms/Sidenav',
  component: 'ds-sidenav',
  parameters: { layout: 'padded' },
};

export default meta;
type Story = StoryObj;

function toggleDemoSidenav(event: Event): void {
  const button = event.currentTarget as HTMLElement;
  const demo = button.closest<HTMLElement>('[data-collapse-demo]');
  const sidenav = demo?.querySelector('ds-sidenav');
  const icon = button.querySelector('ds-icon');
  const collapsed = sidenav?.toggleAttribute('collapsed') ?? false;
  button.setAttribute('label', collapsed ? 'Expand navigation' : 'Collapse navigation');
  icon?.setAttribute('name', collapsed ? 'chevron-right' : 'chevron-left');
}

export const Basic: Story = {
  render: () => html`
    <div style="height:480px;display:flex">
      <ds-sidenav>
        <strong slot="header">Brand</strong>
        <ds-nav-item href="/" current>
          <ds-icon slot="icon" name="home" size="lg"></ds-icon>
          Overview
        </ds-nav-item>
        <ds-nav-item href="/activity">
          <ds-icon slot="icon" name="clock" size="lg"></ds-icon>
          Activity
        </ds-nav-item>
        <ds-nav-item href="/settings">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          Settings
        </ds-nav-item>
        <ds-nav-item slot="footer" href="/help">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
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
          <ds-icon slot="icon" name="home" size="lg"></ds-icon>
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
          <ds-icon slot="icon" name="home" size="lg"></ds-icon>
          Overview
        </ds-nav-item>
        <ds-nav-item href="/activity">
          <ds-icon slot="icon" name="clock" size="lg"></ds-icon>
          Activity
        </ds-nav-item>
        <ds-nav-item href="/settings">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          Settings
        </ds-nav-item>
      </ds-sidenav>
    </div>
  `,
};

export const CollapseToggle: Story = {
  render: () => html`
    <div data-collapse-demo style=${COLLAPSE_SHELL}>
      <header style=${COLLAPSE_HEADER}>
        <strong>Brand</strong>
        <ds-button size="sm" variant="ghost" square label="Collapse navigation" @ds-click=${toggleDemoSidenav}>
          <ds-icon slot="leading" name="chevron-left" size="lg"></ds-icon>
        </ds-button>
      </header>
      <div style="display:flex;min-height:0;background:var(--ds-color-bg-subtle)">
        <ds-sidenav id="toggle-sidenav">
          <ds-nav-item href="/" current>
            <ds-icon slot="icon" name="home" size="lg"></ds-icon>
            Overview
          </ds-nav-item>
          <ds-nav-item href="/activity">
            <ds-icon slot="icon" name="clock" size="lg"></ds-icon>
            Activity
          </ds-nav-item>
          <ds-nav-item href="/settings">
            <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
            Settings
          </ds-nav-item>
        </ds-sidenav>
      </div>
    </div>
  `,
};
