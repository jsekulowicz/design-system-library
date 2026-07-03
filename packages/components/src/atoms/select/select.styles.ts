import { css } from 'lit';

export const selectStyles = css`
  .trigger {
    cursor: pointer;
    text-align: left;
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-md);
    color: var(--ds-color-fg);
  }
  .trigger:focus-visible {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  .trigger[aria-expanded='true'] {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  .tiles {
    flex: 1;
  }
  .trigger-label {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .trigger-label.placeholder {
    color: var(--ds-color-fg-muted);
  }
  .trigger[aria-expanded='true'] .caret {
    transform: rotate(180deg);
  }
`;
