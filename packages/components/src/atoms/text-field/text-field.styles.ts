import { css } from 'lit';

export const textFieldStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    width: 100%;
  }
  .wrap {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: var(--ds-size-md);
    padding: 0 var(--ds-space-2);
    gap: var(--ds-space-2);
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
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
    background: var(--ds-color-danger-subtle);
  }
  :host([invalid]) .wrap:focus-within {
    box-shadow: 0 0 0 3px rgba(178, 26, 10, 0.3);
  }
  :host([disabled]) .wrap {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--ds-color-bg-subtle);
  }
  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    line-height: 1.4;
    padding: 0;
    min-width: 0;
  }
  input::placeholder {
    color: var(--ds-color-fg-muted);
  }
  :host([size='sm']) .wrap {
    height: var(--ds-size-sm);
    padding: 0 var(--ds-space-2);
  }
  :host([size='lg']) .wrap {
    height: var(--ds-size-lg);
    padding: 0 var(--ds-space-4);
    font-size: var(--ds-font-size-md);
  }
  .adornment {
    display: inline-flex;
    align-items: center;
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-sm);
  }
`;
