import { css } from 'lit';

export const skeletonStyles = css`
  :host {
    display: block;
    width: var(--ds-skeleton-width, 100%);
  }

  .stack {
    display: grid;
    gap: var(--ds-skeleton-gap, var(--ds-space-2));
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }

  .item {
    display: block;
    width: var(--ds-skeleton-item-width, 100%);
    height: var(--ds-skeleton-height, 1em);
    border-radius: var(--ds-skeleton-radius, var(--ds-radius-xs));
    background:
      linear-gradient(
        90deg,
        var(--ds-color-bg-muted) 0%,
        var(--ds-color-bg-subtle) 45%,
        var(--ds-color-bg-muted) 90%
      );
    background-size: 240% 100%;
    animation: ds-skeleton-shimmer var(--ds-duration-slow, 1.4s) ease-in-out infinite;
  }

  :host([variant='text']) .item {
    transform: translateY(0.12em);
  }

  :host([variant='rectangle']) .item {
    height: var(--ds-skeleton-height, 6rem);
    border-radius: var(--ds-skeleton-radius, var(--ds-radius-sm));
  }

  :host([variant='circle']) {
    width: var(--ds-skeleton-width, 2.5rem);
  }

  :host([variant='circle']) .item {
    width: var(--ds-skeleton-item-width, var(--ds-skeleton-width, 2.5rem));
    height: var(--ds-skeleton-height, var(--ds-skeleton-width, 2.5rem));
    border-radius: 999px;
  }

  @keyframes ds-skeleton-shimmer {
    from { background-position: 120% 0; }
    to { background-position: -120% 0; }
  }
`;
