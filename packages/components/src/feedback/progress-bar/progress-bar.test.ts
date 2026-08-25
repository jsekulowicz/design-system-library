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

function indicatorIsFull(el: DsProgressBar): boolean {
  const indicator = el.shadowRoot!.querySelector<HTMLElement>('[part="indicator"]')!;
  return indicator.classList.contains('indicator--full');
}

describe('<ds-progress-bar>', () => {
  it('exposes progressbar semantics', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="30" max="120"></ds-progress-bar>');
    const wrapper = el.shadowRoot!.querySelector('.progress-bar')!;
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

  it('rounds the trailing end only when value reaches max', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="40" max="100"></ds-progress-bar>');
    expect(indicatorIsFull(el)).toBe(false);
    el.value = 100;
    await el.updateComplete;
    expect(indicatorIsFull(el)).toBe(true);
  });

  it('shows the label only when slotted content exists', async () => {
    const empty = await mount<DsProgressBar>('<ds-progress-bar value="10"></ds-progress-bar>');
    expect(empty.shadowRoot!.querySelector('.label')!.hasAttribute('hidden')).toBe(true);

    const labeled = await mount<DsProgressBar>('<ds-progress-bar value="10">10 / 100</ds-progress-bar>');
    expect(labeled.shadowRoot!.querySelector('.label')!.hasAttribute('hidden')).toBe(false);
  });

  it('keeps a text-only label after the host is moved in the light DOM', async () => {
    const el = await mount<DsProgressBar>('<ds-progress-bar value="10">10 / 100</ds-progress-bar>');
    expect(el.shadowRoot!.querySelector('.label')!.hasAttribute('hidden')).toBe(false);

    const destination = document.createElement('div');
    el.parentElement!.append(destination);
    destination.append(el);
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.label')!.hasAttribute('hidden')).toBe(false);
  });
});
