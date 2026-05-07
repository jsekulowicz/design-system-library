import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsDivider } from './divider.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-divider')) {
    customElements.define('ds-divider', DsDivider);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-divider>', () => {
  it('renders a horizontal separator by default', async () => {
    const el = await mount<DsDivider>('<ds-divider></ds-divider>');
    const line = el.shadowRoot!.querySelector('[part="line"]')!;
    expect(line.getAttribute('role')).toBe('separator');
    expect(line.getAttribute('aria-orientation')).toBe('horizontal');
  });

  it('reflects vertical orientation', async () => {
    const el = await mount<DsDivider>('<ds-divider orientation="vertical"></ds-divider>');
    const line = el.shadowRoot!.querySelector('[part="line"]')!;
    expect(line.getAttribute('aria-orientation')).toBe('vertical');
    expect(el.getAttribute('orientation')).toBe('vertical');
  });
});
