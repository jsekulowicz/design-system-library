import { html } from 'lit';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { toast } from './toast.imperative.js';
import type { DsToast } from './toast.js';
import './define.js';
import { resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
});

afterEach(() => {
  vi.useRealTimers();
});

function getStacks(): NodeListOf<HTMLElement> {
  return document.body.querySelectorAll<HTMLElement>('ds-toast-stack');
}

describe('toast() imperative API', () => {
  it('lazily mounts a ds-toast-stack on the body for the requested placement', () => {
    expect(getStacks()).toHaveLength(0);
    toast({ heading: 'Saved' });
    const stacks = getStacks();
    expect(stacks).toHaveLength(1);
    expect(stacks[0]?.getAttribute('placement')).toBe('bottom-right');
  });

  it('reuses an existing stack for the same placement', () => {
    toast({ heading: 'A' });
    toast({ heading: 'B' });
    expect(getStacks()).toHaveLength(1);
    expect(getStacks()[0]?.querySelectorAll('ds-toast')).toHaveLength(2);
  });

  it('creates a separate stack per placement', () => {
    toast({ heading: 'A', placement: 'top-left' });
    toast({ heading: 'B', placement: 'bottom-right' });
    const stacks = Array.from(getStacks());
    const placements = stacks.map((stack) => stack.getAttribute('placement')).sort();
    expect(placements).toEqual(['bottom-right', 'top-left']);
  });

  it('removes the toast from the DOM through controller.dismiss()', () => {
    const controller = toast({ heading: 'Saved' });
    expect(document.querySelectorAll('ds-toast')).toHaveLength(1);
    controller.dismiss();
    expect(document.querySelectorAll('ds-toast')).toHaveLength(0);
  });

  it('applies new properties to the live toast through controller.update()', async () => {
    const controller = toast({ heading: 'Loading...', tone: 'info' });
    const el = document.querySelector('ds-toast') as DsToast;
    expect(el.heading).toBe('Loading...');

    controller.update({ heading: 'Saved', tone: 'success' });
    await el.updateComplete;
    expect(el.heading).toBe('Saved');
    expect(el.tone).toBe('success');
  });

  it('wires the right tone through its convenience helpers', () => {
    toast.info('I');
    toast.success('S');
    toast.warning('W');
    toast.danger('D');
    const els = Array.from(document.querySelectorAll<DsToast>('ds-toast'));
    expect(els.map((el) => el.tone)).toEqual(['info', 'success', 'warning', 'danger']);
    expect(els.map((el) => el.heading)).toEqual(['I', 'S', 'W', 'D']);
  });

  it('renders body and actions templates into the toast', () => {
    toast({
      heading: 'Saved',
      body: html`<p class="probe">Body content</p>`,
      actions: () => html`<button class="undo">Undo</button>`,
    });
    const el = document.querySelector('ds-toast') as DsToast;
    expect(el.querySelector('.probe')?.textContent).toBe('Body content');
    expect(el.querySelector('[slot="actions"] .undo')).not.toBeNull();
  });

  it('renders an actions array as ds-buttons and invokes onClick with the controller', () => {
    let dismissedFrom: string | null = null;
    const controller = toast({
      heading: 'No more unapproved',
      actions: [{ label: 'Ignore status', onClick: (dismissed) => (dismissedFrom = dismissed.id) }],
    });
    const el = document.querySelector('ds-toast') as DsToast;
    const button = el.querySelector('[slot="actions"] ds-button');
    expect(button?.textContent).toBe('Ignore status');
    button?.dispatchEvent(new CustomEvent('ds-click', { bubbles: true }));
    expect(dismissedFrom).toBe(controller.id);
  });

  it('deduplicates by key: refreshes the existing toast instead of stacking', () => {
    const first = toast({ heading: 'First', key: 'dupe' });
    const second = toast({ heading: 'Second', key: 'dupe' });
    expect(document.querySelectorAll('ds-toast')).toHaveLength(1);
    expect(second.id).toBe(first.id);
    expect((document.querySelector('ds-toast') as DsToast).heading).toBe('Second');
  });

  it('frees a key once its toast is dismissed, so a later call is a fresh toast', () => {
    const first = toast({ heading: 'First', key: 'dupe' });
    first.dismiss();
    const second = toast({ heading: 'Second', key: 'dupe' });
    expect(document.querySelectorAll('ds-toast')).toHaveLength(1);
    expect(second.id).not.toBe(first.id);
  });

  it('keeps toasts with different keys separate', () => {
    toast({ heading: 'A', key: 'a' });
    toast({ heading: 'B', key: 'b' });
    expect(document.querySelectorAll('ds-toast')).toHaveLength(2);
  });

  it('restarts the auto-dismiss countdown when a keyed toast is re-raised', () => {
    vi.useFakeTimers();
    toast({ heading: 'A', key: 'dupe', tone: 'info', duration: 1000 });
    const el = document.querySelector('ds-toast') as DsToast;
    const events: string[] = [];
    el.addEventListener('ds-dismiss', () => events.push('dismiss'));
    vi.advanceTimersByTime(900);
    toast({ heading: 'A again', key: 'dupe', duration: 1000 });
    vi.advanceTimersByTime(900);
    expect(events).toEqual([]);
    vi.advanceTimersByTime(200);
    expect(events).toEqual(['dismiss']);
    vi.useRealTimers();
  });

  it('recreates the singleton stack on the next call after it was removed', () => {
    toast({ heading: 'A' });
    expect(getStacks()).toHaveLength(1);
    document.body.innerHTML = '';
    expect(getStacks()).toHaveLength(0);
    toast({ heading: 'B' });
    expect(getStacks()).toHaveLength(1);
  });

  it('returns a controller with a unique id per call', () => {
    const first = toast({ heading: 'A' });
    const second = toast({ heading: 'B' });
    expect(first.id).not.toBe(second.id);
    expect(first.id).toMatch(/^ds-toast-/);
  });

  it('names the dismiss button on the toast it creates', () => {
    toast({ body: 'x', dismissLabel: 'Descartar' });
    const el = document.querySelector('ds-toast') as DsToast;
    expect(el.dismissLabel).toBe('Descartar');
  });
});
