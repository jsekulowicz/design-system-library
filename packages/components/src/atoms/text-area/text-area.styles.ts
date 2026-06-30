import { css } from 'lit';

export const textAreaStyles = css`
  :host {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    width: 100%;
  }
  textarea {
    width: 100%;
    box-sizing: border-box;
    padding: var(--ds-space-2) var(--ds-space-3);
    background: var(--ds-color-bg);
    border: 1px solid var(--ds-color-border-strong);
    border-radius: var(--ds-radius-sm);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-sm);
    line-height: 1.4;
    resize: none;
    transition: border-color var(--ds-duration-fast) var(--ds-easing-standard),
      box-shadow var(--ds-duration-fast) var(--ds-easing-standard);
  }
  :host([resize='vertical']) textarea {
    resize: vertical;
  }
  textarea:hover {
    border-color: var(--ds-color-fg-subtle);
  }
  textarea:focus {
    outline: none;
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  textarea::placeholder {
    color: var(--ds-color-fg-muted);
  }
  :host([invalid]) textarea {
    border-color: var(--ds-color-danger);
    background: var(--ds-color-danger-subtle);
  }
  :host([invalid]) textarea:focus {
    box-shadow: 0 0 0 3px rgba(178, 26, 10, 0.3);
  }
  :host([disabled]) textarea {
    opacity: 0.5;
    cursor: not-allowed;
    resize: none;
    background: var(--ds-color-bg-subtle);
  }
  :host([size='sm']) textarea {
    padding: var(--ds-space-1) var(--ds-space-2);
  }
  :host([size='lg']) textarea {
    padding: var(--ds-space-3) var(--ds-space-4);
    font-size: var(--ds-font-size-md);
  }
`;
