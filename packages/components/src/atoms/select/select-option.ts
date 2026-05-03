import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { selectOptionStyles } from './select-option.styles.js';

/**
 * @tag ds-select-option
 * @summary The row element rendered by `ds-select` and `ds-searchable-select` for each option.
 * @slot leading - Icon, avatar, or image rendered before the primary text.
 * @slot default - Primary text.
 * @slot description - Optional secondary line below the primary text.
 * @slot trailing - Trailing content (badge, shortcut).
 * @csspart check - The checkmark icon shown when `selected`.
 * @event ds-activate - Fires when the option is activated. Detail: `{ value, originalEvent }`.
 */
export class DsSelectOption extends DsElement {
  static override styles = [...DsElement.styles, selectOptionStyles];

  @property() value = '';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) active = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.hasAttribute('role')) this.setAttribute('role', 'option');
    this.addEventListener('click', this.#onClick);
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('disabled')) {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
    if (changed.has('selected')) {
      this.setAttribute('aria-selected', this.selected ? 'true' : 'false');
    }
  }

  #onClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      event.stopImmediatePropagation();
      return;
    }
    this.emit('ds-activate', { detail: { value: this.value, originalEvent: event } });
  };

  override render(): TemplateResult {
    return html`<span class="leading"><slot name="leading"></slot></span>
      <span class="content">
        <span class="primary"><slot></slot></span>
        <span class="description"><slot name="description"></slot></span>
      </span>
      <span class="trailing">
        ${this.selected ? this.#renderCheck() : nothing}
        <slot name="trailing"></slot>
      </span>`;
  }

  #renderCheck(): TemplateResult {
    return html`<svg
      class="check"
      part="check"
      viewBox="0 0 16 16"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fill-rule="evenodd"
        d="M12.416 3.376a.75.75 0 0 1 .208 1.04l-5 7.5a.75.75 0 0 1-1.154.114l-3-3a.75.75 0 0 1 1.06-1.06l2.353 2.353 4.493-6.74a.75.75 0 0 1 1.04-.207Z"
        clip-rule="evenodd"
      />
    </svg>`;
  }
}
