import { html } from 'lit';
import { beforeEach, describe, expect, it } from 'vitest';
import { toast } from './toast.imperative.js';
import type { DsToast } from './toast.js';
import './define.js';
import { resetTestDom } from '../../test-utils/mount.js';

beforeEach(() => {
  resetTestDom();
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
    const placements = stacks.map((s) => s.getAttribute('placement')).sort();
    expect(placements).toEqual(['bottom-right', 'top-left']);
  });

  it('controller.dismiss() removes the toast from the DOM', () => {
    const controller = toast({ heading: 'Saved' });
    expect(document.querySelectorAll('ds-toast')).toHaveLength(1);
    controller.dismiss();
    expect(document.querySelectorAll('ds-toast')).toHaveLength(0);
  });

  it('controller.update() applies new properties to the live toast', async () => {
    const controller = toast({ heading: 'Loading…', tone: 'info' });
    const el = document.querySelector('ds-toast') as DsToast;
    expect(el.heading).toBe('Loading…');

    controller.update({ heading: 'Saved', tone: 'success' });
    await el.updateComplete;
    expect(el.heading).toBe('Saved');
    expect(el.tone).toBe('success');
  });

  it('convenience helpers wire the right tone', () => {
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

  it('after the singleton stack is removed, the next call recreates it', () => {
    toast({ heading: 'A' });
    expect(getStacks()).toHaveLength(1);
    document.body.innerHTML = '';
    expect(getStacks()).toHaveLength(0);
    toast({ heading: 'B' });
    expect(getStacks()).toHaveLength(1);
  });

  it('returns a controller with a unique id per call', () => {
    const a = toast({ heading: 'A' });
    const b = toast({ heading: 'B' });
    expect(a.id).not.toBe(b.id);
    expect(a.id).toMatch(/^ds-toast-/);
  });
});
