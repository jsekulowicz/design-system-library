import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/list/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/check';
import '@jsekulowicz/ds-components/icon/chevron-right';
import '@jsekulowicz/ds-components/badge/define';

const meta: Meta = {
  title: 'Atoms/List',
  component: 'ds-list',
  argTypes: {
    variant: {
      control: { type: 'inline-radio' },
      options: ['plain', 'bordered'],
    },
  },
  args: { variant: 'bordered' },
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <ds-list variant=${args['variant']} style="max-width:32rem">
      <ds-list-item>
        <span slot="leading"><ds-icon name="check" size="md"></ds-icon></span>
        Verify your email address
        <ds-badge slot="trailing" tone="success">Done</ds-badge>
      </ds-list-item>
      <ds-list-item>
        <span slot="leading"><ds-icon name="check" size="md"></ds-icon></span>
        Add a profile photo
        <ds-badge slot="trailing" tone="warning">Pending</ds-badge>
      </ds-list-item>
      <ds-list-item>
        <span slot="leading"><ds-icon name="check" size="md"></ds-icon></span>
        Invite a teammate
        <ds-badge slot="trailing" tone="neutral">Optional</ds-badge>
      </ds-list-item>
    </ds-list>
  `,
};

export const Plain: Story = {
  render: () => html`
    <ds-list variant="plain" style="max-width:32rem">
      <ds-list-item>First item</ds-list-item>
      <ds-list-item>Second item</ds-list-item>
      <ds-list-item>Third item</ds-list-item>
    </ds-list>
  `,
};

export const NavigationLinks: Story = {
  render: () => html`
    <ds-list style="max-width:32rem">
      <ds-list-item>
        <strong>Overview</strong>
        <ds-icon slot="trailing" name="chevron-right" size="md"></ds-icon>
      </ds-list-item>
      <ds-list-item>
        <strong>Activity</strong>
        <ds-icon slot="trailing" name="chevron-right" size="md"></ds-icon>
      </ds-list-item>
      <ds-list-item>
        <strong>Settings</strong>
        <ds-icon slot="trailing" name="chevron-right" size="md"></ds-icon>
      </ds-list-item>
    </ds-list>
  `,
};
