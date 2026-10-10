import { html, nothing, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import '../../data-display/icon/icons/check-circle-solid.js';

export interface StepListStep {
  label: string;
  description?: string;
  disabled?: boolean;
  reason?: string;
}

export type StepStatus = 'done' | 'current' | 'upcoming';

export type StepListLayout = 'list' | 'compact';

export function statusOf(index: number, currentIndex: number): StepStatus {
  if (index < currentIndex) {
    return 'done';
  }
  if (index === currentIndex) {
    return 'current';
  }
  return 'upcoming';
}

export function reasonId(index: number, layout: StepListLayout): string {
  return `reason-${layout}-${index}`;
}

function ariaCurrent(step: StepListStep, status: StepStatus): 'step' | undefined {
  return status === 'current' && !step.disabled ? 'step' : undefined;
}

function ariaDisabled(step: StepListStep): 'true' | undefined {
  return step.disabled ? 'true' : undefined;
}

export function renderMarker(status: StepStatus, index: number): TemplateResult {
  if (status === 'done') {
    return html`<ds-icon part="marker" class="marker marker-check" name="check-circle-solid"></ds-icon>`;
  }
  return html`<span part="marker" class="marker marker-number" aria-hidden="true">${index + 1}</span>`;
}

export function renderStepText(step: StepListStep): TemplateResult {
  return html`
    <span class="text">
      <span class="step-label">${step.label}</span>
      ${step.description ? html`<span class="step-description">${step.description}</span>` : nothing}
    </span>
  `;
}

export interface StepButtonOptions {
  describedBy: string | undefined;
  nativelyDisabled: boolean;
  onActivate: () => void;
}

export function renderStepButton(
  step: StepListStep,
  index: number,
  status: StepStatus,
  { describedBy, nativelyDisabled, onActivate }: StepButtonOptions,
): TemplateResult {
  const current = ariaCurrent(step, status);
  return html`<button
    type="button"
    class="step-control ds-focus-ring"
    tabindex=${ifDefined(current ? '-1' : undefined)}
    ?disabled=${nativelyDisabled}
    aria-disabled=${ifDefined(ariaDisabled(step))}
    aria-current=${ifDefined(current)}
    aria-describedby=${ifDefined(describedBy)}
    @click=${onActivate}
  >
    ${renderMarker(step.disabled ? 'upcoming' : status, index)}${renderStepText(step)}
  </button>`;
}

export function renderSegmentButton(
  step: StepListStep,
  status: StepStatus,
  { describedBy, nativelyDisabled, onActivate }: StepButtonOptions,
): TemplateResult {
  const current = ariaCurrent(step, status);
  return html`<button
    type="button"
    part="segment"
    class="segment ds-focus-ring"
    data-status=${status}
    tabindex=${ifDefined(current ? '-1' : undefined)}
    ?disabled=${nativelyDisabled}
    aria-disabled=${ifDefined(ariaDisabled(step))}
    aria-current=${ifDefined(current)}
    aria-label=${step.label}
    aria-describedby=${ifDefined(describedBy)}
    @click=${onActivate}
  ></button>`;
}

export interface ReasonTooltipOptions {
  index: number;
  layout: StepListLayout;
  reason: string | undefined;
  open: boolean;
  onEnter: (event: Event) => void;
  onLeave: (event: Event) => void;
  onPress: () => void;
}

export function renderInReasonTooltip(
  trigger: TemplateResult,
  { index, layout, reason, open, onEnter, onLeave, onPress }: ReasonTooltipOptions,
): TemplateResult {
  return html`
    <ds-tooltip
      class="reason-tooltip"
      trigger="manual"
      ?full-width=${layout === 'compact'}
      .open=${open}
      @mouseenter=${onEnter}
      @mouseleave=${onLeave}
      @focusin=${onEnter}
      @focusout=${onLeave}
      @pointerdown=${onPress}
    >
      ${trigger}
      <span slot="tip" id=${reasonId(index, layout)}>${reason}</span>
    </ds-tooltip>
  `;
}

export function renderCompactCurrentStep(step: StepListStep, index: number): TemplateResult {
  return html`<div class="compact-current">${renderMarker('current', index)}${renderStepText(step)}</div>`;
}
