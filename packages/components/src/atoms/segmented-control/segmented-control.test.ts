import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsSegmentedControl } from './segmented-control.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

const OPTIONS = [
  { value: 'off', label: 'Off' },
  { value: 'light', label: 'Light' },
  { value: 'natural', label: 'Natural' },
];

beforeAll(() => {
  if (!customElements.get('ds-segmented-control')) {
    customElements.define('ds-segmented-control', DsSegmentedControl);
  }
});

beforeEach(() => {
  resetTestDom();
});

async function mountControl(value = 'light'): Promise<DsSegmentedControl> {
  const el = await mount<DsSegmentedControl>(
    '<ds-segmented-control label="Voice"></ds-segmented-control>',
  );
  el.options = OPTIONS;
  el.value = value;
  await el.updateComplete;
  return el;
}

function segments(el: DsSegmentedControl): HTMLButtonElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.segment'));
}

describe('<ds-segmented-control>', () => {
  it('warns when label is missing', async () => {
    const warnings: unknown[][] = [];
    const original = console.warn;
    console.warn = (...args: unknown[]) => warnings.push(args);
    try {
      await mount<DsSegmentedControl>('<ds-segmented-control></ds-segmented-control>');
      expect(warnings.some(args => String(args[0]).includes('label'))).toBe(true);
    } finally {
      console.warn = original;
    }
  });

  it('renders one segment per option and marks the selected one', async () => {
    const el = await mountControl('light');
    const buttons = segments(el);
    expect(buttons).toHaveLength(3);
    expect(buttons.map(b => b.getAttribute('aria-checked'))).toEqual([
      'false',
      'true',
      'false',
    ]);
  });

  it('emits ds-change and updates value on click', async () => {
    const el = await mountControl('light');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', e => events.push(e as CustomEvent));

    segments(el)[2].click();
    await el.updateComplete;

    expect(el.value).toBe('natural');
    expect(events.at(-1)?.detail).toEqual({ value: 'natural' });
    expect(segments(el)[2].getAttribute('aria-checked')).toBe('true');
  });

  it('does not emit when the selected option is clicked again', async () => {
    const el = await mountControl('light');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', e => events.push(e as CustomEvent));

    segments(el)[1].click();
    await el.updateComplete;

    expect(events).toHaveLength(0);
  });

  it('does not emit when disabled', async () => {
    const el = await mountControl('light');
    el.disabled = true;
    await el.updateComplete;
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', e => events.push(e as CustomEvent));

    segments(el)[2].click();
    await el.updateComplete;

    expect(events).toHaveLength(0);
    expect(el.value).toBe('light');
  });

  it('renders a leading icon when an option provides one', async () => {
    const el = await mount<DsSegmentedControl>(
      '<ds-segmented-control label="Voice"></ds-segmented-control>',
    );
    el.options = [{ value: 'off', label: 'Off', icon: 'speaker-x-mark' }];
    el.value = 'off';
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('ds-icon')).not.toBeNull();
  });
});
