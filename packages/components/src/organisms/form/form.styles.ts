import { css } from 'lit';

export const formStyles = css`
  :host {
    display: block;
    container-type: inline-size;
  }
  form {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-5);
  }
  .section {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    padding: var(--ds-space-6);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
  }
  .actions {
    display: flex;
    gap: var(--ds-space-3);
    justify-content: flex-end;
    flex-wrap: wrap;
  }
  @container (max-width: 480px) {
    .actions {
      flex-direction: column-reverse;
      align-items: stretch;
    }
  }
  .summary {
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-xl);
    letter-spacing: var(--ds-letter-spacing-display);
    color: var(--ds-color-fg);
  }
`;
