import { css } from 'lit';

export const selectOptionStyles = css`
  :host {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    height: 36px; /* must match ITEM_HEIGHT constant in virtual-list.ts */
    box-sizing: border-box;
    padding: 0 var(--ds-space-3);
    cursor: pointer;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
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
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .description {
    display: block;
    font-size: var(--ds-font-size-2xs);
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
