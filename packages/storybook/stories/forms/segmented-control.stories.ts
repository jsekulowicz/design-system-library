import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/segmented-control/define';
import '@jsekulowicz/ds-components/icon/speaker-x-mark';
import '@jsekulowicz/ds-components/icon/speaker-wave';
import '@jsekulowicz/ds-components/icon/sparkles';

const meta: Meta = {
  title: 'Forms/SegmentedControl',
  component: 'ds-segmented-control',
  argTypes: {
    label: { control: 'text' },
    description: { control: 'text' },
    value: { control: 'text' },
    disabled: { control: 'boolean' },
    small: { control: 'boolean' },
    messageSpace: { control: 'boolean' },
  },
  args: {
    label: 'Audio guidance',
    description: 'Choose how much spoken guidance is provided.',
    value: 'brief',
    disabled: false,
    small: false,
    messageSpace: false,
  },
};

export default meta;
type Story = StoryObj;

const OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'brief', label: 'Brief' },
  { value: 'full', label: 'Full' },
];

const ICON_OPTIONS = [
  { value: 'off', label: 'Off', icon: 'speaker-x-mark' },
  { value: 'brief', label: 'Brief', icon: 'speaker-wave' },
  { value: 'full', label: 'Full', icon: 'sparkles' },
];

export const Playground: Story = {
  render: (args) => html`
    <ds-segmented-control
      label=${args['label']}
      description=${args['description']}
      .value=${args['value']}
      .options=${OPTIONS}
      ?disabled=${args['disabled']}
      ?small=${args['small']}
      ?message-space=${args['messageSpace']}
    ></ds-segmented-control>
  `,
};

export const WithIcons: Story = {
  render: () => html`
    <ds-segmented-control label="Audio guidance" value="full" .options=${ICON_OPTIONS}></ds-segmented-control>
  `,
};

export const Disabled: Story = {
  render: () => html`
    <ds-segmented-control label="Audio guidance" value="brief" .options=${ICON_OPTIONS} disabled></ds-segmented-control>
  `,
};
