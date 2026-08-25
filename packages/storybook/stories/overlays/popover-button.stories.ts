import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/popover-button/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/checkbox/define';
import '@jsekulowicz/ds-components/checkbox-group/define';
import { joinStyles } from '../shared/styles';

const PANEL_SURFACE = joinStyles(
  'padding:16px',
  'border:1px solid var(--ds-color-border)',
  'border-radius:var(--ds-radius-xs)',
  'background:var(--ds-color-bg)',
  'box-shadow:var(--ds-shadow-lg)',
);
const PREFERENCES_PANEL = joinStyles('display:grid', 'gap:12px', 'width:240px', PANEL_SURFACE);
const NOTIFICATIONS_PANEL = joinStyles('width:280px', PANEL_SURFACE);

const meta: Meta = {
  title: 'Overlays/PopoverButton',
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
      <div style=${PREFERENCES_PANEL}>
        <ds-checkbox-group label="Display preferences" name="display-preferences">
          <ds-checkbox checkboxvalue="compact-rows">Compact rows</ds-checkbox>
          <ds-checkbox checkboxvalue="show-descriptions" checked>Show descriptions</ds-checkbox>
        </ds-checkbox-group>
      </div>
    </ds-popover-button>
  `,
};

export const SlottedTrigger: Story = {
  render: () => html`
    <ds-popover-button placement="bottom-end">
      <ds-button slot="trigger" variant="ghost" aria-label="Notifications">Notifications</ds-button>
      <section aria-label="Notifications" style=${NOTIFICATIONS_PANEL}>
        <strong>Notifications</strong>
        <p>Your request was approved.</p>
      </section>
    </ds-popover-button>
  `,
};
