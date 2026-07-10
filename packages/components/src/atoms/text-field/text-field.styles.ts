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
    padding: 0 var(--ds-space-3);
    gap: var(--ds-space-2);
  }
  .wrap:focus-within {
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  input {
    flex: 1;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-md);
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
  }
  .adornment {
    display: inline-flex;
    align-items: center;
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-sm);
  }
  .adornment[hidden] {
    display: none;
  }
`;
