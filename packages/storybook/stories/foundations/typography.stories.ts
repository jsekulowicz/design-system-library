import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TableColumn } from '@jsekulowicz/ds-components/table';
import { fontSize, fontWeight, lineHeight, letterSpacing } from '@jsekulowicz/ds-tokens';
import '@jsekulowicz/ds-components/table/define';
import { autoGrid, card, joinStyles, MONO_MUTED_CELL, MUTED_CELL, SECTION } from '../shared/styles';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { docs: { story: { inline: true } } },
};

export default meta;
type Story = StoryObj;

const REM_IN_PX = 16;

function remToPx(rem: string): number {
  const match = /^(-?\d*\.?\d+)rem$/.exec(rem);
  return match ? Math.round(Number(match[1]) * REM_IN_PX) : 0;
}

function code(value: string): TemplateResult {
  return html`<code>${value}</code>`;
}

interface SizeRow {
  [key: string]: unknown;
  name: string;
  token: string;
  rem: string;
  px: string;
  preview: string;
}

const sizeRows: readonly SizeRow[] = Object.entries(fontSize).map(([name, rem]) => ({
  name,
  token: `font-size-${name}`,
  rem,
  px: `${remToPx(rem)}px`,
  preview: 'The quick brown fox',
}));

function previewCell(row: SizeRow): TemplateResult {
  const style = joinStyles(
    `font-size:var(--ds-font-size-${row.name})`,
    'line-height:var(--ds-line-height-none)',
    'overflow:hidden;white-space:nowrap;text-overflow:ellipsis',
  );
  return html`<span style=${style}>${row.preview}</span>`;
}

const sizeColumns: readonly TableColumn<SizeRow>[] = [
  { name: 'token', field: 'token', label: 'Token', width: '12rem', render: (row) => code(row.token) },
  { name: 'rem', field: 'rem', label: 'rem', width: '6rem' },
  { name: 'px', field: 'px', label: 'px', width: '5rem' },
  { name: 'preview', field: 'preview', label: 'Preview', render: previewCell },
];

export const TypeScale: Story = {
  render: () => html`<ds-table .rows=${sizeRows} .columns=${sizeColumns}></ds-table>`,
};

interface GuidanceRow {
  [key: string]: unknown;
  range: string;
  role: string;
}

const guidanceRows: readonly GuidanceRow[] = [
  { range: 'body-sm', role: 'Captions, helper text, badges, and timestamps' },
  { range: 'body-md - body-lg', role: 'Body copy, UI labels, and form fields' },
  { range: 'heading-xs - heading-sm', role: 'Card titles and nested section headings' },
  { range: 'heading-md', role: 'Page and main section headings' },
  { range: 'heading-lg - heading-3xl', role: 'Prominent page headings, feature titles, and display text' },
];

const guidanceColumns: readonly TableColumn<GuidanceRow>[] = [
  { name: 'range', field: 'range', label: 'Token range', width: '15rem', render: (row) => code(row.range) },
  { name: 'role', field: 'role', label: 'Role' },
];

export const SizeGuidance: Story = {
  render: () => html`<ds-table .rows=${guidanceRows} .columns=${guidanceColumns}></ds-table>`,
};

const FAMILIES = [
  {
    token: '--ds-font-display',
    label: 'Display',
    name: 'Source Serif 4',
    note: 'Serif font for headings and page titles.',
    sample: 'Example heading in the display font.',
  },
  {
    token: '--ds-font-body',
    label: 'Body',
    name: 'General Sans',
    note: 'Sans-serif font for body copy, labels, and other interface text.',
    sample: 'This font stays readable in paragraphs and compact interface layouts.',
  },
  {
    token: '--ds-font-mono',
    label: 'Mono',
    name: 'JetBrains Mono',
    note: 'Monospace font for code, token names, and technical values.',
    sample: "const value = token('--ds-space-4');",
  },
];

const FONT_FAMILY_TOKEN = joinStyles(
  MONO_MUTED_CELL,
  'display:block',
  'width:fit-content',
  'align-self:start',
  'padding:0',
  'line-height:1',
);
const FONT_FAMILY_LAYOUT = joinStyles(
  'display:flex',
  'flex-wrap:wrap',
  'gap:var(--ds-space-4)',
  'align-items:stretch',
  'justify-content:flex-start',
);
const FONT_FAMILY_CARD = joinStyles(
  card('var(--ds-space-5)'),
  'flex:1 1 16rem',
  'max-width:20rem',
  'min-width:0',
  'margin:0',
);

function familySample(token: string): string {
  return joinStyles(
    'margin:0',
    `font-family:var(${token})`,
    'font-size:var(--ds-font-size-heading-sm)',
    'line-height:var(--ds-line-height-normal)',
  );
}

export const FontFamilies: Story = {
  render: () => html`
    <section style=${SECTION}>
      <div class="ds-font-family-cards" style=${FONT_FAMILY_LAYOUT}>
        ${FAMILIES.map(
          (family) => html`
            <figure class="ds-font-family-card" style=${FONT_FAMILY_CARD}>
              <figcaption style="display:grid;gap:4px">
                <strong>${family.label} - ${family.name}</strong>
                <code style=${FONT_FAMILY_TOKEN}>${family.token}</code>
                <p style=${joinStyles('margin:0', MUTED_CELL)}>${family.note}</p>
              </figcaption>
              <p style=${familySample(family.token)}>${family.sample}</p>
            </figure>
          `,
        )}
      </div>
    </section>
  `,
};

interface WeightRow {
  [key: string]: unknown;
  token: string;
  value: string;
  sample: string;
}

const weightRows: readonly WeightRow[] = Object.entries(fontWeight).map(([name, value]) => ({
  token: `weight-${name}`,
  value,
  sample: 'The quick brown fox jumps over the lazy dog',
}));

const weightColumns: readonly TableColumn<WeightRow>[] = [
  { name: 'token', field: 'token', label: 'Token', width: '12rem', render: (row) => code(row.token) },
  { name: 'value', field: 'value', label: 'Value', width: '6rem' },
  {
    name: 'sample',
    field: 'sample',
    label: 'Preview',
    render: (row) => html`<span style="font-weight:${row.value}">${row.sample}</span>`,
  },
];

export const FontWeights: Story = {
  render: () => html`<ds-table .rows=${weightRows} .columns=${weightColumns}></ds-table>`,
};

const PROSE =
  'Line spacing determines whether text feels crowded or open. Use less space for large headings and more space for body paragraphs.';
const STEP_TOKEN = 'font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-md)';
const STEP_VALUE = joinStyles('display:block', MUTED_CELL, 'margin-top:2px');

export const LineHeights: Story = {
  render: () => html`
    <section style=${SECTION}>
      <div style=${autoGrid('200px')}>
        ${Object.entries(lineHeight).map(
          ([name, value]) => html`
            <div style=${card('var(--ds-space-4)')}>
              <div>
                <code style=${STEP_TOKEN}>line-height-${name}</code>
                <span style=${STEP_VALUE}>${value}</span>
              </div>
              <p style="margin:0;font-size:var(--ds-font-size-body-lg);line-height:${value}">${PROSE}</p>
            </div>
          `,
        )}
      </div>
    </section>
  `,
};

interface TrackingRow {
  [key: string]: unknown;
  name: string;
  token: string;
  value: string;
  sample: string;
}

const trackingRows: readonly TrackingRow[] = Object.entries(letterSpacing).map(([name, value]) => ({
  name,
  token: `letter-spacing-${name}`,
  value: value || '0',
  sample: name === 'wide' ? 'Section heading label' : 'The quick brown fox jumps',
}));

function trackingSample(row: TrackingRow): TemplateResult {
  const uppercase = row.name === 'wide';
  return html`<span
    style="letter-spacing:${row.value};font-size:var(--ds-font-size-${uppercase ? 'body-sm' : 'body-lg'});${
      uppercase ? 'text-transform:uppercase;font-weight:600' : ''
    }"
    >${row.sample}</span
  >`;
}

const trackingColumns: readonly TableColumn<TrackingRow>[] = [
  { name: 'token', field: 'token', label: 'Token', width: '14rem', render: (row) => code(row.token) },
  { name: 'value', field: 'value', label: 'Value', width: '7rem' },
  { name: 'sample', field: 'sample', label: 'Preview', render: trackingSample },
];

export const LetterSpacing: Story = {
  render: () => html`<ds-table .rows=${trackingRows} .columns=${trackingColumns}></ds-table>`,
};
