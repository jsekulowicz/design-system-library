import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/card/define';
import '@ds/components/button/define';
import '@ds/components/badge/define';

const meta: Meta = {
  title: 'Molecules/Card',
  component: 'ds-card',
  tags: ['!dev'],
  argTypes: {
    elevation: { control: { type: 'inline-radio' }, options: ['none', 'sm', 'md'] },
    orientation: { control: { type: 'inline-radio' }, options: ['vertical', 'horizontal'] },
    interactive: { control: 'boolean' },
  },
  args: { elevation: 'sm', orientation: 'vertical', interactive: false },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<div style="max-width:560px">
  <ds-card
    elevation=${args['elevation']}
    orientation=${args['orientation']}
    ?interactive=${args['interactive']}
  >
    <ds-badge slot="eyebrow" tone="accent">Featured</ds-badge>
    <span slot="title">Quiet confidence</span>
    <p>
      A restrained, typography-forward interface that trusts the reader
      and leaves the shouting to the content.
    </p>
    <div slot="actions">
      <ds-button variant="secondary" size="sm">Preview</ds-button>
      <ds-button variant="primary" size="sm">Open</ds-button>
    </div>
  </ds-card>
</div>
  `,
};

export const Horizontal: Story = {
  render: () => html`
<div style="max-width:640px">
  <ds-card orientation="horizontal" elevation="md">
    <span slot="title">Release 0.1</span>
    <p>Atoms, molecules, and the first composition layer shipped.</p>
    <div slot="actions">
      <ds-button variant="ghost" size="sm">Changelog</ds-button>
    </div>
  </ds-card>
</div>
  `,
};
