import { css } from 'lit';

export const selectOptionStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    /* A floor, not the row height - the listbox measures a row rather than assume it. */
    min-height: 36px;
    box-sizing: border-box;
    padding: var(--ds-space-2) var(--ds-space-3);
    cursor: pointer;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    color: var(--ds-color-fg);
  }
  :host(:hover),
  :host([active]) {
    background: var(--ds-color-bg-subtle);
  }
  :host([selected]) {
    background: var(--ds-color-accent-subtle);
  }
  :host([selected][active]),
  :host([selected]:hover) {
    background: var(--ds-color-bg-subtle);
  }
  :host([disabled]) {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .primary {
    white-space: normal;
    overflow-wrap: anywhere;
  }
`;
