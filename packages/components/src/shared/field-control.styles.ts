import { css } from 'lit';

/* Box chrome shared by every bordered form control (text field, text area,
   select triggers). Focus rules stay per-component: text inputs ring on
   :focus-within, button-like triggers only on :focus-visible. */
export const fieldControlStyles = css`
  .field-control {
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    transition: border-color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  .field-control:hover {
    border-color: var(--ds-color-fg-subtle);
  }
  :host([invalid]) .field-control {
    border-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  :host([invalid]) .field-control:is(:focus-visible, :focus-within) {
    box-shadow: var(--ds-shadow-focus-danger);
  }
  :host([disabled]) .field-control {
    opacity: 0.5;
    cursor: not-allowed;
    background: var(--ds-color-bg-subtle);
  }
`;
