import { html, nothing, css, type TemplateResult, type CSSResult } from 'lit';

export const formFieldStyles: CSSResult = css`
  .label {
    display: inline-flex;
    align-items: baseline;
    gap: var(--ds-space-2);
    font-size: var(--ds-font-size-body-md);
    font-weight: var(--ds-font-weight-medium);
    color: var(--ds-color-fg);
    line-height: var(--ds-line-height-normal);
    cursor: default;
  }
  .required {
    color: var(--ds-color-danger);
  }
  .optional {
    font-size: var(--ds-font-size-body-sm);
    color: var(--ds-color-fg-muted);
    letter-spacing: var(--ds-letter-spacing-wide);
    text-transform: uppercase;
    font-weight: var(--ds-font-weight-regular);
  }
  .description {
    margin: 0;
    color: var(--ds-color-fg-muted);
  }
  .error {
    margin: 0;
    display: flex;
    align-items: center;
    gap: var(--ds-space-1);
    color: var(--ds-color-fg-muted);
  }
  /* 1em, not 1rem: a 16px icon would set the row height on its own. */
  .error-icon {
    width: 1em;
    height: 1em;
    flex-shrink: 0;
    color: var(--ds-color-danger);
  }
  .description,
  .error,
  .subtext-spacer {
    font-size: var(--ds-font-size-body-sm);
    line-height: var(--ds-line-height-none);
    min-block-size: 1lh;
  }
  .subtext-spacer {
    margin: 0;
  }
  .field-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: var(--ds-space-2);
  }
  .field-header {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: var(--ds-space-2);
  }
  .field-footer .description,
  .field-footer .error {
    flex: 1;
  }
  .char-count {
    margin: 0;
    margin-inline-start: auto;
    color: var(--ds-color-fg-muted);
    font-size: var(--ds-font-size-body-sm);
    line-height: var(--ds-line-height-normal);
    white-space: nowrap;
  }
`;

export function renderFieldLabel(label: string, required: boolean, forId: string, optional = false): TemplateResult {
  return html`
    <label class="label" for=${forId}>
      <span> ${label} ${required ? html`<span class="required" aria-hidden="true"> *</span>` : nothing} </span>
      ${optional ? html`<span class="optional" aria-hidden="true">optional</span>` : nothing}
    </label>
  `;
}

export function renderSubtext(
  description: string,
  error: string,
  invalid: boolean,
  messageSpace = false,
): TemplateResult | typeof nothing {
  if (invalid && error) {
    return html`
      <p class="error" role="alert">
        <!-- Heroicons 2.2.0 - 16/solid: exclamation-circle -->
        <svg class="error-icon" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14ZM8 4a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
          />
        </svg>
        ${error}
      </p>
    `;
  }
  if (description) {
    return html`<p class="description">${description}</p>`;
  }
  return messageSpace ? html`<p class="subtext-spacer" aria-hidden="true"></p>` : nothing;
}

export function renderFieldFooter(
  description: string,
  error: string,
  invalid: boolean,
  messageSpace = false,
): TemplateResult | typeof nothing {
  const subtext = renderSubtext(description, error, invalid, messageSpace);
  return subtext === nothing ? nothing : html`<div class="field-footer">${subtext}</div>`;
}

/** The counter must stay outside `<label>`, or it joins the field's a11y name. */
export function renderFieldHeader(
  label: string,
  required: boolean,
  forId: string,
  optional = false,
  currentLength = 0,
  maxLength?: number,
  charCount = false,
): TemplateResult | typeof nothing {
  const counter = renderCharCount(currentLength, maxLength, charCount);
  if (counter === nothing) {
    return label ? renderFieldLabel(label, required, forId, optional) : nothing;
  }
  const labelEl = label ? renderFieldLabel(label, required, forId, optional) : nothing;
  return html` <div class="field-header" part="field-header">${labelEl}${counter}</div> `;
}

function renderCharCount(
  currentLength: number,
  maxLength?: number,
  charCount = false,
): TemplateResult | typeof nothing {
  if (!charCount || maxLength === undefined) {
    return nothing;
  }
  return html`<p class="char-count" aria-live="polite">${currentLength}/${maxLength}</p>`;
}
