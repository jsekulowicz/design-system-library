import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/top-bar/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/bars-3';
import '@jsekulowicz/ds-components/icon/user-circle';

const meta: Meta = {
  title: 'Organisms/TopBar',
  component: 'ds-top-bar',
  parameters: {
    layout: 'fullscreen',
    docs: {
      // The top bar styles itself against a full-width viewport; keep iframe
      // rendering so each example has an isolated box of the declared height.
      story: { inline: false, height: '128px' },
    },
  },
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <ds-top-bar>
      <strong slot="brand">Brand</strong>
      <ds-button slot="actions" variant="secondary" size="sm">Sign in</ds-button>
    </ds-top-bar>
  `,
};

export const BrandWithPageName: Story = {
  render: () => html`
    <ds-top-bar>
      <span slot="brand">
        <strong>Brand</strong>
        <span style="color:var(--ds-color-fg-muted);margin-inline-start:var(--ds-space-2)">
          Settings
        </span>
      </span>
      <ds-button slot="actions" variant="ghost" size="sm" square label="Menu" aria-label="Menu">
        <ds-icon slot="leading" name="bars-3" size="xl"></ds-icon>
      </ds-button>
    </ds-top-bar>
  `,
};

export const WithProfileMenu: Story = {
  render: () => html`
    <ds-top-bar>
      <strong slot="brand">Brand</strong>
      <ds-button slot="actions" variant="ghost" size="sm" square label="Menu" aria-label="Menu">
        <ds-icon slot="leading" name="bars-3" size="xl"></ds-icon>
      </ds-button>
      <ds-button slot="actions" variant="ghost" size="sm" square label="Account" aria-label="Account">
        <ds-icon slot="leading" name="user-circle" size="xl"></ds-icon>
      </ds-button>
    </ds-top-bar>
  `,
};
