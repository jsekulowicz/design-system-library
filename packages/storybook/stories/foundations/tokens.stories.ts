import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TableColumn } from '@jsekulowicz/ds-components/table';
import { border, breakpoint, container, duration, easing, radius, shadow, zIndex } from '@jsekulowicz/ds-tokens';
import '@jsekulowicz/ds-components/table/define';
import { GROUP_LABEL, joinStyles } from '../shared/styles';

const meta: Meta = {
  title: 'Foundations/Tokens',
  parameters: { docs: { story: { inline: true } } },
};

export default meta;
type Story = StoryObj;

interface TokenRow {
  [key: string]: unknown;
  token: string;
  value: string;
  use?: string;
}

function code(value: string): TemplateResult {
  return html`<code>${value}</code>`;
}

const SHAPE_LAYOUT = joinStyles(
  'display:grid;gap:var(--ds-space-8)',
  'font-family:var(--ds-font-body)',
  'font-size:var(--ds-font-size-body-lg)',
  'color:var(--ds-color-fg)',
);

function radiusSwatch(value: string): string {
  return joinStyles(
    'width:56px;height:56px',
    'background:var(--ds-color-accent-subtle)',
    'border:1.5px solid var(--ds-color-accent)',
    `border-radius:${value}`,
  );
}

function shadowSwatch(name: string): string {
  return joinStyles(
    'height:64px',
    'background:var(--ds-color-bg)',
    'border-radius:var(--ds-radius-xs)',
    `box-shadow:var(--ds-shadow-${name})`,
  );
}

const borderRows: readonly TokenRow[] = Object.entries(border).map(([name, value]) => ({
  token: `border-${name}`,
  value,
}));

const borderColumns: readonly TableColumn<TokenRow>[] = [
  { name: 'token', field: 'token', label: 'Token', width: '12rem', render: (row) => code(row.token) },
  { name: 'value', field: 'value', label: 'Value', width: '6rem' },
  {
    name: 'preview',
    field: 'value',
    label: 'Preview',
    render: (row) =>
      html`<span
        aria-hidden="true"
        style="display:block;height:${row.value};background:var(--ds-color-fg);max-width:120px"
      ></span>`,
  },
];

export const Shape: Story = {
  render: () => html`
    <section style=${SHAPE_LAYOUT}>
      <div style="display:grid;gap:var(--ds-space-4)">
        <h3 style=${GROUP_LABEL}>Radius</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:var(--ds-space-3)">
          ${Object.entries(radius).map(
            ([name, value]) => html`
              <div style="display:grid;gap:var(--ds-space-2);align-items:start">
                <div style=${radiusSwatch(value)}></div>
                <div>
                  <code style="display:block">radius-${name}</code>
                  <span style="color:var(--ds-color-fg-muted)">${value}</span>
                </div>
              </div>
            `,
          )}
        </div>
      </div>

      <div style="display:grid;gap:var(--ds-space-4)">
        <h3 style=${GROUP_LABEL}>Shadow</h3>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:var(--ds-space-5)">
          ${Object.keys(shadow).map(
            (name) => html`
              <div style="display:grid;gap:var(--ds-space-3)">
                <div style=${shadowSwatch(name)}></div>
                <code>shadow-${name}</code>
              </div>
            `,
          )}
        </div>
      </div>

      <div style="display:grid;gap:var(--ds-space-4)">
        <h3 style=${GROUP_LABEL}>Border width</h3>
        <ds-table .rows=${borderRows} .columns=${borderColumns}></ds-table>
      </div>
    </section>
  `,
};

const durationUse: Record<string, string> = {
  instant: 'Micro-interactions: toggle, checkbox check',
  fast: 'Hover states, icon swaps, badge updates',
  normal: 'Drawer open, popover appear, tab switch',
  slow: 'Panel slide, card expand, skeleton fade',
  slower: 'Full-page transitions, staggered list entry',
};
const easingUse: Record<string, string> = {
  standard: 'Default for most transitions',
  emphasized: 'Attention-drawing, springy overshoot',
  enter: 'Elements entering the screen',
  exit: 'Elements leaving the screen',
};

function tokenRows(prefix: string, values: Record<string, string>, uses: Record<string, string>): readonly TokenRow[] {
  return Object.entries(values).map(([name, value]) => ({ token: `${prefix}-${name}`, value, use: uses[name] }));
}

const usageColumns: readonly TableColumn<TokenRow>[] = [
  { name: 'token', field: 'token', label: 'Token', width: '12rem', render: (row) => code(row.token) },
  { name: 'value', field: 'value', label: 'Value', width: '14rem', render: (row) => code(row.value) },
  { name: 'use', field: 'use', label: 'Use' },
];

export const Motion: Story = {
  render: () => html`
    <section style="display:grid;gap:var(--ds-space-8)">
      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Duration</h3>
        <ds-table .rows=${tokenRows('duration', duration, durationUse)} .columns=${usageColumns}></ds-table>
      </div>
      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Easing</h3>
        <ds-table .rows=${tokenRows('easing', easing, easingUse)} .columns=${usageColumns}></ds-table>
      </div>
    </section>
  `,
};

function barSwatch(value: string, color = 'var(--ds-color-accent-subtle)'): TemplateResult {
  const style = joinStyles(
    'display:block;height:6px',
    `background:${color}`,
    'border:1px solid var(--ds-color-accent)',
    `max-width:min(${value},100%)`,
  );
  return html`<span aria-hidden="true" style=${style}></span>`;
}

const previewColumns: readonly TableColumn<TokenRow>[] = [
  { name: 'token', field: 'token', label: 'Token', width: '12rem', render: (row) => code(row.token) },
  { name: 'value', field: 'value', label: 'Value', width: '7rem' },
  { name: 'preview', field: 'value', label: 'Preview', render: (row) => barSwatch(row.value) },
];

const zIndexUse: Record<string, string> = {
  base: 'Normal document flow',
  raised: 'Sticky elements within a section',
  dropdown: 'Menus and autocomplete panels',
  sticky: 'Sticky headers and sidebars',
  overlay: 'Backdrop overlays behind modals',
  modal: 'Dialogs, drawers, and sheets',
  toast: 'Notification toasts',
  tooltip: 'Tooltip fallback when the Popover API top layer is unavailable',
};

function valueRows(prefix: string, values: Record<string, string>): readonly TokenRow[] {
  return Object.entries(values).map(([name, value]) => ({ token: `${prefix}-${name}`, value }));
}

export const BreakpointsAndZIndex: Story = {
  render: () => html`
    <section style="display:grid;gap:var(--ds-space-8)">
      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Breakpoints</h3>
        <ds-table .rows=${valueRows('breakpoint', breakpoint)} .columns=${previewColumns}></ds-table>
      </div>
      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Container max-widths</h3>
        <ds-table .rows=${valueRows('container', container)} .columns=${previewColumns}></ds-table>
      </div>
      <div style="display:grid;gap:var(--ds-space-3)">
        <h3 style=${GROUP_LABEL}>Z-index</h3>
        <ds-table .rows=${tokenRows('z-index', zIndex, zIndexUse)} .columns=${usageColumns}></ds-table>
      </div>
    </section>
  `,
};
