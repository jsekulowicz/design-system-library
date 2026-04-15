import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/button/define';
import '@ds/components/card/define';
import '@ds/components/text-field/define';
import '@ds/components/badge/define';

const meta: Meta = {
  title: 'Foundations/Theming',
  argTypes: {
    accent: { control: { type: 'color' } },
    accentHover: { control: { type: 'color' } },
    radius: { control: { type: 'range', min: 0, max: 24, step: 1 } },
    hairline: { control: { type: 'color' } },
    displayFont: { control: { type: 'text' } },
  },
  args: {
    accent: '#E2341D',
    accentHover: '#C12613',
    radius: 4,
    hairline: 'rgba(11, 11, 12, 0.12)',
    displayFont: 'Fraunces, ui-serif, Georgia, serif',
  },
};

export default meta;
type Story = StoryObj;

export const LivePlayground: Story = {
  render: (args) => html`
    <div
      style="
        --ds-color-accent:${args.accent};
        --ds-color-accent-hover:${args.accentHover};
        --ds-radius-sm:${args.radius}px;
        --ds-radius-md:${args.radius * 2}px;
        --ds-color-border:${args.hairline};
        --ds-font-display:${args.displayFont};
        display:grid;gap:var(--ds-space-4);max-width:520px
      "
    >
      <ds-card elevation="sm">
        <ds-badge slot="eyebrow" tone="accent">Live</ds-badge>
        <span slot="title">Override the semantic layer</span>
        <p>
          Adjust accent, radius, and display font via tokens. Every ds-*
          component reads from the same semantic variables.
        </p>
        <div slot="actions">
          <ds-button variant="primary">Primary</ds-button>
          <ds-button variant="ghost">Ghost</ds-button>
        </div>
      </ds-card>
      <ds-text-field placeholder="Type to test focus ring"></ds-text-field>
    </div>
  `,
};
