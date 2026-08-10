import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fontSize, fontWeight, lineHeight, letterSpacing } from '@jsekulowicz/ds-tokens';
import {
  autoGrid,
  bodyRow,
  card,
  headerRow,
  joinStyles,
  MONO_CELL,
  MONO_MUTED_CELL,
  MUTED_CELL,
  NUM_CELL,
  SECTION,
  TABLE,
} from '../shared/styles';

const meta: Meta = {
  title: 'Foundations/Typography',
  parameters: { docs: { story: { inline: true } } },
};

export default meta;
type Story = StoryObj;

const REM_IN_PX = 16;

function remToPx(rem: string): number {
  const m = /^(-?\d*\.?\d+)rem$/.exec(rem);
  return m ? Math.round(Number(m[1]) * REM_IN_PX) : 0;
}

function sectionHeader(title: string, description: TemplateResult): TemplateResult {
  return html` <header style="display:grid;gap:var(--ds-space-1)">
    <h2 style="margin:0;font-family:var(--ds-font-display);font-size:var(--ds-font-size-heading-lg)">${title}</h2>
    <p style="margin:0;color:var(--ds-color-fg-muted);max-width:68ch">${description}</p>
  </header>`;
}

const SIZE_STEPS = Object.entries(fontSize) as [string, string][];
const SIZE_COLUMNS = '9rem 4rem 3.5rem 1fr';

function previewCell(name: string): string {
  return joinStyles(
    `font-size:var(--ds-font-size-${name})`,
    'line-height:var(--ds-line-height-none)',
    'overflow:hidden;white-space:nowrap;text-overflow:ellipsis',
  );
}

export const TypeScale: Story = {
  render: () =>
    html` <section style=${SECTION}>
      ${sectionHeader(
        'Type scale',
        html`Two role-based scales: <code>body-sm</code> through <code>body-lg</code> for interface and prose text, and
          <code>heading-xs</code> through <code>heading-3xl</code> for section headings, page titles, and display text.`,
      )}
      <div role="table" style=${TABLE}>
        <div role="row" style=${headerRow(SIZE_COLUMNS)}>
          <strong role="columnheader" style=${MUTED_CELL}>Token</strong>
          <strong role="columnheader" style=${MUTED_CELL}>rem</strong>
          <strong role="columnheader" style=${MUTED_CELL}>px</strong>
          <strong role="columnheader" style=${MUTED_CELL}>Preview</strong>
        </div>
        ${SIZE_STEPS.map(
          ([name, rem], i) => html`
            <div role="row" style=${bodyRow(SIZE_COLUMNS, i)}>
              <code role="cell" style=${MONO_CELL}>font-size-${name}</code>
              <span role="cell" style=${NUM_CELL}>${rem}</span>
              <span role="cell" style=${NUM_CELL}>${remToPx(rem)}px</span>
              <span role="cell" style=${previewCell(name)}>The quick brown fox</span>
            </div>
          `,
        )}
      </div>
    </section>`,
};

const FAMILIES = [
  {
    token: '--ds-font-display',
    label: 'Display',
    name: 'Source Serif 4',
    note: 'Workhorse serif. Headlines, page titles, calm brand moments.',
    sample: 'A measured voice for practical interfaces.',
  },
  {
    token: '--ds-font-body',
    label: 'Body',
    name: 'General Sans',
    note: 'Humanist sans. Body copy, UI labels, any prose.',
    sample: 'Clean and legible at any size, across long paragraphs and tight UI chrome alike.',
  },
  {
    token: '--ds-font-mono',
    label: 'Mono',
    name: 'JetBrains Mono',
    note: 'Monospaced. Code blocks, token values, technical metadata.',
    sample: "const value = token('--ds-space-4');",
  },
];

function familySample(token: string): string {
  return joinStyles(
    'margin:0',
    `font-family:var(${token})`,
    'font-size:var(--ds-font-size-heading-sm)',
    'line-height:var(--ds-line-height-normal)',
  );
}

export const FontFamilies: Story = {
  render: () =>
    html` <section style=${SECTION}>
      ${sectionHeader(
        'Font families',
        html`Three typefaces, three roles. Never swap them — each pairing of semantics and personality is intentional.`,
      )}
      <div style=${autoGrid('240px')}>
        ${FAMILIES.map(
          (f) => html`
            <figure style=${card('var(--ds-space-5)')}>
              <figcaption style="display:grid;gap:4px">
                <strong>${f.label} — ${f.name}</strong>
                <code style=${MONO_MUTED_CELL}>${f.token}</code>
                <p style=${joinStyles('margin:0', MUTED_CELL)}>${f.note}</p>
              </figcaption>
              <p style=${familySample(f.token)}>${f.sample}</p>
            </figure>
          `,
        )}
      </div>
    </section>`,
};

const WEIGHT_STEPS = Object.entries(fontWeight) as [string, string][];
const WEIGHT_COLUMNS = '10rem 4rem 1fr';
const SAMPLE = 'The quick brown fox jumps over the lazy dog';

export const FontWeights: Story = {
  render: () =>
    html` <section style=${SECTION}>
      ${sectionHeader(
        'Font weights',
        html`Four weights. Use <code>regular</code> for body, <code>medium</code> for labels, <code>semibold</code> for
          headings, <code>bold</code> sparingly for maximum contrast.`,
      )}
      <div role="table" style=${TABLE}>
        ${WEIGHT_STEPS.map(
          ([name, val], i) => html`
            <div role="row" style=${bodyRow(WEIGHT_COLUMNS, i)}>
              <code role="cell" style=${MONO_CELL}>weight-${name}</code>
              <span role="cell" style=${NUM_CELL}>${val}</span>
              <span role="cell" style="font-weight:${val}">${SAMPLE}</span>
            </div>
          `,
        )}
      </div>
    </section>`,
};

const LINE_HEIGHT_STEPS = Object.entries(lineHeight) as [string, string][];
const PROSE =
  'Spacing between lines determines whether text feels crowded or open. Tighter leading suits large display type; more relaxed leading aids comprehension in body paragraphs.';

const STEP_TOKEN = 'font-family:var(--ds-font-mono);font-size:var(--ds-font-size-body-md)';
const STEP_VALUE = joinStyles('display:block', MUTED_CELL, 'margin-top:2px');

export const LineHeights: Story = {
  render: () =>
    html` <section style=${SECTION}>
      ${sectionHeader(
        'Line heights',
        html`Five steps, from <code>none</code> for single-line controls to <code>relaxed</code> for long-form prose.
          Pair the tight end with large sizes and the loose end with body copy.`,
      )}
      <div style=${autoGrid('200px')}>
        ${LINE_HEIGHT_STEPS.map(
          ([name, val]) => html`
            <div style=${card('var(--ds-space-4)')}>
              <div>
                <code style=${STEP_TOKEN}>line-height-${name}</code>
                <span style=${STEP_VALUE}>${val}</span>
              </div>
              <p style="margin:0;font-size:var(--ds-font-size-body-md);line-height:${val}">${PROSE}</p>
            </div>
          `,
        )}
      </div>
    </section>`,
};

const TRACKING_STEPS = Object.entries(letterSpacing) as [string, string][];
const TRACKING_COLUMNS = '11rem 5.5rem 1fr';

function trackingSample(val: string, uppercase: boolean): string {
  return joinStyles(
    `letter-spacing:${val}`,
    'font-size:var(--ds-font-size-body-lg)',
    uppercase ? 'text-transform:uppercase;font-size:var(--ds-font-size-body-sm);font-weight:600' : '',
  );
}

export const LetterSpacing: Story = {
  render: () =>
    html` <section style=${SECTION}>
      ${sectionHeader(
        'Letter spacing',
        html`Four values covering optically tight display headings to spaced-out uppercase labels.
          <code>normal</code> is 0 — no adjustment.`,
      )}
      <div role="table" style=${TABLE}>
        ${TRACKING_STEPS.map(
          ([name, val], i) => html`
            <div role="row" style=${bodyRow(TRACKING_COLUMNS, i)}>
              <code role="cell" style=${MONO_CELL}>letter-spacing-${name}</code>
              <span role="cell" style=${NUM_CELL}>${val || '0'}</span>
              <span role="cell" style=${trackingSample(val, name === 'wide')}>
                ${name === 'wide' ? 'Section heading label' : 'The quick brown fox jumps'}
              </span>
            </div>
          `,
        )}
      </div>
    </section>`,
};
