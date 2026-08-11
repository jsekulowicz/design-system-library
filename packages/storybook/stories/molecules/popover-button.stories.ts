import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/popover-button/define';
import '@jsekulowicz/ds-components/button/define';

const meta: Meta = {
  title: 'Molecules/PopoverButton',
  component: 'ds-popover-button',
  decorators: [(story) => html`<div style="padding: 4px 6px;">${story()}</div>`],
  parameters: { docs: { story: { height: '240px' } } },
  argTypes: {
    label: { control: 'text' },
    variant: { control: { type: 'inline-radio' }, options: ['primary', 'secondary', 'ghost'] },
    size: { control: { type: 'inline-radio' }, options: ['sm', 'md', 'lg'] },
    placement: {
      control: { type: 'inline-radio' },
      options: ['bottom-start', 'bottom-end', 'top-start', 'top-end'],
    },
    disabled: { control: 'boolean' },
  },
  args: {
    label: 'Preferences',
    variant: 'secondary',
    size: 'md',
    placement: 'bottom-start',
    disabled: false,
  },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-popover-button
      label=${args['label']}
      variant=${args['variant']}
      size=${args['size']}
      placement=${args['placement']}
      ?disabled=${args['disabled']}
    >
      <section
        aria-label="Display preferences"
        style="display:grid;gap:12px;width:240px;padding:16px;border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-md);background:var(--ds-color-bg);box-shadow:var(--ds-shadow-lg);"
      >
        <strong>Display preferences</strong>
        <label><input type="checkbox" /> Compact rows</label>
        <label><input type="checkbox" /> Show descriptions</label>
      </section>
    </ds-popover-button>
  `,
};

export const SlottedTrigger: Story = {
  render: () => html`
    <ds-popover-button placement="bottom-end">
      <ds-button slot="trigger" variant="ghost" aria-label="Notifications">Notifications</ds-button>
      <section
        aria-label="Notifications"
        style="width:280px;padding:16px;border:1px solid var(--ds-color-border);border-radius:var(--ds-radius-md);background:var(--ds-color-bg);box-shadow:var(--ds-shadow-lg);"
      >
        <strong>Notifications</strong>
        <p>Your crossword was approved.</p>
      </section>
    </ds-popover-button>
  `,
};
