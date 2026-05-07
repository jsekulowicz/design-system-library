import { css } from 'lit';

export const listItemStyles = css`
  :host {
    display: block;
  }
  li {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: var(--ds-space-3);
    padding: var(--ds-space-2) var(--ds-space-3);
    background: transparent;
  }
  :host-context(ds-list[density='compact']) li,
  :host([compact]) li {
    padding: var(--ds-space-1) var(--ds-space-3);
  }
  .leading,
  .trailing {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
  }
  [hidden] {
    display: none;
  }
  .content {
    min-width: 0;
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
  }
`;
