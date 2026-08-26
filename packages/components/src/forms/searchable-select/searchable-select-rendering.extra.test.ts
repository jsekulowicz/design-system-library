import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsSearchableSelect } from './searchable-select.js';
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
  const proto = DsSearchableSelect.prototype as unknown as Record<string, () => void>;
  proto.setAriaLabel = () => {};
  proto.setAriaDescription = () => {};
});

beforeEach(() => {
  resetTestDom();
});

async function mountSearchable(props: Partial<DsSearchableSelect> = {}): Promise<DsSearchableSelect> {
  return mountWithProps<DsSearchableSelect>(
    '<ds-searchable-select label="Framework"></ds-searchable-select>',
    {
      options: OPTIONS,
      ...props,
    },
    'ds-searchable-select',
  );
}

const ICON_OPTIONS = [
  { value: 'design', label: 'Design', icon: { name: 'paint-brush', color: '#db2777' } },
  { value: 'engineering', label: 'Engineering', icon: { name: 'wrench' } },
];

describe('<ds-searchable-select> label, size and icons', () => {
  it('omits the label element when label is empty', async () => {
    const el = await mountWithProps<DsSearchableSelect>(
      '<ds-searchable-select></ds-searchable-select>',
      {
        options: OPTIONS,
      },
      'ds-searchable-select',
    );
    expect(el.shadowRoot!.querySelector('.label')).toBeNull();
  });

  it('reflects the size attribute', async () => {
    const el = await mountSearchable({ size: 'lg' });
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('renders option icons into the leading slot', async () => {
    const el = await mountSearchable({ options: ICON_OPTIONS });
    (el.shadowRoot!.querySelector('.trigger') as HTMLElement).click();
    await el.updateComplete;
    const icon = el.shadowRoot!.querySelector('ds-select-option ds-icon[slot="leading"]');
    expect(icon).not.toBeNull();
    expect(icon!.getAttribute('name')).toBe('paint-brush');
  });

  it('shows the selected option icon as a leading adornment when closed', async () => {
    const el = await mountSearchable({ options: ICON_OPTIONS, value: 'design' });
    const adornment = el.shadowRoot!.querySelector('.leading ds-icon');
    expect(adornment).not.toBeNull();
    expect(adornment!.getAttribute('name')).toBe('paint-brush');
    const slot = el.shadowRoot!.querySelector('.leading slot[name="leading"]') as HTMLElement;
    expect(slot.hasAttribute('hidden')).toBe(true);
  });
});

describe('<ds-searchable-select> re-enters search mode while focused-but-closed', () => {
  function keydown(el: HTMLElement, key: string): void {
    el.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
  }

  it('reopens and searches when typing after Escape closed the dropdown', async () => {
    const el = await mountSearchable();
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    (el.shadowRoot!.querySelector('.trigger') as HTMLElement).click();
    await el.updateComplete;
    expect((el as unknown as { _open: boolean })._open).toBe(true);

    keydown(input, 'Escape');
    await el.updateComplete;
    expect((el as unknown as { _open: boolean })._open).toBe(false);

    keydown(input, 'a');
    await el.updateComplete;
    expect((el as unknown as { _open: boolean })._open).toBe(true);
    // Simulate the browser inserting the character into the (cleared) input.
    input.value = 'a';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(input.value).toBe('a');
  });

  it('reopens with an empty query on Backspace after selecting an option', async () => {
    const el = await mountSearchable({ value: 'react' });
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    expect((el as unknown as { _open: boolean })._open).toBe(false);
    expect(input.value).toBe('React');

    keydown(input, 'Backspace');
    await el.updateComplete;
    expect((el as unknown as { _open: boolean })._open).toBe(true);
    expect(input.value).toBe('');
  });

  it('reopens with the typed character after selecting an option', async () => {
    const el = await mountSearchable({ value: 'react' });
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;

    keydown(input, 'v');
    await el.updateComplete;
    expect((el as unknown as { _open: boolean })._open).toBe(true);
    input.value = 'v';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(input.value).toBe('v');
  });

  it('does not reopen for modifier-key combos', async () => {
    const el = await mountSearchable({ value: 'react' });
    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    input.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', metaKey: true, bubbles: true, cancelable: true }));
    await el.updateComplete;
    expect((el as unknown as { _open: boolean })._open).toBe(false);
  });
  it('emits ds-scroll-end once per approach of the listbox bottom', async () => {
    const el = await mountSearchable({ options: MANY_OPTIONS });
    let fired = 0;
    el.addEventListener('ds-scroll-end', () => {
      fired += 1;
    });

    const input = el.shadowRoot!.querySelector('.search-input') as HTMLInputElement;
    input.dispatchEvent(new Event('focus'));
    await el.updateComplete;
    const listbox = el.shadowRoot!.querySelector('.listbox') as HTMLElement;
    Object.defineProperty(listbox, 'scrollHeight', { configurable: true, value: 432 });
    Object.defineProperty(listbox, 'clientHeight', { configurable: true, value: 240 });

    listbox.scrollTop = 40;
    listbox.dispatchEvent(new Event('scroll'));
    expect(fired).toBe(0);

    listbox.scrollTop = 160;
    listbox.dispatchEvent(new Event('scroll'));
    expect(fired).toBe(1);

    listbox.scrollTop = 30;
    listbox.dispatchEvent(new Event('scroll'));
    listbox.scrollTop = 160;
    listbox.dispatchEvent(new Event('scroll'));
    expect(fired).toBe(2);
  });
});
