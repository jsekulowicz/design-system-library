import { html, nothing, type PropertyValues, type TemplateResult } from 'lit';
import { property, state } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { getColorLabel, normalizeColorOptions } from './color-utils.js';
import './color-picker-swatch.js';
import { colorPickerSwatchGroupStyles } from './color-picker-swatch-group.styles.js';
import type { ColorPickerOption } from './types.js';

/**
 * @tag ds-color-picker-swatch-group
 * @summary Roving radiogroup for ds-color-picker preset swatches.
 * @event ds-color-picker-swatch-group-select - Fires when a swatch is selected.
 */
export class DsColorPickerSwatchGroup extends DsElement {
  static override styles = [...DsElement.styles, colorPickerSwatchGroupStyles];

  @property({ type: Array }) options: ColorPickerOption[] = [];
  @property() value = '';
  @property() label = 'Preset colors';
  @property({ type: Boolean, reflect: true }) disabled = false;
  @property({ type: Boolean, reflect: true }) compact = false;

  @state() private _focusedIndex = -1;

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('options') || changed.has('value')) {
      this.#syncFocusedIndex();
    }
  }

  #normalizedOptions(): ColorPickerOption[] {
    return normalizeColorOptions(this.options);
  }

  #syncFocusedIndex(): void {
    const options = this.#normalizedOptions();
    const selected = options.findIndex((option) => option.value === this.value);
    const firstEnabled = options.findIndex((option) => !option.disabled);
    this._focusedIndex = selected >= 0 && !options[selected]?.disabled ? selected : firstEnabled;
  }

  #onSelect = (event: CustomEvent<{ value: string }>): void => {
    const option = this.#normalizedOptions().find((item) => item.value === event.detail.value);
    if (!option || option.disabled || this.disabled) {
      return;
    }
    this.emit('ds-color-picker-swatch-group-select', { detail: { value: option.value } });
  };

  #onKeydown(event: KeyboardEvent, index: number): void {
    const handled = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (!handled.includes(event.key)) {
      return;
    }
    event.preventDefault();
    this.#moveFocus(event.key, index);
  }

  #moveFocus(key: string, index: number): void {
    const enabled = this.#normalizedOptions()
      .map((option, i) => (option.disabled ? -1 : i))
      .filter((i) => i >= 0);
    if (!enabled.length) {
      return;
    }
    const next = this.#nextIndex(key, index, enabled);
    this._focusedIndex = enabled[next] ?? enabled[0] ?? -1;
    void this.updateComplete.then(() => this.#focusSwatch());
  }

  #nextIndex(key: string, index: number, enabled: number[]): number {
    const current = Math.max(0, enabled.indexOf(index));
    const last = enabled.length - 1;
    if (key === 'Home') {
      return 0;
    }
    if (key === 'End') {
      return last;
    }
    return key === 'ArrowRight' || key === 'ArrowDown'
      ? this.#nextForward(current, last)
      : this.#nextBackward(current, last);
  }

  #nextForward(current: number, last: number): number {
    return current >= last ? 0 : current + 1;
  }

  #nextBackward(current: number, last: number): number {
    return current <= 0 ? last : current - 1;
  }

  #focusSwatch(): void {
    const swatch = this.shadowRoot?.querySelector<HTMLElement>(
      `ds-color-picker-swatch[data-swatch-index="${this._focusedIndex}"]`,
    );
    swatch?.focus();
  }

  #renderSwatch(option: ColorPickerOption, index: number): TemplateResult {
    const selected = option.value === this.value;
    const tabbable = this._focusedIndex === index && !option.disabled && !this.disabled;

    return html`<ds-color-picker-swatch
      data-swatch-index=${index}
      tabindex=${tabbable ? '0' : '-1'}
      .value=${option.value}
      .label=${getColorLabel(option)}
      .selected=${selected}
      .disabled=${this.disabled || Boolean(option.disabled)}
      @ds-color-picker-swatch-select=${this.#onSelect}
      @keydown=${(event: KeyboardEvent) => this.#onKeydown(event, index)}
    ></ds-color-picker-swatch>`;
  }

  override render(): TemplateResult {
    const options = this.#normalizedOptions();
    return html`
      <div id="swatches-label" class="section-label">${this.label}</div>
      <div class="swatches" role="radiogroup" aria-labelledby="swatches-label">
        ${options.length ? options.map((option, index) => this.#renderSwatch(option, index)) : nothing}
      </div>
    `;
  }
}
