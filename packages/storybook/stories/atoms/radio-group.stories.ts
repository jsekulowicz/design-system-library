import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/radio/define';
import '@ds/components/radio-group/define';

const meta: Meta = {
  title: 'Atoms/RadioGroup',
  component: 'ds-radio-group',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    value: { control: 'text' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    label: 'Billing cadence',
    name: 'cadence',
    description: '',
    error: 'Please select a billing cadence.',
    value: '',
    required: false,
    disabled: false,
    invalid: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-radio-group
      label=${args.label}
      name=${args.name}
      description=${args.description || ''}
      error=${args.error || ''}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?invalid=${args.invalid}
    >
      <ds-radio radiovalue="monthly">Monthly</ds-radio>
      <ds-radio radiovalue="quarterly">Quarterly</ds-radio>
      <ds-radio radiovalue="yearly">Yearly (save 20%)</ds-radio>
    </ds-radio-group>
  `,
};

export const WithDescription: Story = {
  render: () => html`
    <ds-radio-group
      label="Billing cadence"
      name="cadence-desc"
      description="You can change this any time from your account settings."
    >
      <ds-radio radiovalue="monthly">Monthly</ds-radio>
      <ds-radio radiovalue="quarterly">Quarterly</ds-radio>
      <ds-radio radiovalue="yearly">Yearly (save 20%)</ds-radio>
    </ds-radio-group>
  `,
};

export const Required: Story = {
  render: () => html`
    <ds-radio-group
      label="Billing cadence"
      name="cadence-req"
      error="Please select a billing cadence."
      ?required=${true}
      ?invalid=${true}
    >
      <ds-radio radiovalue="monthly">Monthly</ds-radio>
      <ds-radio radiovalue="quarterly">Quarterly</ds-radio>
      <ds-radio radiovalue="yearly">Yearly (save 20%)</ds-radio>
    </ds-radio-group>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-radio-group
      label="Billing cadence"
      name="cadence-dis"
      description="This option cannot be changed right now."
      ?disabled=${true}
    >
      <ds-radio radiovalue="monthly" checked>Monthly</ds-radio>
      <ds-radio radiovalue="quarterly">Quarterly</ds-radio>
      <ds-radio radiovalue="yearly">Yearly (save 20%)</ds-radio>
    </ds-radio-group>
  `,
};
