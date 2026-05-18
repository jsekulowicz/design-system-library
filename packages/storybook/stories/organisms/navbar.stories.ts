import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/navbar/define';
import '@jsekulowicz/ds-components/nav-item/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/home';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';
import '@jsekulowicz/ds-components/icon/clock';

const meta: Meta = {
  title: 'Organisms/Navbar',
  component: 'ds-navbar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      // Navbar styles itself against a full-width viewport; keep iframe
      // rendering so the example has an isolated box of the declared height.
      story: { inline: false, height: '128px' },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <ds-navbar>
      <strong slot="brand">Brand</strong>
      <ds-button slot="actions" variant="secondary" size="sm">Sign in</ds-button>
    </ds-navbar>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <ds-navbar>
      <strong slot="brand">Brand</strong>
      <ds-nav-item href="/" current>
        <ds-icon slot="icon" name="home" size="lg"></ds-icon>
        Home
      </ds-nav-item>
      <ds-nav-item href="/activity">
        <ds-icon slot="icon" name="clock" size="lg"></ds-icon>
        Activity
      </ds-nav-item>
      <ds-nav-item href="/settings">
        <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
        Settings
      </ds-nav-item>
      <ds-button slot="actions" variant="primary" size="lg">New project</ds-button>
    </ds-navbar>
  `,
};

export const Responsive: Story = {
  render: () => html`
    <div style="max-width:560px;border:1px dashed var(--ds-color-border-subtle)">
      <ds-navbar>
        <strong slot="brand">Brand</strong>
        <ds-nav-item href="/" current>Overview</ds-nav-item>
        <ds-nav-item href="/projects">Projects</ds-nav-item>
        <ds-nav-item href="/billing">Billing</ds-nav-item>
        <ds-nav-item href="/team">Team</ds-nav-item>
        <ds-button slot="actions" variant="secondary" size="md">Sign in</ds-button>
      </ds-navbar>
      <div style="padding:var(--ds-space-4);color:var(--ds-color-fg-muted)">
        Below the tablet container breakpoint the links collapse to a hamburger toggle.
      </div>
    </div>
  `,
};

export const WithCurrentPage: Story = {
  render: () => html`
    <ds-navbar>
      <strong slot="brand">Brand</strong>
      <ds-nav-item href="/">Overview</ds-nav-item>
      <ds-nav-item href="/projects" current>Projects</ds-nav-item>
      <ds-nav-item href="/billing">Billing</ds-nav-item>
    </ds-navbar>
  `,
};
