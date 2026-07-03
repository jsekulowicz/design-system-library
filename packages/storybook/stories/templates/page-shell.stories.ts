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

const meta: Meta = {
  title: 'Templates/PageShell',
  component: 'ds-page-shell',
  parameters: {
    layout: 'fullscreen',
    // This template fills the viewport with its own header/aside/main/footer
    // grid, so docs render it in an iframe to give that layout an isolated
    // box to claim. Per-story `height` settings control that iframe.
    docs: { story: { inline: false } },
  },
};

export default meta;
type Story = StoryObj;

const FRAME_HEIGHT = 360;
const STORY_HEIGHT = `${FRAME_HEIGHT + 40}px`;
const FLUID_PAGE_SHELL_STYLE = 'min-height:0;height:100%;--ds-page-shell-max-width:none';
const CAPPED_PAGE_SHELL_STYLE = 'min-height:0;height:100%;--ds-page-shell-max-width:90rem';

type PageShellStoryOptions = {
  style?: string;
  asideToggle?: boolean;
  asideState?: 'visible' | 'compact' | 'hidden';
  asideEndToggle?: boolean;
  asideEndState?: 'visible' | 'hidden';
};

function pageShellStory(
  inner: ReturnType<typeof html>,
  options: PageShellStoryOptions = {},
) {
  const {
    style = FLUID_PAGE_SHELL_STYLE,
    asideToggle = false,
    asideState = 'visible',
    asideEndToggle = false,
    asideEndState = 'visible',
  } = options;
  return html`<div style="height:${FRAME_HEIGHT}px;overflow:hidden;border-bottom:1px solid var(--ds-color-border)">
    <ds-page-shell
      brand="Brand"
      style=${style}
      aside-state=${asideState}
      aside-end-state=${asideEndState}
      ?aside-toggle=${asideToggle}
      ?aside-end-toggle=${asideEndToggle}
    >
      ${inner}
    </ds-page-shell>
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
      <ds-page-shell brand="Brand" style=${FLUID_PAGE_SHELL_STYLE}>
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

export const ConstrainedWidth: Story = {
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () =>
    pageShellStory(
      html`
        <div slot="header-actions">
          <ds-button variant="secondary" size="sm">Export</ds-button>
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
        </ds-sidenav>
        <article style="display:grid;gap:var(--ds-space-4);max-width:68ch">
          <h1 style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0">
            Capped shell
          </h1>
          <p>
            This story opts into <code>--ds-page-shell-max-width: 90rem</code> to show the
            centred column cap. The default PageShell stories use the fluid <code>none</code>
            value.
          </p>
        </article>
      `,
      { style: CAPPED_PAGE_SHELL_STYLE },
    ),
};

export const CollapsedSidenav: Story = {
  name: 'Collapsed Sidenav',
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () =>
    pageShellStory(html`
      <div slot="header-actions">
        <ds-button variant="secondary" size="sm">Invite</ds-button>
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
          Collapsed navigation
        </h1>
        <p>
          Set <code>aside-toggle</code> on <code>ds-page-shell</code> to let users cycle the
          start aside between full, compact, and hidden states.
        </p>
      </article>
      <ds-footer slot="footer">
        <span slot="start">© 2026 Brand</span>
      </ds-footer>
    `, { asideToggle: true, asideState: 'compact' }),
};

export const CollapsibleAsides: Story = {
  name: 'Collapsible Asides',
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () =>
    pageShellStory(html`
      <ds-sidenav slot="aside">
        <ds-nav-item href="#" current>
          <ds-icon slot="icon" name="home" size="lg"></ds-icon>
          Overview
        </ds-nav-item>
        <ds-nav-item href="#">
          <ds-icon slot="icon" name="clock" size="lg"></ds-icon>
          Activity
        </ds-nav-item>
      </ds-sidenav>
      <article style="display:grid;gap:var(--ds-space-4);max-width:68ch">
        <h1 style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0">
          Two-sided shell
        </h1>
        <p>
          The start aside cycles through full, compact, and hidden states. The end aside toggles
          between visible and hidden while using the same border-aligned control treatment.
        </p>
      </article>
      <nav
        slot="aside-end"
        aria-label="On this page"
        style="width:14rem;padding:var(--ds-space-4);display:flex;flex-direction:column;gap:var(--ds-space-3)"
      >
        <strong>On this page</strong>
        <ds-link href="#overview" variant="quiet">Overview</ds-link>
        <ds-link href="#activity" variant="quiet">Activity</ds-link>
        <ds-link href="#settings" variant="quiet">Settings</ds-link>
      </nav>
    `, { asideToggle: true, asideEndToggle: true }),
};

export const OverflowingMain: Story = {
  name: 'Overflowing Main',
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () =>
    pageShellStory(html`
      <div slot="header-actions">
        <ds-button variant="primary" size="sm">Action</ds-button>
      </div>
      <ds-sidenav slot="aside">
        <ds-nav-item href="#" current>
          <ds-icon slot="icon" name="home" size="lg"></ds-icon>
          Overview
        </ds-nav-item>
        <ds-nav-item href="#">
          <ds-icon slot="icon" name="cog-6-tooth" size="lg"></ds-icon>
          Settings
        </ds-nav-item>
      </ds-sidenav>
      <article style="display:grid;gap:var(--ds-space-4);max-width:68ch">
        <h1 style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0">
          Overflowing main
        </h1>
        <p>
          When main has more content than fits, a thin vertical scrollbar appears at the
          inline-end. Because main reserves a scrollbar gutter on both inline edges
          (<code>scrollbar-gutter: stable both-edges</code>), the inline-start and inline-end
          visible empty bands stay equal in width whether or not the scrollbar is currently
          rendered — so the page doesn't shift horizontally when overflow toggles on or off.
        </p>
        ${Array.from(
          { length: 30 },
          (_, i) =>
            html`<p>
              Filler row ${i + 1}: lorem ipsum dolor sit amet, consectetur adipiscing elit.
            </p>`,
        )}
      </article>
      <ds-footer slot="footer">
        <span slot="start">© 2026 Brand</span>
      </ds-footer>
    `),
};

export const HeaderStatusAndMenuAtStart: Story = {
  name: 'Header status + menu at start',
  parameters: { docs: { story: { height: STORY_HEIGHT } } },
  render: () =>
    html`<div style="height:${FRAME_HEIGHT}px;overflow:hidden;border-bottom:1px solid var(--ds-color-border)">
      <ds-page-shell
        brand="Brand"
        style="${FLUID_PAGE_SHELL_STYLE};--ds-page-shell-menu-toggle-size:var(--ds-size-md)"
        mobile-menu-button-position="start"
      >
        <div slot="header-status" style="display:flex;align-items:center;gap:var(--ds-space-2);font-weight:var(--ds-font-weight-semibold)">
          <span>1200 XP</span>
          <span>·</span>
          <span>10 credits</span>
        </div>
        <div slot="header-actions" style="display:flex;align-items:center;gap:var(--ds-space-2)">
          <ds-button variant="ghost" square size="md" label="Notifications">
            <ds-icon slot="leading" name="clock" size="3xl"></ds-icon>
          </ds-button>
          <ds-button variant="ghost" square size="md" label="Account">
            <ds-icon slot="leading" name="cog-6-tooth" size="3xl"></ds-icon>
          </ds-button>
        </div>
        <ds-sidenav slot="aside">
          <ds-nav-item href="#" current>
            <ds-icon slot="icon" name="home" size="lg"></ds-icon>
            Overview
          </ds-nav-item>
        </ds-sidenav>
        <article style="display:grid;gap:var(--ds-space-4);max-width:68ch">
          <h1 style="font-family:var(--ds-font-display);font-size:var(--ds-font-size-3xl);margin:0">
            Header status
          </h1>
          <p>
            Indicator widgets go in the <code>header-status</code> slot and read apart from the
            action buttons. Narrow the frame to see the mobile menu toggle appear as a peer of
            the action buttons; <code>mobile-menu-button-position="start"</code> places it before
            them, and <code>--ds-page-shell-menu-toggle-size</code> sizes it to match.
          </p>
        </article>
      </ds-page-shell>
    </div>`,
};
