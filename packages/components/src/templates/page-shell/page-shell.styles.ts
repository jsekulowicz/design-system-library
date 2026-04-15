import { css } from 'lit';

export const pageShellStyles = css`
  :host {
    display: grid;
    grid-template-areas:
      'header header'
      'aside main'
      'footer footer';
    grid-template-columns: minmax(14rem, 18rem) 1fr;
    grid-template-rows: auto 1fr auto;
    min-height: 100vh;
    background: var(--ds-color-bg);
    color: var(--ds-color-fg);
    font-family: var(--ds-font-body);
  }
  header {
    grid-area: header;
    border-bottom: 1px solid var(--ds-color-border);
    padding: var(--ds-space-4) var(--ds-space-8);
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
    border-right: 1px solid var(--ds-color-border);
    padding: var(--ds-space-6);
    overflow-y: auto;
  }
  main {
    grid-area: main;
    padding: var(--ds-space-8);
    max-width: min(72rem, 100%);
  }
  footer {
    grid-area: footer;
    border-top: 1px solid var(--ds-color-border);
    padding: var(--ds-space-4) var(--ds-space-8);
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-xs);
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
    aside {
      border-right: none;
      border-bottom: 1px solid var(--ds-color-border);
      padding: var(--ds-space-3) var(--ds-space-5);
    }
    main {
      padding: var(--ds-space-5);
    }
    header,
    footer {
      padding: var(--ds-space-3) var(--ds-space-5);
    }
  }
`;
