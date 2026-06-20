import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/range-input/define';

const meta: Meta = {
  title: 'Atoms/RangeInput',
  component: 'ds-range-input',
  argTypes: {
    min: { control: 'number' },
    max: { control: 'number' },
    step: { control: 'number' },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    label: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    showValue: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    invalid: { control: 'boolean' },
  },
  args: {
    min: 0,
    max: 100,
    step: 1,
    size: 'md',
    label: 'Volume',
    description: '',
    error: 'Pick a value in range.',
    showValue: true,
    disabled: false,
    required: false,
    invalid: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-range-input
  min=${args['min']}
  max=${args['max']}
  step=${args['step']}
  size=${args['size']}
  label=${args['label']}
  description=${args['description'] || ''}
  error=${args['error'] || ''}
  ?show-value=${args['showValue']}
  ?disabled=${args['disabled']}
  ?required=${args['required']}
  ?invalid=${args['invalid']}
></ds-range-input>
  `,
};

export const WithValue: Story = {
  render: () => html`
<ds-range-input
  label="Brightness"
  description="Drag to adjust the screen brightness."
  value="65"
  show-value
></ds-range-input>
  `,
};

export const Steps: Story = {
  render: () => html`
<ds-range-input
  label="Rating"
  description="Snaps to steps of 10."
  min="0"
  max="100"
  step="10"
  value="40"
  show-value
></ds-range-input>
  `,
};

export const Sizes: Story = {
  render: () => html`
<div style="display: flex; flex-direction: column; gap: 1.5rem;">
  <ds-range-input label="Small" size="sm" value="30" show-value></ds-range-input>
  <ds-range-input label="Medium" size="md" value="50" show-value></ds-range-input>
  <ds-range-input label="Large" size="lg" value="70" show-value></ds-range-input>
</div>
  `,
};

export const Disabled: Story = {
  render: () => html`
<ds-range-input
  label="Volume"
  description="This control cannot be edited right now."
  value="40"
  show-value
  disabled
></ds-range-input>
  `,
};

export const Invalid: Story = {
  render: () => html`
<ds-range-input
  label="Threshold"
  error="Must be at least 50."
  value="20"
  show-value
  invalid
></ds-range-input>
  `,
};
