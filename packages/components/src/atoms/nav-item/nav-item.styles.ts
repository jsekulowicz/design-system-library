import { css } from 'lit';
import { navControlStyles } from './nav-control.styles.js';

export const navItemStyles = [
  navControlStyles,
  css`
  :host([current]) .link {
    background: var(--ds-color-accent-subtle);
    color: var(--ds-color-accent-active);
  }
  :host([disabled]) .link,
  :host([loading]) .link {
    color: var(--ds-color-fg-subtle);
    cursor: not-allowed;
  }
  :host([loading]) .link {
    cursor: wait;
  }
  .spinner {
    width: 1.25rem;
    height: 1.25rem;
    animation: ds-nav-item-spin 0.75s linear infinite;
  }
  @keyframes ds-nav-item-spin {
    to {
      transform: rotate(360deg);
    }
  }
`,
];
