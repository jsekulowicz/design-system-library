import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/text-field/define';

const meta: Meta = {
  title: 'Atoms/TextField',
  component: 'ds-text-field',
  tags: ['!dev'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    type: 'text',
    size: 'md',
    label: 'Full name',
    description: '',
    error: 'This field is required.',
    placeholder: 'Your name',
    disabled: false,
    required: false,
    invalid: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-text-field
  type=${args['type']}
  size=${args['size']}
  label=${args['label']}
  description=${args['description'] || ''}
  error=${args['error'] || ''}
  placeholder=${args['placeholder']}
  ?disabled=${args['disabled']}
  ?required=${args['required']}
  ?invalid=${args['invalid']}
></ds-text-field>
  `,
};

export const WithDescription: Story = {
  render: () => html`
<ds-text-field
  label="Email address"
  description="We'll use this for receipts and audit logs only."
  type="email"
  placeholder="you@studio.co"
></ds-text-field>
  `,
};

export const Required: Story = {
  render: () => html`
<ds-text-field
  label="Email address"
  error="Must be a valid email address."
  type="email"
  placeholder="you@studio.co"
  required
  invalid
></ds-text-field>
  `,
};

export const Disabled: Story = {
  render: () => html`
<ds-text-field
  label="Full name"
  description="This field cannot be edited right now."
  placeholder="Your name"
  value="Jane Smith"
  disabled
></ds-text-field>
  `,
};
