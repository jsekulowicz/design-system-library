import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';

const meta: Meta = { title: 'Foundations/Color' };

export default meta;

type Story = StoryObj;

const swatches = [
  { name: '--ds-color-bg', role: 'Paper' },
  { name: '--ds-color-bg-subtle', role: 'Paper subtle' },
  { name: '--ds-color-fg', role: 'Ink' },
  { name: '--ds-color-fg-muted', role: 'Ink muted' },
  { name: '--ds-color-accent', role: 'Vermilion' },
  { name: '--ds-color-accent-hover', role: 'Vermilion hover' },
  { name: '--ds-color-border', role: 'Hairline' },
  { name: '--ds-color-success', role: 'Success' },
  { name: '--ds-color-warning', role: 'Warning' },
  { name: '--ds-color-danger', role: 'Danger' },
];

export const Semantic: Story = {
  render: () => html`
    <div
      style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:var(--ds-space-3)"
    >
      ${swatches.map(
        (s) => html`
          <figure
            style="margin:0;border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-sm);overflow:hidden;background:var(--ds-color-bg-subtle)"
          >
            <div
              style="height:80px;background:var(${s.name})"
              aria-hidden="true"
            ></div>
            <figcaption
              style="padding:var(--ds-space-3);display:grid;gap:2px"
            >
              <strong style="font-family:var(--ds-font-body)">${s.role}</strong>
              <code style="font-family:var(--ds-font-mono);font-size:var(--ds-font-size-xs)"
                >${s.name}</code
              >
            </figcaption>
          </figure>
        `
      )}
    </div>
  `,
};
