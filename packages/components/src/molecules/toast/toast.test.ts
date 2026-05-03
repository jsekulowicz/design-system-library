import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { DsToast, ToastDismissReason } from './toast.js';
import './define.js';
import { mount, mountWithProps, resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

afterEach(() => {
  vi.useRealTimers();
});

describe('<ds-toast>', () => {
  it('maps tone to role and aria-live', async () => {
    const info = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', { tone: 'info' });
    expect(info.getAttribute('role')).toBe('status');
    expect(info.getAttribute('aria-live')).toBe('polite');

    const success = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', { tone: 'success' });
    expect(success.getAttribute('role')).toBe('status');
    expect(success.getAttribute('aria-live')).toBe('polite');

    const warning = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', { tone: 'warning' });
    expect(warning.getAttribute('role')).toBe('status');
    expect(warning.getAttribute('aria-live')).toBe('polite');

    const danger = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', { tone: 'danger' });
    expect(danger.getAttribute('role')).toBe('alert');
    expect(danger.getAttribute('aria-live')).toBe('assertive');
  });

  it('renders heading, default slot, and actions slot', async () => {
    const el = await mount<DsToast>(`
      <ds-toast heading="Saved">
        <span>Your changes are live.</span>
        <ds-button slot="actions">Undo</ds-button>
      </ds-toast>
    `);
    expect(el.shadowRoot!.querySelector('.title')?.textContent).toBe('Saved');
    const defaultSlot = el.shadowRoot!.querySelector('slot:not([name])') as HTMLSlotElement;
    expect(defaultSlot.assignedElements()[0]?.tagName.toLowerCase()).toBe('span');
    const actionsSlot = el.shadowRoot!.querySelector('slot[name="actions"]') as HTMLSlotElement;
    expect(actionsSlot.assignedElements()[0]?.tagName.toLowerCase()).toBe('ds-button');
  });

  it('hides the dismiss button when not dismissible', async () => {
    const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', { dismissible: false });
    expect(el.shadowRoot!.querySelector('button.close')).toBeNull();
  });

  it('emits ds-dismiss with reason="user" and removes itself when the close button is clicked', async () => {
    const el = await mount<DsToast>('<ds-toast>Body</ds-toast>');
    const events: ToastDismissReason[] = [];
    el.addEventListener('ds-dismiss', (event) =>
      events.push((event as CustomEvent<{ reason: ToastDismissReason }>).detail.reason),
    );
    const button = el.shadowRoot!.querySelector('button.close') as HTMLButtonElement;
    button.click();
    expect(events).toEqual(['user']);
    expect(document.body.contains(el)).toBe(false);
  });

  it('dismiss() emits reason="programmatic" by default', async () => {
    const el = await mount<DsToast>('<ds-toast>Body</ds-toast>');
    const events: ToastDismissReason[] = [];
    el.addEventListener('ds-dismiss', (event) =>
      events.push((event as CustomEvent<{ reason: ToastDismissReason }>).detail.reason),
    );
    el.dismiss();
    expect(events).toEqual(['programmatic']);
  });

  it('dismiss() is idempotent (second call is a no-op)', async () => {
    const el = await mount<DsToast>('<ds-toast>Body</ds-toast>');
    const events: Event[] = [];
    el.addEventListener('ds-dismiss', (event) => events.push(event));
    el.dismiss();
    el.dismiss();
    expect(events).toHaveLength(1);
  });

  describe('auto-dismiss', () => {
    it('uses the tone default when duration is unset (info → 5000 ms)', async () => {
      vi.useFakeTimers();
      const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', { tone: 'info' });
      const events: ToastDismissReason[] = [];
      el.addEventListener('ds-dismiss', (event) =>
        events.push((event as CustomEvent<{ reason: ToastDismissReason }>).detail.reason),
      );
      vi.advanceTimersByTime(4999);
      expect(events).toEqual([]);
      vi.advanceTimersByTime(1);
      expect(events).toEqual(['timeout']);
    });

    it('warning defaults to 8000 ms', async () => {
      vi.useFakeTimers();
      const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', { tone: 'warning' });
      const events: ToastDismissReason[] = [];
      el.addEventListener('ds-dismiss', (event) =>
        events.push((event as CustomEvent<{ reason: ToastDismissReason }>).detail.reason),
      );
      vi.advanceTimersByTime(7999);
      expect(events).toEqual([]);
      vi.advanceTimersByTime(1);
      expect(events).toEqual(['timeout']);
    });

    it('danger sticks (no timer fires)', async () => {
      vi.useFakeTimers();
      const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', { tone: 'danger' });
      const events: Event[] = [];
      el.addEventListener('ds-dismiss', (event) => events.push(event));
      vi.advanceTimersByTime(60_000);
      expect(events).toHaveLength(0);
      expect(document.body.contains(el)).toBe(true);
    });

    it('explicit duration=0 sticks regardless of tone', async () => {
      vi.useFakeTimers();
      const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', {
        tone: 'info',
        duration: 0,
      });
      const events: Event[] = [];
      el.addEventListener('ds-dismiss', (event) => events.push(event));
      vi.advanceTimersByTime(60_000);
      expect(events).toHaveLength(0);
      expect(document.body.contains(el)).toBe(true);
    });

    it('emits reason="timeout" on auto-dismiss', async () => {
      vi.useFakeTimers();
      const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', {
        tone: 'info',
        duration: 1000,
      });
      const events: ToastDismissReason[] = [];
      el.addEventListener('ds-dismiss', (event) =>
        events.push((event as CustomEvent<{ reason: ToastDismissReason }>).detail.reason),
      );
      vi.advanceTimersByTime(1000);
      expect(events).toEqual(['timeout']);
    });

    it('pauses on hover and resumes on mouseleave', async () => {
      vi.useFakeTimers();
      const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', {
        tone: 'info',
        duration: 1000,
      });
      const events: Event[] = [];
      el.addEventListener('ds-dismiss', (event) => events.push(event));

      vi.advanceTimersByTime(400);
      el.dispatchEvent(new MouseEvent('mouseenter'));
      vi.advanceTimersByTime(5000);
      expect(events).toHaveLength(0);

      el.dispatchEvent(new MouseEvent('mouseleave'));
      vi.advanceTimersByTime(599);
      expect(events).toHaveLength(0);
      vi.advanceTimersByTime(1);
      expect(events).toHaveLength(1);
    });

    it('pauses on focusin and resumes when focus leaves the toast', async () => {
      vi.useFakeTimers();
      const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', {
        tone: 'info',
        duration: 1000,
      });
      const events: Event[] = [];
      el.addEventListener('ds-dismiss', (event) => events.push(event));

      vi.advanceTimersByTime(300);
      el.dispatchEvent(new FocusEvent('focusin'));
      vi.advanceTimersByTime(5000);
      expect(events).toHaveLength(0);

      const outsideTarget = document.createElement('div');
      document.body.appendChild(outsideTarget);
      el.dispatchEvent(new FocusEvent('focusout', { relatedTarget: outsideTarget }));
      vi.advanceTimersByTime(700);
      expect(events).toHaveLength(1);
    });

    it('does not resume when focus moves within the toast', async () => {
      vi.useFakeTimers();
      const el = await mountWithProps<DsToast>('<ds-toast>Body</ds-toast>', {
        tone: 'info',
        duration: 1000,
      });
      const events: Event[] = [];
      el.addEventListener('ds-dismiss', (event) => events.push(event));

      el.dispatchEvent(new FocusEvent('focusin'));
      const inner = document.createElement('span');
      el.appendChild(inner);
      el.dispatchEvent(new FocusEvent('focusout', { relatedTarget: inner }));
      vi.advanceTimersByTime(5000);
      expect(events).toHaveLength(0);
    });
  });

  it('does not steal focus when added to the DOM', async () => {
    const trigger = document.createElement('button');
    trigger.textContent = 'trigger';
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const toast = document.createElement('ds-toast') as DsToast;
    toast.tone = 'info';
    toast.textContent = 'Body';
    document.body.appendChild(toast);
    await toast.updateComplete;
    expect(document.activeElement).toBe(trigger);
  });
});
