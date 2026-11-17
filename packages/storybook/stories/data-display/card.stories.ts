import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/card/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/badge/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/paint-brush';
import '@jsekulowicz/ds-components/icon/wrench';
import '@jsekulowicz/ds-components/icon/cube';
import { joinStyles } from '../shared/styles';

const meta: Meta = {
  title: 'Data Display/Card',
  component: 'ds-card',
  argTypes: {
    elevation: { control: { type: 'inline-radio' }, options: ['none', 'sm', 'md'] },
    orientation: { control: { type: 'inline-radio' }, options: ['vertical', 'horizontal'] },
    interactive: { control: 'boolean' },
  },
  args: { elevation: 'sm', orientation: 'vertical', interactive: false },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <div style="max-width:560px">
      <ds-card elevation=${args['elevation']} orientation=${args['orientation']} ?interactive=${args['interactive']}>
        <ds-badge slot="eyebrow" tone="accent">Featured</ds-badge>
        <span slot="title">Project overview</span>
        <p>Review the latest project details and choose what to do next.</p>
        <div slot="actions">
          <ds-button variant="secondary" size="sm">Preview</ds-button>
          <ds-button variant="primary" size="sm">Open</ds-button>
        </div>
      </ds-card>
    </div>
  `,
};

export const Horizontal: Story = {
  render: () => html`
    <div style="max-width:640px">
      <ds-card orientation="horizontal" elevation="md">
        <span slot="title">Release 0.1</span>
        <p>Core components and the first composed layouts shipped.</p>
        <div slot="actions">
          <ds-button variant="ghost" size="sm">Changelog</ds-button>
        </div>
      </ds-card>
    </div>
  `,
};

const TILES = [
  { icon: 'paint-brush', label: 'Design', count: 4, color: 'var(--ds-color-chart-1)' },
  { icon: 'wrench', label: 'Tools', count: 7, color: 'var(--ds-color-chart-2)' },
  { icon: 'cube', label: 'Packages', count: 2, color: 'var(--ds-color-chart-3)' },
];

const TILE_ROW = 'display:flex;gap:var(--ds-space-2)';

function buildTileStyle(color: string): string {
  return joinStyles(
    '--ds-card-padding:var(--ds-space-3)',
    '--ds-card-gap:var(--ds-space-1)',
    `--ds-card-border-color:${color}`,
  );
}

export const CompactTiles: Story = {
  render: () => html`
    <div style=${TILE_ROW}>
      ${TILES.map(
        (tile) => html`
          <ds-card style=${buildTileStyle(tile.color)}>
            <ds-icon name=${tile.icon} size="4xl" label=${tile.label} style="color:${tile.color}"></ds-icon>
            <strong slot="footer">${tile.count}</strong>
          </ds-card>
        `,
      )}
    </div>
  `,
};
