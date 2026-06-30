import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/text-area/define';

const meta: Meta = {
  title: 'Atoms/TextArea',
  component: 'ds-text-area',
  argTypes: {
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    resize: { control: { type: 'inline-radio' }, options: ['none', 'vertical'] },
    rows: { control: { type: 'number', min: 1, max: 20 } },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    placeholder: { control: 'text' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
  },
  args: {
    size: 'md',
    resize: 'none',
    rows: 3,
    label: 'Bio',
    description: '',
    error: 'This field is required.',
    placeholder: 'Tell us about yourself',
    disabled: false,
    required: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-text-area
  size=${args['size']}
  resize=${args['resize']}
  rows=${args['rows']}
  label=${args['label']}
  description=${args['description'] || ''}
  error=${args['error'] || ''}
  placeholder=${args['placeholder']}
  ?disabled=${args['disabled']}
  ?required=${args['required']}
></ds-text-area>
  `,
};

export const WithDescription: Story = {
  render: () => html`
<ds-text-area
  label="Release notes"
  description="Markdown is supported. Keep it under a few short paragraphs."
  placeholder="What changed?"
></ds-text-area>
  `,
};

export const Rows: Story = {
  name: 'Rows sets the height',
  parameters: {
    docs: {
      description: {
        story:
          '`rows` sizes the field to exactly that many text rows. Set it to match the expected input length — a one-line note vs. a long description.',
      },
    },
  },
  render: () => html`
  <div style="display:flex;flex-direction:column;gap:var(--ds-space-4)">
    <ds-text-area label="Compact (rows=2)" rows="2" placeholder="A short note"></ds-text-area>
    <ds-text-area label="Roomy (rows=6)" rows="6" placeholder="A longer description"></ds-text-area>
  </div>
  `,
};

export const Resizable: Story = {
  name: 'User-resizable',
  parameters: {
    docs: {
      description: {
        story:
          'By default the field is not draggable (`resize="none"`). Set `resize="vertical"` to let people drag it taller.',
      },
    },
  },
  render: () => html`
<ds-text-area
  label="Feedback"
  resize="vertical"
  placeholder="Drag the bottom edge to grow this field"
></ds-text-area>
  `,
};

export const Required: Story = {
  render: () => html`
<ds-text-area
  label="Reason for the report"
  error="Please describe the issue."
  placeholder="What's wrong?"
  required
></ds-text-area>
  `,
};

export const Disabled: Story = {
  render: () => html`
<ds-text-area
  label="Bio"
  description="This field cannot be edited right now."
  value="Crossword enthusiast and part-time setter."
  disabled
></ds-text-area>
  `,
};
