import { css } from 'lit';

export const badgeStyles = css`
  :host {
    display: inline-flex;
  }
  .badge {
    display: inline-flex;
    align-items: center;
    gap: var(--ds-space-1);
    padding: 2px var(--ds-space-2);
    border-radius: var(--ds-radius-xs);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-2xs);
    font-weight: var(--ds-font-weight-medium);
    letter-spacing: var(--ds-letter-spacing-wide);
    text-transform: uppercase;
    line-height: 1.2;
    background: var(--ds-color-bg-subtle);
    color: var(--ds-color-fg);
    border: 1px solid var(--ds-color-border);
  }
  :host([tone='accent']) .badge {
    background: var(--ds-color-accent-subtle);
    color: var(--ds-color-accent-active);
    border-color: transparent;
  }
  :host([tone='success']) .badge {
    background: var(--ds-color-success-subtle);
    color: var(--ds-color-success);
    border-color: transparent;
  }
  :host([tone='warning']) .badge {
    background: var(--ds-color-warning-subtle);
    color: var(--ds-color-warning);
    border-color: transparent;
  }
  :host([tone='danger']) .badge {
    background: var(--ds-color-danger-subtle);
    color: var(--ds-color-danger);
    border-color: transparent;
  }
`;
