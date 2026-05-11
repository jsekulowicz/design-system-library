import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import '@jsekulowicz/ds-components/page-shell/define';
import '@jsekulowicz/ds-components/link/define';
import '@jsekulowicz/ds-components/button/define';
import '@jsekulowicz/ds-components/nav-item/define';
import '@jsekulowicz/ds-components/sidenav/define';
import '@jsekulowicz/ds-components/footer/define';
import '@jsekulowicz/ds-components/icon/define';
import '@jsekulowicz/ds-components/icon/home';
import '@jsekulowicz/ds-components/icon/cog-6-tooth';
import '@jsekulowicz/ds-components/icon/clock';
import '@jsekulowicz/ds-components/icon/chevron-right';

const meta: Meta = {
  title: 'Templates/PageShell',
  component: 'ds-page-shell',
  parameters: { layout: 'fullscreen' },
};

export default meta;
type Story = StoryObj;

const FRAME_HEIGHT = 360;
const STORY_HEIGHT = `${FRAME_HEIGHT + 40}px`;

function pageShellStory(inner: ReturnType<typeof html>) {
  return html`<div style="height:${FRAME_HEIGHT}px;overflow:hidden;border-bottom:1px solid var(--ds-color-border)">
    <ds-page-shell brand="Brand" style="min-height:0;height:100%"> ${inner} </ds-page-shell>
  </div>`;
}

export const WithSidenav: Story = {
  name: 'With Sidenav',
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () =>
    pageShellStory(html`
      <div slot="header-actions">
        <ds-button variant="primary" size="sm">New project</ds-button>
      </div>
      <ds-sidenav slot="aside">
        <ds-nav-item href="#" current>
          <ds-icon slot="icon" name="home" size="lg"></ds-icon>
          Overview
        </ds-nav-item>
        <ds-nav-item href="#">
          <ds-icon slot="icon" name="clock" size="lg"></ds-icon>
          Activity
        </ds-nav-item>
        <ds-nav-item href="#">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          Settings
        </ds-nav-item>
      </ds-sidenav>
      <article style="display:grid;gap:var(--ds-space-4);max-width:68ch">
        <h1 style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0">
          Overview
        </h1>
        <p>
          Compose <code>ds-sidenav</code> + <code>ds-nav-item</code> in the <code>aside</code> slot
          and <code>ds-footer</code> in the <code>footer</code> slot for a complete application
          frame.
        </p>
      </article>
      <ds-footer slot="footer">
        <span slot="start">© 2026 Brand</span>
        <ds-link slot="end" href="#" variant="quiet">Privacy</ds-link>
      </ds-footer>
    `),
};

export const NoAside: Story = {
  name: 'No Aside',
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () =>
    html`<div
      style="height:${FRAME_HEIGHT}px;overflow:hidden;border-bottom:1px solid var(--ds-color-border)"
    >
      <ds-page-shell brand="Brand" style="min-height:0;height:100%">
        <div slot="header-actions">
          <ds-button variant="primary" size="sm">New session</ds-button>
        </div>
        <article style="display:grid;gap:var(--ds-space-4);max-width:68ch">
          <h1 style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0">
            Single-section app
          </h1>
          <p>
            Leave the <code>aside</code> slot empty and the page shell auto-collapses to a single
            column on every viewport — the hamburger toggle, drawer, and aside region don't render.
            Useful for focused, single-purpose tools that don't need a global
            <code>ds-sidenav</code>.
          </p>
        </article>
      </ds-page-shell>
    </div>`,
};

export const CollapsedSidenav: Story = {
  name: 'Collapsed Sidenav',
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () =>
    pageShellStory(html`
      <div slot="header-actions">
        <ds-button variant="secondary" size="sm">Invite</ds-button>
      </div>
      <style>
        .collapse-toggle {
          display: block;
          width: calc(100% + 2 * var(--ds-space-3));
          margin-inline: calc(-1 * var(--ds-space-3));
        }
        .collapse-toggle::part(button) {
          width: 100%;
          justify-content: flex-start;
          padding: var(--ds-space-2) var(--ds-space-3);
        }
        .collapse-toggle ds-icon {
          transition: transform var(--ds-duration-slow) var(--ds-easing-standard);
        }
        ds-sidenav:not([collapsed]) .collapse-toggle ds-icon { transform: rotate(180deg); }
        ds-sidenav[collapsed] .collapse-toggle::part(button) {
          width: var(--ds-sidenav-item-compact-size);
          min-width: var(--ds-sidenav-item-compact-size);
          justify-content: center;
          padding: var(--ds-space-2);
        }
        ds-sidenav[collapsed] .collapse-toggle-label { display: none; }
        @media (max-width: 768px) {
          .collapse-toggle { display: none; }
        }
        ds-page-shell[mobile-layout] .collapse-toggle { display: none; }
      </style>
      <ds-sidenav slot="aside" collapsed>
        <ds-button
          class="collapse-toggle"
          slot="header"
          variant="ghost"
          aria-label="Toggle navigation"
          @click=${(e: Event) => {
            const sidenav = (e.currentTarget as HTMLElement).closest('ds-sidenav');
            sidenav?.toggleAttribute('collapsed');
          }}
        >
          <ds-icon slot="leading" name="chevron-right" size="sm"></ds-icon>
          <span class="collapse-toggle-label">Collapse</span>
        </ds-button>
        <ds-nav-item href="#" current>
          <ds-icon slot="icon" name="home" size="lg"></ds-icon>
          Overview
        </ds-nav-item>
        <ds-nav-item href="#">
          <ds-icon slot="icon" name="clock" size="lg"></ds-icon>
          Activity
        </ds-nav-item>
        <ds-nav-item href="#">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          Settings
        </ds-nav-item>
      </ds-sidenav>
      <article style="display:grid;gap:var(--ds-space-4);max-width:68ch">
        <h1 style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0">
          Collapsed navigation
        </h1>
        <p>
          Set <code>collapsed</code> on <code>ds-sidenav</code> to hide labels and show icons only.
          The aside column shrinks from <code>14–18rem</code> to <code>4rem</code>.
        </p>
      </article>
      <ds-footer slot="footer">
        <span slot="start">© 2026 Brand</span>
      </ds-footer>
    `),
};
