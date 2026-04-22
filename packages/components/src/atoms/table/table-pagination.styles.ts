import { css } from 'lit';

export const tablePaginationStyles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-3);
    flex-wrap: wrap;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
  }

  nav {
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
  }

  .list {
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
    list-style: none;
    padding: 0;
    margin: 0;
  }

  button {
    min-width: 2rem;
    height: 2rem;
    padding: 0 var(--ds-space-2);
    background: transparent;
    color: var(--ds-color-fg);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-sm);
    font: inherit;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: var(--ds-space-1);
  }
  button:hover:not(:disabled) {
    background: var(--ds-color-bg-muted);
  }
  button:focus-visible {
    outline: 2px solid var(--ds-color-focus);
    outline-offset: 2px;
  }
  button:disabled {
    color: var(--ds-color-fg-subtle);
    cursor: not-allowed;
    opacity: 0.6;
  }
  button[aria-current="page"] {
    background: var(--ds-color-accent);
    color: var(--ds-color-accent-fg);
    border-color: var(--ds-color-accent);
  }

  .ellipsis {
    display: inline-flex;
    min-width: 2rem;
    justify-content: center;
    color: var(--ds-color-fg-muted);
  }

  .size {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-2);
    color: var(--ds-color-fg-muted);
  }

  select {
    padding: var(--ds-space-1) var(--ds-space-2);
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-sm);
    font: inherit;
  }

  .summary {
    color: var(--ds-color-fg-muted);
  }

  svg {
    width: 1em;
    height: 1em;
  }
`;
