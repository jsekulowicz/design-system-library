import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/checkbox/define';
import '@ds/components/checkbox-group/define';

const meta: Meta = {
  title: 'Atoms/CheckboxGroup',
  component: 'ds-checkbox-group',
  tags: ['autodocs'],
  argTypes: {
    label: { control: 'text' },
    name: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    value: { control: 'object' },
    required: { control: 'boolean' },
    disabled: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    label: 'Notification channels',
    name: 'channels',
    description: '',
    error: 'Please select at least one channel.',
    value: [],
    required: false,
    disabled: false,
    invalid: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-checkbox-group
      label=${args.label}
      name=${args.name}
      description=${args.description || ''}
      error=${args.error || ''}
      ?required=${args.required}
      ?disabled=${args.disabled}
      ?invalid=${args.invalid}
    >
      <ds-checkbox checkboxvalue="email">Email</ds-checkbox>
      <ds-checkbox checkboxvalue="sms">SMS</ds-checkbox>
      <ds-checkbox checkboxvalue="push">Push notifications</ds-checkbox>
    </ds-checkbox-group>
  `,
};

export const WithDescription: Story = {
  render: () => html`
    <ds-checkbox-group
      label="Notification channels"
      name="channels-desc"
      description="You can update these preferences in your account settings."
    >
      <ds-checkbox checkboxvalue="email" checked>Email</ds-checkbox>
      <ds-checkbox checkboxvalue="sms">SMS</ds-checkbox>
      <ds-checkbox checkboxvalue="push">Push notifications</ds-checkbox>
    </ds-checkbox-group>
  `,
};

export const Required: Story = {
  render: () => html`
    <ds-checkbox-group
      label="Notification channels"
      name="channels-req"
      error="Please select at least one channel."
      ?required=${true}
      ?invalid=${true}
    >
      <ds-checkbox checkboxvalue="email">Email</ds-checkbox>
      <ds-checkbox checkboxvalue="sms">SMS</ds-checkbox>
      <ds-checkbox checkboxvalue="push">Push notifications</ds-checkbox>
    </ds-checkbox-group>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-checkbox-group
      label="Notification channels"
      name="channels-dis"
      description="These settings are managed by your organization."
      ?disabled=${true}
    >
      <ds-checkbox checkboxvalue="email" checked>Email</ds-checkbox>
      <ds-checkbox checkboxvalue="sms">SMS</ds-checkbox>
      <ds-checkbox checkboxvalue="push">Push notifications</ds-checkbox>
    </ds-checkbox-group>
  `,
};
