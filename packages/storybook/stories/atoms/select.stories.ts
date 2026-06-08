import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/select/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/paint-brush';
import '@jsekulowicz/ds-components/icon/wrench';
import '@jsekulowicz/ds-components/icon/cube';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';

const options = [
  { label: 'Design', value: 'design', icon: { name: 'paint-brush', color: '#db2777' } },
  { label: 'Engineering', value: 'engineering', icon: { name: 'wrench', color: '#2563eb' } },
  { label: 'Product', value: 'product', icon: { name: 'cube', color: '#7c3aed' } },
  { label: 'Operations', value: 'ops', disabled: true, icon: { name: 'cog-6-tooth', color: '#0891b2' } },
];

const countryOptions = [
  { label: 'Argentina', value: 'ar' },
  { label: 'Australia', value: 'au' },
  { label: 'Belgium', value: 'be' },
  { label: 'Bosnia and Herzegovina', value: 'ba' },
  { label: 'Brazil', value: 'br' },
  { label: 'Canada', value: 'ca' },
  { label: 'France', value: 'fr' },
  { label: 'Germany', value: 'de' },
  { label: 'Japan', value: 'jp' },
  { label: 'Netherlands', value: 'nl' },
  { label: 'Poland', value: 'pl' },
  { label: 'United Kingdom', value: 'gb' },
  { label: 'United States', value: 'us' },
];

// Displayed verbatim in the "Show code" panel so examples show how options —
// including per-option icons — are defined alongside the component markup.
const OPTIONS_SRC = `import '@jsekulowicz/ds-components/select/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/paint-brush';
import '@jsekulowicz/ds-components/icon/wrench';
import '@jsekulowicz/ds-components/icon/cube';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';

const options = [
  { label: 'Design', value: 'design', icon: { name: 'paint-brush', color: '#db2777' } },
  { label: 'Engineering', value: 'engineering', icon: { name: 'wrench', color: '#2563eb' } },
  { label: 'Product', value: 'product', icon: { name: 'cube', color: '#7c3aed' } },
  { label: 'Operations', value: 'ops', disabled: true, icon: { name: 'cog-6-tooth', color: '#0891b2' } },
];`;

const COUNTRY_OPTIONS_SRC = `const options = [
  { label: 'Argentina', value: 'ar' },
  { label: 'Australia', value: 'au' },
  // …more countries
  { label: 'United States', value: 'us' },
];`;

function src(optionsSrc: string, markup: string): string {
  return `${optionsSrc}\n\nhtml\`\n${markup}\n\`;`;
}

const meta: Meta = {
  title: 'Atoms/Select',
  component: 'ds-select',
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
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
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
    size: 'md',
    invalid: false,
    disabled: false,
    required: false,
    clearable: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select label="Discipline" placeholder="Pick a discipline" .options=\${options}></ds-select>`,
        ),
      },
    },
  },
  render: (args) => html`
  <ds-select
    label=${args['label']}
    placeholder=${args['placeholder']}
    description=${args['description'] || ''}
    error=${args['error'] || ''}
    size=${args['size']}
    ?invalid=${args['invalid']}
    ?disabled=${args['disabled']}
    ?required=${args['required']}
    ?clearable=${args['clearable']}
    .options=${options}
  ></ds-select>
`,
};

export const Preselected: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select label="Discipline" .options=\${options} .value=\${'engineering'}></ds-select>`,
        ),
      },
    },
  },
  render: () => html`
  <ds-select
    label="Discipline"
    .options=${options}
    .value=${'engineering'}
  ></ds-select>
`,
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="Choose the team you primarily work with."
    .options=\${options}
  ></ds-select>`,
        ),
      },
    },
  },
  render: () => html`
  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="Choose the team you primarily work with."
    .options=${options}
  ></ds-select>
`,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      story: { height: '120px' },
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select size="sm" label="" placeholder="Small" .options=\${options}></ds-select>
  <ds-select size="md" label="" placeholder="Medium" .options=\${options}></ds-select>
  <ds-select size="lg" label="" placeholder="Large" .options=\${options}></ds-select>`,
        ),
      },
    },
  },
  render: () => html`
  <div style="display:flex;gap:var(--ds-space-3);align-items:flex-start">
    <ds-select size="sm" label="" placeholder="Small" .options=${options}></ds-select>
    <ds-select size="md" label="" placeholder="Medium" .options=${options}></ds-select>
    <ds-select size="lg" label="" placeholder="Large" .options=${options}></ds-select>
  </div>
`,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="Choose the team you primarily work with."
    error="Please select a discipline."
    invalid
    required
    .options=\${options}
  ></ds-select>`,
        ),
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="This field cannot be changed right now."
    disabled
    .options=\${options}
  ></ds-select>`,
        ),
      },
    },
  },
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
  parameters: {
    docs: {
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="This field is required."
    required
    .options=\${options}
  ></ds-select>`,
        ),
      },
    },
  },
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

export const Countries: Story = {
  parameters: {
    docs: {
      story: { height: '320px' },
      source: {
        code: src(
          COUNTRY_OPTIONS_SRC,
          `  <ds-select
    label="Country"
    placeholder="Pick a country"
    description="Choose the country associated with this workspace."
    .options=\${options}
  ></ds-select>`,
        ),
      },
    },
  },
  render: () => html`
  <ds-select
    label="Country"
    placeholder="Pick a country"
    description="Choose the country associated with this workspace."
    .options=${countryOptions}
  ></ds-select>
`,
};

export const Multiple: Story = {
  name: 'Multiple selection',
  parameters: {
    docs: {
      story: { height: '320px' },
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select label="Disciplines" placeholder="Pick disciplines" multiple .options=\${options}></ds-select>`,
        ),
      },
    },
  },
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
  parameters: {
    docs: {
      story: { height: '320px' },
      source: {
        code: src(
          OPTIONS_SRC,
          `  <ds-select
    label="Disciplines"
    placeholder="Pick disciplines"
    multiple
    .maxLines=\${1}
    .options=\${options}
    .values=\${['design', 'engineering', 'product']}
  ></ds-select>`,
        ),
      },
    },
  },
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
