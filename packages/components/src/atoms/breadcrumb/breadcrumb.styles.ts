import { css } from 'lit';

export const breadcrumbStyles = css`
  :host {
    display: block;
    color: var(--ds-color-fg-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
  }

  nav {
    display: block;
  }

  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--ds-space-1);
  }

  ::slotted(ds-breadcrumb-item) {
    display: inline-flex;
    align-items: center;
  }
`;
