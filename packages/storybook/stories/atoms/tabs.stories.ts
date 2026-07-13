import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/tabs/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/home';
import '@jsekulowicz/ds-components/icon/clock';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';

const meta: Meta = {
  title: 'Atoms/Tabs',
  component: 'ds-tabs',
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  argTypes: {
    value: {
      control: 'inline-radio',
      options: ['overview', 'activity', 'settings'],
    },
  },
  args: {
    value: 'overview',
  },
  render: function render(args) {
    return html`
<ds-tabs .value=${args['value']}>
  <ds-tab slot="tab" value="overview">Overview</ds-tab>
  <ds-tab slot="tab" value="activity">Activity</ds-tab>
  <ds-tab slot="tab" value="settings">Settings</ds-tab>
  <ds-tab-panel value="overview">
    <p style="margin: 0;">Summary of the account and recent highlights.</p>
  </ds-tab-panel>
  <ds-tab-panel value="activity">
    <p style="margin: 0;">A timeline of the most recent events.</p>
  </ds-tab-panel>
  <ds-tab-panel value="settings">
    <p style="margin: 0;">Per-account preferences and integrations.</p>
  </ds-tab-panel>
</ds-tabs>
  `;
  },
};

export const TabPlayground: Story = {
  argTypes: {
    value: { control: 'text', table: { type: { summary: 'string' } } },
    selected: {
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
    disabled: {
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  args: {
    value: 'overview',
    selected: true,
    disabled: false,
  },
  render: function render(args) {
    return html`
      <ds-tab .value=${args['value']} ?selected=${args['selected']} ?disabled=${args['disabled']}>
        Overview
      </ds-tab>
    `;
  },
};

export const TabPanelPlayground: Story = {
  argTypes: {
    value: { control: 'text', table: { type: { summary: 'string' } } },
    active: {
      control: 'boolean',
      table: { type: { summary: 'boolean' }, defaultValue: { summary: 'false' } },
    },
  },
  args: {
    value: 'overview',
    active: true,
  },
  render: function render(args) {
    return html`
      <ds-tab-panel .value=${args['value']} ?active=${args['active']}>
        <p style="margin: 0;">Summary of the account and recent highlights.</p>
      </ds-tab-panel>
    `;
  },
};

export const WithIcons: Story = {
  render: () => html`
<ds-tabs value="overview">
  <ds-tab slot="tab" value="overview">
    <ds-icon name="home" style="font-size: 1em"></ds-icon>
    Overview
  </ds-tab>
  <ds-tab slot="tab" value="activity">
    <ds-icon name="clock" style="font-size: 1em"></ds-icon>
    Activity
  </ds-tab>
  <ds-tab slot="tab" value="settings">
    <ds-icon name="cog-6-tooth" style="font-size: 1em"></ds-icon>
    Settings
  </ds-tab>
  <ds-tab-panel value="overview">
    <p style="margin: 0;">Summary of the account and recent highlights.</p>
  </ds-tab-panel>
  <ds-tab-panel value="activity">
    <p style="margin: 0;">A timeline of the most recent events.</p>
  </ds-tab-panel>
  <ds-tab-panel value="settings">
    <p style="margin: 0;">Per-account preferences and integrations.</p>
  </ds-tab-panel>
</ds-tabs>
  `,
};

export const WithDisabledTab: Story = {
  render: () => html`
<ds-tabs value="details">
  <ds-tab slot="tab" value="details">Details</ds-tab>
  <ds-tab slot="tab" value="history">History</ds-tab>
  <ds-tab slot="tab" value="admin" disabled>Admin</ds-tab>
  <ds-tab-panel value="details">
    <p style="margin: 0;">Line items, quantities, and totals.</p>
  </ds-tab-panel>
  <ds-tab-panel value="history">
    <p style="margin: 0;">Previous revisions of this record.</p>
  </ds-tab-panel>
  <ds-tab-panel value="admin">
    <p style="margin: 0;">Restricted to admins.</p>
  </ds-tab-panel>
</ds-tabs>
  `,
};
