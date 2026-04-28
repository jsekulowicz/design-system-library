import { css } from 'lit';

export const pageShellStyles = css`
  :host {
    display: grid;
    grid-template-areas:
      'header header'
      'aside main'
      'footer footer';
    grid-template-columns: auto 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    overflow-x: clip;
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
  }
  header {
    grid-area: header;
    border-bottom: 1px solid var(--ds-color-border);
    padding: var(--ds-space-5) var(--ds-space-4);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--ds-space-4);
    position: sticky;
    top: 0;
    background: color-mix(in oklab, var(--ds-color-bg) 92%, transparent);
    backdrop-filter: blur(12px);
    z-index: var(--ds-z-index-sticky);
  }
  aside {
    grid-area: aside;
    display: flex;
    overflow-x: clip;
    overflow-y: auto;
    min-height: 0;
    width: 240px;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
  }
  main {
    grid-area: main;
    padding: var(--ds-space-5);
    max-width: min(72rem, 100%);
    overflow-y: auto;
    min-height: 0;
    scrollbar-color: var(--ds-color-fg-subtle) transparent;
    scrollbar-width: thin;
  }
  footer {
    grid-area: footer;
  }
  .brand {
    font-family: var(--ds-font-display);
    font-size: var(--ds-font-size-lg);
    letter-spacing: var(--ds-letter-spacing-display);
  }
  @media (max-width: 768px) {
    :host {
      grid-template-areas:
        'header'
        'aside'
        'main'
        'footer';
      grid-template-columns: 1fr;
      grid-template-rows: auto auto 1fr auto;
    }
    main {
      padding: var(--ds-space-5);
    }
    header {
      padding: var(--ds-space-3) var(--ds-space-5);
    }
  }
`;
