import { describe, it, expect, beforeAll } from 'vitest';
import { DsButton } from './button.js';
import './define.js';
import { mount } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-button')) {
    customElements.define('ds-button', DsButton);
  }
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
});
