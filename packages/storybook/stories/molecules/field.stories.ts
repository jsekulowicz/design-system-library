import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/field/define';
import '@ds/components/text-field/define';
import '@ds/components/select/define';
import '@ds/components/checkbox/define';

const meta: Meta = {
  title: 'Molecules/Field',
  component: 'ds-field',
  tags: ['!dev'],
  args: {
    label: 'Display name',
    help: 'This appears on receipts and shared links.',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-field label=${args['label']} help=${args['help']}>
  <ds-text-field placeholder="Brand"></ds-text-field>
</ds-field>
`,
};

export const WithError: Story = {
  render: () => html`
<ds-field label="Display name" error="Must be between 2 and 40 characters">
  <ds-text-field value="A" required></ds-text-field>
</ds-field>
`,
};

export const Optional: Story = {
  render: () => html`
<ds-field label="Pronouns" optional help="Visible only to your team.">
  <ds-text-field placeholder="e.g. they / them"></ds-text-field>
</ds-field>
`,
};

export const WithSelect: Story = {
  render: () => html`
<ds-field label="Timezone" help="Used for scheduling and digest emails.">
  <ds-select .options=${[
    { label: 'UTC', value: 'utc' },
    { label: 'Europe / Warsaw', value: 'waw' },
    { label: 'America / New York', value: 'nyc' },
  ]}></ds-select>
</ds-field>
`,
};
