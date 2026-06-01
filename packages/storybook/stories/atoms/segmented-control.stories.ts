import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/segmented-control/define';
import '@jsekulowicz/ds-components/icon/speaker-x-mark';
import '@jsekulowicz/ds-components/icon/speaker-wave';
import '@jsekulowicz/ds-components/icon/sparkles';

const meta: Meta = {
  title: 'Atoms/SegmentedControl',
  component: 'ds-segmented-control',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Voice',
    value: 'light',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

const OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'light', label: 'Light' },
  { value: 'natural', label: 'Natural' },
];

const ICON_OPTIONS = [
  { value: 'off', label: 'Off', icon: 'speaker-x-mark' },
  { value: 'light', label: 'Light', icon: 'speaker-wave' },
  { value: 'natural', label: 'Natural', icon: 'sparkles' },
];

export const Playground: Story = {
  render: args => html`
    <ds-segmented-control
      label=${args['label']}
      .value=${args['value']}
      .options=${OPTIONS}
      ?disabled=${args['disabled']}
    ></ds-segmented-control>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <ds-segmented-control
      label="Voice"
      value="natural"
      .options=${ICON_OPTIONS}
    ></ds-segmented-control>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-segmented-control
      label="Voice"
      value="light"
      .options=${ICON_OPTIONS}
      disabled
    ></ds-segmented-control>
  `,
};
