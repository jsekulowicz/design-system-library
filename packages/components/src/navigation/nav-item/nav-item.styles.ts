import { css } from 'lit';
import { spinnerStyles } from '../../shared/spinner.js';
import { navControlStyles } from './nav-control.styles.js';

export const navItemStyles = [
  navControlStyles,
  spinnerStyles,
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
    /* Redefined here so a consumer's accent-colored icon dims with the label. */
    :host([disabled]) {
      --ds-color-accent: var(--ds-color-fg-subtle);
    }
    :host([loading]) .link {
      cursor: wait;
    }
  `,
];
