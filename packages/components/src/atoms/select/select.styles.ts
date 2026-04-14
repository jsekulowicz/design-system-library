import { css } from 'lit';

export const selectStyles = css`
  :host {
    display: inline-flex;
    width: 100%;
  }
  .wrap {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--ds-size-md);
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    padding: 0 var(--ds-space-3);
    transition: border-color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .wrap:hover {
    border-color: var(--ds-color-fg-subtle);
  }
  .wrap:focus-within {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  :host([invalid]) .wrap {
    border-color: var(--ds-color-danger);
  }
  :host([disabled]) .wrap {
    opacity: 0.5;
    background: var(--ds-color-bg-subtle);
  }
  select {
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    padding: 0;
    cursor: pointer;
    min-width: 0;
  }
  .caret {
    pointer-events: none;
    width: 0.7rem;
    height: 0.7rem;
    margin-left: var(--ds-space-2);
    color: var(--ds-color-fg-muted);
  }
`;
