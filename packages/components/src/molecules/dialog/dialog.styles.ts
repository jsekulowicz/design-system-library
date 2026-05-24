import { css } from 'lit';

export const dialogStyles = css`
  /* Interpolatable colors so the scroll-driven keyframes can crossfade
     the gradient stops instead of jumping between values. */
  @property --ds-dialog-body-top-fade {
    syntax: '<color>';
    inherits: false;
    initial-value: rgb(0 0 0);
  }
  @property --ds-dialog-body-bottom-fade {
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
    width: 100%;
    max-height: min(90vh, 720px);
    border-radius: var(--ds-radius-sm);
    box-shadow: var(--ds-shadow-md);
    overflow: visible;
  }
  /* Scope flex-column to the open state so the UA's display:none
     keeps the closed dialog out of layout. Without this scope, our
     display:flex wins unconditionally and the closed dialog renders
     inline alongside its opener. The flex column itself is needed so
     ds-card resolves a definite height from the dialog's max-height
     cap (percentages only resolve against an explicit parent height,
     not max-height) — otherwise the body never gets a height to
     scroll against on short viewports. */
  dialog[open] {
    display: flex;
    flex-direction: column;
  }
  :host([size='sm']) dialog {
    max-width: 400px;
  }
  :host([size='md']) dialog {
    max-width: 560px;
  }
  :host([size='lg']) dialog {
    max-width: 800px;
  }
  dialog::backdrop {
    background: rgb(15 23 42 / 0.55);
    backdrop-filter: blur(2px);
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
    gap: var(--ds-space-3);
  }
  ds-card::part(body) {
    flex: 1;
    min-height: 0;
    overflow-x: clip;
    overflow-y: auto;
    /* Don't chain scroll up to the page when the body reaches its
       top/bottom boundary or has no overflow. The dialog/drawer is
       modal — the page behind it shouldn't twitch when the user
       wheel-scrolls inside the modal. */
    overscroll-behavior: contain;
    padding-inline: var(--ds-space-2);
    margin-inline: calc(var(--ds-space-2) * -1);
    /* Hide the native scrollbar. Overflow is indicated by a fade mask
       at the top and bottom of the scrollport, driven by an actual
       scroll-progress timeline so the fades only appear when there's
       content to scroll into / out of view. No padding-block buffer
       is needed — the top fade stays opaque (no fade) at scroll-top
       and only switches to transparent (fade visible) once the user
       has scrolled even one pixel; mirror for the bottom. */
    scrollbar-width: none;
    mask-image: linear-gradient(
      to bottom,
      var(--ds-dialog-body-top-fade, rgb(0 0 0)) 0,
      rgb(0 0 0) var(--ds-space-6),
      rgb(0 0 0) calc(100% - var(--ds-space-6)),
      var(--ds-dialog-body-bottom-fade, rgb(0 0 0)) 100%
    );
    animation: ds-dialog-body-scroll-fade linear;
    animation-timeline: scroll(self);
  }
  ds-card::part(body)::-webkit-scrollbar {
    display: none;
  }
  @keyframes ds-dialog-body-scroll-fade {
    /* At scroll-top: keep the top stop opaque (no fade above), reveal
       the bottom fade so the user knows there's more below. The two
       near-instant transitions at 0.001% and 99.999% flip each stop
       on / off as soon as scroll actually progresses, so the fades
       are binary (present / absent), not interpolated as the user
       drags through the range. */
    0% {
      --ds-dialog-body-top-fade: rgb(0 0 0);
      --ds-dialog-body-bottom-fade: rgb(0 0 0 / 0);
    }
    0.001%, 99.999% {
      --ds-dialog-body-top-fade: rgb(0 0 0 / 0);
      --ds-dialog-body-bottom-fade: rgb(0 0 0 / 0);
    }
    100% {
      --ds-dialog-body-top-fade: rgb(0 0 0 / 0);
      --ds-dialog-body-bottom-fade: rgb(0 0 0);
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
  /* Slotted heading tags (h1-h6, etc.) carry UA defaults that
     compound on top of .title-text — a bigger font-size and large
     vertical margins. Normalise them so 'Foo', '<h2 slot="title">Foo</h2>'
     and '<span slot="title">Foo</span>' all render identically. */
  .title-text ::slotted(*) {
    font: inherit;
    margin: 0;
    letter-spacing: inherit;
  }
  /* Pull the close button up and to the right so it sits near the
     card's top-right corner instead of indented by ds-card's full
     ds-space-6 padding. Its own visual chrome (size, hover, focus
     ring, square shape) comes from ds-button. */
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
