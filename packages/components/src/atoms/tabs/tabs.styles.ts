import { css } from 'lit';

export const tabsStyles = css`
  :host {
    display: block;
    width: 100%;
  }
  .tablist {
    display: flex;
    gap: var(--ds-space-2);
    border-bottom: 1px solid var(--ds-color-border);
    padding: 4px 4px 0;
    margin: -4px -4px 0;
  }
  .panels {
    padding-top: var(--ds-space-4);
  }
`;
