import { css } from 'lit';
import { navControlStyles } from './nav-control.styles.js';

export const navItemStyles = [
  navControlStyles,
  css`
  :host([current]) .link {
    background: var(--ds-color-accent-subtle);
    color: var(--ds-color-accent-active);
  }
  :host([disabled]) .link {
    color: var(--ds-color-fg-subtle);
    cursor: not-allowed;
  }
`,
];
