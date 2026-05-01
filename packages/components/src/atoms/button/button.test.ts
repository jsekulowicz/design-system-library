import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';
import { DsButton } from './button.js';
import { DsForm } from '../../organisms/form/form.js';
import './define.js';
import '../../organisms/form/define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-button')) {
    customElements.define('ds-button', DsButton);
  }
  if (!customElements.get('ds-form')) {
    customElements.define('ds-form', DsForm);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-button>', () => {
  it('defaults to primary/md button type', async () => {
    const el = await mount<DsButton>('<ds-button>Go</ds-button>');
    expect(el.variant).toBe('primary');
    expect(el.size).toBe('md');
    expect(el.type).toBe('button');
  });

  it('emits ds-click on activation and respects disabled', async () => {
    const el = await mount<DsButton>('<ds-button>Go</ds-button>');
    const events: Event[] = [];
    el.addEventListener('ds-click', (event) => events.push(event));
    el.shadowRoot!.querySelector('button')!.click();
    expect(events).toHaveLength(1);
    el.disabled = true;
    await el.updateComplete;
    el.shadowRoot!.querySelector('button')!.click();
    expect(events).toHaveLength(1);
  });

  it('submits the host form when type=submit', async () => {
    document.body.innerHTML = '<form><ds-button type="submit">Send</ds-button></form>';
    const form = document.querySelector('form')!;
    const btn = form.querySelector('ds-button') as DsButton;
    await btn.updateComplete;
    let submitted = false;
    form.addEventListener('submit', (event) => {
      event.preventDefault();
      submitted = true;
    });
    btn.shadowRoot!.querySelector('button')!.click();
    expect(submitted).toBe(true);
  });

  it('resets the host form when type=reset', async () => {
    document.body.innerHTML = '<form><input name="email" value="a@b.com"/><ds-button type="reset">Reset</ds-button></form>';
    const form = document.querySelector('form')!;
    const btn = form.querySelector('ds-button') as DsButton;
    await btn.updateComplete;
    const resetSpy = vi.spyOn(form, 'reset');

    btn.shadowRoot!.querySelector('button')!.click();

    expect(resetSpy).toHaveBeenCalledTimes(1);
  });

  it('falls back to ds-form shadow form when no native ancestor form exists', async () => {
    document.body.innerHTML = '<ds-form><ds-button type="submit">Send</ds-button></ds-form>';
    const formHost = document.querySelector('ds-form') as DsForm;
    await formHost.updateComplete;
    const btn = formHost.querySelector('ds-button') as DsButton;
    await btn.updateComplete;
    const shadowForm = formHost.shadowRoot!.querySelector('form') as HTMLFormElement;
    const submitSpy = vi.spyOn(shadowForm, 'requestSubmit');

    btn.shadowRoot!.querySelector('button')!.click();

    expect(submitSpy).toHaveBeenCalledTimes(1);
  });

  it('emits ds-click for reset buttons even when no form exists', async () => {
    const el = await mount<DsButton>('<ds-button type="reset">Reset</ds-button>');
    const events: Event[] = [];
    el.addEventListener('ds-click', (event) => events.push(event));

    el.shadowRoot!.querySelector('button')!.click();

    expect(events).toHaveLength(1);
  });

  it('renders loading affordance and busy aria attributes', async () => {
    const el = await mount<DsButton>('<ds-button loading>Wait</ds-button>');
    const button = el.shadowRoot!.querySelector('button') as HTMLButtonElement;

    expect(button.getAttribute('aria-disabled')).toBe('true');
    expect(button.getAttribute('aria-busy')).toBe('true');
    expect(el.shadowRoot!.querySelector('.spinner')).not.toBeNull();
  });
});
