import { describe, it, expect, beforeEach } from 'vitest';
import type { DsStepList, StepListStep } from './step-list.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const STEPS: StepListStep[] = [
  { label: 'Name and size', description: 'Required' },
  { label: 'Visibility' },
  { label: 'Vocabulary' },
];

beforeEach(() => {
  resetTestDom();
});

function mountStepList(props: Partial<DsStepList> = {}): Promise<DsStepList> {
  return mountWithProps<DsStepList>('<ds-step-list></ds-step-list>', { steps: STEPS, ...props });
}

function stepEls(el: DsStepList): NodeListOf<HTMLLIElement> {
  return el.shadowRoot!.querySelectorAll<HTMLLIElement>('[part="step"]');
}

function selectedIndex(event: Event): number {
  return (event as CustomEvent<{ index: number }>).detail.index;
}

function collectSelections(el: DsStepList): number[] {
  const selected: number[] = [];
  el.addEventListener('ds-step-select', (event) => selected.push(selectedIndex(event)));
  return selected;
}

function followSelections(el: DsStepList): void {
  el.addEventListener('ds-step-select', (event) => {
    el.currentIndex = selectedIndex(event);
  });
}

describe('<ds-step-list>', () => {
  it('marks every step before the current index done', async () => {
    const el = await mountStepList({ currentIndex: 2 });
    const steps = stepEls(el);
    expect(steps[0].getAttribute('data-status')).toBe('done');
    expect(steps[1].getAttribute('data-status')).toBe('done');
    expect(steps[2].getAttribute('data-status')).toBe('current');
  });

  it('leaves steps after the current index upcoming', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    const steps = stepEls(el);
    expect(steps[1].getAttribute('data-status')).toBe('upcoming');
    expect(steps[2].getAttribute('data-status')).toBe('upcoming');
  });

  it('marks aria-current="step" only on the current step', async () => {
    const el = await mountStepList({ currentIndex: 1 });
    const steps = stepEls(el);
    expect(steps[0].querySelector('[aria-current]')).toBeNull();
    expect(steps[1].querySelector('[aria-current="step"]')).not.toBeNull();
    expect(steps[2].querySelector('[aria-current]')).toBeNull();
  });

  it("keeps a step's number out of its name, as a done step's checkmark already is", async () => {
    const el = await mountStepList({ currentIndex: 1 });
    const numbers = el.shadowRoot!.querySelectorAll('[part="step"] .marker-number');

    expect([...numbers].map((number) => number.getAttribute('aria-hidden'))).toEqual(['true', 'true']);
  });

  it('fires ds-step-select with the index of a done step the reader clicks', async () => {
    const el = await mountStepList({ currentIndex: 2 });
    const selected = collectSelections(el);
    const doneButton = stepEls(el)[0].querySelector('button')!;
    doneButton.click();
    expect(selected).toEqual([0]);
  });

  it('lets the reader jump ahead to a step the host left enabled', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    const selected = collectSelections(el);

    stepEls(el)[2].querySelector('button')!.click();

    expect(selected).toEqual([2]);
  });

  it('keeps focus on the step the reader moves onto, so the keyboard does not fall back to the top of the page', async () => {
    const el = await mountStepList({ currentIndex: 1 });
    followSelections(el);
    const doneStep = stepEls(el)[0].querySelector('button')!;

    doneStep.focus();
    doneStep.click();
    await el.updateComplete;

    expect(el.shadowRoot!.activeElement).toBe(doneStep);
    expect(doneStep.getAttribute('aria-current')).toBe('step');
  });

  it('leaves the step the reader is already on out of the tab order in both layouts, and selects nothing', async () => {
    const el = await mountStepList({ currentIndex: 1 });
    const selected = collectSelections(el);
    const step = stepEls(el)[1].querySelector('button')!;
    const segment = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[part="segment"]')[1]!;

    step.click();
    segment.click();

    expect([step.getAttribute('tabindex'), segment.getAttribute('tabindex')]).toEqual(['-1', '-1']);
    expect(selected).toEqual([]);
  });

  it('seats trailing content above the steps', async () => {
    const el = await mountWithProps<DsStepList>('<ds-step-list><button slot="trailing">Reset</button></ds-step-list>', {
      steps: STEPS,
    });
    const wrapper = el.shadowRoot!.querySelector('[part="trailing"]')!;
    expect((wrapper.querySelector('slot') as HTMLSlotElement).assignedElements()).toHaveLength(1);
    expect(wrapper.hasAttribute('hidden')).toBe(false);
  });

  it('keeps no room above the steps when nothing trails them', async () => {
    const el = await mountStepList({ currentIndex: 0 });

    expect(el.shadowRoot!.querySelector('[part="trailing"]')!.hasAttribute('hidden')).toBe(true);
  });

  it('rings every focusable step and rail segment when the keyboard reaches it', async () => {
    const el = await mountStepList({ currentIndex: 1 });
    const focusable = el.shadowRoot!.querySelectorAll('button');

    expect(focusable.length).toBeGreaterThan(0);
    expect([...focusable].every((control) => control.classList.contains('ds-focus-ring'))).toBe(true);
  });
});
