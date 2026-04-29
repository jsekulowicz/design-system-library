import { css } from 'lit';

export const settingsPageStyles = css`
  :host {
    display: block;
  }
  .hero {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
    padding-bottom: var(--ds-space-6);
    border-bottom: 1px solid var(--ds-color-border);
  }
  .hero .eyebrow {
    font-size: var(--ds-font-size-2xs);
    letter-spacing: var(--ds-letter-spacing-wide);
    text-transform: uppercase;
    color: var(--ds-color-accent);
  }
  .hero h1 {
    font-family: var(--ds-font-display);
    font-weight: var(--ds-font-weight-semibold);
    margin: 0;
  }
  .hero p {
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-md);
    max-width: 52ch;
    margin: 0;
  }
  .grid {
    display: grid;
    grid-template-columns: minmax(12rem, 16rem) 1fr;
    gap: var(--ds-space-10);
    padding: var(--ds-space-8) 0;
  }
  @media (max-width: 768px) {
    .grid {
      grid-template-columns: 1fr;
      gap: var(--ds-space-6);
      padding: var(--ds-space-5) 0;
    }
  }
  nav {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-1);
    position: sticky;
    top: calc(var(--ds-space-10) + var(--ds-space-4));
    align-self: start;
  }
  nav a {
    padding: var(--ds-space-2) var(--ds-space-3);
    color: var(--ds-color-fg-muted);
    text-decoration: none;
    border-radius: var(--ds-radius-xs);
    font-size: var(--ds-font-size-sm);
  }
  nav a[aria-current='true'] {
    color: var(--ds-color-fg);
    background: var(--ds-color-bg-subtle);
    font-weight: var(--ds-font-weight-medium);
  }
  .sections {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-6);
  }
  :host > .sections {
    padding-top: var(--ds-space-8);
  }
`;
