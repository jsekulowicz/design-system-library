import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import { space } from '@ds/tokens';

const meta: Meta = {
  title: 'Foundations/Spacing',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

type Step = { name: string; cssVar: string; rem: string; px: number };

const REM_IN_PX = 16;

const STEPS: readonly Step[] = Object.entries(space).map(([name, rem]) => ({
  name,
  cssVar: `--ds-space-${name}`,
  rem,
  px: rem === '0' ? 0 : Number(/^(-?\d*\.?\d+)rem$/.exec(rem)![1]) * REM_IN_PX,
}));

export const Scale: Story = {
  render: () => html`
<section
  style="display:grid;gap:var(--ds-space-3);max-width:780px;font-family:var(--ds-font-body);color:var(--ds-color-fg)"
>
  <header style="display:grid;gap:var(--ds-space-1)">
    <h2 style="margin:0;font-family:var(--ds-font-display);font-size:var(--ds-font-size-2xl)">
      Spacing scale
    </h2>
    <p style="margin:0;color:var(--ds-color-fg-muted)">
      Every step is a multiple of 4px. The number in the token name is the step
      count on that 4px grid, so <code>--ds-space-3</code> is <strong>3 × 4px = 12px</strong>.
    </p>
  </header>
  <div
    role="table"
    style="display:grid;grid-template-columns:6rem 5rem 5rem 1fr;gap:var(--ds-space-2) var(--ds-space-3);align-items:center"
  >
    <strong role="columnheader">Token</strong>
    <strong role="columnheader">rem</strong>
    <strong role="columnheader">px</strong>
    <strong role="columnheader">Preview</strong>
    ${STEPS.map(
      (s) => html`
        <code role="cell" style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-sm)">
          space-${s.name}
        </code>
        <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted)">
          ${s.rem}
        </span>
        <span role="cell" style="font-variant-numeric:tabular-nums;color:var(--ds-color-fg-muted)">
          ${s.px}px
        </span>
        <span
          role="cell"
          aria-hidden="true"
          style="display:inline-block;background:var(--ds-color-accent);height:12px;width:var(${s.cssVar});min-width:1px;border-radius:2px"
        ></span>
          `
        )}
      </div>
    </section>
  `,
};

export const PaddingExamples: Story = {
  render: () => html`
<section
  style="display:grid;gap:var(--ds-space-4);font-family:var(--ds-font-body);color:var(--ds-color-fg)"
>
  <p style="margin:0;max-width:60ch;color:var(--ds-color-fg-muted)">
    Compare how common steps feel when used as padding. Pair <code>space-3</code> with
    <code>space-4</code> or <code>space-6</code> for dense/comfortable/spacious densities.
  </p>
  ${[2, 3, 4, 6, 8].map(
    (n) => html`
      <div
        style="display:flex;align-items:center;gap:var(--ds-space-4)"
      >
        <code style="width:6rem;font-family:var(--ds-font-mono)">space-${n}</code>
        <div
          style="border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-sm);background:var(--ds-color-bg-subtle);padding:var(--ds-space-${n})"
        >
          <div
            style="background:var(--ds-color-accent-subtle);border:1px dashed var(--ds-color-accent);padding:var(--ds-space-1) var(--ds-space-2);font-family:var(--ds-font-mono);font-size:var(--ds-font-size-sm)"
          >
            Content
          </div>
        </div>
      </div>
        `
      )}
    </section>
  `,
};
