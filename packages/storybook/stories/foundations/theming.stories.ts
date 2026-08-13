import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TableColumn } from '@jsekulowicz/ds-components/table';
import { GROUP_LABEL, joinStyles } from '../shared/styles';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/card/define';
import '@jsekulowicz/ds-components/text-field/define';
import '@jsekulowicz/ds-components/badge/define';
import '@jsekulowicz/ds-components/table/define';

const meta: Meta = {
  title: 'Foundations/Theming',
  parameters: { docs: { story: { inline: true } } },
  argTypes: {
    accent: { control: { type: 'color' } },
    accentHover: { control: { type: 'color' } },
    radius: { control: { type: 'range', min: 0, max: 24, step: 1 } },
    hairline: { control: { type: 'color' } },
    displayFont: { control: { type: 'text' } },
  },
  args: {
    accent: '#4A72CC',
    accentHover: '#3860B8',
    radius: 4,
    hairline: 'rgba(11, 11, 12, 0.12)',
    displayFont: "'Source Serif 4', Georgia, ui-serif, serif",
  },
};

const PANEL_LABEL = joinStyles('margin:0 0 var(--ds-space-3)', GROUP_LABEL.replace('margin:0;', ''));
const PRESETS_LAYOUT = joinStyles(
  'display:grid;gap:var(--ds-space-6)',
  'font-family:var(--ds-font-body)',
  'font-size:var(--ds-font-size-body-lg)',
  'color:var(--ds-color-fg)',
);

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

function componentShowcase(vars: string): ReturnType<typeof html> {
  return html` <div style="${vars};display:grid;gap:var(--ds-space-4);max-width:480px">
    <ds-card elevation="sm">
      <ds-badge slot="eyebrow" tone="accent">Themed</ds-badge>
      <span slot="title">Override the semantic layer</span>
      <p>
        Every <code>ds-*</code> component reads from the same semantic CSS custom properties. Change the tokens, every
        component updates.
      </p>
      <div slot="actions">
        <ds-button variant="primary">Primary</ds-button>
        <ds-button variant="ghost">Ghost</ds-button>
      </div>
    </ds-card>
    <ds-text-field placeholder="Type to test focus ring"></ds-text-field>
  </div>`;
}

export const LivePlayground: Story = {
  render: (args) =>
    componentShowcase(`
    --ds-color-accent:${args['accent']};
    --ds-color-accent-hover:${args['accentHover']};
    --ds-radius-xs:${args['radius']}px;
    --ds-color-border:${args['hairline']};
    --ds-font-display:${args['displayFont']}`),
};

export const BrandPresets: Story = {
  render: () =>
    html` <section style=${PRESETS_LAYOUT}>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--ds-space-5)">
        <div>
          <h3 style=${PANEL_LABEL}>Cobalt (default)</h3>
          ${componentShowcase('')}
        </div>
        <div>
          <h3 style=${PANEL_LABEL}>Vermilion</h3>
          ${componentShowcase(`
        --ds-color-accent:#E2341D;
        --ds-color-accent-hover:#C12613;
        --ds-color-accent-active:#9A1B0C;
        --ds-color-accent-subtle:rgba(226,52,29,0.1)`)}
        </div>
        <div>
          <h3 style=${PANEL_LABEL}>Rounded Teal</h3>
          ${componentShowcase(`
        --ds-color-accent:#1F7A7A;
        --ds-color-accent-hover:#166666;
        --ds-color-accent-active:#0D5252;
        --ds-color-accent-subtle:rgba(31,122,122,0.1);
        --ds-radius-xs:12px`)}
        </div>
      </div>
    </section>`,
};
