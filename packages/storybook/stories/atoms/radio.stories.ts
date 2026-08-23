import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { joinStyles } from '../shared/styles';
import '@jsekulowicz/ds-components/radio/define';
import '@jsekulowicz/ds-components/link/define';
import '@jsekulowicz/ds-components/card/define';

const meta: Meta = {
  title: 'Atoms/Radio',
  component: 'ds-radio',
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

const FIELDSET_BOX = joinStyles(
  'border:1px solid var(--ds-color-border)',
  'border-radius:var(--ds-radius-xs)',
  'padding:var(--ds-space-4)',
  'display:grid;gap:var(--ds-space-2)',
  'margin:0',
);

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-radio
      name=${args['name']}
      radiovalue=${args['radioValue']}
      ?checked=${args['checked']}
      ?disabled=${args['disabled']}
      >Option label</ds-radio
    >
  `,
};

export const Group: Story = {
  render: () => html`
    <fieldset style=${FIELDSET_BOX}>
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

export const WrappingLabel: Story = {
  render: () => html`
    <ds-card style="max-inline-size: 22rem">
      <h3 slot="title">Pick a plan</h3>
      <div style="display:grid;gap:var(--ds-space-5)">
        <ds-radio name="wrapping" radiovalue="linked">
          Ship it under the
          <ds-link href="/terms" target="_blank">Terms and Conditions</ds-link>
          agreed at sign-up, renewed every year
        </ds-radio>
        <ds-radio name="wrapping" radiovalue="long">
          A label with no links in it at all, long enough that it runs onto three or four lines, so the dot has
          somewhere to drift to if it ever stops holding the first line
        </ds-radio>
        <ds-radio name="wrapping" radiovalue="short">Short label, one line</ds-radio>
      </div>
    </ds-card>
  `,
};
