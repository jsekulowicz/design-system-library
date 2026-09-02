import { describe, it, expect, beforeEach } from 'vitest';
import './define.js';
import type { DsSegmentedControl } from './segmented-control.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const OPTIONS = [
  { value: 'a', label: 'A' },
  { value: 'b', label: 'B' },
];

beforeEach(resetTestDom);

async function mount(props: Partial<DsSegmentedControl> = {}): Promise<DsSegmentedControl> {
  return mountWithProps<DsSegmentedControl>('<ds-segmented-control label="Visibility"></ds-segmented-control>', {
    options: OPTIONS,
    value: 'a',
    ...props,
  });
}

function description(el: DsSegmentedControl): HTMLElement | null {
  return el.shadowRoot?.querySelector<HTMLElement>('.description') ?? null;
}

describe('description-lines', () => {
  it('holds the space so a value-dependent description cannot reflow the page', async () => {
    const el = await mount({ description: 'Short', descriptionLines: 3 });
    expect(description(el)?.style.minHeight).toBe('calc(3lh)');
  });

  it('holds it even with no description at all, so the gap does not appear later', async () => {
    const el = await mount({ descriptionLines: 2 });
    const paragraph = description(el);
    expect(paragraph).not.toBeNull();
    expect(paragraph?.getAttribute('aria-hidden')).toBe('true');
  });

  it('reserves nothing unless asked, which is how it shipped', async () => {
    const el = await mount({ description: 'Short' });
    expect(description(el)?.style.minHeight).toBe('');
  });
});
