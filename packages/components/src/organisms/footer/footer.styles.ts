import { css } from 'lit';

export const footerStyles = css`
  :host {
    display: block;
    container-type: inline-size;
  }
  footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: nowrap;
    gap: var(--ds-space-4);
    padding: var(--ds-space-2) var(--ds-space-6);
    border-top: 1px solid var(--ds-color-border);
    color: var(--ds-color-fg-muted);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
  }
  .start,
  .middle,
  .end {
    display: flex;
    align-items: center;
    gap: var(--ds-space-3);
    min-width: 0;
  }
  .end {
    justify-content: flex-end;
  }
  @container (max-width: 480px) {
    footer {
      gap: var(--ds-space-2);
      padding: var(--ds-space-2) var(--ds-space-4);
      font-size: var(--ds-font-size-xs);
    }
    .start,
    .middle,
    .end {
      gap: var(--ds-space-2);
    }
  }
`;
