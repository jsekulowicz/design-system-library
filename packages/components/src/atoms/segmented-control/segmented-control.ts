import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { segmentedControlStyles } from './segmented-control.styles.js';
import '../button/define.js';
import '../icon/define.js';

export interface SegmentedControlOption {
  value: string;
  label: string;
  /** Optional leading icon glyph name (the glyph must be imported by the host). */
  icon?: string;
  disabled?: boolean;
}

/**
 * @tag ds-segmented-control
 * @summary Single-select segmented control — a connected row of mutually
 *   exclusive options, each with an optional leading icon. A token-styled,
 *   inline alternative to a dropdown when there are only a few choices.
 * @event ds-change - Fires when the selection changes. Detail: `{ value: string }`.
 * @csspart group - The container that holds the segments.
 * @csspart segment - Each option button.
 */
export class DsSegmentedControl extends DsElement {
  static override styles = [...DsElement.styles, formFieldStyles, segmentedControlStyles];

  @property() label = '';
  @property() description = '';
  @property() value = '';
  @property({ type: Array }) options: SegmentedControlOption[] = [];
  @property({ type: Boolean, reflect: true }) disabled = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label) {
      console.warn(
        '<ds-segmented-control>: the `label` property is required for accessibility.',
      );
    }
  }

  #select(option: SegmentedControlOption): void {
    if (this.disabled || option.disabled || option.value === this.value) {
      return;
    }
    this.value = option.value;
    this.emit('ds-change', { detail: { value: option.value } });
  }

  #renderSegment(option: SegmentedControlOption): TemplateResult {
    const selected = option.value === this.value;
    return html`
      <ds-button
        class="segment"
        part="segment"
        size="sm"
        variant=${selected ? 'primary' : 'ghost'}
        full-width
        .roleAttr=${'radio'}
        .ariaCheckedAttr=${selected ? 'true' : 'false'}
        ?disabled=${this.disabled || option.disabled}
        @ds-click=${() => this.#select(option)}
      >
        ${option.icon
          ? html`<ds-icon slot="leading" name=${option.icon} size="sm"></ds-icon>`
          : nothing}
        ${option.label}
      </ds-button>
    `;
  }

  override render(): TemplateResult {
    return html`
      ${this.label ? renderFieldLabel(this.label, false, 'group') : nothing}
      <div class="group" id="group" role="radiogroup" aria-label=${this.label} part="group">
        ${this.options.map(option => this.#renderSegment(option))}
      </div>
      ${renderSubtext(this.description, '', false)}
    `;
  }
}
