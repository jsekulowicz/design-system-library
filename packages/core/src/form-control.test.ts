import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LitElement } from 'lit';
import { FormControlMixin } from './form-control.js';

class TestControl extends FormControlMixin(LitElement) {
  type = '';
}
customElements.define('test-form-control', TestControl);

function mount(): TestControl {
  const el = document.createElement('test-form-control') as TestControl;
  document.body.appendChild(el);
  return el;
}

function mountInForm(): { form: HTMLFormElement; el: TestControl } {
  const form = document.createElement('form');
  const el = document.createElement('test-form-control') as TestControl;
  form.appendChild(el);
  document.body.appendChild(form);
  form.requestSubmit = vi.fn();
  return { form, el };
}

function pressEnter(el: HTMLElement, init: KeyboardEventInit = {}): KeyboardEvent {
  const event = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true, ...init });
  el.dispatchEvent(event);
  return event;
}

beforeEach(() => {
  document.body.innerHTML = '';
});

describe('FormControlMixin', () => {
  it('reflects name, disabled and required', async () => {
    const el = mount();
    el.name = 'email';
    el.disabled = true;
    el.required = true;
    await el.updateComplete;
    expect(el.getAttribute('name')).toBe('email');
    expect(el.hasAttribute('disabled')).toBe(true);
    expect(el.hasAttribute('required')).toBe(true);
  });

  it('stores the value and schedules an update', async () => {
    const el = mount();
    await el.updateComplete;
    el.value = 'hello';
    expect(el.value).toBe('hello');
    expect(el.isUpdatePending).toBe(true);
    await el.updateComplete;
  });

  it('clears the value on form reset', () => {
    const el = mount();
    el.value = 'typed';
    el.formResetCallback();
    expect(el.value).toBeNull();
  });

  it('follows fieldset/form disabling', () => {
    const el = mount();
    el.formDisabledCallback(true);
    expect(el.disabled).toBe(true);
    el.formDisabledCallback(false);
    expect(el.disabled).toBe(false);
  });

  it('restores browser-persisted state', () => {
    const el = mount();
    el.formStateRestoreCallback('restored');
    expect(el.value).toBe('restored');
  });

  it('submits the surrounding form on Enter', () => {
    const { form, el } = mountInForm();
    const event = pressEnter(el);
    expect(form.requestSubmit).toHaveBeenCalledOnce();
    expect(event.defaultPrevented).toBe(true);
  });

  it('ignores Enter with modifier keys', () => {
    const { form, el } = mountInForm();
    pressEnter(el, { shiftKey: true });
    pressEnter(el, { ctrlKey: true });
    pressEnter(el, { metaKey: true });
    pressEnter(el, { altKey: true });
    expect(form.requestSubmit).not.toHaveBeenCalled();
  });

  it('ignores Enter when disabled or already handled', () => {
    const { form, el } = mountInForm();
    el.disabled = true;
    pressEnter(el);
    el.disabled = false;
    const handled = new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true });
    handled.preventDefault();
    el.dispatchEvent(handled);
    expect(form.requestSubmit).not.toHaveBeenCalled();
  });

  it('does not implicitly submit from a textarea control', () => {
    const { form, el } = mountInForm();
    el.type = 'textarea';
    pressEnter(el);
    expect(form.requestSubmit).not.toHaveBeenCalled();
  });

  it('does nothing on Enter outside a form', () => {
    const el = mount();
    const event = pressEnter(el);
    expect(event.defaultPrevented).toBe(false);
  });

  it('still submits on Enter after a disconnect/reconnect cycle', () => {
    const { form, el } = mountInForm();
    el.remove();
    form.appendChild(el);
    pressEnter(el);
    expect(form.requestSubmit).toHaveBeenCalledOnce();
  });
});
