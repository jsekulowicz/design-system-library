import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/radio/define';

const meta: Meta = {
  title: 'Atoms/Radio',
  component: 'ds-radio',
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

export const Group: Story = {
  render: () => html`
    <fieldset
      style="border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-sm);padding:var(--ds-space-4);display:grid;gap:var(--ds-space-2);margin:0"
    >
      <legend style="padding:0 var(--ds-space-2)">Billing cadence</legend>
      <ds-radio name="cadence" radiovalue="monthly" checked>Monthly</ds-radio>
      <ds-radio name="cadence" radiovalue="quarterly">Quarterly</ds-radio>
      <ds-radio name="cadence" radiovalue="yearly">Yearly (save 20%)</ds-radio>
    </fieldset>
  `,
};
