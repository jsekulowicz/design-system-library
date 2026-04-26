import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/breadcrumb/define';
import '@ds/components/icon/define';
import '@ds/components/icon/home';

const meta: Meta = {
  title: 'Atoms/Breadcrumb',
  component: 'ds-breadcrumb',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
<ds-breadcrumb>
  <ds-breadcrumb-item href="/">Home</ds-breadcrumb-item>
  <ds-breadcrumb-item href="/products">Products</ds-breadcrumb-item>
  <ds-breadcrumb-item>Widget</ds-breadcrumb-item>
</ds-breadcrumb>
  `,
};

export const WithHomeIcon: Story = {
  render: () => html`
<ds-breadcrumb>
  <ds-breadcrumb-item href="/">
    <ds-icon slot="leading" name="home" size="sm"></ds-icon>
    Home
  </ds-breadcrumb-item>
  <ds-breadcrumb-item href="/products">Products</ds-breadcrumb-item>
  <ds-breadcrumb-item href="/products/audio">Audio</ds-breadcrumb-item>
  <ds-breadcrumb-item>Headphones</ds-breadcrumb-item>
</ds-breadcrumb>
  `,
};

export const DeepTrail: Story = {
  render: () => html`
<ds-breadcrumb>
  <ds-breadcrumb-item href="/">Home</ds-breadcrumb-item>
  <ds-breadcrumb-item href="/org">Acme</ds-breadcrumb-item>
  <ds-breadcrumb-item href="/org/teams">Teams</ds-breadcrumb-item>
  <ds-breadcrumb-item href="/org/teams/platform">Platform</ds-breadcrumb-item>
  <ds-breadcrumb-item href="/org/teams/platform/projects">Projects</ds-breadcrumb-item>
  <ds-breadcrumb-item>Q2 Roadmap</ds-breadcrumb-item>
</ds-breadcrumb>
  `,
};

export const SingleCurrent: Story = {
  render: () => html`
<ds-breadcrumb>
  <ds-breadcrumb-item>Dashboard</ds-breadcrumb-item>
</ds-breadcrumb>
  `,
};

export const OpensInNewTab: Story = {
  render: () => html`
<ds-breadcrumb>
  <ds-breadcrumb-item href="https://example.com" target="_blank" rel="noopener">
    External docs
  </ds-breadcrumb-item>
  <ds-breadcrumb-item href="/guide">Guide</ds-breadcrumb-item>
  <ds-breadcrumb-item>Getting started</ds-breadcrumb-item>
</ds-breadcrumb>
  `,
};
