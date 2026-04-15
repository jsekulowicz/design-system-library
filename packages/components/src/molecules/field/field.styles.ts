import { css } from 'lit';

export const fieldStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1-5);
    font-family: var(--ds-font-body);
    container-type: inline-size;
  }
  .row {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: var(--ds-space-2);
  }
  label {
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    color: var(--ds-color-fg);
    line-height: 1.2;
  }
  .optional {
    font-size: var(--ds-font-size-2xs);
    color: var(--ds-color-fg-muted);
    letter-spacing: var(--ds-letter-spacing-wide);
    text-transform: uppercase;
  }
  .help {
    font-size: var(--ds-font-size-xs);
    color: var(--ds-color-fg-muted);
    line-height: 1.45;
  }
  .error {
    font-size: var(--ds-font-size-xs);
    color: var(--ds-color-danger);
    line-height: 1.45;
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
  }
  .error::before {
    content: '';
    width: 6px;
    height: 6px;
    background: var(--ds-color-danger);
    border-radius: 50%;
    display: inline-block;
  }
  :host([layout='inline']) {
    flex-direction: row;
    align-items: center;
    gap: var(--ds-space-4);
  }
  :host([layout='inline']) label {
    min-width: 8rem;
  }
  @container (max-width: 420px) {
    :host([layout='inline']) {
      flex-direction: column;
      align-items: stretch;
    }
    :host([layout='inline']) label {
      min-width: 0;
    }
  }
`;
