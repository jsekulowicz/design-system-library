import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/button/define';
import '@ds/components/card/define';
import '@ds/components/text-field/define';
import '@ds/components/badge/define';

const meta: Meta = {
  title: 'Foundations/Theming',
  tags: ['!dev'],
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
    displayFont: 'Fraunces, ui-serif, Georgia, serif',
  },
};

export default meta;
type Story = StoryObj;

function componentShowcase(vars: string): ReturnType<typeof html> {
  return html`
<div style="${vars};display:grid;gap:var(--ds-space-4);max-width:480px">
  <ds-card elevation="sm">
    <ds-badge slot="eyebrow" tone="accent">Themed</ds-badge>
    <span slot="title">Override the semantic layer</span>
    <p>Every <code>ds-*</code> component reads from the same semantic CSS custom properties. Change the tokens, every component updates.</p>
    <div slot="actions">
      <ds-button variant="primary">Primary</ds-button>
      <ds-button variant="ghost">Ghost</ds-button>
    </div>
  </ds-card>
  <ds-text-field placeholder="Type to test focus ring"></ds-text-field>
</div>`;
}

export const LivePlayground: Story = {
  render: (args) => componentShowcase(`
    --ds-color-accent:${args['accent']};
    --ds-color-accent-hover:${args['accentHover']};
    --ds-radius-sm:${args['radius']}px;
    --ds-radius-md:${args['radius'] * 2}px;
    --ds-color-border:${args['hairline']};
    --ds-font-display:${args['displayFont']}`),
};

export const BrandPresets: Story = {
  render: () => html`
<section style="display:grid;gap:var(--ds-space-6);font-family:var(--ds-font-body);color:var(--ds-color-fg)">
  <p style="margin:0;color:var(--ds-color-fg-muted);max-width:56ch">
    Three example brand configurations. Each overrides only the tokens that differ from the base theme — no component code changes.
  </p>
  <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:var(--ds-space-5)">
    <div>
      <p style="margin:0 0 var(--ds-space-3);font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Cobalt (default)</p>
      ${componentShowcase('')}
    </div>
    <div>
      <p style="margin:0 0 var(--ds-space-3);font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Vermilion</p>
      ${componentShowcase(`
        --ds-color-accent:#E2341D;
        --ds-color-accent-hover:#C12613;
        --ds-color-accent-active:#9A1B0C;
        --ds-color-accent-subtle:rgba(226,52,29,0.1)`)}
    </div>
    <div>
      <p style="margin:0 0 var(--ds-space-3);font-size:var(--ds-font-size-xs);font-weight:var(--ds-font-weight-semibold);text-transform:uppercase;letter-spacing:var(--ds-letter-spacing-wide);color:var(--ds-color-fg-muted)">Rounded Teal</p>
      ${componentShowcase(`
        --ds-color-accent:#1F7A7A;
        --ds-color-accent-hover:#166666;
        --ds-color-accent-active:#0D5252;
        --ds-color-accent-subtle:rgba(31,122,122,0.1);
        --ds-radius-sm:8px;
        --ds-radius-md:16px;
        --ds-radius-lg:24px`)}
    </div>
  </div>
</section>`,
};
