import { beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { DsAlert } from './alert.js';
import './define.js';
import { mount, resetTestDom } from '../../test-utils/mount.js';

beforeAll(() => {
  if (!customElements.get('ds-alert')) {
    customElements.define('ds-alert', DsAlert);
  }
});

beforeEach(() => {
  resetTestDom();
});

describe('<ds-alert>', () => {
  it('renders status role for non-danger tone and optional heading', async () => {
    const el = await mount<DsAlert>('<ds-alert heading="Saved">Body</ds-alert>');
    const root = el.shadowRoot!.querySelector('[part="alert"]')!;
    expect(root.getAttribute('role')).toBe('status');
    expect(el.shadowRoot!.querySelector('[part="title"]')!.textContent).toContain('Saved');
  });

  it('renders alert role for danger tone', async () => {
    const el = await mount<DsAlert>('<ds-alert tone="danger">Body</ds-alert>');
    const root = el.shadowRoot!.querySelector('[part="alert"]')!;
    expect(root.getAttribute('role')).toBe('alert');
  });

  it('omits heading block when heading is missing', async () => {
    const el = await mount<DsAlert>('<ds-alert>Body</ds-alert>');
    expect(el.shadowRoot!.querySelector('[part="title"]')).toBeNull();
  });

  it('dismisses and emits ds-dismiss when close button is clicked', async () => {
    const el = await mount<DsAlert>('<ds-alert dismissible>Body</ds-alert>');
    const events: CustomEvent[] = [];
    el.addEventListener('ds-dismiss', (event) => events.push(event as CustomEvent));
    const button = el.shadowRoot!.querySelector('button.close')!;
    button.click();
    expect(events).toHaveLength(1);
    expect(document.body.contains(el)).toBe(false);
  });

  it('does not render a close button when not dismissible', async () => {
    const el = await mount<DsAlert>('<ds-alert>Body</ds-alert>');
    expect(el.shadowRoot!.querySelector('button.close')).toBeNull();
  });

  it('handles announceOnConnect path when heading is present', async () => {
    const el = await mount<DsAlert>('<ds-alert heading="Heads up" announceonconnect>Body</ds-alert>');
    expect(el.heading).toBe('Heads up');
  });

  it('handles announceOnConnect path for danger tone', async () => {
    const el = await mount<DsAlert>('<ds-alert tone="danger" heading="Danger" announceonconnect>Body</ds-alert>');
    expect(el.tone).toBe('danger');
    expect(el.heading).toBe('Danger');
  });
});
