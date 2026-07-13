import { css } from 'lit';

export const menuStyles = css`
  :host {
    display: inline-block;
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-sm);
    box-shadow: var(--ds-shadow-md);
    overflow: hidden;
    min-width: 180px;
    font-family: var(--ds-font-body);
  }
  .header,
  .footer {
    padding: var(--ds-space-2) var(--ds-space-3);
    color: var(--ds-color-fg-subtle, var(--ds-color-fg));
    font-size: var(--ds-font-size-body-sm);
    letter-spacing: var(--ds-letter-spacing-wide);
    text-transform: uppercase;
  }
  .header {
    border-bottom: 1px solid var(--ds-color-border);
  }
  .footer {
    border-top: 1px solid var(--ds-color-border);
  }
  .items {
    padding: var(--ds-space-1);
    max-height: var(--ds-menu-max-height, 320px);
    overflow-y: auto;
  }
`;
