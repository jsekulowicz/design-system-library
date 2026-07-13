import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/divider/define';

const meta: Meta = {
  title: 'Atoms/Divider',
  component: 'ds-divider',
  argTypes: {
    orientation: {
      control: { type: 'inline-radio' },
      options: ['horizontal', 'vertical'],
    },
  },
  args: { orientation: 'horizontal' },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <div style="display:grid;gap:var(--ds-space-3);max-width:32rem;color:var(--ds-color-fg)">
      <p style="margin:0">Above the divider.</p>
      <ds-divider orientation=${args['orientation']}></ds-divider>
      <p style="margin:0">Below the divider.</p>
    </div>
  `,
};

export const SeparatingFormSections: Story = {
  render: () => html`
    <section style="display:grid;gap:var(--ds-space-2);max-width:32rem;color:var(--ds-color-fg)">
      <h3 style="margin:0;font-family:var(--ds-font-display);font-size:var(--ds-font-size-body-lg)">Profile</h3>
      <p style="margin:0;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-body-md)">
        Name, email, avatar — visible to your team.
      </p>
      <ds-divider></ds-divider>
      <h3 style="margin:0;font-family:var(--ds-font-display);font-size:var(--ds-font-size-body-lg)">Preferences</h3>
      <p style="margin:0;color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-body-md)">
        Theme, notifications, keyboard shortcuts.
      </p>
    </section>
  `,
};

export const InlineWithText: Story = {
  render: () => html`
    <p style="margin:0;display:inline-flex;align-items:center;gap:var(--ds-space-2);color:var(--ds-color-fg-muted);font-size:var(--ds-font-size-body-md)">
      <span>Edited just now</span>
      <ds-divider orientation="vertical"></ds-divider>
      <span>3 contributors</span>
      <ds-divider orientation="vertical"></ds-divider>
      <span>Public</span>
    </p>
  `,
};
