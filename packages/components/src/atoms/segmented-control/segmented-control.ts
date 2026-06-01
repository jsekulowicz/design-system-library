import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { segmentedControlStyles } from './segmented-control.styles.js';
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
  static override styles = [...DsElement.styles, segmentedControlStyles];

  @property() label = '';
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

  override render(): TemplateResult {
    return html`
      <div class="group" role="radiogroup" aria-label=${this.label} part="group">
        ${this.options.map(option => {
          const selected = option.value === this.value;
          return html`
            <button
              type="button"
              class="segment"
              part="segment"
              role="radio"
              aria-checked=${selected ? 'true' : 'false'}
              ?disabled=${this.disabled || option.disabled}
              @click=${() => this.#select(option)}
            >
              ${option.icon
                ? html`<ds-icon name=${option.icon} size="md" part="icon"></ds-icon>`
                : nothing}
              <span class="label">${option.label}</span>
            </button>
          `;
        })}
      </div>
    `;
  }
}
