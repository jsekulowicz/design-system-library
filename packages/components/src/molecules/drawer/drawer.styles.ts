import { css } from 'lit';

export const drawerStyles = css`
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
    /* Flex column so ds-card resolves a definite height from the
       drawer's height cap, same fix as ds-dialog. */
    display: flex;
    flex-direction: column;
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
    border-radius: 0;
    gap: var(--ds-space-3);
  }
  ds-card::part(body) {
    flex: 1;
    min-height: 0;
    overflow-x: clip;
    overflow-y: auto;
    padding-inline: var(--ds-space-2);
    margin-inline: calc(var(--ds-space-2) * -1);
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
