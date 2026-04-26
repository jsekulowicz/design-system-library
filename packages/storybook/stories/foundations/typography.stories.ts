import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = {
  title: 'Foundations/Typography',
};

export default meta;

type Story = StoryObj;

export const Scale: Story = {
  render: () => html`
<div style="display:grid;gap:var(--ds-space-4);max-width:60ch">
  <h1
    style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-4xl);letter-spacing:var(--ds-letter-spacing-display);margin:0"
  >
    Editorial Modernist
  </h1>
  <h2
    style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-2xl);margin:0"
  >
    A studied restraint in display type.
  </h2>
  <p
    style="font-family:var(--ds-font-body);font-size:var(--ds-font-size-md);line-height:var(--ds-line-height-md);margin:0"
  >
    Body copy stays in General Sans — a clean, humanist sans that carries
    long-form reading without calling attention to itself. Display copy
    uses Fraunces, a variable serif tuned for optical size.
  </p>
  <pre
    style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-sm);background:color-mix(in oklab, var(--ds-color-fg) 6%, transparent);padding:var(--ds-space-3);border-radius:var(--ds-radius-sm);margin:0"
  >
const ship = () => "it";</pre
  >
</div>
  `,
};
