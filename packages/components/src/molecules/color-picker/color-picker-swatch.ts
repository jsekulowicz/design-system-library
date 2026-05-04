import { html, type PropertyValues, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@ds/core';
import { colorPickerSwatchStyles } from './color-picker-swatch.styles.js';
import { getContrastingThemeColor } from './color-utils.js';

/**
 * @tag ds-color-picker-swatch
 * @summary Preset color swatch used inside ds-color-picker.
 * @event ds-color-picker-swatch-select - Fires when the swatch is activated.
 * @csspart swatch - The swatch host surface.
 */
export class DsColorPickerSwatch extends DsElement {
  static override styles = [...DsElement.styles, colorPickerSwatchStyles];

  @property() value = '';
  @property() label = '';
  @property({ type: Boolean, reflect: true }) selected = false;
  @property({ type: Boolean, reflect: true }) disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    this.setAttribute('role', 'radio');
    this.setAttribute('part', 'swatch');
    this.addEventListener('click', this.#onClick);
    this.addEventListener('keydown', this.#onKeydown);
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener('click', this.#onClick);
    this.removeEventListener('keydown', this.#onKeydown);
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('selected')) {
      this.setAttribute('aria-checked', this.selected ? 'true' : 'false');
    }
    if (changed.has('disabled')) {
      this.setAttribute('aria-disabled', this.disabled ? 'true' : 'false');
    }
    if (changed.has('label') || changed.has('value')) {
      this.setAttribute('aria-label', this.#accessibleLabel());
      this.style.setProperty('--color-picker-value', this.value);
      this.#syncCheckColor();
    }
  }

  #accessibleLabel(): string {
    return this.label ? `${this.label} ${this.value}` : this.value;
  }

  #onClick = (event: MouseEvent): void => {
    if (this.disabled) {
      event.preventDefault();
      return;
    }
    this.#select();
  };

  #onKeydown = (event: KeyboardEvent): void => {
    if (event.key !== 'Enter' && event.key !== ' ') {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    if (this.disabled) {
      return;
    }
    this.#select();
  };

  #select(): void {
    this.emit('ds-color-picker-swatch-select', { detail: { value: this.value } });
  }

  #syncCheckColor(): void {
    if (!this.value) {
      this.style.removeProperty('--color-picker-check-color');
      return;
    }

    const styles = getComputedStyle(this);
    const color = getContrastingThemeColor(
      this.value,
      styles.getPropertyValue('--ds-color-bg'),
      styles.getPropertyValue('--ds-color-fg'),
    );
    this.style.setProperty('--color-picker-check-color', color);
  }

  override render(): TemplateResult {
    return html`<svg class="check" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 10.5l3 3L15 6"
        stroke="currentColor"
        stroke-width="2.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>`;
  }
}
