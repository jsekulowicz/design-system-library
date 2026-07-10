import { css } from 'lit';

/* Row internals shared by ds-menu-item and ds-select-option. */
export const optionRowStyles = css`
  .leading,
  .trailing {
    display: flex;
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
  .description {
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
