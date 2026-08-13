import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { joinStyles } from '../shared/styles';
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

const INLINE_LABEL = joinStyles(
  'margin:0',
  'display:inline-flex;align-items:center;gap:var(--ds-space-2)',
  'color:var(--ds-color-fg-muted)',
  'font-family:var(--ds-font-body)',
  'font-size:var(--ds-font-size-body-lg)',
);

const DEMO_LAYOUT = joinStyles(
  'display:grid;gap:var(--ds-space-3);max-width:32rem',
  'color:var(--ds-color-fg)',
  'font-family:var(--ds-font-body)',
  'font-size:var(--ds-font-size-body-lg)',
);

const SECTION_LAYOUT = DEMO_LAYOUT.replace('var(--ds-space-3)', 'var(--ds-space-2)');

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <div style=${DEMO_LAYOUT}>
      <p style="margin:0">Above the divider.</p>
      <ds-divider orientation=${args['orientation']}></ds-divider>
      <p style="margin:0">Below the divider.</p>
    </div>
  `,
};

export const SeparatingFormSections: Story = {
  render: () => html`
    <section style=${SECTION_LAYOUT}>
      <h3 style="margin:0;font-family:var(--ds-font-display);font-size:var(--ds-font-size-heading-sm)">Profile</h3>
      <p style="margin:0;color:var(--ds-color-fg-muted)">Name, email, avatar — visible to your team.</p>
      <ds-divider></ds-divider>
      <h3 style="margin:0;font-family:var(--ds-font-display);font-size:var(--ds-font-size-heading-sm)">Preferences</h3>
      <p style="margin:0;color:var(--ds-color-fg-muted)">Theme, notifications, keyboard shortcuts.</p>
    </section>
  `,
};

export const InlineWithText: Story = {
  render: () => html`
    <p style=${INLINE_LABEL}>
      <span>Edited just now</span>
      <ds-divider orientation="vertical"></ds-divider>
      <span>3 contributors</span>
      <ds-divider orientation="vertical"></ds-divider>
      <span>Public</span>
    </p>
  `,
};
