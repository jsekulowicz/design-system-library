import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/nav-item/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/briefcase';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';
import '@jsekulowicz/ds-components/icon/users';

const meta: Meta = {
  title: 'Atoms/NavGroup',
  component: 'ds-nav-group',
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--ds-space-1);width:240px">
      <ds-nav-group label="Workspace" expanded>
        <ds-nav-item href="/settings">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          General
        </ds-nav-item>
        <ds-nav-item href="/members">
          <ds-icon slot="icon" name="users" size="lg"></ds-icon>
          Members
        </ds-nav-item>
      </ds-nav-group>
    </div>
  `,
};

export const WithIcon: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--ds-space-1);width:240px">
      <ds-nav-group label="Workspace" expanded>
        <ds-icon slot="icon" name="briefcase" size="lg"></ds-icon>
        <ds-nav-item href="/settings">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          General
        </ds-nav-item>
        <ds-nav-item href="/members">
          <ds-icon slot="icon" name="users" size="lg"></ds-icon>
          Members
        </ds-nav-item>
      </ds-nav-group>
    </div>
  `,
};

export const Collapsed: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--ds-space-1);width:240px">
      <ds-nav-group label="Workspace">
        <ds-icon slot="icon" name="briefcase" size="lg"></ds-icon>
        <ds-nav-item href="/settings">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          General
        </ds-nav-item>
      </ds-nav-group>
    </div>
  `,
};

export const Compact: Story = {
  render: () => html`
    <div style="display:flex;flex-direction:column;gap:var(--ds-space-1);width:64px">
      <ds-nav-group label="Workspace" compact expanded>
        <ds-icon slot="icon" name="briefcase" size="lg"></ds-icon>
        <ds-nav-item href="/settings" compact>
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          General
        </ds-nav-item>
      </ds-nav-group>
    </div>
  `,
};
