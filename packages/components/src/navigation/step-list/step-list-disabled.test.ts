import { describe, it, expect, beforeEach } from 'vitest';
import type { DsStepList, StepListStep } from './step-list.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const STEPS: StepListStep[] = [{ label: 'One' }, { label: 'Two', disabled: true, reason: 'Not yet' }];

beforeEach(() => {
  resetTestDom();
});

function mountStepList(props: Partial<DsStepList> = {}): Promise<DsStepList> {
  return mountWithProps<DsStepList>('<ds-step-list></ds-step-list>', { steps: STEPS, ...props });
}

function stepEls(el: DsStepList): NodeListOf<HTMLLIElement> {
  return el.shadowRoot!.querySelectorAll<HTMLLIElement>('[part="step"]');
}

describe('<ds-step-list> disabled steps and their reasons', () => {
  it('leaves a disabled step unreachable even once it is behind the reader', async () => {
    const withSkipped: StepListStep[] = [
      { label: 'Name and size' },
      { label: 'Vocabulary' },
      { label: 'Extra words', disabled: true },
      { label: 'Summary' },
    ];
    const el = await mountStepList({ steps: withSkipped, currentIndex: 3 });
    const steps = stepEls(el);

    expect(steps[2].classList.contains('step-disabled')).toBe(true);
    expect(steps[2].querySelector('button')!.disabled).toBe(true);
    expect(steps[0].querySelector('button')!.disabled).toBe(false);
  });

  it('gives a disabled step the plain number rather than a checkmark it did not earn', async () => {
    const el = await mountStepList({
      steps: [{ label: 'One' }, { label: 'Two', disabled: true }, { label: 'Three' }],
      currentIndex: 2,
    });

    expect(stepEls(el)[1].querySelector('ds-icon')).toBeNull();
    expect(stepEls(el)[0].querySelector('ds-icon')).not.toBeNull();
  });

  it('never selects an unavailable step, however often it is asked', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    const selected: number[] = [];
    el.addEventListener('ds-step-select', () => selected.push(1));

    stepEls(el)[1].querySelector('button')!.click();
    await el.updateComplete;
    stepEls(el)[1].querySelector('button')!.click();

    expect(selected).toEqual([]);
  });

  it('keeps a disabled step with no reason to give out of the tab order in both layouts', async () => {
    const el = await mountStepList({
      steps: [{ label: 'One' }, { label: 'Two', disabled: true }],
      currentIndex: 0,
    });
    const step = stepEls(el)[1].querySelector('button')!;
    const segment = el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[part="segment"]')[1]!;

    expect([step.disabled, segment.disabled]).toEqual([true, true]);
    expect(segment.getAttribute('aria-disabled')).toBe('true');
  });

  it('keeps a rail segment with a reason to give focusable, so the reason can be asked for', async () => {
    const el = await mountStepList({ currentIndex: 0 });

    expect(el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[part="segment"]')[1]!.disabled).toBe(false);
  });

  it('lets an unavailable step be focused and asked why', async () => {
    const el = await mountStepList({
      steps: [{ label: 'One' }, { label: 'Two', disabled: true, reason: 'Fill in step one first' }, { label: 'Three' }],
      currentIndex: 0,
    });
    const step = stepEls(el)[1];
    const trigger = step.querySelector('button')!;

    expect(trigger.getAttribute('aria-disabled')).toBe('true');
    expect(step.querySelector('[slot="tip"]')!.textContent).toBe('Fill in step one first');
    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(false);

    trigger.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(true);
  });

  it('describes an unavailable step by the reason it gives, so a screen reader reads it too', async () => {
    const el = await mountStepList({
      steps: [{ label: 'One' }, { label: 'Two', disabled: true, reason: 'Fill in step one first' }],
      currentIndex: 0,
    });
    const step = stepEls(el)[1].querySelector('button')!;
    const segment = el.shadowRoot!.querySelectorAll<HTMLElement>('.segment')[1];
    const describedBy = [step, segment].map((el) => el.getAttribute('aria-describedby')!);

    expect(describedBy.map((id) => el.shadowRoot!.getElementById(id)?.textContent)).toEqual([
      'Fill in step one first',
      'Fill in step one first',
    ]);
  });

  it('keeps a rail segment tappable across its whole share of the rail even when it carries a reason', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    const wrapped = el.shadowRoot!.querySelector('.rail ds-tooltip')!;

    expect(wrapped.hasAttribute('full-width')).toBe(true);
  });

  it('keeps the full list and the compact rail on reasons of their own, so neither resolves to the hidden one', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    const step = stepEls(el)[1].querySelector('button')!.getAttribute('aria-describedby');
    const segment = el.shadowRoot!.querySelectorAll('.segment')[1].getAttribute('aria-describedby');
    const ids = [...el.shadowRoot!.querySelectorAll('[slot="tip"]')].map((tip) => tip.id);

    expect(step).not.toBe(segment);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('describes an available step by nothing at all', async () => {
    const el = await mountStepList({ steps: [{ label: 'One' }, { label: 'Two' }], currentIndex: 0 });

    expect(el.shadowRoot!.querySelectorAll('.segment')[1].hasAttribute('aria-describedby')).toBe(false);
  });
});
