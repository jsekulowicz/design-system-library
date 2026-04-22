import { css } from 'lit';

export const tableSortButtonStyles = css`
  :host {
    display: inline-flex;
  }

  button {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    background: transparent;
    color: inherit;
    border: 0;
    padding: 0;
    font: inherit;
    cursor: pointer;
    border-radius: var(--ds-radius-sm);
  }
  button:focus-visible {
    outline: 2px solid var(--ds-color-focus);
    outline-offset: 2px;
  }
  button:hover {
    color: var(--ds-color-accent);
  }

  .icon {
    display: inline-flex;
    width: 1em;
    height: 1em;
    color: var(--ds-color-fg-muted);
  }
  :host([direction]) .icon {
    color: var(--ds-color-accent);
  }
  svg {
    width: 100%;
    height: 100%;
  }
`;
