import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components';
import '@ds/components/page-shell/define';
import '@ds/components/link/define';
import '@ds/components/button/define';

const meta: Meta = {
  title: 'Templates/PageShell',
  component: 'ds-page-shell',
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

export const AppFrame: Story = {
  render: () => html`
    <div style="height:80vh">
      <ds-page-shell brand="Forma">
        <div slot="header-actions">
          <ds-button variant="secondary" size="sm">Invite</ds-button>
        </div>
        <nav slot="aside" style="display:grid;gap:var(--ds-space-2)">
          <ds-link href="#" variant="quiet">Overview</ds-link>
          <ds-link href="#" variant="quiet">Projects</ds-link>
          <ds-link href="#" variant="quiet">Billing</ds-link>
          <ds-link href="#" variant="quiet">Settings</ds-link>
        </nav>
        <article
          style="display:grid;gap:var(--ds-space-4);max-width:68ch"
        >
          <h1
            style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0"
          >
            Editorial grid
          </h1>
          <p>
            The shell collapses to a single column below 768px, stacks the
            aside into a disclosure, and keeps the header sticky with a
            hairline rule and backdrop blur on scroll.
          </p>
        </article>
        <span slot="footer">&copy; Forma 2026</span>
      </ds-page-shell>
    </div>
  `,
};
