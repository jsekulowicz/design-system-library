import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TableColumn } from '@jsekulowicz/ds-components/table';
import { renderBrandExamples } from './theming-brand-examples';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/card/define';
import '@jsekulowicz/ds-components/text-field/define';
import '@jsekulowicz/ds-components/badge/define';
import '@jsekulowicz/ds-components/table/define';

const meta: Meta = {
  title: 'Foundations/Theming',
  parameters: { docs: { story: { inline: true } } },
};

export default meta;
type Story = StoryObj;

interface OverrideRow {
  [key: string]: unknown;
  group: string;
  tokens: readonly string[];
  effect: string;
}

const overrideRows: readonly OverrideRow[] = [
  {
    group: 'Brand color',
    tokens: ['--ds-color-accent', '--ds-color-accent-hover', '--ds-color-accent-active', '--ds-color-accent-subtle'],
    effect: 'Buttons, links, badges, and focus rings',
  },
  {
    group: 'Radii',
    tokens: ['--ds-radius-xs', '...', '--ds-radius-full'],
    effect: 'radius-xs is the standard-surface default; larger values are deliberate overrides',
  },
  {
    group: 'Borders',
    tokens: ['--ds-color-border', '--ds-color-border-strong'],
    effect: 'Cards, inputs, and dividers',
  },
  { group: 'Display font', tokens: ['--ds-font-display'], effect: 'Headings that use the display typeface' },
  {
    group: 'Surface colors',
    tokens: ['--ds-color-bg', '--ds-color-bg-subtle', '--ds-color-bg-muted'],
    effect: 'Page and card backgrounds',
  },
  {
    group: 'Status colors',
    tokens: ['--ds-color-success', '--ds-color-warning', '--ds-color-danger'],
    effect: 'Alert banners and validation states',
  },
];

function tokenList(tokens: readonly string[]): TemplateResult {
  return html`<span style="display:flex;flex-wrap:wrap;gap:var(--ds-space-1)">
    ${tokens.map((token) => (token === '...' ? token : html`<code>${token}</code>`))}
  </span>`;
}

const overrideColumns: readonly TableColumn<OverrideRow>[] = [
  { name: 'group', field: 'group', label: 'Token group', width: '12rem' },
  { name: 'tokens', field: 'tokens', label: 'Semantic tokens', render: (row) => tokenList(row.tokens) },
  { name: 'effect', field: 'effect', label: 'Effect', width: '18rem' },
];

export const OverridableTokens: Story = {
  render: () => html`<ds-table .rows=${overrideRows} .columns=${overrideColumns}></ds-table>`,
};

export const BrandExamples: Story = {
  render: renderBrandExamples,
};
