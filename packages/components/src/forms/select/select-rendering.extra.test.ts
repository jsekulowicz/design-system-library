import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsSelect } from './select.js';
import './define.js';
import { mountWithProps, resetTestDom } from '../../test-utils/mount.js';

const OPTIONS = [
  { value: '', label: 'None' },
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue' },
  { value: 'angular', label: 'Angular', disabled: true },
];
const MANY_OPTIONS = Array.from({ length: 12 }, (_, index) => ({
  value: `v${index}`,
  label: `Option ${index}`,
}));

beforeAll(() => {
  const proto = DsSelect.prototype as unknown as Record<string, () => void>;
  proto.setAriaLabel = () => {};
  proto.setAriaDescription = () => {};
});

beforeEach(() => {
  resetTestDom();
});

// Patches the shared prototype, so the restore matters: a leak changes later tests.
function stubRowHeight(el: DsSelect, height: (this: HTMLElement) => number): () => void {
  const proto = Object.getPrototypeOf(el.shadowRoot!.querySelector('ds-select-option') as HTMLElement) as {
    getBoundingClientRect: () => DOMRect;
  };
  const original = proto.getBoundingClientRect;
  proto.getBoundingClientRect = function (this: HTMLElement) {
    return { height: height.call(this) } as DOMRect;
  };
  return () => {
    proto.getBoundingClientRect = original;
  };
}

async function mountSelect(props: Partial<DsSelect> = {}): Promise<DsSelect> {
  return mountWithProps<DsSelect>(
    '<ds-select label="Framework"></ds-select>',
    {
      options: OPTIONS,
      ...props,
    },
    'ds-select',
  );
}

const ICON_OPTIONS = [
  { value: 'design', label: 'Design', icon: { name: 'paint-brush', color: '#db2777' } },
  { value: 'engineering', label: 'Engineering', icon: { name: 'wrench' } },
];

describe('<ds-select> label, size and icons', () => {
  it('omits the label element when label is empty', async () => {
    const el = await mountWithProps<DsSelect>(
      '<ds-select></ds-select>',
      {
        options: OPTIONS,
      },
      'ds-select',
    );
    expect(el.shadowRoot!.querySelector('.label')).toBeNull();
  });

  it('renders the label element when label is set', async () => {
    const el = await mountSelect({ label: 'Framework' });
    expect(el.shadowRoot!.querySelector('.label')).not.toBeNull();
  });

  it('reflects the size attribute and drives trigger height via --ds-select-size', async () => {
    const el = await mountSelect({ size: 'sm' });
    expect(el.getAttribute('size')).toBe('sm');
    const css = (DsSelect as unknown as { styles: { cssText: string }[] }).styles
      .map((style) => style.cssText)
      .join('\n');
    expect(css).toMatch(/--ds-select-size/);
    expect(css).toMatch(/:host\(\[size='sm'\]\)\s*{[^}]*--ds-select-size:\s*var\(--ds-size-sm\)/s);
    expect(css).toMatch(/\.trigger\s*{[^}]*height:\s*var\(--ds-select-size\)/s);
  });

  it('renders option icons into the leading slot', async () => {
    const el = await mountSelect({ options: ICON_OPTIONS });
    el.shadowRoot!.querySelector<HTMLElement>('.trigger')!.click();
    await el.updateComplete;
    const icon = el.shadowRoot!.querySelector('ds-select-option ds-icon[slot="leading"]');
    expect(icon).not.toBeNull();
    expect(icon!.getAttribute('name')).toBe('paint-brush');
    expect(icon!.getAttribute('style')).toContain('color:#db2777');
  });

  it('renders the selected option icon in the trigger and overrides the leading slot', async () => {
    const el = await mountWithProps<DsSelect>(
      '<ds-select label="Discipline"><span slot="leading">L</span></ds-select>',
      { options: ICON_OPTIONS, value: 'design' },
      'ds-select',
    );
    const leadingIcon = el.shadowRoot!.querySelector('.leading ds-icon');
    expect(leadingIcon).not.toBeNull();
    expect(leadingIcon!.getAttribute('name')).toBe('paint-brush');
    const slot = el.shadowRoot!.querySelector('.leading slot[name="leading"]') as HTMLElement;
    expect(slot.hasAttribute('hidden')).toBe(true);
  });

  it('renders option icons and a ds-icon x-mark remove button on multiple-select tiles', async () => {
    const el = await mountSelect({ options: ICON_OPTIONS, multiple: true, values: ['design'] });
    const tile = el.shadowRoot!.querySelector('.tile[data-value="design"]')!;
    const tileIcon = tile.querySelector('ds-icon:not([name="x-mark"])');
    expect(tileIcon!.getAttribute('name')).toBe('paint-brush');
    expect(tileIcon!.getAttribute('size')).toBe('md');
    const removeIcon = tile.querySelector('.tile-remove ds-icon');
    expect(removeIcon!.getAttribute('name')).toBe('x-mark');
    expect(removeIcon!.getAttribute('size')).toBe('xl');
  });
  it('emits ds-scroll-end once per approach of the listbox bottom', async () => {
    const el = await mountSelect({ options: MANY_OPTIONS });
    let fired = 0;
    el.addEventListener('ds-scroll-end', () => {
      fired += 1;
    });

    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;
    const listbox = el.shadowRoot!.querySelector('.listbox') as HTMLElement;
    // jsdom has no layout: simulate a 432px tall list in a 240px viewport.
    Object.defineProperty(listbox, 'scrollHeight', { configurable: true, value: 432 });
    Object.defineProperty(listbox, 'clientHeight', { configurable: true, value: 240 });

    listbox.scrollTop = 40;
    listbox.dispatchEvent(new Event('scroll'));
    expect(fired).toBe(0);

    listbox.scrollTop = 150;
    listbox.dispatchEvent(new Event('scroll'));
    expect(fired).toBe(1);

    // Still at the bottom: no repeat until the user scrolls away.
    listbox.scrollTop = 180;
    listbox.dispatchEvent(new Event('scroll'));
    expect(fired).toBe(1);

    listbox.scrollTop = 20;
    listbox.dispatchEvent(new Event('scroll'));
    listbox.scrollTop = 170;
    listbox.dispatchEvent(new Event('scroll'));
    expect(fired).toBe(2);
  });

  // Measuring picks startIdx, which picks the next row measured: two heights can point at each other.
  it('settles when neighboring rows measure differently', async () => {
    const MANY = Array.from({ length: 200 }, (_, index) => ({
      value: `v${index}`,
      label: `Option ${index}`,
    }));
    const el = await mountSelect({ options: MANY });
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;

    let measurements = 0;
    const restore = stubRowHeight(el, function (this: HTMLElement) {
      measurements += 1;
      // Capped so a regression reports a runaway instead of hanging the suite.
      if (measurements > 50) {
        return 37.5;
      }
      const index = Number.parseInt(this.id.replace('option-', ''), 10);
      return index % 2 === 0 ? 38.4 : 37.5;
    });

    try {
      // At this offset the two heights select rows of the other height.
      el._scrollTop = 1640;
      for (let i = 0; i < 20; i += 1) {
        await el.updateComplete;
        await Promise.resolve();
      }
    } finally {
      restore();
    }

    expect(measurements).toBeLessThan(10);
  });

  it('sizes the virtual spacers from a measured row, not the default', async () => {
    const MANY = Array.from({ length: 100 }, (_, index) => ({
      value: `v${index}`,
      label: `Option ${index}`,
    }));
    const el = await mountSelect({ options: MANY });
    const trigger = el.shadowRoot!.querySelector('.trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;

    // jsdom has no layout: stand in for a real row, which exceeds the default.
    const restore = stubRowHeight(el, () => 37.5);

    try {
      el.requestUpdate();
      await el.updateComplete;
      await el.updateComplete;

      el._scrollTop = 37.5 * 20;
      await el.updateComplete;
    } finally {
      restore();
    }

    const topSpacer = el.shadowRoot!.querySelector('.listbox [aria-hidden="true"]') as HTMLElement;
    expect(Number.parseFloat(topSpacer.style.height)).toBe(17 * 37.5);
  });

  describe('required validation', () => {
    it('flags a required single select as invalid until something is picked', async () => {
      const el = await mountSelect({ required: true });
      el.showValidity();
      expect(el.invalid).toBe(true);

      el.value = 'vue';
      el.showValidity();
      expect(el.invalid).toBe(false);
    });

    it('flags a required multiple select as invalid while nothing is chosen', async () => {
      const el = await mountSelect({ required: true, multiple: true, values: [] });
      el.showValidity();
      expect(el.invalid).toBe(true);

      el.values = ['vue'];
      el.showValidity();
      expect(el.invalid).toBe(false);
    });

    it('leaves an optional select alone when empty', async () => {
      const el = await mountSelect();
      el.showValidity();
      expect(el.invalid).toBe(false);
    });

    it('holds the error styling back until the user has interacted', async () => {
      const el = await mountSelect({ required: true });
      expect(el.invalid).toBe(false);
    });
  });
});
