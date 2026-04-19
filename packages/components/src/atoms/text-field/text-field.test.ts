import { describe, it, expect, beforeAll } from 'vitest';
import { DsTextField } from './text-field.js';
import './define.js';

beforeAll(() => {
  if (!customElements.get('ds-text-field')) {
    customElements.define('ds-text-field', DsTextField);
  }
});

async function mount(template: string): Promise<DsTextField> {
  document.body.innerHTML = template;
  const el = document.querySelector('ds-text-field') as DsTextField;
  await el.updateComplete;
  return el;
}

describe('<ds-text-field>', () => {
  it('reflects value changes and emits ds-input', async () => {
    const el = await mount('<ds-text-field name="email"></ds-text-field>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-input', (event) => events.push(event as CustomEvent));
    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'user@example.com';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    expect(el.value).toBe('user@example.com');
    expect(events[0]?.detail).toEqual({ value: 'user@example.com' });
  });

  it('reflects placeholder and readonly into the inner input; disabled maps to readonly', async () => {
    const el = await mount(
      '<ds-text-field placeholder="Your email" readonly disabled></ds-text-field>',
    );
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.placeholder).toBe('Your email');
    expect(input.readOnly).toBe(true);
    expect(input.disabled).toBe(false);
  });
});
