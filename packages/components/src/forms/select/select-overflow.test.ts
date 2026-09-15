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

  it('carries a tooltip whose tip the consumer fills', () => {
    const host = renderTile(2);
    const tooltip = host.querySelector('ds-tooltip');

    expect(tooltip).not.toBeNull();
    expect(tooltip?.querySelector('.tile-overflow')).not.toBeNull();
    expect(tooltip?.querySelector('slot[name="overflow-tip"]')?.getAttribute('slot')).toBe('tip');
  });

  it('takes focus when tapped, so the tip stays up until the reader leaves', () => {
    const tile = renderTile(2).querySelector<HTMLButtonElement>('.tile-overflow')!;

    tile.click();

    expect(document.activeElement).toBe(tile);
  });
});

function watchPopover(tooltip: Element): { shown: () => number } {
  const bubble = tooltip.shadowRoot!.querySelector('.tooltip') as HTMLElement;
  let shown = 0;
  let open = false;
  Object.assign(bubble, {
    showPopover: () => {
      shown += 1;
      open = true;
    },
    hidePopover: () => {
      open = false;
    },
  });
  Object.defineProperty(bubble, 'matches', {
    configurable: true,
    value: (selector: string) => (selector === ':popover-open' ? open : false),
  });
  return { shown: () => shown };
}

async function hoverTile(tooltip: Element): Promise<void> {
  tooltip.shadowRoot!.querySelector('.anchor')!.dispatchEvent(new MouseEvent('mouseenter', { bubbles: true }));
  await (tooltip as Element & { updateComplete: Promise<unknown> }).updateComplete;
}

function fillOverflowTip(el: DsSelect): HTMLElement {
  const tip = document.createElement('span');
  tip.slot = 'overflow-tip';
  tip.textContent = 'Ada, Bo, Cy';
  el.append(tip);
  return tip;
}

describe('the overflow tip', () => {
  it('stays down while the consumer has filled nothing', async () => {
    const el = await mountOverflowing();
    const tooltip = el.shadowRoot!.querySelector('ds-tooltip')!;
    const popover = watchPopover(tooltip);

    await hoverTile(tooltip);

    expect(popover.shown()).toBe(0);
  });

  it('opens on hover once the tip is filled, even through the nested slot', async () => {
    const el = await mountOverflowing();
    const tooltip = el.shadowRoot!.querySelector('ds-tooltip')!;
    const popover = watchPopover(tooltip);

    fillOverflowTip(el);
    await new Promise((resolve) => setTimeout(resolve, 0));
    await hoverTile(tooltip);

    expect(popover.shown()).toBe(1);
  });

  it('goes quiet again once the consumer empties it', async () => {
    const el = await mountOverflowing();
    const tooltip = el.shadowRoot!.querySelector('ds-tooltip')!;
    const popover = watchPopover(tooltip);
    const tip = fillOverflowTip(el);
    await new Promise((resolve) => setTimeout(resolve, 0));

    tip.remove();
    await new Promise((resolve) => setTimeout(resolve, 0));
    await hoverTile(tooltip);

    expect(popover.shown()).toBe(0);
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
