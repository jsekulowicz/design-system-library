import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/checkbox/define';
import '@jsekulowicz/ds-components/link/define';
import '@jsekulowicz/ds-components/card/define';

const meta: Meta = {
  title: 'Forms/Checkbox',
  component: 'ds-checkbox',
  argTypes: {
    checked: { control: 'boolean' },
    indeterminate: { control: 'boolean' },
    disabled: { control: 'boolean' },
    description: { control: 'text' },
    error: { control: 'text' },
    invalid: { control: 'boolean' },
    messageSpace: { control: 'boolean' },
  },
  args: {
    checked: false,
    indeterminate: false,
    disabled: false,
    description: '',
    error: 'This field is required.',
    invalid: false,
    messageSpace: false,
    label: 'Subscribe to updates',
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-checkbox
      description=${args['description'] || ''}
      error=${args['error'] || ''}
      ?checked=${args['checked']}
      ?indeterminate=${args['indeterminate']}
      ?disabled=${args['disabled']}
      ?invalid=${args['invalid']}
      ?message-space=${args['messageSpace']}
      >${args['label']}</ds-checkbox
    >
  `,
};

export const States: Story = {
  render: () => html`
    <div style="display:grid;gap:var(--ds-space-2)">
      <ds-checkbox>Unchecked</ds-checkbox>
      <ds-checkbox checked>Checked</ds-checkbox>
      <ds-checkbox indeterminate>Indeterminate</ds-checkbox>
      <ds-checkbox disabled>Disabled</ds-checkbox>
      <ds-checkbox checked disabled>Checked + disabled</ds-checkbox>
    </div>
  `,
};

export const WrappingLabel: Story = {
  render: () => html`
    <ds-card style="max-inline-size: 22rem">
      <h3 slot="title">Create your account</h3>
      <div style="display:grid;gap:var(--ds-space-5)">
        <ds-checkbox message-space>
          I agree with the
          <ds-link href="/terms" target="_blank">Terms and Conditions</ds-link>
          and the
          <ds-link href="/privacy" target="_blank">Privacy Policy</ds-link>
        </ds-checkbox>
        <ds-checkbox checked>
          A label with no links in it at all, long enough that it runs onto three or four lines, so the box has
          somewhere to drift to if it ever stops holding the first line
        </ds-checkbox>
        <ds-checkbox message-space invalid error="Please accept to continue">
          I agree with the
          <ds-link href="/terms" target="_blank">Terms and Conditions</ds-link>
        </ds-checkbox>
        <ds-checkbox>Short label, one line</ds-checkbox>
      </div>
    </ds-card>
  `,
};
