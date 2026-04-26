import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/page-shell/define';
import '@ds/components/sidenav/define';
import '@ds/components/nav-item/define';
import '@ds/components/footer/define';
import '@ds/components/link/define';
import '@ds/components/settings-page/define';
import '@ds/components/form/define';
import '@ds/components/text-field/define';
import '@ds/components/select/define';
import '@ds/components/checkbox/define';
import '@ds/components/button/define';
import '@ds/components/icon/define';
import '@ds/components/icon/home';
import '@ds/components/icon/cog-6-tooth';
import '@ds/components/icon/clock';
import '@ds/components/icon/magnifying-glass';
import '@ds/components/icon/chevron-right';

const meta: Meta = {
  title: 'Pages/SettingsPage',
  component: 'ds-settings-page',
  tags: ['!dev'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const FRAME_HEIGHT = 480;
const STORY_HEIGHT = `${FRAME_HEIGHT + 40}px`;

const timezones = [
  { label: 'UTC', value: 'utc' },
  { label: 'Europe / Warsaw', value: 'waw' },
  { label: 'America / New York', value: 'nyc' },
];

export const Default: Story = {
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () => html`
<div style="height:${FRAME_HEIGHT}px;overflow:clip;border-bottom:1px solid var(--ds-color-border)">
<ds-page-shell brand="Brand" style="min-height:0;height:100%">
  <ds-sidenav slot="aside">
    <ds-nav-item href="#">
      <ds-icon slot="icon" name="home" size="lg"></ds-icon>
      Overview
    </ds-nav-item>
    <ds-nav-item href="#">
      <ds-icon slot="icon" name="clock" size="lg"></ds-icon>
      Activity
    </ds-nav-item>
    <ds-nav-item href="#">
      <ds-icon slot="icon" name="magnifying-glass" size="lg"></ds-icon>
      Search
    </ds-nav-item>
    <ds-nav-group label="Workspace" expanded>
      <ds-nav-item href="#">General</ds-nav-item>
      <ds-nav-item href="#">Members</ds-nav-item>
      <ds-nav-item href="#">Integrations</ds-nav-item>
      <ds-nav-item href="#">Plans</ds-nav-item>
    </ds-nav-group>
    <ds-nav-group label="Account" expanded>
      <ds-nav-item href="#" current>
        <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
        Settings
      </ds-nav-item>
      <ds-nav-item href="#">Profile</ds-nav-item>
      <ds-nav-item href="#">Security</ds-nav-item>
      <ds-nav-item href="#">Notifications</ds-nav-item>
      <ds-nav-item href="#">API Keys</ds-nav-item>
    </ds-nav-group>
    <ds-nav-group label="Help">
      <ds-nav-item href="#">Documentation</ds-nav-item>
      <ds-nav-item href="#">Support</ds-nav-item>
      <ds-nav-item href="#">Changelog</ds-nav-item>
    </ds-nav-group>
  </ds-sidenav>
  <ds-settings-page
    eyebrow="Workspace · Brand"
    heading="Settings"
    description="Studio preferences, billing, and the other plumbing."
  >
    <section id="profile" style="display:grid;gap:var(--ds-space-4)">
      <ds-form header="Profile">
        <ds-text-field label="Display name" value="Jan Sekułowicz"></ds-text-field>
        <ds-text-field label="Email" value="jan@example.com" type="email"></ds-text-field>
        <ds-select label="Timezone" .options=${timezones} .value=${'waw'}></ds-select>
        <ds-text-field label="Bio" value="Design systems engineer."></ds-text-field>
        <ds-button slot="actions" variant="primary" size="sm">Save profile</ds-button>
      </ds-form>
    </section>
    <section id="security" style="display:grid;gap:var(--ds-space-4)">
      <ds-form header="Security">
        <ds-text-field label="Current password" type="password"></ds-text-field>
        <ds-text-field label="New password" type="password"></ds-text-field>
        <ds-text-field label="Confirm new password" type="password"></ds-text-field>
        <ds-button slot="actions" variant="primary" size="sm">Update password</ds-button>
      </ds-form>
    </section>
    <section id="notifications" style="display:grid;gap:var(--ds-space-4)">
      <ds-form header="Notifications">
        <ds-checkbox checked>Digest email on Mondays</ds-checkbox>
        <ds-checkbox>Ping me on build failures</ds-checkbox>
        <ds-checkbox checked>Weekly activity summary</ds-checkbox>
        <ds-button slot="actions" variant="primary" size="sm">Save preferences</ds-button>
      </ds-form>
    </section>
    <section id="billing" style="display:grid;gap:var(--ds-space-4)">
      <ds-form header="Billing">
        <ds-text-field label="Billing email" value="billing@example.com" type="email"></ds-text-field>
        <p style="margin:0;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-sm)">
          Studio plan · renews 30 April 2027.
        </p>
        <div slot="actions" style="display:flex;gap:var(--ds-space-2)">
          <ds-button variant="secondary" size="sm">Manage billing</ds-button>
          <ds-button variant="ghost" size="sm">Cancel plan</ds-button>
        </div>
      </ds-form>
    </section>
  </ds-settings-page>
  <ds-footer slot="footer">
    <span slot="start">© 2026 Brand</span>
    <ds-link slot="end" href="#" variant="quiet">Privacy</ds-link>
  </ds-footer>
</ds-page-shell>
</div>
`,
};
