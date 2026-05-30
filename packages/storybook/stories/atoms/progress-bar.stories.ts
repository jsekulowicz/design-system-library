import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/progress-bar/define';

const meta: Meta = {
  title: 'Atoms/Progress Bar',
  component: 'ds-progress-bar',
  argTypes: {
    value: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
  },
  args: { value: 45, max: 100 },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<div style="max-width:24rem">
  <ds-progress-bar value=${args['value']} max=${args['max']}>
    ${args['value']} / ${args['max']}
  </ds-progress-bar>
</div>
  `,
};

export const WithoutLabel: Story = {
  render: () => html`
<div style="max-width:24rem">
  <ds-progress-bar value="60"></ds-progress-bar>
</div>
  `,
};

export const CustomHeightAndColor: Story = {
  render: () => html`
<style>
  .branded::part(track) { height: 2.25rem; }
  .branded::part(indicator) { background: var(--ds-color-accent); }
</style>
<div style="max-width:24rem">
  <ds-progress-bar class="branded" value="350" max="500">350 / 500</ds-progress-bar>
</div>
  `,
};
