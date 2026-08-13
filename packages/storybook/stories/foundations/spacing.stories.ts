import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import type { TableColumn } from '@jsekulowicz/ds-components/table';
import { space } from '@jsekulowicz/ds-tokens';
import '@jsekulowicz/ds-components/table/define';
import { joinStyles } from '../shared/styles';

const meta: Meta = {
  title: 'Foundations/Spacing',
  parameters: { docs: { story: { inline: true } } },
};

const EXAMPLES_LAYOUT = joinStyles(
  'display:grid;gap:var(--ds-space-4)',
  'font-family:var(--ds-font-body)',
  'font-size:var(--ds-font-size-body-lg)',
  'color:var(--ds-color-fg)',
);

function bar(cssVar: string): string {
  return joinStyles(
    'display:inline-block',
    'background:var(--ds-color-accent)',
    'height:12px',
    `width:var(${cssVar})`,
    'min-width:1px',
    'border-radius:2px',
  );
}

function paddingBox(n: number | string): string {
  return joinStyles(
    'border:1px solid var(--ds-color-border)',
    'border-radius:var(--ds-radius-xs)',
    'background:var(--ds-color-bg-subtle)',
    `padding:var(--ds-space-${n})`,
  );
}

function paddingChip(): string {
  return joinStyles(
    'background:var(--ds-color-accent-subtle)',
    'border:1px dashed var(--ds-color-accent)',
    'padding:var(--ds-space-1) var(--ds-space-2)',
    'font-family:var(--ds-font-mono)',
    'font-size:var(--ds-font-size-body-md)',
  );
}

export default meta;
type Story = StoryObj;

interface Step {
  [key: string]: unknown;
  name: string;
  cssVar: string;
  rem: string;
  px: number;
}

const REM_IN_PX = 16;

const STEPS: readonly Step[] = Object.entries(space).map(([name, rem]) => ({
  name,
  cssVar: `--ds-space-${name}`,
  rem,
  px: rem === '0' ? 0 : Number(/^(-?\d*\.?\d+)rem$/.exec(rem)![1]) * REM_IN_PX,
}));

function code(value: string): TemplateResult {
  return html`<code>${value}</code>`;
}

const columns: readonly TableColumn<Step>[] = [
  { name: 'name', field: 'name', label: 'Token', width: '9rem', render: (row) => code(`space-${row.name}`) },
  { name: 'rem', field: 'rem', label: 'rem', width: '6rem' },
  { name: 'px', field: 'px', label: 'px', width: '5rem', render: (row) => `${row.px}px` },
  {
    name: 'preview',
    field: 'cssVar',
    label: 'Preview',
    render: (row) => html`<span aria-hidden="true" style=${bar(row.cssVar)}></span>`,
  },
];

export const Scale: Story = {
  render: () => html`<ds-table .rows=${STEPS} .columns=${columns}></ds-table>`,
};

export const PaddingExamples: Story = {
  render: () => html`
    <section style=${EXAMPLES_LAYOUT}>
      ${[2, 3, 4, 6, 8].map(
        (n) => html`
          <div style="display:flex;align-items:center;gap:var(--ds-space-4)">
            <code style="width:6rem;font-family:var(--ds-font-mono)">space-${n}</code>
            <div style=${paddingBox(n)}>
              <div style=${paddingChip()}>Content</div>
            </div>
          </div>
        `,
      )}
    </section>
  `,
};
