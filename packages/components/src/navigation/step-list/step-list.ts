import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { SlotPresenceController } from '../../shared/slot-presence.js';
import { stepListStyles } from './step-list.styles.js';
import { stepListRailStyles } from './step-list-rail.styles.js';
import { ReasonTooltipController } from './reason-tooltip-controller.js';
import {
  reasonId,
  renderMarker,
  renderSegmentButton,
  renderStepButton,
  renderStepText,
  type StepButtonOptions,
  type StepListLayout,
  type StepListStep,
  type StepStatus,
} from './step-list-templates.js';

export type { StepListStep } from './step-list-templates.js';

/**
 * @tag ds-step-list
 * @summary Numbered progress trail for a stepped form. Marks steps before the current index done
 * and lets the reader move to any step the host has not disabled, ahead of the current one included.
 * @slot trailing - Controls above the steps, such as a reset action.
 * @attr {boolean} compact - Forces the condensed current-step-plus-rail layout, which a container
 * narrower than the `md` breakpoint already switches to on its own.
 * @event ds-step-select - Fires when the reader picks a step that is neither the current one nor disabled.
 * Asking a disabled step for its `reason` never fires it. Detail: `{ index: number }`.
 * @csspart nav - The internal `<nav>` element.
 * @csspart trailing - The wrapper around the trailing slot.
 * @csspart list - The ordered `<ol>` of steps.
 * @csspart step - Each step's container.
 * @csspart marker - A step's circular index/checkmark.
 * @csspart segment - One step's segment of the condensed rail.
 * @cssprop --ds-step-list-marker-size - Diameter of each step's marker. Defaults to `2rem`.
 * @cssprop --ds-step-list-text-gap - Space between a step's label and its description. Defaults to `--ds-space-1`.
 * @cssprop --ds-step-list-segment-target - Height of a condensed rail segment's touch target. Defaults to `2.75rem`.
 */
export class DsStepList extends DsElement {
  static override styles = [...DsElement.styles, stepListStyles, stepListRailStyles];

  @property() label = 'Steps';
  @property({ type: Array }) steps: StepListStep[] = [];
  @property({ type: Number, attribute: 'current-index' }) currentIndex = 0;
  @property({ type: Boolean, reflect: true }) compact = false;

  readonly #slots = new SlotPresenceController(this, ['trailing']);
  readonly #reasonTooltip = new ReasonTooltipController(this, (index) => this.#hasReasonToGive(index));

  #statusOf(index: number): StepStatus {
    if (index < this.currentIndex) {
      return 'done';
    }
    if (index === this.currentIndex) {
      return 'current';
    }
    return 'upcoming';
  }

  #isReachable(index: number): boolean {
    return !this.steps[index]?.disabled && index !== this.currentIndex;
  }

  #hasReasonToGive(index: number): boolean {
    const step = this.steps[index];
    return Boolean(step?.disabled && step.reason);
  }

  #activate(index: number): void {
    if (this.#hasReasonToGive(index)) {
      this.#reasonTooltip.toggle(index);
      return;
    }
    if (!this.#isReachable(index)) {
      return;
    }
    this.#reasonTooltip.close();
    this.emit('ds-step-select', { detail: { index } });
  }

  #wrapInReasonTooltip(index: number, layout: StepListLayout, trigger: TemplateResult): TemplateResult {
    return html`
      <ds-tooltip class="reason-tooltip" ?full-width=${layout === 'rail'} .open=${this.#reasonTooltip.isOpenFor(index)}>
        ${trigger}
        <span slot="tip" id=${reasonId(index, layout)}>${this.steps[index]?.reason}</span>
      </ds-tooltip>
    `;
  }

  #renderWithReasonIfGiven(
    step: StepListStep,
    index: number,
    layout: StepListLayout,
    renderButton: (options: StepButtonOptions) => TemplateResult,
  ): TemplateResult {
    const hasReason = this.#hasReasonToGive(index);
    const button = renderButton({
      describedBy: hasReason ? reasonId(index, layout) : undefined,
      nativelyDisabled: Boolean(step.disabled) && !hasReason,
      onActivate: () => this.#activate(index),
    });
    return hasReason ? this.#wrapInReasonTooltip(index, layout, button) : button;
  }

  #renderStep(step: StepListStep, index: number): TemplateResult {
    const status = this.#statusOf(index);
    return html`
      <li part="step" class="step${step.disabled ? ' step-disabled' : ''}" data-status=${status}>
        ${this.#renderWithReasonIfGiven(step, index, 'list', (options) => renderStepButton(step, index, status, options))}
      </li>
    `;
  }

  #renderSegment(step: StepListStep, index: number): TemplateResult {
    const status = this.#statusOf(index);
    return this.#renderWithReasonIfGiven(step, index, 'rail', (options) => renderSegmentButton(step, status, options));
  }

  #renderCondensed(): TemplateResult {
    const currentStep = this.steps[this.currentIndex];
    return html`
      <div class="condensed">
        ${
          currentStep
            ? html`<div class="condensed-current">
                ${renderMarker('current', this.currentIndex)}${renderStepText(currentStep)}
              </div>`
            : nothing
        }
        <div class="rail">${this.steps.map((step, index) => this.#renderSegment(step, index))}</div>
      </div>
    `;
  }

  override render(): TemplateResult {
    return html`
      <nav part="nav" aria-label=${this.label} @focusout=${this.#reasonTooltip.close}>
        <div part="trailing" class="trailing" ?hidden=${!this.#slots.has('trailing')}>
          <slot name="trailing" @slotchange=${this.#slots.handleSlotChange}></slot>
        </div>
        <ol part="list" role="list">
          ${this.steps.map((step, index) => this.#renderStep(step, index))}
        </ol>
        ${this.#renderCondensed()}
      </nav>
    `;
  }
}
