import { css, html, type TemplateResult } from 'lit';
import '../actions/button/define.js';
import '../data-display/icon/define.js';
import '../data-display/icon/icons/x-mark.js';

export const clearButtonStyles = css`
  .clear-btn {
    --ds-button-text: var(--ds-color-fg-muted);
  }
`;

export function renderClearButton(
  clearLabel: string,
  onClear: (event: Event) => void,
  onKeydown?: (event: KeyboardEvent) => void,
): TemplateResult {
  return html`<ds-button
    class="clear-btn"
    variant="ghost"
    size="xs"
    square
    label=${clearLabel}
    @click=${onClear}
    @keydown=${onKeydown}
  >
    <ds-icon slot="leading" name="x-mark" size="md"></ds-icon>
  </ds-button>`;
}
