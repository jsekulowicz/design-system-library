import { css } from 'lit';

export const navbarStyles = css`
  :host {
    display: block;
    container-type: inline-size;
    --_breakpoint: 640px;
  }
  nav {
    position: relative;
    display: flex;
    align-items: center;
    gap: var(--ds-space-4);
    padding: var(--ds-space-3) var(--ds-space-6);
    background: var(--ds-color-bg);
    border-bottom: 1px solid var(--ds-color-border);
    font-family: var(--ds-font-body);
  }
  .brand {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-lg);
    color: var(--ds-color-fg);
  }
  .links {
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
    flex: 1;
  }
  .actions {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
  }
  .toggle {
    display: none;
    align-items: center;
    justify-content: center;
    border: 1px solid var(--ds-color-border);
    background: transparent;
    border-radius: var(--ds-radius-sm);
    color: var(--ds-color-fg);
    cursor: pointer;
    padding: var(--ds-space-2);
  }
  .toggle:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }
  .menu {
    display: contents;
  }
  @container (max-width: 640px) {
    .links {
      justify-content: flex-end;
      flex: 0 0 auto;
      margin-left: auto;
    }
    .toggle {
      display: inline-flex;
    }
    .menu {
      display: none;
      position: absolute;
      top: 100%;
      left: 0;
      right: 0;
      flex-direction: column;
      align-items: stretch;
      gap: var(--ds-space-1);
      padding: var(--ds-space-3);
      background: var(--ds-color-bg);
      border-bottom: 1px solid var(--ds-color-border);
      box-shadow: var(--ds-shadow-md);
      z-index: 10;
    }
    :host([data-open]) .menu {
      display: flex;
    }
  }
`;
