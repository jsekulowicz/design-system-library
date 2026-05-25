import { css } from 'lit';

export const drawerStyles = css`
  /* @property registration so the scroll-driven keyframes can
     interpolate these as colors. */
  @property --ds-drawer-body-top-fade {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(0 0 0);
  }
  @property --ds-drawer-body-bottom-fade {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(0 0 0);
  }
  :host {
    display: contents;
  }
  dialog {
    padding: 0;
    border: 0;
    background: transparent;
    color: inherit;
    box-shadow: var(--ds-shadow-lg);
    overflow: visible;
    height: 100vh;
    height: 100dvh;
    max-height: 100%;
    /* allow-discrete lets display/overlay hold their open values for
       the slide-in / slide-out duration. */
    transition:
      transform var(--ds-duration-slow) var(--ds-easing-standard),
      display var(--ds-duration-slow) allow-discrete,
      overlay var(--ds-duration-slow) allow-discrete;
  }
  /* Scope to [open] so closed dialogs stay display:none per UA. */
  dialog[open] {
    display: flex;
    flex-direction: column;
  }
  :host([side='start']) dialog {
    margin: 0;
    margin-inline-end: auto;
    transform: translateX(-100%);
  }
  :host([side='end']) dialog {
    margin: 0;
    margin-inline-start: auto;
    transform: translateX(100%);
  }
  :host([side='start']) dialog[open],
  :host([side='end']) dialog[open] {
    transform: translateX(0);
  }
  @starting-style {
    :host([side='start']) dialog[open] {
      transform: translateX(-100%);
    }
    :host([side='end']) dialog[open] {
      transform: translateX(100%);
    }
  }
  :host([size='sm']) dialog {
    width: min(20rem, 90vw);
  }
  :host([size='md']) dialog {
    width: min(24rem, 90vw);
  }
  :host([size='lg']) dialog {
    width: min(28rem, 90vw);
  }
  dialog::backdrop {
    background: rgb(15 23 42 / 0.55);
  }
  ds-card {
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  ds-card::part(card) {
    /* Fill the dialog explicitly; percentage heights don't resolve
       reliably through ds-card's display:block host. */
    height: 100vh;
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    box-shadow: none;
    /* border: 0 not transparent — a 1px transparent border still fills
       with the card's own background (background-clip: border-box). */
    border: 0;
    border-radius: 0;
    gap: var(--ds-space-3);
    padding: var(--ds-drawer-card-padding, var(--ds-space-6));
  }
  ds-card::part(body) {
    flex: 1;
    min-height: 0;
    overflow-x: clip;
    overflow-y: auto;
    overscroll-behavior: contain;
    /* Inline padding + negative margin lets focus rings on full-width
       children paint outside the body's clip box. */
    padding-inline: var(--ds-space-2);
    margin-inline: calc(var(--ds-space-2) * -1);
    scrollbar-width: none;
    mask-image: linear-gradient(
      to bottom,
      var(--ds-drawer-body-top-fade, rgb(0 0 0)) 0,
      rgb(0 0 0) var(--ds-space-6),
      rgb(0 0 0) calc(100% - var(--ds-space-6)),
      var(--ds-drawer-body-bottom-fade, rgb(0 0 0)) 100%
    );
    animation: ds-drawer-body-scroll-fade linear;
    animation-timeline: scroll(self);
  }
  ds-card::part(body)::-webkit-scrollbar {
    display: none;
  }
  @keyframes ds-drawer-body-scroll-fade {
    0% {
      --ds-drawer-body-top-fade: rgb(0 0 0);
      --ds-drawer-body-bottom-fade: rgb(0 0 0 / 0);
    }
    0.001%, 99.999% {
      --ds-drawer-body-top-fade: rgb(0 0 0 / 0);
      --ds-drawer-body-bottom-fade: rgb(0 0 0 / 0);
    }
    100% {
      --ds-drawer-body-top-fade: rgb(0 0 0 / 0);
      --ds-drawer-body-bottom-fade: rgb(0 0 0);
    }
  }
  .title-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    background: var(--ds-drawer-title-bg, transparent);
    color: var(--ds-drawer-title-fg, inherit);
    border-bottom: 1px solid var(--ds-drawer-title-border-color, transparent);
    padding: var(--ds-drawer-title-padding, 0);
    min-height: var(--ds-drawer-title-min-height, auto);
  }
  .title-text {
    margin: 0;
    flex: 1;
    /* Flex-centre the slotted content; otherwise the h2's line-height
       inflates the title-row height and content sits at the baseline. */
    display: flex;
    align-items: center;
    line-height: 1;
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-xl);
    font-weight: var(--ds-font-weight-semibold);
    letter-spacing: var(--ds-letter-spacing-display);
  }
  .title-text ::slotted(*) {
    font: inherit;
    margin: 0;
    letter-spacing: inherit;
  }
  .close-btn::part(button) {
    color: var(--ds-drawer-title-fg, inherit);
  }
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--ds-space-2);
  }
`;
