import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/radio/define';

const meta: Meta = {
  title: 'Atoms/Radio',
  component: 'ds-radio',
  tags: ['!dev'],
  argTypes: {
    checked: { control: 'boolean' },
    disabled: { control: 'boolean' },
    radioValue: { control: 'text' },
    name: { control: 'text' },
  },
  args: {
    checked: false,
    disabled: false,
    radioValue: 'option',
    name: 'demo',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-radio
  name=${args['name']}
  radiovalue=${args['radioValue']}
  ?checked=${args['checked']}
  ?disabled=${args['disabled']}
>Option label</ds-radio>
  `,
};

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

export const Disabled: Story = {
  render: () => html`
<div style="display:grid;gap:var(--ds-space-2)">
  <ds-radio name="disabled-demo" radiovalue="a" checked disabled>Checked and disabled</ds-radio>
  <ds-radio name="disabled-demo" radiovalue="b" disabled>Unchecked and disabled</ds-radio>
</div>
  `,
};
