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
    width: calc(100% - var(--ds-space-4));
    max-height: min(90vh, 720px);
    border-radius: var(--ds-radius-sm);
    box-shadow: var(--ds-shadow-md);
    overflow: visible;
  }
  /* Scope to [open] so closed dialogs stay display:none per UA. */
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
  }
  ds-card {
    flex: 1;
    min-height: 0;
    min-width: 0;
  }
  ds-card::part(card) {
    /* Match the dialog's cap explicitly; percentage heights don't
       resolve reliably through ds-card's display:block host, so body
       scroll breaks when content overflows. */
    max-height: min(90vh, 720px);
    box-shadow: none;
    border-color: transparent;
    gap: var(--ds-space-3);
  }
  /* The scrolling body (ds-card::part(body)) + its scroll fade come from the
     shared cardBodyScrollFadeStyles. */
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
  /* Normalise slotted headings (h1-h6) so UA defaults don't compound
     with .title-text styles. */
  .title-text ::slotted(*) {
    font: inherit;
    margin: 0;
    letter-spacing: inherit;
  }
  /* Pull the close button toward the card's top-right corner; the
     card's own padding would otherwise indent it. */
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
