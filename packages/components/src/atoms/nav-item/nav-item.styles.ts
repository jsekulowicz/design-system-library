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
  /* Grey out an accent-coloured slotted icon too: consumers commonly colour
     the icon with --ds-color-accent, so redefining it here (a higher-specificity
     :host rule than a consumer class) dims the icon along with the label. */
  :host([disabled]) {
    --ds-color-accent: var(--ds-color-fg-subtle);
  }
  :host([loading]) .link {
    cursor: wait;
  }
`,
];
