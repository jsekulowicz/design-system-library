import { css } from 'lit';

export const dialogStyles = css`
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
    padding-inline: var(--ds-space-2);
    padding-block: var(--ds-space-7);
    margin-inline: calc(var(--ds-space-2) * -1);
    /* Hide the native scrollbar and indicate overflow with a soft top
       / bottom fade. The mask is always applied; the padding-block
       above keeps content out of the fade zone when nothing overflows,
       so edges look sharp at rest. When content scrolls past the
       padding buffer it fades into transparency, signalling that
       there's more above or below. Fade height tracks padding-block
       so the gradient covers the full buffer (~one line of text). */
    scrollbar-width: none;
    mask-image: linear-gradient(
      to bottom,
      transparent 0,
      black var(--ds-space-7),
      black calc(100% - var(--ds-space-7)),
      transparent 100%
    );
  }
  ds-card::part(body)::-webkit-scrollbar {
    display: none;
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
