import { html, type TemplateResult } from 'lit';

export function renderLoadingOverlay(content: unknown): TemplateResult {
  return html`
    <div class="loading-overlay" part="loading" role="status" aria-live="polite">
      <span class="loading-overlay-label">${content}</span>
    </div>
  `;
}

export function renderLoadingStatus(content: unknown): TemplateResult {
  return html`
    <div class="visually-hidden" role="status" aria-live="polite">${content}</div>
  `;
}
