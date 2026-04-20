import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/link/define';

const meta: Meta = {
  title: 'Atoms/Link',
  component: 'ds-link',
  tags: ['!dev'],
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['inline', 'quiet', 'standalone'],
    },
    external: { control: 'boolean' },
  },
  args: { variant: 'inline', href: '#', external: false },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <p>
      The editorial grid is defined in
      <ds-link
        href=${args['href']}
        variant=${args['variant']}
        ?external=${args['external']}
        >the foundations chapter</ds-link
      >.
    </p>
  `,
};

export const Variants: Story = {
  render: () => html`
    <div style="display:grid;gap:var(--ds-space-2)">
      <p>A paragraph with an <ds-link href="#">inline link</ds-link>.</p>
      <ds-link href="#" variant="quiet">Quiet link</ds-link>
      <ds-link href="#" variant="standalone" external>Standalone external</ds-link>
    </div>
  `,
};
