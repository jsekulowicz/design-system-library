import { css } from 'lit';

export const linkStyles = css`
  :host {
    display: inline;
  }
  a {
    color: var(--ds-color-accent-active);
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-underline-offset: 0.18em;
    transition: color var(--ds-duration-fast) var(--ds-easing-standard);
    border-radius: var(--ds-radius-xs);
  }
  a:hover {
    color: var(--ds-color-accent);
  }
  a:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus);
  }
  :host([variant='quiet']) a {
    color: inherit;
    text-decoration-color: var(--ds-color-border-strong);
  }
  :host([variant='quiet']) a:hover {
    color: var(--ds-color-accent-active);
  }
  :host([variant='standalone']) a {
    text-decoration: none;
    font-weight: var(--ds-font-weight-medium);
  }
  :host([variant='standalone']) a:hover {
    text-decoration: underline;
  }
`;
