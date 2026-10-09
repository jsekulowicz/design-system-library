import { css } from 'lit';

export const stepListStyles = css`
  :host {
    display: block;
    container-type: inline-size;
    font-family: var(--ds-font-body);
  }

  .trailing {
    display: flex;
    justify-content: flex-end;
    gap: var(--ds-space-2);
    margin-block-end: var(--ds-space-2);
  }

  .trailing[hidden] {
    display: none;
  }

  ol {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
  }

  .step {
    display: flex;
    align-items: center;
    min-inline-size: 0;
  }

  .step:not(:first-child) {
    flex: 1 1 auto;
  }

  .step:not(:first-child)::before {
    content: '';
    flex: 1 1 0;
    min-inline-size: var(--ds-space-4);
    block-size: 2px;
    margin-inline: var(--ds-space-3);
    background: var(--ds-color-border-subtle);
  }

  .step:is([data-status='done'], [data-status='current']):not(.step-disabled)::before {
    background: var(--ds-color-accent);
  }

  .step .reason-tooltip {
    min-inline-size: 0;
  }

  :is(.step-control, .segment) {
    border: none;
    background: none;
    padding: 0;
    border-radius: var(--ds-radius-xs);
    cursor: pointer;
  }

  :is(.step-control, .segment):is(:disabled, [aria-current='step']) {
    cursor: default;
  }

  .step-control {
    display: flex;
    align-items: center;
    gap: var(--ds-space-2);
    min-inline-size: 0;
    font: inherit;
    color: inherit;
    text-align: start;
  }

  .marker {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: center;
    inline-size: var(--ds-step-list-marker-size, 2rem);
    block-size: var(--ds-step-list-marker-size, 2rem);
    border-radius: var(--ds-radius-full);
  }

  .marker-number {
    font-size: var(--ds-font-size-body-md);
    font-weight: var(--ds-font-weight-semibold);
    background: var(--ds-color-bg-muted);
    color: var(--ds-color-fg-muted);
  }

  .step[data-status='current'] .marker-number,
  .compact-current .marker-number {
    background: var(--ds-color-accent);
    color: var(--ds-color-accent-fg);
    box-shadow: 0 0 0 3px var(--ds-color-accent-subtle);
  }

  .marker-check {
    color: var(--ds-color-success);
  }

  .text {
    display: flex;
    flex-direction: column;
    min-inline-size: 0;
    gap: var(--ds-step-list-text-gap, var(--ds-space-1));
  }

  .step-label,
  .step-description {
    line-height: var(--ds-line-height-tight);
    overflow-wrap: anywhere;
  }

  .step-label {
    font-size: var(--ds-font-size-body-md);
    font-weight: var(--ds-font-weight-medium);
    color: var(--ds-color-fg);
  }

  .step[data-status='current'] .step-label,
  .compact-current .step-label {
    color: var(--ds-color-accent);
    font-weight: var(--ds-font-weight-semibold);
  }

  .step:is([data-status='upcoming'], .step-disabled) .step-label {
    color: var(--ds-color-fg-muted);
  }

  .step-disabled :is(.marker, .text) {
    opacity: 0.6;
  }

  .step-description {
    font-size: var(--ds-font-size-body-sm);
    color: var(--ds-color-fg-muted);
  }
`;
