import { html, type TemplateResult } from 'lit';
import { live } from 'lit/directives/live.js';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { DEFAULT_COLOR, normalizeHexColor } from './color-utils.js';
import { inputColorStyles } from './input-color.styles.js';

/**
 * @tag ds-color-picker-input-color
 * @summary Native color input wrapper used inside ds-color-picker.
 * @event ds-input - Fires on live color edits. Detail: `{ value }`.
 * @event ds-change - Fires when the color is committed. Detail: `{ value }`.
 * @csspart input - The native color input.
 */
export class DsColorPickerInputColor extends DsElement {
  static override styles = [...DsElement.styles, inputColorStyles];

  @property() value = DEFAULT_COLOR;
  @property() label = 'Pick custom color';
  @property({ type: Boolean, reflect: true }) disabled = false;

  #onInput = (event: Event): void => {
    this.#updateValue(event, 'ds-input');
  };

  #onChange = (event: Event): void => {
    this.#updateValue(event, 'ds-change');
  };

  #updateValue(event: Event, name: 'ds-input' | 'ds-change'): void {
    if (this.disabled) {
      return;
    }
    const value = normalizeHexColor((event.target as HTMLInputElement).value);
    if (!value) {
      return;
    }
    this.value = value;
    this.emit(name, { detail: { value } });
  }

  override render(): TemplateResult {
    return html`<input
      part="input"
      type="color"
      .value=${live(this.value || DEFAULT_COLOR)}
      ?disabled=${this.disabled}
      aria-label=${this.label}
      @input=${this.#onInput}
      @change=${this.#onChange}
    />`;
  }
}
