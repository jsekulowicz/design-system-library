import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsRadio } from './radio.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-radio')) {
    customElements.define('ds-radio', DsRadio);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-radio>', () => {
  it('syncs form value from checked and radioValue', async () => {
    const el = await mount<DsRadio>('<ds-radio radiovalue="primary">Primary</ds-radio>');
    el.checked = true;
    await el.updateComplete;
    expect(el.value).toBe('primary');

    el.checked = false;
    await el.updateComplete;
    expect(el.value).toBeNull();
  });

  it('uses "on" as fallback form value when checked without radioValue', async () => {
    const el = await mount<DsRadio>('<ds-radio>Primary</ds-radio>');
    el.checked = true;
    await el.updateComplete;
    expect(el.value).toBe('on');
  });

  it('selects on click, unchecks siblings and emits ds-change', async () => {
    await mount('<div><ds-radio name="plan" radiovalue="a">A</ds-radio><ds-radio name="plan" radiovalue="b" checked>B</ds-radio></div>');
    const radios = Array.from(document.body.querySelectorAll<DsRadio>('ds-radio'));
    const [first, second] = radios;
    const events: CustomEvent[] = [];
    first.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    first.shadowRoot!.querySelector('label')!.click();
    await first.updateComplete;
    await second.updateComplete;

    expect(first.checked).toBe(true);
    expect(second.checked).toBe(false);
    expect(events[0]?.detail).toEqual({ value: 'a' });
  });

  it('does not emit when clicking disabled or already selected radio', async () => {
    const el = await mount<DsRadio>('<ds-radio radiovalue="a" checked disabled>A</ds-radio>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));
    el.shadowRoot!.querySelector('label')!.click();
    await el.updateComplete;
    expect(events).toHaveLength(0);
    expect(el.checked).toBe(true);
  });

  it('handles key selection for Space and Enter only', async () => {
    const el = await mount<DsRadio>('<ds-radio radiovalue="a">A</ds-radio>');
    const label = el.shadowRoot!.querySelector('label')!;
    label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(false);

    label.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(true);

    el.checked = false;
    await el.updateComplete;
    label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(true);
  });

  it('uses CSS.escape when available while selecting siblings', async () => {
    const originalCss = globalThis.CSS;
    const calls: string[] = [];
    globalThis.CSS = {
      escape: (value: string) => {
        calls.push(value);
        return value;
      },
    } as never;

    try {
      await mount('<div><ds-radio name="plan" radiovalue="a">A</ds-radio><ds-radio name="plan" radiovalue="b">B</ds-radio></div>');
      const first = document.body.querySelector<DsRadio>('ds-radio[radiovalue="a"]')!;
      first.shadowRoot!.querySelector('label')!.click();
      await first.updateComplete;
      expect(calls).toContain('plan');
    } finally {
      globalThis.CSS = originalCss;
    }
  });

  it('keeps selection logic safe when root scope is not queryable', async () => {
    const el = await mount<DsRadio>('<ds-radio name="plan" radiovalue="a">A</ds-radio>');
    (el as unknown as { getRootNode: () => object }).getRootNode = () => ({});
    el.shadowRoot!.querySelector('label')!.click();
    await el.updateComplete;
    expect(el.checked).toBe(true);
  });
});
