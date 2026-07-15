import { beforeEach, describe, expect, it } from 'vitest';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';
import type { DsStatTile } from './stat-tile.js';
import './define.js';

beforeEach(() => resetTestDom());

async function mountTile(props: Partial<DsStatTile> = {}): Promise<DsStatTile> {
  return mountWithProps<DsStatTile>('<ds-stat-tile></ds-stat-tile>', props);
}

describe('<ds-stat-tile>', () => {
  it('renders its value, label, and hint', async () => {
    const element = await mountTile({ value: 42, label: 'Completed', hint: 'This month' });

    expect(element.shadowRoot!.querySelector('.value')?.textContent?.trim()).toBe('42');
    expect(element.shadowRoot!.querySelector('.label')?.textContent?.trim()).toBe('Completed');
    expect(element.shadowRoot!.querySelector('.hint')?.textContent?.trim()).toBe('This month');
  });

  it('replaces the value with a skeleton while loading', async () => {
    const element = await mountTile({ value: 42, label: 'Completed', loading: true });

    expect(element.shadowRoot!.querySelector('.value ds-skeleton')).not.toBeNull();
    expect(element.shadowRoot!.querySelector('.tile')?.getAttribute('aria-busy')).toBe('true');
  });

  it('shows consumer-provided hint content', async () => {
    const element = await mountTile();
    const skeleton = document.createElement('ds-skeleton');
    skeleton.slot = 'hint';
    element.append(skeleton);
    element.shadowRoot!.querySelector('slot[name="hint"]')!.dispatchEvent(new Event('slotchange'));
    await element.updateComplete;

    expect(element.shadowRoot!.querySelector('.hint')?.hasAttribute('hidden')).toBe(false);
  });

  it('hides empty label and hint containers', async () => {
    const element = await mountTile({ label: '   ', hint: '   ' });

    expect(element.shadowRoot!.querySelector('.label')?.hasAttribute('hidden')).toBe(true);
    expect(element.shadowRoot!.querySelector('.hint')?.hasAttribute('hidden')).toBe(true);
  });

  it('shows consumer-provided label content', async () => {
    const element = await mountTile();
    const label = document.createElement('span');
    label.slot = 'label';
    element.append(label);
    element.shadowRoot!.querySelector('slot[name="label"]')!.dispatchEvent(new Event('slotchange'));
    await element.updateComplete;

    expect(element.shadowRoot!.querySelector('.label')?.hasAttribute('hidden')).toBe(false);
  });
});
