import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/select/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/squares-2x2';
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

// Displayed verbatim in the "Show code" panel so examples show how options —
// including per-option icons — are defined alongside the component markup.
const OPTIONS_SRC = `import '@jsekulowicz/ds-components/select/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/squares-2x2';
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

function src(markup: string): string {
  return `${OPTIONS_SRC}\n\nhtml\`\n${markup}\n\`;`;
}

// A leading-slot icon that is shown until an option is selected; the selected
// option's own icon then overrides it.
const LEADING = `  <ds-icon slot="leading" name="squares-2x2"></ds-icon>`;

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
          `  <ds-select label="Discipline" placeholder="Pick a discipline" .options=\${options}>
${LEADING}
  </ds-select>`,
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
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

export const Preselected: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          `  <ds-select label="Discipline" .options=\${options} .value=\${'engineering'}>
${LEADING}
  </ds-select>`,
        ),
      },
    },
  },
  render: () => html`
  <ds-select
    label="Discipline"
    .options=${options}
    .value=${'engineering'}
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

export const WithDescription: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          `  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="Choose the team you primarily work with."
    .options=\${options}
  >
${LEADING}
  </ds-select>`,
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
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

export const Sizes: Story = {
  parameters: {
    docs: {
      story: { height: '120px' },
      source: {
        code: src(
          `  \${['sm', 'md', 'lg'].map(
    (size) => html\`
      <ds-select size=\${size} label="" placeholder=\${size} .options=\${options}>
${LEADING}
      </ds-select>
    \`,
  )}`,
        ),
      },
    },
  },
  render: () => html`
  <div style="display:flex;gap:var(--ds-space-3);align-items:flex-start">
    <ds-select size="sm" label="" placeholder="Small" .options=${options}>
      <ds-icon slot="leading" name="squares-2x2"></ds-icon>
    </ds-select>
    <ds-select size="md" label="" placeholder="Medium" .options=${options}>
      <ds-icon slot="leading" name="squares-2x2"></ds-icon>
    </ds-select>
    <ds-select size="lg" label="" placeholder="Large" .options=${options}>
      <ds-icon slot="leading" name="squares-2x2"></ds-icon>
    </ds-select>
  </div>
`,
};

export const Invalid: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          `  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="Choose the team you primarily work with."
    error="Please select a discipline."
    invalid
    required
    .options=\${options}
  >
${LEADING}
  </ds-select>`,
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
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

export const Disabled: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          `  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="This field cannot be changed right now."
    disabled
    .options=\${options}
  >
${LEADING}
  </ds-select>`,
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
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

export const Required: Story = {
  parameters: {
    docs: {
      source: {
        code: src(
          `  <ds-select
    label="Discipline"
    placeholder="Pick a discipline"
    description="This field is required."
    required
    .options=\${options}
  >
${LEADING}
  </ds-select>`,
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
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

export const Multiple: Story = {
  name: 'Multiple selection',
  parameters: {
    docs: {
      story: { height: '320px' },
      source: {
        code: src(
          `  <ds-select label="Disciplines" placeholder="Pick disciplines" multiple .options=\${options}>
${LEADING}
  </ds-select>`,
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
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

export const MultipleWithIcons: Story = {
  name: 'Multiple — icons on tiles',
  parameters: {
    docs: {
      story: { height: '200px' },
      source: {
        code: src(
          `  <ds-select
    label="Disciplines"
    placeholder="Pick disciplines"
    multiple
    .options=\${options}
    .values=\${['design', 'engineering', 'product']}
  >
${LEADING}
  </ds-select>`,
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
    .values=${['design', 'engineering', 'product']}
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

export const MultiplePreselected: Story = {
  name: 'Multiple — preselected + maxLines',
  parameters: {
    docs: {
      story: { height: '320px' },
      source: {
        code: src(
          `  <ds-select
    label="Disciplines"
    placeholder="Pick disciplines"
    multiple
    .maxLines=\${1}
    .options=\${options}
    .values=\${['design', 'engineering', 'product']}
  >
${LEADING}
  </ds-select>`,
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
  >
    <ds-icon slot="leading" name="squares-2x2"></ds-icon>
  </ds-select>
`,
};

// Long, sentence-like labels (e.g. crossword clues) to show option wrapping.
const longOptions = [
  {
    label: 'Líquido transparente, incoloro e inodoro que forma ríos, lagos y mares',
    value: 'agua',
  },
  { label: 'Conjunto de pasos y técnicas para preparar un plato de comida', value: 'receta' },
  { label: 'Persona que se dedica a escribir obras literarias', value: 'autor' },
];

const LONG_OPTIONS_SRC = `import '@jsekulowicz/ds-components/select/define';

const options = [
  {
    label: 'Líquido transparente, incoloro e inodoro que forma ríos, lagos y mares',
    value: 'agua',
  },
  { label: 'Conjunto de pasos y técnicas para preparar un plato de comida', value: 'receta' },
  { label: 'Persona que se dedica a escribir obras literarias', value: 'autor' },
];`;

export const LongOptionsWrap: Story = {
  name: 'Long options wrap',
  parameters: {
    docs: {
      story: { height: '240px' },
      description: {
        story:
          'Dropdown options wrap onto multiple lines instead of truncating with an ellipsis, so long labels (such as full crossword clues) can be read in full. Open the select to see the wrapped options; an option keeps its single-line height as a baseline and grows only when its text wraps, and the closed trigger still truncates the selected value to one line. `ds-searchable-select` shares the same option and wraps identically.',
      },
      source: {
        code: `${LONG_OPTIONS_SRC}\n\nhtml\`\n  <ds-select label="Clue" placeholder="Pick a clue" .options=\${options}></ds-select>\n\`;`,
      },
    },
  },
  render: () => html`
  <ds-select
    label="Clue"
    placeholder="Pick a clue"
    .options=${longOptions}
  ></ds-select>
`,
};
