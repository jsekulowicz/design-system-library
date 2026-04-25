import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/footer/define';
import '@ds/components/link/define';

const meta: Meta = {
  title: 'Organisms/Footer',
  component: 'ds-footer',
  tags: ['!dev'],
};

export default meta;
type Story = StoryObj;

export const Basic: Story = {
  render: () => html`
    <ds-footer>
      <span slot="start">© 2026 Jan Sekułowicz</span>
    </ds-footer>
  `,
};

export const WithLinks: Story = {
  render: () => html`
    <ds-footer>
      <span slot="start">© 2026 Jan Sekułowicz</span>
      <span slot="end" style="display:flex;gap:var(--ds-space-3)">
        <ds-link href="/about" variant="quiet">About</ds-link>
        <ds-link href="/changelog" variant="quiet">Changelog</ds-link>
        <ds-link href="https://github.com" variant="quiet" external>GitHub</ds-link>
      </span>
    </ds-footer>
  `,
};

export const CustomLayout: Story = {
  render: () => html`
    <ds-footer>
      <div slot="start" style="display:flex;flex-direction:column;gap:var(--ds-space-1)">
        <strong>Forma Studio</strong>
        <span>Editorial systems for thoughtful teams.</span>
      </div>
      <div slot="end" style="display:flex;gap:var(--ds-space-4);text-align:right">
        <span>v0.1.0</span>
        <ds-link href="/privacy" variant="quiet">Privacy</ds-link>
      </div>
    </ds-footer>
  `,
};
