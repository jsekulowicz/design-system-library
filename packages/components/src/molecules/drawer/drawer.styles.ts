import { css } from 'lit';

export const drawerStyles = css`
  /* Interpolatable colors so the scroll-driven keyframes can crossfade
     the gradient stops instead of jumping between values. */
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
    /* Slide in on open, slide out on close. allow-discrete lets the
       display/overlay properties (which can't normally transition)
       hold their open values for the duration. */
    transition:
      transform var(--ds-duration-slow) var(--ds-easing-standard),
      display var(--ds-duration-slow) allow-discrete,
      overlay var(--ds-duration-slow) allow-discrete;
  }
  /* Scope flex-column to the open state so the UA's display:none
     keeps the closed dialog out of layout. Same fix and rationale as
     ds-dialog — the flex column is needed for the body's height cap to
     propagate, but unscoped it makes the closed drawer render inline
     alongside its opener. */
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
    height: 100%;
    max-height: 100%;
    box-shadow: none;
    border-color: transparent;
    border-radius: 0;
    gap: var(--ds-space-3);
  }
  ds-card::part(body) {
    flex: 1;
    min-height: 0;
    overflow-x: clip;
    overflow-y: auto;
    /* Don't chain scroll up to the page when the body reaches its
       top/bottom boundary or has no overflow. Same rationale as
       ds-dialog — modal surfaces shouldn't let scroll leak through. */
    overscroll-behavior: contain;
    padding-inline: var(--ds-space-2);
    margin-inline: calc(var(--ds-space-2) * -1);
    /* Same scroll-driven fade trick as ds-dialog — see comments
       there. No padding-block buffer; the fades only kick in once
       there's actual scroll progress to drive them. */
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
    align-items: flex-start;
    justify-content: space-between;
    gap: var(--ds-space-3);
  }
  .title-text {
    margin: 0;
    flex: 1;
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
  .close-btn {
    margin-block-start: calc(var(--ds-space-3) * -1);
    margin-inline-end: calc(var(--ds-space-3) * -1);
  }
  .footer {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: var(--ds-space-2);
  }
`;
