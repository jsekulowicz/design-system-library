import { css } from 'lit';

export const searchableSelectStyles = css`
  .trigger {
    flex-wrap: wrap;
  }
  .trigger:focus-within {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  .trigger.open {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  .search-input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    min-width: 0;
    cursor: pointer;
    /* Show a long selected value truncated rather than hard-clipped; the
       input still scrolls normally while focused and typing. */
    text-overflow: ellipsis;
  }
  :host([size='sm']) .search-input {
    font-size: var(--ds-font-size-xs);
  }
  :host([size='lg']) .search-input {
    font-size: var(--ds-font-size-md);
  }
  .search-input::placeholder {
    color: var(--ds-color-fg-muted);
  }
  .trigger.open .search-input {
    cursor: text;
  }
  :host([loading]) .trigger {
    cursor: default;
    pointer-events: none;
  }
  .spinner {
    width: 1.2rem;
    height: 1.2rem;
    margin-left: var(--ds-space-2);
    color: var(--ds-color-fg-muted);
    flex-shrink: 0;
    animation: spin 0.75s linear infinite;
  }
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
  .trigger.open .caret {
    transform: rotate(180deg);
  }
  .empty {
    margin: 0;
    padding: var(--ds-space-3);
    font-size: var(--ds-font-size-sm);
    color: var(--ds-color-fg-muted);
    text-align: center;
  }
  mark.match {
    background: none;
    color: var(--ds-color-accent);
    font-weight: var(--ds-font-weight-medium);
  }
`;
