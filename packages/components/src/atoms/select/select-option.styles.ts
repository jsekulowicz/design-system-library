import { css } from 'lit';

export const selectOptionStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    /* ITEM_HEIGHT (virtual-list.ts) baseline for single-line options; an
       option whose primary text wraps grows past it. Virtualization stays
       accurate while options fit one line. */
    min-height: 36px;
    box-sizing: border-box;
    padding: var(--ds-space-2) var(--ds-space-3);
    cursor: pointer;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-md);
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
  .leading,
  .trailing {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--ds-color-fg-subtle, var(--ds-color-fg));
  }
  .leading:empty,
  .trailing:empty {
    display: none;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .primary {
    display: block;
    white-space: normal;
    overflow-wrap: anywhere;
  }
  .description {
    display: block;
    font-size: var(--ds-font-size-xs);
    color: var(--ds-color-fg-subtle, var(--ds-color-fg));
  }
  .description:empty {
    display: none;
  }
  .check {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    color: var(--ds-color-accent);
  }
`;
