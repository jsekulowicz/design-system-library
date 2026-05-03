import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { getColorLabel } from './color-utils.js';
import type { ColorPickerOption } from './types.js';

export interface ColorPickerRenderParams {
  clearable: boolean;
  current: string;
  disabled: boolean;
  focusedIndex: number;
  invalid: boolean;
  label: string;
  nativeValue: string;
  onClear: () => void;
  onCommitAndClose: () => void;
  onNativeChange: () => void;
  onNativeInput: (event: Event) => void;
  onSelectColor: (option: ColorPickerOption) => void;
  onSwatchKeydown: (event: KeyboardEvent, index: number) => void;
  onTextChange: () => void;
  onTextInput: (event: Event) => void;
  onTextKeydown: (event: KeyboardEvent) => void;
  onTogglePicker: () => void;
  onTriggerKeydown: (event: KeyboardEvent) => void;
  open: boolean;
  options: ColorPickerOption[];
  placeholder: string;
  selected?: ColorPickerOption;
  textValue: string;
  validationError: string;
}

export function renderColorPickerTrigger(params: ColorPickerRenderParams): TemplateResult {
  const label = params.selected
    ? getColorLabel(params.selected)
    : params.current || params.placeholder;

  return html`<button
    id="trigger"
    class="trigger"
    part="trigger"
    type="button"
    ?disabled=${params.disabled}
    aria-haspopup="dialog"
    aria-expanded=${params.open ? 'true' : 'false'}
    aria-controls=${params.open ? 'panel' : nothing}
    aria-invalid=${params.invalid ? 'true' : 'false'}
    aria-label=${ifDefined(params.label || params.placeholder || undefined)}
    @click=${params.onTogglePicker}
    @keydown=${params.onTriggerKeydown}
  >
    <span
      class="preview"
      part="preview"
      style=${params.current ? `--color-picker-value:${params.current}` : ''}
      aria-hidden="true"
    ></span>
    <span class="trigger-text">
      <span class=${params.current ? 'trigger-label' : 'trigger-label placeholder'}>${label}</span>
      ${params.current ? html`<span class="trigger-value">${params.current}</span>` : nothing}
    </span>
  </button>`;
}

export function renderColorPickerPanel(params: ColorPickerRenderParams): TemplateResult {
  return html`<div id="panel" class="panel" part="panel" role="dialog" aria-label=${params.label}>
    <ds-card elevation="md">
      <span slot="title" class="panel-title">${params.label || 'Color picker'}</span>
      ${params.options.length ? renderSwatches(params) : nothing}
      ${renderCustomInputs(params)}
      <div slot="footer" class="panel-actions">
        ${params.clearable
          ? html`<ds-button variant="ghost" size="sm" @ds-click=${params.onClear}>Clear</ds-button>`
          : nothing}
        <ds-button variant="primary" size="sm" @ds-click=${params.onCommitAndClose}>Done</ds-button>
      </div>
    </ds-card>
  </div>`;
}

function renderSwatches(params: ColorPickerRenderParams): TemplateResult {
  return html`<section class="section" aria-labelledby="swatches-label">
    <div id="swatches-label" class="section-label">Preset colors</div>
    <div class="swatches" role="radiogroup" aria-labelledby="swatches-label">
      ${params.options.map((option, index) => renderSwatch(params, option, index))}
    </div>
  </section>`;
}

function renderSwatch(
  params: ColorPickerRenderParams,
  option: ColorPickerOption,
  index: number,
): TemplateResult {
  const selected = option.value === params.current;
  const tabbable = params.focusedIndex === index && !option.disabled;

  return html`<ds-color-picker-swatch
    role="radio"
    data-swatch-index=${index}
    tabindex=${tabbable ? '0' : '-1'}
    .value=${option.value}
    .label=${getColorLabel(option)}
    .selected=${selected}
    .disabled=${Boolean(option.disabled)}
    @ds-color-picker-swatch-select=${() => params.onSelectColor(option)}
    @keydown=${(event: KeyboardEvent) => params.onSwatchKeydown(event, index)}
  ></ds-color-picker-swatch>`;
}

function renderCustomInputs(params: ColorPickerRenderParams): TemplateResult {
  return html`<section class="section" aria-labelledby="custom-label">
    <div id="custom-label" class="section-label">Custom color</div>
    <div class="custom-row">
      <input
        class="native-color"
        type="color"
        .value=${live(params.nativeValue)}
        ?disabled=${params.disabled}
        aria-label="Pick custom color"
        @input=${params.onNativeInput}
        @change=${params.onNativeChange}
      />
      <label class="hex-field">
        <span class="hex-label">Hex</span>
        <input
          class="hex-input"
          type="text"
          spellcheck="false"
          autocapitalize="off"
          placeholder="#RRGGBB"
          .value=${live(params.textValue)}
          ?disabled=${params.disabled}
          aria-invalid=${params.validationError ? 'true' : 'false'}
          @input=${params.onTextInput}
          @change=${params.onTextChange}
          @keydown=${params.onTextKeydown}
        />
      </label>
    </div>
    ${params.validationError
      ? html`<p class="input-error" role="alert">${params.validationError}</p>`
      : nothing}
  </section>`;
}
