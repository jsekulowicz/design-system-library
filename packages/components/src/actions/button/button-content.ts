import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { spinnerTemplate } from '../../shared/spinner.js';

function contentWithSpinnerOverlaidOnTop(loading: boolean): TemplateResult {
  return html`
    <span class="content ${loading ? 'is-hidden' : ''}">
      <slot name="leading"></slot>
      <slot></slot>
      <slot name="trailing"></slot>
    </span>
    ${loading ? html`<span class="loading-overlay">${spinnerTemplate()}</span>` : nothing}
  `;
}

function contentStackedWithInFlowLoadingLabel(loading: boolean, loadingLabel: string): TemplateResult {
  return html`
    <span class="stack labels">
      <span class="stack-item ${loading ? 'is-hidden' : ''}" aria-hidden=${ifDefined(loading ? 'true' : undefined)}>
        <slot name="leading"></slot>
        <slot></slot>
      </span>
      <span class="stack-item ${loading ? '' : 'is-hidden'}" aria-hidden=${ifDefined(loading ? undefined : 'true')}>
        ${spinnerTemplate(loading ? '' : 'is-hidden')} ${loadingLabel}
      </span>
    </span>
    <slot name="trailing"></slot>
  `;
}

export function buttonContent(loading: boolean, loadingLabel?: string): TemplateResult {
  if (loadingLabel) {
    return contentStackedWithInFlowLoadingLabel(loading, loadingLabel);
  }
  return contentWithSpinnerOverlaidOnTop(loading);
}
