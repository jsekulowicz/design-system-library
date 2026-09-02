import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsSearchableSelect } from './searchable-select.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const OPTIONS = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular' },
];

beforeAll(() => {
  const proto = DsSearchableSelect.prototype as unknown as Record<string, () => void>;
  proto.setAriaLabel = () => {};
  proto.setAriaDescription = () => {};
});

beforeEach(resetTestDom);

async function mountOverflowing(): Promise<DsSearchableSelect> {
  const el = await mountWithProps<DsSearchableSelect>(
    '<ds-searchable-select label="Framework"></ds-searchable-select>',
    { options: OPTIONS, multiple: true, maxLines: 1, values: ['react', 'vue', 'angular'] },
    'ds-searchable-select',
  );
  el.shadowRoot!.querySelectorAll<HTMLElement>('.tile[data-value]').forEach((tile, index) => {
    Object.defineProperty(tile, 'offsetTop', { configurable: true, value: index * 32 });
  });
  el.values = [...el.values];
  await el.updateComplete;
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('.tile-overflow')).not.toBeNull();
  return el;
}

function press(target: HTMLElement, key: string): void {
  target.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true }));
}

describe('<ds-searchable-select> overflow tile', () => {
  it('reports the hidden count when activated by keyboard', async () => {
    const el = await mountOverflowing();
    let reported = -1;
    el.addEventListener('ds-overflow-click', (event) => {
      reported = (event as CustomEvent<{ count: number }>).detail.count;
    });

    press(el.shadowRoot!.querySelector<HTMLButtonElement>('.tile-overflow')!, 'Enter');
    await el.updateComplete;

    expect(reported).toBeGreaterThan(0);
  });
});
