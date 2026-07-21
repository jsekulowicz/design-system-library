import { css, html, type TemplateResult } from 'lit';

/* Indeterminate progress arc shared by ds-button, ds-nav-item and ds-searchable-select. */
export function spinnerTemplate(extraClasses = ''): TemplateResult {
  return html`<svg
    class="spinner ds-allow-motion ${extraClasses}"
    part="spinner"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden="true"
  >
    <circle
      cx="12"
      cy="12"
      r="9"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-dasharray="42 56.55"
    />
  </svg>`;
}

export const spinnerStyles = css`
  .spinner {
    width: var(--ds-spinner-size, 1.25rem);
    height: var(--ds-spinner-size, 1.25rem);
    flex-shrink: 0;
    transform-box: view-box;
    transform-origin: 50% 50%;
    animation: ds-spin 0.75s linear infinite;
  }
  @keyframes ds-spin {
    to {
      transform: rotate(360deg);
    }
  }
  @media (prefers-reduced-motion: reduce) {
    .spinner {
      animation-duration: 1.6s;
    }
  }
`;
