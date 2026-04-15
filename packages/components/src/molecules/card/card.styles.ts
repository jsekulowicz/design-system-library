import { css } from 'lit';

export const cardStyles = css`
  :host {
    display: block;
    container-type: inline-size;
  }
  .card {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-4);
    padding: var(--ds-space-6);
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-sm);
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    transition: border-color var(--ds-duration-normal) var(--ds-easing-standard),
      transform var(--ds-duration-normal) var(--ds-easing-standard);
  }
  :host([elevation='sm']) .card {
    box-shadow: var(--ds-shadow-sm);
  }
  :host([elevation='md']) .card {
    box-shadow: var(--ds-shadow-md);
  }
  :host([interactive]) .card {
    cursor: pointer;
  }
  :host([interactive]) .card:hover {
    border-color: var(--ds-color-fg-subtle);
    transform: translateY(-1px);
  }
  :host([orientation='horizontal']) .card {
    flex-direction: row;
    align-items: center;
  }
  @container (max-width: 420px) {
    :host([orientation='horizontal']) .card {
      flex-direction: column;
      align-items: stretch;
    }
  }
  .header {
    display: flex;
    gap: var(--ds-space-3);
    align-items: baseline;
    justify-content: space-between;
  }
  ::slotted([slot='title']) {
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-xl);
    font-weight: var(--ds-font-weight-semibold);
    letter-spacing: var(--ds-letter-spacing-display);
    margin: 0;
  }
  ::slotted([slot='eyebrow']) {
    font-size: var(--ds-font-size-2xs);
    letter-spacing: var(--ds-letter-spacing-wide);
    text-transform: uppercase;
    color: var(--ds-color-accent);
  }
`;
