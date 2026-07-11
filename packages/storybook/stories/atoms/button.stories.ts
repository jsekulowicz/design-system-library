import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/magnifying-glass';

const meta: Meta = {
  title: 'Atoms/Button',
  component: 'ds-button',
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['primary', 'secondary', 'ghost'],
    },
    color: {
      control: { type: 'inline-radio' },
      options: ['accent', 'success', 'danger'],
    },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    type: {
      control: { type: 'inline-radio' },
      options: ['button', 'submit', 'reset'],
    },
    disabled: { control: 'boolean' },
    loading: { control: 'boolean' },
    fullWidth: { control: 'boolean' },
    square: { control: 'boolean' },
  },
  args: {
    variant: 'primary',
    color: 'accent',
    size: 'md',
    type: 'button',
    disabled: false,
    loading: false,
    fullWidth: false,
    square: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
<ds-button
  variant=${args['variant']}
  color=${args['color']}
  size=${args['size']}
  type=${args['type']}
  ?disabled=${args['disabled']}
  ?loading=${args['loading']}
  ?full-width=${args['fullWidth']}
  ?square=${args['square']}
  >Ship it</ds-button
>
  `,
};

export const Variants: Story = {
  render: () => html`
<div style="display:flex;gap:var(--ds-space-3);flex-wrap:wrap">
  <ds-button variant="primary">Primary</ds-button>
  <ds-button variant="secondary">Secondary</ds-button>
  <ds-button variant="ghost">Ghost</ds-button>
</div>
  `,
};

export const Colors: Story = {
  render: () => html`
<div style="display:grid;grid-template-columns:repeat(3,max-content);gap:var(--ds-space-3)">
  <ds-button variant="primary" color="accent">Accent</ds-button>
  <ds-button variant="secondary" color="accent">Accent</ds-button>
  <ds-button variant="ghost" color="accent">Accent</ds-button>
  <ds-button variant="primary" color="success">Success</ds-button>
  <ds-button variant="secondary" color="success">Success</ds-button>
  <ds-button variant="ghost" color="success">Success</ds-button>
  <ds-button variant="primary" color="danger">Danger</ds-button>
  <ds-button variant="secondary" color="danger">Danger</ds-button>
  <ds-button variant="ghost" color="danger">Danger</ds-button>
</div>
  `,
};

export const Sizes: Story = {
  render: () => html`
<div style="display:flex;gap:var(--ds-space-3);align-items:center">
  <ds-button size="sm">Small</ds-button>
  <ds-button size="md">Medium</ds-button>
  <ds-button size="lg">Large</ds-button>
</div>
  `,
};

export const Square: Story = {
  render: () => html`
<div style="display:flex;gap:var(--ds-space-3);align-items:center">
  <ds-button square size="sm" variant="ghost" label="Search">
    <ds-icon slot="leading" name="magnifying-glass" size="sm"></ds-icon>
  </ds-button>
  <ds-button square variant="secondary" label="Search">
    <ds-icon slot="leading" name="magnifying-glass" size="sm"></ds-icon>
  </ds-button>
  <ds-button square size="lg" label="Search">
    <ds-icon slot="leading" name="magnifying-glass"></ds-icon>
  </ds-button>
</div>
  `,
};

export const Loading: Story = {
  args: { loading: true },
  render: (args) => html`
<ds-button ?loading=${args['loading']}>Saving…</ds-button>
  `,
};

export const Disabled: Story = {
  args: { disabled: true },
  render: (args) => html`
<ds-button ?disabled=${args['disabled']}>Unavailable</ds-button>
  `,
};
