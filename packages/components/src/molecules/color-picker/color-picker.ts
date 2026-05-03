import { html, nothing, LitElement, type PropertyValues, type TemplateResult } from 'lit';
import { property, query } from 'lit/decorators.js';
import { DsElement, FormControlMixin } from '@ds/core';
import '../../atoms/button/define.js';
import '../../atoms/text-field/define.js';
import '../card/define.js';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { ColorPickerCustomInputs } from './color-picker-custom-inputs.js';
import { ColorPickerPopover } from './color-picker-popover.js';
import { colorPickerStyles } from './color-picker.styles.js';
import './color-picker-swatch-group.js';
import './input-color.js';
import {
  COLOR_FORMAT_ERROR,
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
  @property({ type: Boolean, reflect: true }) compact = false;

  @query('#trigger') private triggerEl?: HTMLElement;

  #popover = new ColorPickerPopover(this, {
    focusTrigger: () => this.#focusTrigger(),
    onOpen: () => {},
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
    if (!this.label && !this.compact) {
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
  }

  override updated(changed: PropertyValues): void {
    if (changed.has('label') || changed.has('compact') || changed.has('placeholder')) {
      this.setAriaLabel(this.#fieldAccessibleName());
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

  #fieldAccessibleName(): string | null {
    return this.label || (this.compact ? this.placeholder || 'Select color' : null);
  }

  #focusTrigger(): void {
    const button = this.triggerEl?.shadowRoot?.querySelector<HTMLButtonElement>('button');
    (button ?? this.triggerEl)?.focus();
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

  #selectColor(value: string): void {
    if (this.disabled) {
      return;
    }
    this.value = value;
    this.emit('ds-change', { detail: { value } });
    this.#popover.close(true);
  }

  #onSwatchGroupSelect = (event: CustomEvent<{ value: string }>): void => {
    this.#selectColor(event.detail.value);
  };

  override render(): TemplateResult {
    const options = this.#colorOptions();
    const current = this.#currentValue();
    const selected = this.#selectedOption(options);

    return html`
      ${this.label && !this.compact
        ? renderFieldLabel(this.label, this.required, 'trigger', this.optional)
        : nothing}
      <div class="control-wrap" @keydown=${this.#popover.onPanelKeydown}>
        ${this.#renderTrigger(current, selected)}
        ${this.#popover.open ? this.#renderPanel(options, current) : nothing}
      </div>
      ${this.compact ? nothing : renderSubtext(this.description, this.error, this.invalid)}
    `;
  }

  #renderTrigger(current: string, selected?: ColorPickerOption): TemplateResult {
    const label = selected ? getColorLabel(selected) : current || this.placeholder;

    return html`<ds-button
      id="trigger"
      class="trigger"
      part="trigger"
      variant="secondary"
      ?full-width=${!this.compact}
      ?disabled=${this.disabled}
      label=${this.#triggerAccessibleName(current, selected)}
      aria-haspopup="dialog"
      aria-expanded=${this.#popover.open ? 'true' : 'false'}
      aria-controls=${this.#popover.open ? 'panel' : nothing}
      aria-invalid=${this.invalid ? 'true' : 'false'}
      @ds-click=${this.#popover.toggle}
      @keydown=${this.#popover.onTriggerKeydown}
    >
      <span
        class="preview"
        part="preview"
        style=${current ? `--color-picker-value:${current}` : ''}
        aria-hidden="true"
      ></span>
      ${this.compact
        ? nothing
        : html`<span class="trigger-text">
            <span class=${current ? 'trigger-label' : 'trigger-label placeholder'}>${label}</span>
            ${current ? html`<span class="trigger-value">${current}</span>` : nothing}
          </span>`}
    </ds-button>`;
  }

  #triggerAccessibleName(current: string, selected?: ColorPickerOption): string {
    const base = this.label || this.placeholder || 'Select color';
    if (!current) {
      return base;
    }
    return `${base}: ${selected ? getColorLabel(selected) : current} ${current}`;
  }

  #renderPanel(options: ColorPickerOption[], current: string): TemplateResult {
    return html`<div
      id="panel"
      class="panel"
      part="panel"
      role="dialog"
      aria-label=${this.#fieldAccessibleName() || 'Color picker'}
    >
      <ds-card elevation="md">
        <span slot="title" class="panel-title">
          ${this.#fieldAccessibleName() || 'Color picker'}
        </span>
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
    return html`<ds-color-picker-swatch-group
      .options=${options}
      .value=${current}
      ?compact=${this.compact}
      ?disabled=${this.disabled}
      @ds-color-picker-swatch-group-select=${this.#onSwatchGroupSelect}
    ></ds-color-picker-swatch-group>`;
  }

  #renderCustomInputs(): TemplateResult {
    const validationError = this.#customInputs.validationError;

    return html`<section class="section" aria-labelledby="custom-label">
      <div id="custom-label" class="section-label">Custom color</div>
      <div class="custom-row">
        <ds-color-picker-input-color
          class="native-color"
          .value=${this.#customInputs.nativeValue}
          ?disabled=${this.disabled}
          @ds-input=${this.#customInputs.onNativeInput}
          @ds-change=${this.#customInputs.onNativeChange}
        ></ds-color-picker-input-color>
        <ds-text-field
          class="hex-input"
          input-label="Hex code"
          size="sm"
          placeholder="Hex code (#RRGGBB)"
          .value=${this.#customInputs.textValue}
          .error=${validationError}
          ?disabled=${this.disabled}
          ?invalid=${Boolean(validationError)}
          @ds-input=${this.#customInputs.onTextInput}
          @ds-change=${this.#customInputs.onTextChange}
          @keydown=${this.#customInputs.onTextKeydown}
        ></ds-text-field>
      </div>
    </section>`;
  }
}
