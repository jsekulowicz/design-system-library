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

function segments(el: DsSegmentedControl): HTMLElement[] {
  return Array.from(el.shadowRoot!.querySelectorAll<HTMLElement>('.segment'));
}

function segmentSizes(el: DsSegmentedControl): (string | null)[] {
  return segments(el).map(s => s.getAttribute('size'));
}

// Each segment is a <ds-button>; its focusable element carries the radio role
// and checked state, and a native click on it is what triggers ds-click.
function nativeButton(segment: HTMLElement): HTMLButtonElement {
  return segment.shadowRoot!.querySelector<HTMLButtonElement>('button')!;
}

function checkedStates(el: DsSegmentedControl): (string | null)[] {
  return segments(el).map(s => nativeButton(s).getAttribute('aria-checked'));
}

function tabIndexes(el: DsSegmentedControl): (string | null)[] {
  return segments(el).map(s => nativeButton(s).getAttribute('tabindex'));
}

function pressKey(el: DsSegmentedControl, key: string): void {
  el.shadowRoot!.querySelector('.group')!.dispatchEvent(
    new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }),
  );
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
    expect(segments(el)).toHaveLength(3);
    expect(checkedStates(el)).toEqual(['false', 'true', 'false']);
  });

  it('uses regular sized buttons by default', async () => {
    const el = await mountControl('light');
    expect(segmentSizes(el)).toEqual(['md', 'md', 'md']);
  });

  it('uses small buttons when small is true', async () => {
    const el = await mountControl('light');
    el.small = true;
    await el.updateComplete;
    expect(segmentSizes(el)).toEqual(['sm', 'sm', 'sm']);
  });

  it('emits ds-change and updates value on click', async () => {
    const el = await mountControl('light');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', e => events.push(e as CustomEvent));

    nativeButton(segments(el)[2]).click();
    await el.updateComplete;

    expect(el.value).toBe('natural');
    expect(events.at(-1)?.detail).toEqual({ value: 'natural' });
    expect(checkedStates(el)[2]).toBe('true');
  });

  it('does not emit when the selected option is clicked again', async () => {
    const el = await mountControl('light');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', e => events.push(e as CustomEvent));

    nativeButton(segments(el)[1]).click();
    await el.updateComplete;

    expect(events).toHaveLength(0);
  });

  it('does not emit when disabled', async () => {
    const el = await mountControl('light');
    el.disabled = true;
    await el.updateComplete;
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', e => events.push(e as CustomEvent));

    nativeButton(segments(el)[2]).click();
    await el.updateComplete;

    expect(events).toHaveLength(0);
    expect(el.value).toBe('light');
  });

  it('renders a visible label and description', async () => {
    const el = await mount<DsSegmentedControl>(
      '<ds-segmented-control label="Voice" description="Pick a reading voice"></ds-segmented-control>',
    );
    el.options = OPTIONS;
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.label')?.textContent).toContain('Voice');
    expect(el.shadowRoot!.querySelector('.description')?.textContent).toContain(
      'Pick a reading voice',
    );
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

  it('keeps a single tab stop on the selected segment (roving tabindex)', async () => {
    const el = await mountControl('light');
    expect(tabIndexes(el)).toEqual(['-1', '0', '-1']);
  });

  it('falls back the tab stop to the first option when nothing is selected', async () => {
    const el = await mountControl('');
    expect(tabIndexes(el)).toEqual(['0', '-1', '-1']);
  });

  it('moves selection and the tab stop with ArrowRight (selection follows focus)', async () => {
    const el = await mountControl('light');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', e => events.push(e as CustomEvent));

    pressKey(el, 'ArrowRight');
    await el.updateComplete;

    expect(el.value).toBe('natural');
    expect(events.at(-1)?.detail).toEqual({ value: 'natural' });
    expect(tabIndexes(el)).toEqual(['-1', '-1', '0']);
    expect(checkedStates(el)).toEqual(['false', 'false', 'true']);
  });

  it('wraps to the last option with ArrowLeft from the first', async () => {
    const el = await mountControl('off');
    pressKey(el, 'ArrowLeft');
    await el.updateComplete;
    expect(el.value).toBe('natural');
  });

  it('jumps to first/last with Home and End', async () => {
    const el = await mountControl('light');
    pressKey(el, 'End');
    await el.updateComplete;
    expect(el.value).toBe('natural');
    pressKey(el, 'Home');
    await el.updateComplete;
    expect(el.value).toBe('off');
  });

  it('skips disabled options while arrowing', async () => {
    const el = await mount<DsSegmentedControl>(
      '<ds-segmented-control label="Voice"></ds-segmented-control>',
    );
    el.options = [
      { value: 'off', label: 'Off' },
      { value: 'light', label: 'Light', disabled: true },
      { value: 'natural', label: 'Natural' },
    ];
    el.value = 'off';
    await el.updateComplete;

    pressKey(el, 'ArrowRight');
    await el.updateComplete;
    expect(el.value).toBe('natural');
  });

  it('ignores arrow keys when the whole control is disabled', async () => {
    const el = await mountControl('light');
    el.disabled = true;
    await el.updateComplete;

    pressKey(el, 'ArrowRight');
    await el.updateComplete;
    expect(el.value).toBe('light');
  });
});
