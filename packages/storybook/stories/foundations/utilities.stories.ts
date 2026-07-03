import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TableColumn } from '@jsekulowicz/ds-components/table';
import '@jsekulowicz/ds-components/table/define';

type Story = StoryObj;
type UtilityRow = {
  group: string;
  classes: readonly string[];
  mapsTo: string;
};

const meta: Meta = {
  title: 'Foundations/Utilities',
  parameters: { docs: { story: { inline: true } } },
};

export default meta;

function code(value: string): TemplateResult {
  return html`<code>${value}</code>`;
}

function codeList(values: readonly string[]): TemplateResult {
  return html`
    <span style="display:flex;flex-wrap:wrap;gap:var(--ds-space-1)">
      ${values.map((value) => code(value))}
    </span>
  `;
}

const spacingRows: readonly UtilityRow[] = [
  { group: 'Padding', classes: ['.ds-p-{n}'], mapsTo: 'padding' },
  { group: 'Padding inline', classes: ['.ds-px-{n}'], mapsTo: 'padding-inline' },
  { group: 'Padding block', classes: ['.ds-py-{n}'], mapsTo: 'padding-block' },
  { group: 'Padding top/right/bottom/left', classes: ['.ds-pt-{n}', '.ds-pr-{n}', '.ds-pb-{n}', '.ds-pl-{n}'], mapsTo: 'logical side padding' },
  { group: 'Margin', classes: ['.ds-m-{n}'], mapsTo: 'margin' },
  { group: 'Margin inline', classes: ['.ds-mx-{n}'], mapsTo: 'margin-inline' },
  { group: 'Margin block', classes: ['.ds-my-{n}'], mapsTo: 'margin-block' },
  { group: 'Margin top/right/bottom/left', classes: ['.ds-mt-{n}', '.ds-mr-{n}', '.ds-mb-{n}', '.ds-ml-{n}'], mapsTo: 'logical side margin' },
  { group: 'Gap', classes: ['.ds-gap-{n}'], mapsTo: 'gap' },
  { group: 'Column gap', classes: ['.ds-gap-x-{n}'], mapsTo: 'column-gap' },
  { group: 'Row gap', classes: ['.ds-gap-y-{n}'], mapsTo: 'row-gap' },
];

const sizingRows: readonly UtilityRow[] = [
  { group: 'Width', classes: ['.ds-w-{n}'], mapsTo: 'width → --ds-space-{n}' },
  { group: 'Height', classes: ['.ds-h-{n}'], mapsTo: 'height → --ds-space-{n}' },
  { group: 'Square', classes: ['.ds-size-{n}'], mapsTo: 'width + height → --ds-space-{n}' },
  { group: 'Width keywords', classes: ['.ds-w-auto', '.ds-w-full', '.ds-w-screen', '.ds-w-min', '.ds-w-max', '.ds-w-fit'], mapsTo: 'width' },
  { group: 'Height keywords', classes: ['.ds-h-auto', '.ds-h-full', '.ds-h-screen', '.ds-h-min', '.ds-h-max', '.ds-h-fit'], mapsTo: 'height' },
  { group: 'Min width', classes: ['.ds-min-w-0', '.ds-min-w-full', '.ds-min-w-min', '.ds-min-w-max'], mapsTo: 'min-width' },
  { group: 'Min height', classes: ['.ds-min-h-0', '.ds-min-h-full', '.ds-min-h-screen'], mapsTo: 'min-height' },
  { group: 'Max width', classes: ['.ds-max-w-full', '.ds-max-w-none', '.ds-max-w-min', '.ds-max-w-max'], mapsTo: 'max-width' },
  { group: 'Max height', classes: ['.ds-max-h-full', '.ds-max-h-screen', '.ds-max-h-none'], mapsTo: 'max-height' },
];

const layoutRows: readonly UtilityRow[] = [
  { group: 'Display', classes: ['.ds-d-block', '.ds-d-inline-block', '.ds-d-flex', '.ds-d-inline-flex', '.ds-d-grid', '.ds-d-none'], mapsTo: 'display' },
  { group: 'Flex direction', classes: ['.ds-flex-row', '.ds-flex-column'], mapsTo: 'flex-direction' },
  { group: 'Flex wrapping', classes: ['.ds-flex-wrap', '.ds-flex-nowrap'], mapsTo: 'flex-wrap' },
  { group: 'Align items', classes: ['.ds-items-start', '.ds-items-center', '.ds-items-end', '.ds-items-stretch'], mapsTo: 'align-items' },
  { group: 'Justify content', classes: ['.ds-justify-start', '.ds-justify-center', '.ds-justify-end', '.ds-justify-between'], mapsTo: 'justify-content' },
  { group: 'Align content', classes: ['.ds-content-start', '.ds-content-center', '.ds-content-end', '.ds-content-between'], mapsTo: 'align-content' },
  { group: 'Align self', classes: ['.ds-self-start', '.ds-self-center', '.ds-self-end', '.ds-self-stretch'], mapsTo: 'align-self' },
];

const typographyRows: readonly UtilityRow[] = [
  { group: 'Font family', classes: ['.ds-font-sans', '.ds-font-serif', '.ds-font-mono'], mapsTo: '--ds-font-family-*' },
  { group: 'Font size', classes: ['.ds-text-xs', '.ds-text-sm', '.ds-text-md', '.ds-text-lg', '.ds-text-xl', '.ds-text-2xl', '.ds-text-3xl'], mapsTo: '--ds-font-size-*' },
  { group: 'Font weight', classes: ['.ds-font-normal', '.ds-font-medium', '.ds-font-semibold', '.ds-font-bold'], mapsTo: '--ds-font-weight-*' },
  { group: 'Line height', classes: ['.ds-leading-tight', '.ds-leading-normal', '.ds-leading-relaxed'], mapsTo: '--ds-line-height-*' },
];

const columns: readonly TableColumn<UtilityRow>[] = [
  { name: 'group', field: 'group', label: 'Group', width: '13rem' },
  { name: 'classes', field: 'classes', label: 'Classes', render: (row) => codeList(row.classes) },
  { name: 'mapsTo', field: 'mapsTo', label: 'Maps to', width: '14rem', render: (row) => code(row.mapsTo) },
];

function renderTable(rows: readonly UtilityRow[]): TemplateResult {
  return html`<ds-table .rows=${rows} .columns=${columns}></ds-table>`;
}

export const Spacing: Story = {
  render: () => renderTable(spacingRows),
};

export const Sizing: Story = {
  render: () => renderTable(sizingRows),
};

export const Layout: Story = {
  render: () => renderTable(layoutRows),
};

export const Typography: Story = {
  render: () => renderTable(typographyRows),
};
