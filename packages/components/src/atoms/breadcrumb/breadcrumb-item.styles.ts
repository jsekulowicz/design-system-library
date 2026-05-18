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
    /* padding-inline + negative margin-inline widens the focus-ring
       bounding box on the horizontal axis while keeping the link's
       footprint identical, so adjacent crumbs stay aligned. */
    padding: var(--ds-space-1) 2px;
    margin-inline: -2px;
    border-radius: var(--ds-radius-sm);
    transition: color var(--ds-duration-fast) var(--ds-easing-standard);
  }
  a:hover {
    color: var(--ds-color-accent);
    text-decoration: underline;
  }
  a:focus-visible {
    box-shadow: var(--ds-shadow-focus);
  }

  .current {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    color: var(--ds-color-fg);
    font-weight: var(--ds-font-weight-medium);
    padding: var(--ds-space-1) 0;
  }

  .separator {
    display: inline-flex;
    color: var(--ds-color-fg-subtle);
    font-size: 0.875em;
  }
`;
