import { css } from 'lit';

/* Tone-tinted message surface shared by ds-alert and ds-toast. */
export const noticeStyles = css`
  .notice {
    display: flex;
    align-items: flex-start;
    gap: var(--ds-space-3);
    padding: var(--ds-space-4);
    border-radius: var(--ds-radius-sm);
    border-left: 3px solid var(--ds-color-accent);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    line-height: 1.5;
  }
  :host([tone='info']) .notice {
    border-left-color: var(--ds-color-accent);
    background: var(--ds-color-accent-subtle);
  }
  :host([tone='success']) .notice {
    border-left-color: var(--ds-color-success);
    background: var(--ds-color-success-subtle);
  }
  :host([tone='warning']) .notice {
    border-left-color: var(--ds-color-warning);
    background: var(--ds-color-warning-subtle);
  }
  :host([tone='danger']) .notice {
    border-left-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  .content {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
  }
  .title {
    font-family: var(--ds-font-display);
    font-weight: var(--ds-font-weight-semibold);
    font-size: var(--ds-font-size-heading-sm);
    letter-spacing: var(--ds-letter-spacing-display);
  }
  .close {
    appearance: none;
    background: transparent;
    border: none;
    color: inherit;
    padding: var(--ds-space-1);
    margin: calc(var(--ds-space-1) * -1);
    cursor: pointer;
    border-radius: var(--ds-radius-xs);
  }
  .close:focus-visible {
    box-shadow: var(--ds-shadow-focus);
  }
`;
