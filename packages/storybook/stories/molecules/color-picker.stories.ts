import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/color-picker/define';
import '@ds/components/button/define';
import '@ds/components/form/define';

const brandColors = [
  { label: 'Ocean', value: '#0EA5E9' },
  { label: 'Leaf', value: '#22C55E' },
  { label: 'Violet', value: '#7C3AED' },
  { label: 'Rose', value: '#E11D48' },
  { label: 'Amber', value: '#F59E0B' },
  { label: 'Slate', value: '#334155' },
];

const neutralColors = [
  { label: 'Ink', value: '#111827' },
  { label: 'Graphite', value: '#374151' },
  { label: 'Stone', value: '#78716C' },
  { label: 'Mist', value: '#CBD5E1' },
  { label: 'Disabled', value: '#F3F4F6', disabled: true },
];

const meta: Meta = {
  title: 'Molecules/ColorPicker',
  component: 'ds-color-picker',
  tags: ['!dev'],
  decorators: [(story) => html`<div style="max-width: 420px; padding: 4px 6px 280px;">${story()}</div>`],
  parameters: {
    docs: {
      story: { height: '420px' },
    },
  },
  argTypes: {
    label: { control: 'text' },
    placeholder: { control: 'text' },
    description: { control: 'text' },
    error: { control: 'text' },
    invalid: { control: 'boolean' },
    disabled: { control: 'boolean' },
    required: { control: 'boolean' },
    clearable: { control: 'boolean' },
    colors: { control: false },
  },
  args: {
    label: 'Accent color',
    placeholder: 'Select a color',
    description: '',
    error: 'Select a valid color.',
    invalid: false,
    disabled: false,
    required: false,
    clearable: true,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-color-picker
      label=${args['label']}
      placeholder=${args['placeholder']}
      description=${args['description'] || ''}
      error=${args['error'] || ''}
      ?invalid=${args['invalid']}
      ?disabled=${args['disabled']}
      ?required=${args['required']}
      ?clearable=${args['clearable']}
      .colors=${brandColors}
    ></ds-color-picker>
  `,
};

export const PresetPalette: Story = {
  name: 'Preset palette',
  render: () => html`
    <ds-color-picker
      label="Neutral color"
      description="Disabled swatches remain visible but cannot be selected."
      value="#374151"
      .colors=${neutralColors}
    ></ds-color-picker>
  `,
};

export const CustomOnly: Story = {
  name: 'Custom only',
  render: () => html`
    <ds-color-picker
      label="Custom color"
      description="Use when presets are not needed."
      value="#22C55E"
    ></ds-color-picker>
  `,
};

export const RequiredInvalid: Story = {
  name: 'Required / invalid',
  render: () => html`
    <ds-color-picker
      label="Brand color"
      placeholder="Choose a brand color"
      error="A brand color is required."
      required
      invalid
      .colors=${brandColors}
    ></ds-color-picker>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-color-picker
      label="Accent color"
      description="This color is managed by the workspace theme."
      value="#7C3AED"
      disabled
      .colors=${brandColors}
    ></ds-color-picker>
  `,
};

export const NarrowMobile: Story = {
  name: 'Narrow mobile',
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => html`
    <div style="width: 320px; max-width: 100%;">
      <ds-color-picker
        label="Mobile color"
        description="The popover and custom controls stack at narrow widths."
        clearable
        .colors=${brandColors}
      ></ds-color-picker>
    </div>
  `,
};

export const FormUsage: Story = {
  name: 'Form usage',
  render: () => html`
    <ds-form title="Theme">
      <ds-color-picker
        label="Accent color"
        name="accent"
        required
        .colors=${brandColors}
      ></ds-color-picker>
      <ds-button slot="actions" type="submit">Save</ds-button>
    </ds-form>
  `,
};
