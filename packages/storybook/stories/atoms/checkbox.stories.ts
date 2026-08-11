import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/checkbox/define';

const meta: Meta = {
  title: 'Atoms/Checkbox',
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
