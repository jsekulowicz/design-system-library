import { html, nothing, css, type TemplateResult, type CSSResult } from 'lit';

export const formFieldStyles: CSSResult = css`
  .label {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-2);
    font-size: var(--ds-font-size-sm);
    font-weight: var(--ds-font-weight-medium);
    color: var(--ds-color-fg);
    line-height: 1.4;
    cursor: default;
  }
  .required {
    color: var(--ds-color-danger);
  }
  .optional {
    font-size: var(--ds-font-size-2xs);
    color: var(--ds-color-fg-muted);
    letter-spacing: var(--ds-letter-spacing-wide);
    text-transform: uppercase;
    font-weight: var(--ds-font-weight-regular);
  }
  .description {
    margin: 0;
    font-size: var(--ds-font-size-xs);
    color: var(--ds-color-fg-muted);
    line-height: 1.4;
  }
  .error {
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
    font-size: var(--ds-font-size-xs);
    color: var(--ds-color-fg-muted);
    line-height: 1.4;
  }
  .error-icon {
    width: 1rem;
    height: 1rem;
    flex-shrink: 0;
    color: var(--ds-color-danger);
  }
`;

export function renderFieldLabel(label: string, required: boolean, forId: string, optional = false): TemplateResult {
  return html`
    <label class="label" for=${forId}>
      <span>
        ${label}
        ${required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing}
      </span>
      ${optional ? html`<span class="optional" aria-hidden="true">optional</span>` : nothing}
    </label>
  `;
}

export function renderSubtext(description: string, error: string, invalid: boolean): TemplateResult {
  if (invalid && error) {
    return html`
      <p class="error" role="alert">
        <!-- Heroicons 2.2.0 — 16/solid: exclamation-circle -->
        <svg class="error-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" clip-rule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z" />
        </svg>
        ${error}
      </p>
    `;
  }
  if (description) {
    return html`<p class="description">${description}</p>`;
  }
  return html``;
}
