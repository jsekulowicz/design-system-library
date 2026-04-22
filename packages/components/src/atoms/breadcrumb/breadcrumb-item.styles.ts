import { css } from 'lit';

export const breadcrumbItemStyles = css`
  :host {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    color: inherit;
    font: inherit;
  }

  a {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    color: var(--ds-color-fg-muted);
    text-decoration: none;
    padding: var(--ds-space-1) var(--ds-space-2);
    border-radius: var(--ds-radius-sm);
    transition: color var(--ds-duration-fast) var(--ds-easing-standard);
  }
  a:hover {
    color: var(--ds-color-accent);
    text-decoration: underline;
  }
  a:focus-visible {
    outline: 2px solid var(--ds-color-focus);
    outline-offset: 2px;
  }

  .current {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    color: var(--ds-color-fg);
    font-weight: var(--ds-font-weight-medium);
    padding: var(--ds-space-1) var(--ds-space-2);
  }

  .separator {
    display: inline-flex;
    color: var(--ds-color-fg-subtle);
    font-size: 0.875em;
  }
`;
