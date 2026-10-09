import { html, nothing, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';
import { DsElement } from '@jsekulowicz/ds-core';
import { SlotPresenceController } from '../../shared/slot-presence.js';
import { stepListStyles } from './step-list.styles.js';
import { stepListCompactStyles } from './step-list-compact.styles.js';
import { ReasonTooltipController } from './reason-tooltip-controller.js';
import { RowFitController } from './row-fit-controller.js';
import { stepAsRendered, warnWhenTheCurrentStepTurnsDisabled } from './disabled-current-step.js';
import {
  reasonId,
  renderCompactCurrentStep,
  renderInReasonTooltip,
  renderSegmentButton,
  renderStepButton,
  statusOf,
  type StepButtonOptions,
  type StepListLayout,
  type StepListStep,
} from './step-list-templates.js';

export type { StepListStep } from './step-list-templates.js';

/**
 * @tag ds-step-list
 * @summary Numbered progress trail for a stepped form. Marks steps before the current index done
 * and lets the reader move to any step the host has not disabled, ahead of the current one included.
 * @slot trailing - Controls above the steps, such as a reset action.
 * @attr {boolean} compact - Forces the compact layout - the current step above a rail of segments. Without it the
 * component switches to that layout on its own whenever the full row of steps would not fit on one line.
 * @event ds-step-select - Fires when the reader picks a step that is neither the current one nor disabled.
 * Asking a disabled step for its `reason` never fires it. Detail: `{ index: number }`.
 * @csspart nav - The internal `<nav>` element.
 * @csspart trailing - The wrapper around the trailing slot.
 * @csspart list - The ordered `<ol>` of steps.
 * @csspart step - Each step's container.
 * @csspart marker - A step's circular index/checkmark.
 * @csspart segment - One step's segment of the compact layout's rail.
 * @cssprop --ds-step-list-marker-size - Diameter of each step's marker. Defaults to `2rem`.
 * @cssprop --ds-step-list-text-gap - Space between a step's label and its description. Defaults to `--ds-space-1`.
 * @cssprop --ds-step-list-connector-min - Shortest a line between two steps may get before the row stops fitting.
 * Defaults to `2rem`.
 * @cssprop --ds-step-list-segment-target - Height of a compact rail segment's touch target. Defaults to `2.75rem`.
 */
export class DsStepList extends DsElement {
  static override styles = [...DsElement.styles, stepListStyles, stepListCompactStyles];

  @property() label = 'Steps';
  @property({ type: Array }) steps: StepListStep[] = [];
  @property({ type: Number, attribute: 'current-index' }) currentIndex = 0;
  @property({ type: Boolean, reflect: true }) compact = false;

  readonly #slots = new SlotPresenceController(this, ['trailing']);
  readonly #reasonTooltip = new ReasonTooltipController(this, (index) => this.#hasReasonToGive(index));
  readonly #rowFit = new RowFitController(this, () => this.renderRoot.querySelector<HTMLElement>('[part="list"]'));
  #currentStepWasDisabled = false;

  override willUpdate(): void {
    this.#currentStepWasDisabled = warnWhenTheCurrentStepTurnsDisabled(
      this.steps,
      this.currentIndex,
      this.#currentStepWasDisabled,
    );
  }

  #isReachable(index: number): boolean {
    return !this.steps[index]?.disabled && index !== this.currentIndex;
  }

  #hasReasonToGive(index: number): boolean {
    const step = this.steps[index];
    return Boolean(step && stepAsRendered(step, index, this.currentIndex).disabled && step.reason);
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
    if (!hasReason) {
      return button;
    }
    return renderInReasonTooltip(button, {
      index,
      layout,
      reason: step.reason,
      open: this.#reasonTooltip.isOpenFor(index),
    });
  }

  #renderStep(step: StepListStep, index: number): TemplateResult {
    const status = statusOf(index, this.currentIndex);
    return html`
      <li part="step" class="step${step.disabled ? ' step-disabled' : ''}" data-status=${status}>
        ${this.#renderWithReasonIfGiven(step, index, 'list', (options) => renderStepButton(step, index, status, options))}
      </li>
    `;
  }

  #renderSegment(step: StepListStep, index: number): TemplateResult {
    const status = statusOf(index, this.currentIndex);
    return this.#renderWithReasonIfGiven(step, index, 'compact', (options) =>
      renderSegmentButton(step, status, options),
    );
  }

  #renderCompact(): TemplateResult {
    const currentStep = this.steps[this.currentIndex];
    return html`
      <div class="compact">
        ${currentStep ? renderCompactCurrentStep(currentStep, this.currentIndex) : nothing}
        <div class="rail">
          ${this.steps.map((step, index) => this.#renderSegment(stepAsRendered(step, index, this.currentIndex), index))}
        </div>
      </div>
    `;
  }

  override render(): TemplateResult {
    return html`
      <nav
        part="nav"
        class=${this.compact || !this.#rowFit.rowFits ? 'showing-compact' : ''}
        aria-label=${this.label}
        @focusout=${this.#reasonTooltip.close}
      >
        <div part="trailing" class="trailing" ?hidden=${!this.#slots.has('trailing')}>
          <slot name="trailing" @slotchange=${this.#slots.handleSlotChange}></slot>
        </div>
        <ol part="list" role="list">
          ${this.steps.map((step, index) => this.#renderStep(stepAsRendered(step, index, this.currentIndex), index))}
        </ol>
        ${this.#renderCompact()}
      </nav>
    `;
  }
}
