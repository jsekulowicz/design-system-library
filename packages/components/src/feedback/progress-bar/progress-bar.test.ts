import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsProgressBar } from './progress-bar.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-progress-bar')) {
    customElements.define('ds-progress-bar', DsProgressBar);
  }
});

beforeEach(() => {
  resetTestDom();
});

function indicatorWidth(el: DsProgressBar): string {
  const indicator = el.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
  return indicator.style.width;
}

function isPartHidden(el: DsProgressBar, part: string): boolean {
  return el.shadowRoot!.querySelector(`[part="${part}"]`)!.hasAttribute('hidden');
}

describe('<ds-progress-bar>', () => {
  it('exposes progressbar semantics', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="30" max="120"></ds-progress-bar>');
    const wrapper = el.shadowRoot!.querySelector('[part="track"]')!;
    expect(wrapper.getAttribute('role')).toBe('progressbar');
    expect(wrapper.getAttribute('aria-valuemin')).toBe('0');
    expect(wrapper.getAttribute('aria-valuemax')).toBe('120');
    expect(wrapper.getAttribute('aria-valuenow')).toBe('30');
  });

  it('fills proportionally to value/max', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="25" max="100"></ds-progress-bar>');
    expect(indicatorWidth(el)).toBe('25%');
  });

  it('clamps the fill between 0 and 100 percent', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="500" max="100"></ds-progress-bar>');
    expect(indicatorWidth(el)).toBe('100%');
    el.value = -10;
    await el.updateComplete;
    expect(indicatorWidth(el)).toBe('0%');
  });

  it('renders zero fill when max is not positive', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="10" max="0"></ds-progress-bar>');
    expect(indicatorWidth(el)).toBe('0%');
  });

  it('shows the label only when slotted content exists', async () => {
    const empty = await mount<DsProgressBar>('<ds-progress-bar value="10"></ds-progress-bar>');
    expect(isPartHidden(empty, 'label')).toBe(true);

    const labeled = await mount<DsProgressBar>('<ds-progress-bar value="10">10 / 100</ds-progress-bar>');
    expect(isPartHidden(labeled, 'label')).toBe(false);
  });

  it('keeps a text-only label after the host is moved in the light DOM', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="10">10 / 100</ds-progress-bar>');
    expect(isPartHidden(el, 'label')).toBe(false);

    const destination = document.createElement('div');
    el.parentElement!.append(destination);
    destination.append(el);
    await el.updateComplete;

    expect(isPartHidden(el, 'label')).toBe(false);
  });

  it('shows the leading slot only when an icon is slotted into it', async () => {
    const plain = await mount<DsProgressBar>('<ds-progress-bar value="10">10 / 100</ds-progress-bar>');
    expect(isPartHidden(plain, 'leading')).toBe(true);

    const withIcon = await mount<DsProgressBar>(
      '<ds-progress-bar value="10"><span slot="leading">XP</span>Level 3</ds-progress-bar>',
    );
    expect(isPartHidden(withIcon, 'leading')).toBe(false);
    expect(isPartHidden(withIcon, 'label')).toBe(false);
  });

  it('centers the label unless told otherwise, and reflects the alignment for styling', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="10">10 / 100</ds-progress-bar>');
    expect(el.getAttribute('label-align')).toBe('center');

    el.labelAlign = 'start';
    await el.updateComplete;
    expect(el.getAttribute('label-align')).toBe('start');
  });
});
