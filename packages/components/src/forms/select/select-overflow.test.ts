import { describe, it, expect, beforeAll, beforeEach } from 'vitest';
import { DsSelect } from './select.js';
import './define.js';
import { renderOverflowTile } from './select.shared.js';
import { render } from 'lit';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  const proto = DsSelect.prototype as unknown as Record<string, () => void>;
  proto['setAriaLabel'] = () => {};
  proto['setAriaDescription'] = () => {};
});

const OPTIONS = [
  { value: 'a', label: 'Ada' },
  { value: 'b', label: 'Bo' },
  { value: 'c', label: 'Cy' },
];

beforeEach(resetTestDom);

function renderTile(count: number, onActivate?: () => void): HTMLElement {
  const host = document.createElement('div');
  document.body.append(host);
  render(renderOverflowTile(count, '{count} more', onActivate), host);
  return host;
}

async function mountOverflowing(props: Partial<DsSelect> = {}): Promise<DsSelect> {
  const el = await mountWithProps<DsSelect>('<ds-select label="People"></ds-select>', {
    options: OPTIONS,
    multiple: true,
    maxLines: 1,
    values: ['a', 'b', 'c'],
    ...props,
  });
  el.shadowRoot!.querySelectorAll<HTMLElement>('.tile[data-value]').forEach((tile, index) => {
    Object.defineProperty(tile, 'offsetTop', { configurable: true, value: index * 32 });
  });
  el.values = [...el.values];
  await el.updateComplete;
  await el.updateComplete;
  expect(el.shadowRoot!.querySelector('.tile-overflow')).not.toBeNull();
  return el;
}

describe('the overflow tile', () => {
  it('is a button, so what max-lines clipped can still be reached', () => {
    const tile = renderTile(3).querySelector('.tile-overflow');
    expect(tile?.tagName).toBe('BUTTON');
    expect(tile?.getAttribute('type')).toBe('button');
    expect(tile?.getAttribute('aria-label')).toBe('3 more');
  });

  it('reports how many are hidden when clicked', () => {
    let clicks = 0;
    renderTile(2, () => {
      clicks += 1;
    })
      .querySelector<HTMLButtonElement>('.tile-overflow')
      ?.click();
    expect(clicks).toBe(1);
  });

  it('renders nothing when everything fits', () => {
    expect(renderTile(0).querySelector('.tile-overflow')).toBeNull();
  });
});

describe('activating the overflow tile by keyboard', () => {
  it.each(['Enter', ' '])('reports the hidden count on %s rather than opening the dropdown', async (key) => {
    const el = await mountOverflowing();
    expect(el._overflowCount).toBeGreaterThan(0);

    let reported = -1;
    el.addEventListener('ds-overflow-click', (event) => {
      reported = (event as CustomEvent<{ count: number }>).detail.count;
    });

    const tile = el.shadowRoot!.querySelector<HTMLButtonElement>('.tile-overflow')!;
    tile.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true }));
    await el.updateComplete;

    expect(reported).toBe(el._overflowCount);
    expect(el._open).toBe(false);
  });

  it('does not let the trigger drive tile navigation while it holds focus', async () => {
    const el = await mountOverflowing();
    const tile = el.shadowRoot!.querySelector<HTMLButtonElement>('.tile-overflow')!;
    const press = (key: string) =>
      tile.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, composed: true, cancelable: true }));

    press('ArrowLeft');
    press('Backspace');
    await el.updateComplete;

    expect(el._focusedTileIndex).toBe(-1);
    expect(el.values).toEqual(['a', 'b', 'c']);
  });
});

describe('removing a tile', () => {
  it('counts as an interaction, so a required field revalidates', async () => {
    const select = await mountWithProps<DsSelect>('<ds-select label="People"></ds-select>', {
      options: OPTIONS,
      multiple: true,
      required: true,
      values: ['a'],
    });
    expect(select.invalid).toBe(false);

    select.shadowRoot?.querySelector<HTMLButtonElement>('.tile-remove')?.click();
    await select.updateComplete;

    expect(select.values).toEqual([]);
    expect(select.invalid).toBe(true);
  });
});
