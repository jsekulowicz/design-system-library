import { html, type TemplateResult } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { fontSize, fontWeight, lineHeight, letterSpacing } from '@ds/tokens';

const meta: Meta = {
  title: 'Foundations/Typography',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

const REM_IN_PX = 16;

function remToPx(rem: string): number {
  const m = /^(-?\d*\.?\d+)rem$/.exec(rem);
  return m ? Math.round(Number(m[1]) * REM_IN_PX) : 0;
}

function sectionHeader(title: string, description: TemplateResult): TemplateResult {
  return html`
    <header style="display:grid;gap:var(--ds-space-1)">
      <h2 style="margin:0;font-family:var(--ds-font-display);font-size:var(--ds-font-size-2xl)">${title}</h2>
      <p style="margin:0;color:var(--ds-color-fg-muted);max-width:68ch">${description}</p>
    </header>`;
}

function stripeRow(i: number): string {
  return i % 2 !== 0 ? 'background:color-mix(in oklab,var(--ds-color-fg) 3%,transparent)' : '';
}

const SIZE_STEPS = Object.entries(fontSize) as [string, string][];

export const TypeScale: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-5);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
  ${sectionHeader('Type scale', html`Eleven steps from <code>3xs</code> (11 px) to <code>5xl</code> (64 px).
    Body copy lives in <code>sm</code>–<code>lg</code>; headings in <code>xl</code>–<code>4xl</code>;
    display pieces at <code>5xl</code>.`)}
  <div role="table" style="display:grid;gap:0">
    <div role="row" style="display:grid;grid-template-columns:9rem 4rem 3.5rem 1fr;gap:var(--ds-space-3);padding:var(--ds-space-2) var(--ds-space-2);border-bottom:1px solid var(--ds-color-border)">
      <strong role="columnheader" style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">Token</strong>
      <strong role="columnheader" style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">rem</strong>
      <strong role="columnheader" style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">px</strong>
      <strong role="columnheader" style="font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">Preview</strong>
    </div>
    ${SIZE_STEPS.map(([name, rem], i) => html`
      <div role="row" style="display:grid;grid-template-columns:9rem 4rem 3.5rem 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
        <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">font-size-${name}</code>
        <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${rem}</span>
        <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${remToPx(rem)}px</span>
        <span role="cell" style="font-size:var(--ds-font-size-${name});line-height:1;overflow:hidden;white-space:nowrap;text-overflow:ellipsis">The quick brown fox</span>
      </div>
    `)}
  </div>
</section>`,
};

const FAMILIES = [
  { token: '--ds-font-display', label: 'Display', name: 'Fraunces', note: 'Variable optical-size serif. Headlines, pull quotes, brand moments.', sample: 'A studied restraint in editorial type.' },
  { token: '--ds-font-body', label: 'Body', name: 'General Sans', note: 'Humanist sans. Body copy, UI labels, any prose.', sample: 'Clean and legible at any size, across long paragraphs and tight UI chrome alike.' },
  { token: '--ds-font-mono', label: 'Mono', name: 'JetBrains Mono', note: 'Monospaced. Code blocks, token values, technical metadata.', sample: "const value = token('--ds-space-4');" },
];

export const FontFamilies: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-5);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
  ${sectionHeader('Font families', html`Three typefaces, three roles. Never swap them — each pairing of semantics
    and personality is intentional.`)}
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:var(--ds-space-4)">
    ${FAMILIES.map(f => html`
      <figure style="margin:0;padding:var(--ds-space-5);border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-md);display:grid;gap:var(--ds-space-3)">
        <figcaption style="display:grid;gap:4px">
          <strong>${f.label} — ${f.name}</strong>
          <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">${f.token}</code>
          <p style="margin:0;font-size:var(--ds-font-size-xs);color:var(--ds-color-fg-muted)">${f.note}</p>
        </figcaption>
        <p style="margin:0;font-family:var(${f.token});font-size:var(--ds-font-size-lg);line-height:var(--ds-line-height-normal)">${f.sample}</p>
      </figure>`)}
  </div>
</section>`,
};

const WEIGHT_STEPS = Object.entries(fontWeight) as [string, string][];
const SAMPLE = 'The quick brown fox jumps over the lazy dog';

export const FontWeights: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-5);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
  ${sectionHeader('Font weights', html`Four weights. Use <code>regular</code> for body, <code>medium</code> for labels,
    <code>semibold</code> for headings, <code>bold</code> sparingly for maximum contrast.`)}
  <div role="table" style="display:grid;gap:0">
    ${WEIGHT_STEPS.map(([name, val], i) => html`
      <div role="row" style="display:grid;grid-template-columns:10rem 4rem 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
        <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">weight-${name}</code>
        <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${val}</span>
        <span role="cell" style="font-weight:${val}">${SAMPLE}</span>
      </div>`)}
  </div>
</section>`,
};

const LINE_HEIGHT_STEPS = Object.entries(lineHeight) as [string, string][];
const PROSE = 'Spacing between lines determines whether text feels crowded or open. Tighter leading suits large display type; more relaxed leading aids comprehension in body paragraphs.';

export const LineHeights: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-5);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
  ${sectionHeader('Line heights', html`Four steps from tight (display) to relaxed (long-form prose). Pair
    <code>tight</code>/<code>snug</code> with large sizes and <code>normal</code>/<code>relaxed</code>
    with body copy.`)}
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:var(--ds-space-4)">
    ${LINE_HEIGHT_STEPS.map(([name, val]) => html`
      <div style="padding:var(--ds-space-4);border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-md);display:grid;gap:var(--ds-space-3)">
        <div>
          <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-sm)">line-height-${name}</code>
          <span style="display:block;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs);margin-top:2px">${val}</span>
        </div>
        <p style="margin:0;font-size:var(--ds-font-size-sm);line-height:${val}">${PROSE}</p>
      </div>`)}
  </div>
</section>`,
};

const TRACKING_STEPS = Object.entries(letterSpacing) as [string, string][];

export const LetterSpacing: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-5);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
  ${sectionHeader('Letter spacing', html`Four values covering optically tight display headings to spaced-out
    uppercase labels. <code>normal</code> is 0 — no adjustment.`)}
  <div role="table" style="display:grid;gap:0">
    ${TRACKING_STEPS.map(([name, val], i) => html`
      <div role="row" style="display:grid;grid-template-columns:11rem 5.5rem 1fr;align-items:center;gap:var(--ds-space-3);padding:var(--ds-space-3) var(--ds-space-2);border-radius:var(--ds-radius-xs);${stripeRow(i)}">
        <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)">letter-spacing-${name}</code>
        <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-xs)">${val || '0'}</span>
        <span role="cell" style="letter-spacing:${val};font-size:var(--ds-font-size-md);${name === 'wide' ? 'text-transform:uppercase;font-size:var(--ds-font-size-xs);font-weight:600' : ''}">
          ${name === 'wide' ? 'Section heading label' : 'The quick brown fox jumps'}
        </span>
      </div>`)}
  </div>
</section>`,
};
