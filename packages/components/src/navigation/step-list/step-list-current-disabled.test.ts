import { describe, it, expect, beforeEach, afterEach, vi, type MockInstance } from 'vitest';
import type { DsStepList, StepListStep } from './step-list.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const WITH_THE_SECOND_STEP_RULED_OUT: StepListStep[] = [
  { label: 'One' },
  { label: 'Two', disabled: true, reason: 'Not yet' },
  { label: 'Three' },
];

let warn: MockInstance<typeof console.warn>;

beforeEach(() => {
  resetTestDom();
  warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
});

afterEach(() => {
  warn.mockRestore();
});

function mountOnTheRuledOutStep(): Promise<DsStepList> {
  return mountWithProps<DsStepList>('<ds-step-list></ds-step-list>', {
    steps: WITH_THE_SECOND_STEP_RULED_OUT,
    currentIndex: 1,
  });
}

function listStep(el: DsStepList, index: number): HTMLLIElement {
  return el.shadowRoot!.querySelectorAll<HTMLLIElement>('[part="step"]')[index];
}

function segment(el: DsStepList, index: number): HTMLButtonElement {
  return el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[part="segment"]')[index];
}

async function setSteps(el: DsStepList, steps: StepListStep[]): Promise<void> {
  el.steps = steps;
  await el.updateComplete;
}

describe('<ds-step-list> when the host disables the current step', () => {
  it('marks the step the reader is on as current even when the host has disabled it', async () => {
    const el = await mountOnTheRuledOutStep();
    const step = listStep(el, 1);
    const button = step.querySelector('button')!;

    expect(step.dataset.status).toBe('current');
    expect(step.classList.contains('step-disabled')).toBe(false);
    expect(button.getAttribute('aria-current')).toBe('step');
    expect(button.disabled).toBe(false);
    expect(button.hasAttribute('aria-disabled')).toBe(false);
    expect(segment(el, 1).getAttribute('aria-current')).toBe('step');
    expect(segment(el, 1).hasAttribute('aria-disabled')).toBe(false);
  });

  it('offers no reason tooltip for the current step, which the reader cannot be asked to reach', async () => {
    const el = await mountOnTheRuledOutStep();
    const selected: number[] = [];
    el.addEventListener('ds-step-select', (event) =>
      selected.push((event as CustomEvent<{ index: number }>).detail.index),
    );

    listStep(el, 1).querySelector('button')!.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.reason-tooltip')).toBeNull();
    expect(listStep(el, 1).querySelector('button')!.hasAttribute('aria-describedby')).toBe(false);
    expect(selected).toEqual([]);
  });

  it('warns the host once when the current step is disabled', async () => {
    const el = await mountOnTheRuledOutStep();
    el.label = 'Checkout';
    await el.updateComplete;

    expect(warn).toHaveBeenCalledTimes(1);
    expect(warn).toHaveBeenCalledWith(
      expect.stringContaining('<ds-step-list>: the step at current-index 1 is disabled'),
    );
  });

  it('warns again only when a later update disables the step the reader is on anew', async () => {
    const enabled = WITH_THE_SECOND_STEP_RULED_OUT.map(({ label }) => ({ label }));
    const el = await mountWithProps<DsStepList>('<ds-step-list></ds-step-list>', { steps: enabled, currentIndex: 1 });
    expect(warn).not.toHaveBeenCalled();

    await setSteps(el, WITH_THE_SECOND_STEP_RULED_OUT);
    await setSteps(el, enabled);
    await setSteps(el, WITH_THE_SECOND_STEP_RULED_OUT);

    expect(warn).toHaveBeenCalledTimes(2);
  });
});
