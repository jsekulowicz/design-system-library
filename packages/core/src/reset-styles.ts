import { css } from 'lit';

export const resetStyles = css`
  :host {
    box-sizing: border-box;
    font-family: var(--ds-font-body, system-ui, sans-serif);
    color: var(--ds-color-fg, inherit);
  }
  :host *,
  :host *::before,
  :host *::after {
    box-sizing: inherit;
  }
  :host([hidden]) {
    display: none !important;
  }
`;

export const focusVisibleStyles = css`
  :host(:focus-visible),
  :host :focus-visible {
    outline: none;
  }
  .ds-focus-ring:focus-visible {
    outline: 2px solid transparent;
    box-shadow: var(--ds-shadow-focus, 0 0 0 3px rgba(74, 114, 204, 0.35));
  }
`;

export const visuallyHiddenStyles = css`
  .visually-hidden {
    position: absolute;
    inline-size: 1px;
    block-size: 1px;
    margin: -1px;
    padding: 0;
    border: 0;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    clip-path: inset(50%);
    white-space: nowrap;
  }
`;

export const reducedMotionStyles = css`
  @media (prefers-reduced-motion: reduce) {
    :host,
    :host * {
      animation-duration: 0.001ms !important;
      transition-duration: 0.001ms !important;
    }
  }
`;
