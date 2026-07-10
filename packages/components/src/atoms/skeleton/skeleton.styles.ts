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

  .item {
    width: var(--ds-skeleton-item-width, 100%);
    height: var(--ds-skeleton-height, 1em);
    border-radius: var(--ds-skeleton-radius, var(--ds-radius-xs));
    background:
      linear-gradient(
        90deg,
        var(--ds-color-bg-muted) 0%,
        var(--ds-color-bg-muted) 34%,
        var(--ds-color-bg-subtle) 50%,
        var(--ds-color-bg-muted) 66%,
        var(--ds-color-bg-muted) 100%
      );
    background-size: 200% 100%;
    animation: ds-skeleton-shimmer var(--ds-skeleton-duration, 4s) linear infinite;
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
    from { background-position: 200% 0; }
    to { background-position: 0 0; }
  }

  @media (prefers-reduced-motion: reduce) {
    .item {
      animation: none;
      background-size: 100% 100%;
    }
  }
`;
