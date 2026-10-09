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

function selectedIndex(event: Event): number {
  return (event as CustomEvent<{ index: number }>).detail.index;
}

function collectSelections(el: DsStepList): number[] {
  const selected: number[] = [];
  el.addEventListener('ds-step-select', (event) => selected.push(selectedIndex(event)));
  return selected;
}

describe('<ds-step-list> compact layout', () => {
  it('offers a compact view of the current step alongside the full row, for CSS to choose between', async () => {
    const el = await mountStepList({ currentIndex: 1 });
    expect(el.shadowRoot!.querySelector('[part="list"]')).not.toBeNull();
    expect(el.shadowRoot!.querySelector('.compact-current .step-label')!.textContent).toBe('Visibility');
    expect(el.shadowRoot!.querySelectorAll('.segment')).toHaveLength(3);
  });

  it('reflects compact as an attribute so the stylesheet can force the compact layout', async () => {
    const el = await mountStepList({ currentIndex: 1, compact: true });
    expect(el.hasAttribute('compact')).toBe(true);
  });

  it('leaves the compact current step out when there are no steps to show', async () => {
    const el = await mountWithProps<DsStepList>('<ds-step-list></ds-step-list>', {});
    expect(el.shadowRoot!.querySelector('.compact-current')).toBeNull();
  });

  it('moves between steps from the compact rail', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    const selected = collectSelections(el);

    el.shadowRoot!.querySelectorAll<HTMLButtonElement>('[part="segment"]')[2]!.click();

    expect(selected).toEqual([2]);
  });

  it('names each rail segment after the step it stands for', async () => {
    const el = await mountStepList({ currentIndex: 1 });
    const segments = el.shadowRoot!.querySelectorAll('[part="segment"]');

    expect([...segments].map((segment) => segment.getAttribute('aria-label'))).toEqual([
      'Name and size',
      'Visibility',
      'Vocabulary',
    ]);
    expect(segments[1]!.getAttribute('aria-current')).toBe('step');
  });
});
