import { css } from 'lit';

export const radioStyles = css`
  .control {
    border-radius: 50%;
  }
  .control::after {
    content: '';
    width: 0.5rem;
    height: 0.5rem;
    flex-shrink: 0;
    border-radius: 50%;
    background: var(--ds-color-accent);
    transform: scale(0);
    transition: transform var(--ds-duration-fast) var(--ds-easing-standard);
  }
  :host([checked]) .control {
    border-color: var(--ds-color-accent);
  }
  :host([checked]) .control::after {
    transform: scale(1);
  }
`;
