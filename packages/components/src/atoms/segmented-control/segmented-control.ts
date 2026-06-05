import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { formFieldStyles, renderFieldLabel, renderSubtext } from '../../shared/form-field.js';
import { resolveRovingTarget } from '../../shared/roving-focus.js';
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
  @property({ type: Boolean, reflect: true }) small = false;

  override connectedCallback(): void {
    super.connectedCallback();
    if (!this.label) {
      console.warn(
        '<ds-segmented-control>: the `label` property is required for accessibility.',
      );
    }
  }

  // The single tab stop: the selected option, or the first enabled one when
  // nothing is selected yet. Arrow keys move focus (and selection) from here.
  get #tabStopIndex(): number {
    const selected = this.options.findIndex(option => option.value === this.value);
    if (selected >= 0) {
      return selected;
    }
    return this.options.findIndex(option => !option.disabled);
  }

  #select(option: SegmentedControlOption): void {
    if (this.disabled || option.disabled || option.value === this.value) {
      return;
    }
    this.value = option.value;
    this.emit('ds-change', { detail: { value: option.value } });
  }

  #focusSegment(index: number): void {
    const segments = this.renderRoot.querySelectorAll<HTMLElement>('.segment');
    segments[index]?.focus();
  }

  #onKeydown = (event: KeyboardEvent): void => {
    if (this.disabled) {
      return;
    }
    const target = resolveRovingTarget({
      key: event.key,
      currentIndex: this.#tabStopIndex,
      count: this.options.length,
      isDisabled: index => this.options[index]?.disabled === true,
    });
    if (target === null) {
      return;
    }
    const option = this.options[target];
    if (!option) {
      return;
    }
    event.preventDefault();
    // Selection follows focus, as the radiogroup pattern prescribes.
    this.#select(option);
    void this.updateComplete.then(() => this.#focusSegment(target));
  };

  #renderSegment(option: SegmentedControlOption, index: number): TemplateResult {
    const selected = option.value === this.value;
    return html`
      <ds-button
        class="segment"
        part="segment"
        size=${this.small ? 'sm' : 'md'}
        variant=${selected ? 'primary' : 'ghost'}
        full-width
        .roleAttr=${'radio'}
        .ariaCheckedAttr=${selected ? 'true' : 'false'}
        .tabIndexAttr=${index === this.#tabStopIndex ? 0 : -1}
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
      <div
        class="group"
        id="group"
        role="radiogroup"
        aria-label=${this.label}
        part="group"
        @keydown=${this.#onKeydown}
      >
        ${this.options.map((option, index) => this.#renderSegment(option, index))}
      </div>
      ${renderSubtext(this.description, '', false)}
    `;
  }
}
