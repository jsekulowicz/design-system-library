import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/settings-page/define';
import '@ds/components/field/define';
import '@ds/components/text-field/define';
import '@ds/components/select/define';
import '@ds/components/checkbox/define';
import '@ds/components/button/define';

const meta: Meta = {
  title: 'Pages/SettingsPage',
  component: 'ds-settings-page',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const sections = [
  { id: 'profile', label: 'Profile' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'billing', label: 'Billing' },
];

const timezones = [
  { label: 'UTC', value: 'utc' },
  { label: 'Europe / Warsaw', value: 'waw' },
  { label: 'America / New York', value: 'nyc' },
];

export const Composition: Story = {
  render: () => html`
<ds-settings-page
  eyebrow="Workspace · Brand"
  heading="Settings"
  description="Studio preferences, billing, and the other plumbing."
  .sections=${sections}
>
  <section id="profile" style="display:grid;gap:var(--ds-space-4)">
    <h2 style="margin:0">Profile</h2>
    <ds-field label="Display name">
      <ds-text-field value="Jan"></ds-text-field>
    </ds-field>
    <ds-field label="Timezone">
      <ds-select .options=${timezones} .value=${'waw'}></ds-select>
    </ds-field>
  </section>
  <section id="notifications" style="display:grid;gap:var(--ds-space-4)">
    <h2 style="margin:0">Notifications</h2>
    <ds-checkbox checked>Digest email on Mondays</ds-checkbox>
    <ds-checkbox>Ping me on build failures</ds-checkbox>
  </section>
  <section id="billing" style="display:grid;gap:var(--ds-space-4)">
    <h2 style="margin:0">Billing</h2>
    <p>Studio plan · renews April 30.</p>
    <ds-button variant="secondary">Manage billing</ds-button>
  </section>
</ds-settings-page>
  `,
};
