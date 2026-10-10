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

describe('<ds-step-list> dismissing a reason', () => {
  it('forgets an explanation once the step opens up, so it cannot return unasked when the step closes again', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    stepEls(el)[1].querySelector('button')!.click();
    await el.updateComplete;

    el.steps = [{ label: 'One' }, { label: 'Two' }];
    await el.updateComplete;
    el.steps = [{ label: 'One' }, { label: 'Two', disabled: true, reason: 'Not yet' }];
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(false);
  });

  it('stops explaining on Escape even when the click that opened it left focus on the page, as Safari does', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    stepEls(el)[1].querySelector('button')!.click();
    await el.updateComplete;

    document.body.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(false);
  });

  it('stops explaining once the reader looks somewhere else', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    stepEls(el)[1].querySelector('button')!.click();
    await el.updateComplete;

    stepEls(el)[1]
      .querySelector('button')!
      .dispatchEvent(new FocusEvent('focusout', { relatedTarget: document.body, bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(false);
  });

  it('stops explaining a step once focus moves on to the next one, so two reasons never show at once', async () => {
    const el = await mountStepList({
      steps: [{ label: 'One' }, { label: 'Two', disabled: true, reason: 'Not yet' }, { label: 'Three' }],
      currentIndex: 0,
    });
    const [, explained, next] = [...stepEls(el)].map((step) => step.querySelector('button')!);
    explained.click();
    await el.updateComplete;

    explained.dispatchEvent(new FocusEvent('focusout', { relatedTarget: next, bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(false);
  });

  it('leaves Escape to whatever surrounds the step list when it has nothing to dismiss', async () => {
    await mountStepList({ currentIndex: 0 });
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });

    document.body.dispatchEvent(escape);

    expect(escape.defaultPrevented).toBe(false);
  });

  it('keeps an Escape that dismissed a reason from also closing a surrounding dialog', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    stepEls(el)[1].querySelector('button')!.click();
    await el.updateComplete;
    const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });

    document.body.dispatchEvent(escape);

    expect(escape.defaultPrevented).toBe(true);
  });

  it('stops explaining when the reader clicks outside, where a tap never moves focus', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    stepEls(el)[1].querySelector('button')!.click();
    await el.updateComplete;

    document.body.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(false);
  });

  it('keeps explaining through a click inside the step list', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    stepEls(el)[1].querySelector('button')!.click();
    await el.updateComplete;

    el.shadowRoot!.querySelector('nav')!.click();
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(true);
  });

  it('forgets an explanation when the step list leaves the page, so it does not reappear on return', async () => {
    const el = await mountStepList({ currentIndex: 0 });
    stepEls(el)[1].querySelector('button')!.click();
    await el.updateComplete;

    const parent = el.parentElement!;
    el.remove();
    parent.append(el);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-tooltip')!.hasAttribute('open')).toBe(false);
  });
});
