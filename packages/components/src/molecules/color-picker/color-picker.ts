import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { DsElement, FormControlMixin } from '@ds/core';
import '../../atoms/button/define.js';
import '../card/define.js';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { ColorPickerCustomInputs } from './color-picker-custom-inputs.js';
import { ColorPickerPopover } from './color-picker-popover.js';
import { renderColorPickerPanel, renderColorPickerTrigger } from './color-picker.render.js';
import { ColorPickerSwatchFocus } from './color-picker-swatch-focus.js';
import { colorPickerStyles } from './color-picker.styles.js';
import './color-picker-swatch.js';
import {
  COLOR_FORMAT_ERROR,
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

  @query('#trigger') private triggerEl?: HTMLButtonElement;

  #swatchFocus = new ColorPickerSwatchFocus(
    this,
    () => this.#colorOptions(),
    () => this.#currentValue(),
  );

  #popover = new ColorPickerPopover(this, {
    focusTrigger: () => this.triggerEl?.focus(),
    onOpen: () => this.#swatchFocus.sync(),
  });

  #customInputs = new ColorPickerCustomInputs(this, {
    closePicker: () => this.#popover.close(true),
    commitAndClose: () => this.#commitAndClose(),
    emitChange: (value: string) => this.emit('ds-change', { detail: { value } }),
    emitInput: (value: string) => this.emit('ds-input', { detail: { value } }),
    setValidation: (message: string) => this.#syncValidity(message),
    setValue: (value: string) => {
      this.value = value;
    },
  });

  override get value(): FormDataEntryValue | null {
    return super.value;
  }

  override set value(next: FormDataEntryValue | null) {
    if (next === null || next === '') {
      super.value = '';
      this.#customInputs.syncEmpty();
      this.#syncValidity();
      return;
    }
    const normalized = normalizeHexColor(next);
    if (!normalized) {
      super.value = '';
      this.#customInputs.syncInvalid(String(next));
      this.#syncValidity(COLOR_FORMAT_ERROR);
      return;
    }
    super.value = normalized;
    this.#customInputs.syncValue(normalized);
    this.#syncValidity();
  }

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
    this.#popover.disconnect();
  }

  override willUpdate(changed: PropertyValues): void {
    if (changed.has('required') || changed.has('value')) {
      this.#syncValidity();
    }
    if (changed.has('colors')) {
      this.#swatchFocus.sync();
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

  #syncValidity(message = this.#customInputs.validationError): void {
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

  #clear = (): void => {
    this.value = '';
    this.emit('ds-change', { detail: { value: '' } });
    this.#popover.close(true);
  };

  #commitAndClose = (): void => {
    if (!this.#customInputs.commit()) {
      this.#customInputs.focusHexInput(this.shadowRoot);
      return;
    }
    this.emit('ds-change', { detail: { value: this.#currentValue() } });
    this.#popover.close(true);
  };

  #selectColor(option: ColorPickerOption): void {
    if (option.disabled || this.disabled) {
      return;
    }
    this.value = option.value;
    this.emit('ds-change', { detail: { value: option.value } });
    this.#popover.close(true);
  }

  override render(): TemplateResult {
    const options = this.#colorOptions();
    const current = this.#currentValue();
    const selected = this.#selectedOption(options);
    const renderParams = {
      clearable: this.clearable,
      current,
      disabled: this.disabled,
      focusedIndex: this.#swatchFocus.focusedIndex,
      invalid: this.invalid,
      label: this.label,
      nativeValue: this.#customInputs.nativeValue,
      onClear: this.#clear,
      onCommitAndClose: this.#commitAndClose,
      onNativeChange: this.#customInputs.onNativeChange,
      onNativeInput: this.#customInputs.onNativeInput,
      onSelectColor: (option: ColorPickerOption) => this.#selectColor(option),
      onSwatchKeydown: this.#swatchFocus.onKeydown,
      onTextChange: this.#customInputs.onTextChange,
      onTextInput: this.#customInputs.onTextInput,
      onTextKeydown: this.#customInputs.onTextKeydown,
      onTogglePicker: this.#popover.toggle,
      onTriggerKeydown: this.#popover.onTriggerKeydown,
      open: this.#popover.open,
      options,
      placeholder: this.placeholder,
      selected,
      textValue: this.#customInputs.textValue,
      validationError: this.#customInputs.validationError,
    };

    return html`
      ${this.label ? renderFieldLabel(this.label, this.required, 'trigger', this.optional) : nothing}
      <div class="control-wrap" @keydown=${this.#popover.onPanelKeydown}>
        ${renderColorPickerTrigger(renderParams)}
        ${this.#popover.open ? renderColorPickerPanel(renderParams) : nothing}
      </div>
      ${renderSubtext(this.description, this.error, this.invalid)}
    `;
  }
}
