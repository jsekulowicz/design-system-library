import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/text-field/define';
import '@ds/components/field/define';

const meta: Meta = {
  title: 'Atoms/TextField',
  component: 'ds-text-field',
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'search', 'tel', 'url', 'number'],
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    type: 'text',
    size: 'md',
    placeholder: 'Your name',
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-text-field
      type=${args.type}
      size=${args.size}
      placeholder=${args.placeholder}
      ?disabled=${args.disabled}
      ?required=${args.required}
    ></ds-text-field>
  `,
};

export const InsideField: Story = {
  render: () => html`
    <ds-field
      label="Email address"
      help="We'll use this for receipts and audit logs only."
    >
      <ds-text-field
        type="email"
        name="email"
        placeholder="you@studio.co"
        required
      ></ds-text-field>
    </ds-field>
  `,
};

export const Invalid: Story = {
  render: () => html`
    <ds-field label="Email" error="Must be a valid email address">
      <ds-text-field
        type="email"
        name="email"
        required
        value="not-an-email"
      ></ds-text-field>
    </ds-field>
  `,
};
