import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/select/define';

const options = [
  { label: 'Design', value: 'design' },
  { label: 'Engineering', value: 'engineering' },
  { label: 'Product', value: 'product' },
  { label: 'Operations', value: 'ops', disabled: true },
];

const meta: Meta = {
  title: 'Atoms/Select',
  component: 'ds-select',
  tags: ['!dev'],
  decorators: [(story) => html`<div style="padding: 4px 6px;">${story()}</div>`],
  parameters: {
    docs: {
      story: { height: '260px' },
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
    options: { control: false },
  },
  args: {
    label: 'Discipline',
    placeholder: 'Pick a discipline',
    description: '',
    error: 'Please select a discipline.',
    invalid: false,
    disabled: false,
    required: false,
    clearable: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-select
  label=${args['label']}
  placeholder=${args['placeholder']}
  description=${args['description'] || ''}
  error=${args['error'] || ''}
  ?invalid=${args['invalid']}
  ?disabled=${args['disabled']}
  ?required=${args['required']}
  ?clearable=${args['clearable']}
  .options=${options}
></ds-select>
`,
};

export const Preselected: Story = {
  render: () => html`
<ds-select
  label="Discipline"
  .options=${options}
  .value=${'engineering'}
></ds-select>
`,
};

export const WithDescription: Story = {
  render: () => html`
<ds-select
  label="Discipline"
  placeholder="Pick a discipline"
  description="Choose the team you primarily work with."
  .options=${options}
></ds-select>
`,
};

export const Invalid: Story = {
  render: () => html`
<ds-select
  label="Discipline"
  placeholder="Pick a discipline"
  description="Choose the team you primarily work with."
  error="Please select a discipline."
  ?invalid=${true}
  ?required=${true}
  .options=${options}
></ds-select>
`,
};

export const Disabled: Story = {
  render: () => html`
<ds-select
  label="Discipline"
  placeholder="Pick a discipline"
  description="This field cannot be changed right now."
  ?disabled=${true}
  .options=${options}
></ds-select>
`,
};

export const Required: Story = {
  render: () => html`
<ds-select
  label="Discipline"
  placeholder="Pick a discipline"
  description="This field is required."
  ?required=${true}
  .options=${options}
></ds-select>
`,
};

export const Multiple: Story = {
  name: 'Multiple selection',
  parameters: { docs: { story: { height: '320px' } } },
  render: () => html`
<ds-select
  label="Disciplines"
  placeholder="Pick disciplines"
  ?multiple=${true}
  .options=${options}
></ds-select>
`,
};

export const MultiplePreselected: Story = {
  name: 'Multiple — preselected + maxLines',
  parameters: { docs: { story: { height: '320px' } } },
  render: () => html`
<ds-select
  label="Disciplines"
  placeholder="Pick disciplines"
  ?multiple=${true}
  .maxLines=${1}
  .options=${options}
  .values=${['design', 'engineering', 'product']}
></ds-select>
`,
};
