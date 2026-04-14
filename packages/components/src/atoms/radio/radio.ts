import { html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement, FormControlMixin } from '@ds/core';
import { radioStyles } from './radio.styles.js';

/**
 * @tag ds-radio
 * @summary Single option in a radio group; coordinates via `name` within the same form/root.
 * @slot default - The visible label.
 * @event ds-change - Fires when this radio becomes checked.
 */
export class DsRadio extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, radioStyles];

  @property({ type: Boolean, reflect: true }) checked = false;
  @property() radioValue = '';

  override updated(changed: Map<string, unknown>): void {
    if (changed.has('checked')) {
      this.value = this.checked ? this.radioValue || 'on' : null;
    }
  }

  #uncheckSiblings(): void {
    const scope = this.form ?? this.getRootNode();
    if (!(scope instanceof HTMLElement) && !(scope instanceof ShadowRoot) && !(scope instanceof Document)) {
      return;
    }
    const selector = `ds-radio[name="${CSS.escape(this.name)}"]`;
    const siblings = (scope as Element | ShadowRoot | Document).querySelectorAll<DsRadio>(selector);
    siblings.forEach((sibling) => {
      if (sibling !== this) {
        sibling.checked = false;
      }
    });
  }

  #select = (): void => {
    if (this.disabled || this.checked) {
      return;
    }
    this.checked = true;
    this.#uncheckSiblings();
    this.emit('ds-change', { detail: { value: this.radioValue } });
  };

  #onKey = (event: KeyboardEvent): void => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault();
      this.#select();
    }
  };

  override render(): TemplateResult {
    return html`<label @click=${this.#select} @keydown=${this.#onKey}>
      <input
        type="radio"
        name=${this.name || ''}
        .checked=${this.checked}
        value=${this.radioValue}
        ?required=${this.required}
        ?disabled=${this.disabled}
      />
      <span class="dot" part="dot" aria-hidden="true"></span>
      <span part="label"><slot></slot></span>
    </label>`;
  }
}
