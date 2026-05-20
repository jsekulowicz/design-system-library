import { css } from 'lit';
import { navControlStyles } from './nav-control.styles.js';

export const navGroupStyles = [
  navControlStyles,
  css`
  .heading {
    width: 100%;
  }
  .label {
    flex: 1;
  }
  .heading[disabled] {
    cursor: default;
  }
  .chevron {
    display: inline-flex;
    flex: none;
    transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .chevron svg {
    width: 1rem;
    height: 1rem;
  }
  :host([expanded]) .chevron {
    transform: rotate(180deg);
  }
  .items {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    padding-left: var(--ds-space-2);
  }
  .items[hidden] {
    display: none;
  }
  :host([compact]) .label {
    clip-path: inset(50%);
    height: 1px;
    width: 1px;
    position: absolute;
  }
  :host([compact]) .heading {
    gap: var(--ds-space-1);
  }
  :host([compact]) .chevron svg {
    width: 0.75rem;
    height: 0.75rem;
  }
  :host([compact]) .items {
    padding-left: 0;
  }
  .icon-probe {
    display: none;
  }
`,
];
