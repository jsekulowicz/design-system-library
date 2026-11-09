import { css } from 'lit';

/* Row internals shared by ds-menu-item and ds-select-option. */
export const optionRowStyles = css`
  .leading,
  .trailing {
    display: contents;
    color: var(--ds-color-fg-subtle, var(--ds-color-fg));
  }
  ::slotted([slot='leading']),
  ::slotted([slot='trailing']) {
    flex-shrink: 0;
  }
  .content {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-width: 0;
  }
  .description {
    font-size: var(--ds-font-size-body-sm);
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
