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
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
    font-size: var(--ds-font-size-body-lg);
    line-height: 1.4;
    resize: none;
  }
  :host([resize='vertical']) textarea {
    resize: vertical;
  }
  textarea:focus {
    outline: none;
    border-color: var(--ds-color-accent);
    box-shadow: var(--ds-shadow-focus);
  }
  textarea::placeholder {
    color: var(--ds-color-fg-muted);
  }
  :host([disabled]) textarea {
    resize: none;
  }
  :host([size='sm']) textarea {
    padding: var(--ds-space-1) var(--ds-space-2);
  }
  :host([size='lg']) textarea {
    padding: var(--ds-space-3) var(--ds-space-4);
  }
`;
