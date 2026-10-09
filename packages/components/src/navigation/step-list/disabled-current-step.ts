import type { StepListStep } from './step-list-templates.js';

export function stepAsRendered(step: StepListStep, index: number, currentIndex: number): StepListStep {
  if (index !== currentIndex || !step.disabled) {
    return step;
  }
  return { ...step, disabled: false, reason: undefined };
}

export function warnWhenTheCurrentStepTurnsDisabled(
  steps: StepListStep[],
  currentIndex: number,
  currentStepWasDisabled: boolean,
): boolean {
  const currentStepIsDisabled = Boolean(steps[currentIndex]?.disabled);
  if (currentStepIsDisabled && !currentStepWasDisabled) {
    console.warn(
      `<ds-step-list>: the step at current-index ${currentIndex} is disabled. Disabled only stops the reader moving to a step, so it is shown as the current step.`,
    );
  }
  return currentStepIsDisabled;
}
