import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { DsElement, FormControlMixin } from '@ds/core';
import '../../atoms/button/define.js';
import '../card/define.js';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { colorPickerStyles } from './color-picker.styles.js';
import {
  COLOR_FORMAT_ERROR,
  DEFAULT_COLOR,
  getColorLabel,
  normalizeColorOptions,
  normalizeHexColor,
} from './color-utils.js';
import type { ColorPickerOption } from './types.js';

/**
 * @tag ds-color-picker
 * @summary Form-associated color picker with preset swatches and custom Hex RGB input.
 * @event ds-input - Fires on live custom color edits. Detail: `{ value }`.
 * @event ds-change - Fires when the committed color changes. Detail: `{ value }`.
 * @csspart trigger - The field trigger button.
 * @csspart preview - The selected color preview swatch.
 * @csspart panel - The popover panel.
 * @csspart swatch - Each preset color swatch.
 */
export class DsColorPicker extends FormControlMixin(DsElement) {
  static override styles = [...DsElement.styles, formFieldStyles, colorPickerStyles];
  static override shadowRootOptions: ShadowRootInit = {
    ...LitElement.shadowRootOptions,
    delegatesFocus: true,
  };

  @property({ type: Array }) colors: ColorPickerOption[] = [];
  @property() label = '';
  @property() placeholder = 'Select a color';
  @property() description = '';
  @property() error = '';
  @property({ type: Boolean, reflect: true }) invalid = false;
  @property({ type: Boolean, reflect: true }) optional = false;
  @property({ type: Boolean, reflect: true }) clearable = false;

  @state() private _open = false;
  @state() private _focusedIndex = -1;
  @state() private _textValue = '';
  @state() private _nativeValue = DEFAULT_COLOR;
  @state() private _validationError = '';

  @query('#trigger') private triggerEl?: HTMLButtonElement;
  @query('.hex-input') private hexInput?: HTMLInputElement;

  override get value(): FormDataEntryValue | null {
    return super.value;
  }

  override set value(next: FormDataEntryValue | null) {
    if (next === null || next === '') {
      super.value = '';
      this._textValue = '';
      this._nativeValue = DEFAULT_COLOR;
      this._validationError = '';
      this.#syncValidity();
      return;
    }
    const normalized = normalizeHexColor(next);
    if (!normalized) {
      super.value = '';
      this._textValue = String(next);
      this._validationError = COLOR_FORMAT_ERROR;
      this.#syncValidity(COLOR_FORMAT_ERROR);
      return;
    }
    super.value = normalized;
    this._textValue = normalized;
    this._nativeValue = normalized;
    this._validationError = '';
    this.#syncValidity();
  }

  #onDocumentClick = (event: MouseEvent): void => {
    if (!event.composedPath().includes(this)) {
      this.#closePicker();
    }
  };

  override connectedCallback(): void {
    super.connectedCallback();
    if (this.value === null) {
      this.value = '';
    }
    if (!this.label) {
      console.warn('<ds-color-picker>: the `label` property is required for accessibility.');
    }
  }

  override disconnectedCallback(): void {
    super.disconnectedCallback();
    this.#closePicker();
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('required') || changed.has('value')) {
      this.#syncValidity();
    }
    if (changed.has('colors')) {
      this.#syncFocusedIndex();
    }
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('label')) {
      this.setAriaLabel(this.label || null);
    }
    if (changed.has('description')) {
      this.setAriaDescription(this.description || null);
    }
  }

  #colorOptions(): ColorPickerOption[] {
    return normalizeColorOptions(this.colors);
  }

  #currentValue(): string {
    return typeof this.value === 'string' ? this.value : '';
  }

  #selectedOption(options: ColorPickerOption[]): ColorPickerOption | undefined {
    const current = this.#currentValue();
    return options.find((option) => option.value === current);
  }

  #syncValidity(message = this._validationError): void {
    const missing = this.required && !this.#currentValue();
    const validationMessage = message || (missing ? 'Please select a color.' : '');
    const flags = message ? { customError: true } : missing ? { valueMissing: true } : {};
    if (this.triggerEl) {
      this.setValidity(flags, validationMessage, this.triggerEl);
    } else {
      this.setValidity(flags, validationMessage);
    }
    this.invalid = Boolean(validationMessage);
  }

  #openPicker(): void {
    if (this.disabled || this._open) {
      return;
    }
    this._open = true;
    this.#syncFocusedIndex();
    document.addEventListener('click', this.#onDocumentClick);
  }

  #closePicker(focusTrigger = false): void {
    if (!this._open) {
      return;
    }
    this._open = false;
    document.removeEventListener('click', this.#onDocumentClick);
    if (focusTrigger) {
      void this.updateComplete.then(() => this.triggerEl?.focus());
    }
  }

  #togglePicker = (): void => {
    if (this._open) {
      this.#closePicker();
      return;
    }
    this.#openPicker();
  };

  #clear = (): void => {
    this.value = '';
    this.emit('ds-change', { detail: { value: '' } });
    this.#closePicker(true);
  };

  #commitAndClose = (): void => {
    if (!this.#commitTextValue()) {
      this.hexInput?.focus();
      return;
    }
    this.emit('ds-change', { detail: { value: this.#currentValue() } });
    this.#closePicker(true);
  };

  #selectColor(option: ColorPickerOption): void {
    if (option.disabled || this.disabled) {
      return;
    }
    this.value = option.value;
    this.emit('ds-change', { detail: { value: option.value } });
    this.#closePicker(true);
  }

  #commitTextValue(): boolean {
    if (!this._textValue) {
      this.value = '';
      return true;
    }
    const normalized = normalizeHexColor(this._textValue);
    if (!normalized) {
      this._validationError = COLOR_FORMAT_ERROR;
      this.#syncValidity(COLOR_FORMAT_ERROR);
      return false;
    }
    this.value = normalized;
    return true;
  }

  #onNativeInput = (event: Event): void => {
    const normalized = normalizeHexColor((event.target as HTMLInputElement).value);
    if (!normalized) {
      return;
    }
    this.value = normalized;
    this.emit('ds-input', { detail: { value: normalized } });
  };

  #onNativeChange = (): void => {
    this.emit('ds-change', { detail: { value: this.#currentValue() } });
  };

  #onTextInput = (event: Event): void => {
    const raw = (event.target as HTMLInputElement).value.trim();
    this._textValue = raw;
    if (raw === '') {
      this.value = '';
      this.emit('ds-input', { detail: { value: '' } });
      return;
    }
    const normalized = normalizeHexColor(raw);
    if (!normalized) {
      this._validationError = COLOR_FORMAT_ERROR;
      this.#syncValidity(COLOR_FORMAT_ERROR);
      return;
    }
    this.value = normalized;
    this.emit('ds-input', { detail: { value: normalized } });
  };

  #onTextChange = (): void => {
    if (this.#commitTextValue()) {
      this.emit('ds-change', { detail: { value: this.#currentValue() } });
    }
  };

  #onTriggerKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'ArrowDown' || event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.#openPicker();
    }
    if (event.key === 'Escape') {
      this.#closePicker(true);
    }
  };

  #onTextKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.#commitAndClose();
    }
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#closePicker(true);
    }
  };

  #onPanelKeydown = (event: KeyboardEvent): void => {
    if (event.key === 'Escape') {
      event.preventDefault();
      this.#closePicker(true);
    }
  };

  #onSwatchKeydown(event: KeyboardEvent, index: number): void {
    const options = this.#colorOptions();
    const handled = ['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'];
    if (handled.includes(event.key)) {
      event.preventDefault();
      this.#moveSwatchFocus(event.key, index, options);
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      const option = options[index];
      if (option) {
        this.#selectColor(option);
      }
    }
  }

  #moveSwatchFocus(key: string, index: number, options: ColorPickerOption[]): void {
    const enabled = options.map((option, i) => (option.disabled ? -1 : i)).filter((i) => i >= 0);
    if (enabled.length === 0) {
      return;
    }
    const first = enabled[0];
    if (first === undefined) {
      return;
    }
    const current = Math.max(0, enabled.indexOf(index));
    const last = enabled.length - 1;
    const next = key === 'Home' ? 0 : key === 'End' ? last : this.#nextEnabled(current, key, last);
    this._focusedIndex = enabled[next] ?? first;
    void this.updateComplete.then(() => this.#focusSwatch());
  }

  #nextEnabled(current: number, key: string, last: number): number {
    if (key === 'ArrowRight' || key === 'ArrowDown') {
      return current >= last ? 0 : current + 1;
    }
    return current <= 0 ? last : current - 1;
  }

  #syncFocusedIndex(): void {
    const options = this.#colorOptions();
    const selected = options.findIndex((option) => option.value === this.#currentValue());
    const firstEnabled = options.findIndex((option) => !option.disabled);
    this._focusedIndex = selected >= 0 && !options[selected]?.disabled ? selected : firstEnabled;
  }

  #focusSwatch(): void {
    const swatch = this.shadowRoot?.querySelector<HTMLElement>(
      `[data-swatch-index="${this._focusedIndex}"]`,
    );
    swatch?.focus();
  }

  override render(): TemplateResult {
    const options = this.#colorOptions();
    const current = this.#currentValue();
    const selected = this.#selectedOption(options);
    return html`
      ${this.label ? renderFieldLabel(this.label, this.required, 'trigger', this.optional) : nothing}
      <div class="control-wrap" @keydown=${this.#onPanelKeydown}>
        ${this.#renderTrigger(current, selected)}
        ${this._open ? this.#renderPanel(options, current) : nothing}
      </div>
      ${renderSubtext(this.description, this.error, this.invalid)}
    `;
  }

  #renderTrigger(current: string, selected?: ColorPickerOption): TemplateResult {
    const label = selected ? getColorLabel(selected) : current || this.placeholder;
    return html`<button
      id="trigger"
      class="trigger"
      part="trigger"
      type="button"
      ?disabled=${this.disabled}
      aria-haspopup="dialog"
      aria-expanded=${this._open ? 'true' : 'false'}
      aria-controls=${this._open ? 'panel' : nothing}
      aria-invalid=${this.invalid ? 'true' : 'false'}
      aria-label=${ifDefined(this.label || this.placeholder || undefined)}
      @click=${this.#togglePicker}
      @keydown=${this.#onTriggerKeydown}
    >
      <span
        class="preview"
        part="preview"
        style=${current ? `--color-picker-value:${current}` : ''}
        aria-hidden="true"
      ></span>
      <span class="trigger-text">
        <span class=${current ? 'trigger-label' : 'trigger-label placeholder'}>${label}</span>
        ${current ? html`<span class="trigger-value">${current}</span>` : nothing}
      </span>
    </button>`;
  }

  #renderPanel(options: ColorPickerOption[], current: string): TemplateResult {
    return html`<div id="panel" class="panel" part="panel" role="dialog" aria-label=${this.label}>
      <ds-card elevation="md">
        <span slot="title" class="panel-title">${this.label || 'Color picker'}</span>
        ${options.length ? this.#renderSwatches(options, current) : nothing}
        ${this.#renderCustomInputs()}
        <div slot="footer" class="panel-actions">
          ${this.clearable
            ? html`<ds-button variant="ghost" size="sm" @ds-click=${this.#clear}>Clear</ds-button>`
            : nothing}
          <ds-button variant="primary" size="sm" @ds-click=${this.#commitAndClose}>Done</ds-button>
        </div>
      </ds-card>
    </div>`;
  }

  #renderSwatches(options: ColorPickerOption[], current: string): TemplateResult {
    return html`<section class="section" aria-labelledby="swatches-label">
      <div id="swatches-label" class="section-label">Preset colors</div>
      <div class="swatches" role="radiogroup" aria-labelledby="swatches-label">
        ${options.map((option, index) => this.#renderSwatch(option, index, current))}
      </div>
    </section>`;
  }

  #renderSwatch(option: ColorPickerOption, index: number, current: string): TemplateResult {
    const selected = option.value === current;
    const label = `${getColorLabel(option)} ${option.value}`;
    const tabbable = this._focusedIndex === index && !option.disabled;
    return html`<button
      class="swatch"
      part="swatch"
      type="button"
      role="radio"
      data-swatch-index=${index}
      style=${`--color-picker-value:${option.value}`}
      aria-label=${label}
      aria-checked=${selected ? 'true' : 'false'}
      tabindex=${tabbable ? '0' : '-1'}
      ?disabled=${option.disabled}
      @click=${() => this.#selectColor(option)}
      @keydown=${(event: KeyboardEvent) => this.#onSwatchKeydown(event, index)}
    >
      ${this.#renderCheckIcon()}
    </button>`;
  }

  #renderCustomInputs(): TemplateResult {
    return html`<section class="section" aria-labelledby="custom-label">
      <div id="custom-label" class="section-label">Custom color</div>
      <div class="custom-row">
        <input
          class="native-color"
          type="color"
          .value=${live(this._nativeValue)}
          ?disabled=${this.disabled}
          aria-label="Pick custom color"
          @input=${this.#onNativeInput}
          @change=${this.#onNativeChange}
        />
        <label class="hex-field">
          <span class="hex-label">Hex</span>
          <input
            class="hex-input"
            type="text"
            spellcheck="false"
            autocapitalize="off"
            placeholder="#RRGGBB"
            .value=${live(this._textValue)}
            ?disabled=${this.disabled}
            aria-invalid=${this._validationError ? 'true' : 'false'}
            @input=${this.#onTextInput}
            @change=${this.#onTextChange}
            @keydown=${this.#onTextKeydown}
          />
        </label>
      </div>
      ${this._validationError ? html`<p class="input-error" role="alert">${this._validationError}</p>` : nothing}
    </section>`;
  }

  #renderCheckIcon(): TemplateResult {
    return html`<svg class="check" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M5 10.5l3 3L15 6"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>`;
  }
}
