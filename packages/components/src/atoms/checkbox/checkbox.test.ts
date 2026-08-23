import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsCheckbox } from './checkbox.js';
import './define.js';
import '../link/define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-checkbox')) {
    customElements.define('ds-checkbox', DsCheckbox);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-checkbox>', () => {
  it('syncs form value from checked and checkboxValue', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox checkboxvalue="yes">Accept</ds-checkbox>');
    el.checked = true;
    await el.updateComplete;
    expect(el.value).toBe('yes');

    el.checked = false;
    await el.updateComplete;
    expect(el.value).toBeNull();

    el.checkboxValue = '';
    el.checked = true;
    await el.updateComplete;
    expect(el.value).toBe('on');
  });

  it('leaves a required unchecked box alone until it is touched', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox required>Accept</ds-checkbox>');
    el.checkboxValue = 'accept';
    await el.updateComplete;

    expect(el.invalid).toBe(false);
    expect(el.shadowRoot!.querySelector('input')!.getAttribute('aria-invalid')).toBe('false');
  });

  it('marks required unchecked state as invalid and clears invalid when checked', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox required>Accept</ds-checkbox>');
    el.checkboxValue = 'accept';
    el.showValidity();
    await el.updateComplete;
    expect(el.invalid).toBe(true);

    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('aria-invalid')).toBe('true');

    el.checked = true;
    await el.updateComplete;
    expect(el.invalid).toBe(false);
    expect(input.getAttribute('aria-invalid')).toBe('false');
  });

  it('keeps a consumer-assigned invalid across a toggle', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox>Accept</ds-checkbox>');
    el.invalid = true;
    await el.updateComplete;

    el.checked = true;
    await el.updateComplete;

    expect(el.invalid).toBe(true);
  });

  it('handles change input events and emits ds-change', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox indeterminate>Accept</ds-checkbox>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    const input = el.shadowRoot!.querySelector('input')!;
    input.checked = true;
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    expect(el.checked).toBe(true);
    expect(el.indeterminate).toBe(false);
    expect(events[0]?.detail).toEqual({ checked: true });
  });

  it('toggles with Space and Enter keys only', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox>Accept</ds-checkbox>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));
    const label = el.shadowRoot!.querySelector('label')!;

    label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(false);

    label.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(true);

    label.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    await el.updateComplete;
    expect(el.checked).toBe(false);
    expect(events.map((event) => event.detail)).toEqual([{ checked: true }, { checked: false }]);
  });

  it('stays focusable and blocks interaction when disabled', async () => {
    const el = await mount<DsCheckbox>('<ds-checkbox disabled>Accept</ds-checkbox>');
    const input = el.shadowRoot!.querySelector('input')!;
    const label = el.shadowRoot!.querySelector('label')!;

    expect(input.disabled).toBe(false);
    expect(input.getAttribute('aria-disabled')).toBe('true');
    input.focus();
    expect(el.shadowRoot!.activeElement).toBe(input);

    label.click();
    label.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(el.checked).toBe(false);
  });

  describe('message row', () => {
    it('renders nothing extra by default', async () => {
      const el = await mount<DsCheckbox>('<ds-checkbox>Accept</ds-checkbox>');

      expect(el.shadowRoot!.querySelector('.description, .error, .subtext-spacer')).toBeNull();
    });

    it('holds a row open when the consumer opts in', async () => {
      const el = await mount<DsCheckbox>('<ds-checkbox message-space>Accept</ds-checkbox>');

      expect(el.shadowRoot!.querySelector('.subtext-spacer')).not.toBeNull();
    });

    it('swaps the reserved row for the error in place', async () => {
      const el = await mount<DsCheckbox>('<ds-checkbox message-space error="Required">Accept</ds-checkbox>');
      el.invalid = true;
      await el.updateComplete;

      expect(el.shadowRoot!.querySelector('.subtext-spacer')).toBeNull();
      expect(el.shadowRoot!.querySelector('.error')?.textContent).toContain('Required');
    });

    it('shows a description without opting in', async () => {
      const el = await mount<DsCheckbox>('<ds-checkbox description="Optional extra">Accept</ds-checkbox>');

      expect(el.shadowRoot!.querySelector('.description')?.textContent).toContain('Optional extra');
    });
  });
  describe('interactive slotted content', () => {
    it('leaves Enter to a link in the label instead of toggling', async () => {
      const el = await mount<DsCheckbox>('<ds-checkbox>I agree with the <a href="/terms">Terms</a></ds-checkbox>');
      const link = el.querySelector('a')!;

      const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, composed: true, cancelable: true });
      link.dispatchEvent(event);
      await el.updateComplete;

      expect(el.checked).toBe(false);
      expect(event.defaultPrevented).toBe(false);
    });

    it('leaves Space to a link in the label instead of toggling', async () => {
      const el = await mount<DsCheckbox>('<ds-checkbox>I agree with the <a href="/terms">Terms</a></ds-checkbox>');
      const link = el.querySelector('a')!;

      link.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true, cancelable: true }));
      await el.updateComplete;

      expect(el.checked).toBe(false);
    });

    it('leaves Enter to a custom element link, whose anchor is in its own shadow root', async () => {
      const el = await mount<DsCheckbox>(
        '<ds-checkbox>I agree with the <ds-link href="/terms">Terms</ds-link></ds-checkbox>',
      );
      const anchor = el.querySelector('ds-link')!.shadowRoot!.querySelector('a')!;

      const event = new KeyboardEvent('keydown', {
        key: 'Enter',
        bubbles: true,
        composed: true,
        cancelable: true,
      });
      anchor.dispatchEvent(event);
      await el.updateComplete;

      expect(el.checked).toBe(false);
      expect(event.defaultPrevented).toBe(false);
    });

    it('still toggles for plain text in the label', async () => {
      const el = await mount<DsCheckbox>('<ds-checkbox>I agree with the <span>Terms</span></ds-checkbox>');
      const text = el.querySelector('span')!;

      text.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true, composed: true, cancelable: true }));
      await el.updateComplete;

      expect(el.checked).toBe(true);
    });
  });
  describe('label presence', () => {
    it('offsets the box onto the first line only when there is a label', async () => {
      const labeled = await mount<DsCheckbox>('<ds-checkbox>Pick me</ds-checkbox>');
      const bare = await mount<DsCheckbox>('<ds-checkbox></ds-checkbox>');

      expect(labeled.shadowRoot!.querySelector('label')!.classList.contains('has-label')).toBe(true);
      expect(bare.shadowRoot!.querySelector('label')!.classList.contains('has-label')).toBe(false);
    });
  });
});
