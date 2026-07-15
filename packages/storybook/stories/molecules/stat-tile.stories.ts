import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/stat-tile/define';
import '@jsekulowicz/ds-components/skeleton/define';

const meta: Meta = {
  title: 'Molecules/StatTile',
  component: 'ds-stat-tile',
  argTypes: {
    value: { control: 'text' },
    label: { control: 'text' },
    hint: { control: 'text' },
    loading: { control: 'boolean' },
  },
  args: {
    value: '1,248',
    label: 'Crosswords played',
    hint: 'Up 12% this month',
    loading: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <div style="max-width: 18rem">
      <ds-stat-tile
        .value=${args['value']}
        .label=${args['label']}
        .hint=${args['hint']}
        .loading=${args['loading']}
      ></ds-stat-tile>
    </div>
  `,
};

export const LoadingHint: Story = {
  render: () => html`
    <div style="max-width: 18rem">
      <ds-stat-tile loading label="Best day">
        <ds-skeleton slot="hint" width="7rem"></ds-skeleton>
      </ds-stat-tile>
    </div>
  `,
};
