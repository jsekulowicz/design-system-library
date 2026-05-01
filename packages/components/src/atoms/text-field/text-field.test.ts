import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsTextField } from './text-field.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-text-field')) {
    customElements.define('ds-text-field', DsTextField);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-text-field>', () => {
  it('reflects input and change value updates and emits events', async () => {
    const el = await mount<DsTextField>('<ds-text-field name="email"></ds-text-field>');
    const inputEvents: CustomEvent[] = [];
    const changeEvents: CustomEvent[] = [];

    el.addEventListener('ds-input', (event) => inputEvents.push(event as CustomEvent));
    el.addEventListener('ds-change', (event) => changeEvents.push(event as CustomEvent));

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = 'user@example.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.value = 'next@example.com';
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(el.value).toBe('next@example.com');
    expect(inputEvents[0]?.detail).toEqual({ value: 'user@example.com' });
    expect(changeEvents[0]?.detail).toEqual({ value: 'next@example.com' });
  });

  it('does not update value or emit when disabled', async () => {
    const el = await mount<DsTextField>('<ds-text-field disabled></ds-text-field>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-input', (event) => events.push(event as CustomEvent));
    el.addEventListener('ds-change', (event) => events.push(event as CustomEvent));

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.value = 'blocked';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    input.dispatchEvent(new Event('change', { bubbles: true }));

    expect(el.value).toBeNull();
    expect(events).toHaveLength(0);
  });

  it('reflects placeholder and readonly into the inner input; disabled maps to readonly', async () => {
    const el = await mount<DsTextField>('<ds-text-field placeholder="Your email" readonly disabled></ds-text-field>');
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;

    expect(input.placeholder).toBe('Your email');
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);
  });

  it('updates adornment visibility on slot changes', async () => {
    const el = await mount<DsTextField>(`
      <ds-text-field>
        <span slot="leading">L</span>
        <span slot="trailing">T</span>
      </ds-text-field>
    `);

    const adornments = el.shadowRoot!.querySelectorAll<HTMLElement>('.adornment');
    const leadingSlot = el.shadowRoot!.querySelector('slot[name="leading"]') as HTMLSlotElement;
    const trailingSlot = el.shadowRoot!.querySelector('slot[name="trailing"]') as HTMLSlotElement;

    leadingSlot.dispatchEvent(new Event('slotchange'));
    trailingSlot.dispatchEvent(new Event('slotchange'));
    await el.updateComplete;

    expect(adornments[0]?.hasAttribute('hidden')).toBe(false);
    expect(adornments[1]?.hasAttribute('hidden')).toBe(false);
  });

  it('keeps validity sync safe when input node is missing', async () => {
    const el = await mount<DsTextField>('<ds-text-field></ds-text-field>');
    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    input.remove();

    input.value = 'orphaned';
    expect(() => {
      input.dispatchEvent(new Event('input', { bubbles: true }));
    }).not.toThrow();
  });

  it('renders label, optional marker, description and invalid error state', async () => {
    const el = await mount<DsTextField>(
      '<ds-text-field label="Email" optional description="Helpful hint" error="Required"></ds-text-field>',
    );
    expect(el.shadowRoot!.querySelector('.label')?.textContent).toContain('Email');
    expect(el.shadowRoot!.querySelector('.optional')?.textContent?.toLowerCase()).toContain('optional');
    expect(el.shadowRoot!.querySelector('.description')?.textContent).toContain('Helpful hint');

    el.invalid = true;
    await el.updateComplete;

    const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
    expect(input.getAttribute('aria-invalid')).toBe('true');
    expect(el.shadowRoot!.querySelector('.error')?.getAttribute('role')).toBe('alert');
    expect(el.shadowRoot!.querySelector('.error')?.textContent).toContain('Required');
  });
});
