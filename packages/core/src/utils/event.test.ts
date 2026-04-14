import { describe, it, expect, vi } from 'vitest';
import { emit } from './event.js';

describe('emit', () => {
  it('dispatches a bubbling, composed CustomEvent by default', () => {
    const target = new EventTarget();
    const listener = vi.fn();
    target.addEventListener('ds-change', listener as EventListener);
    emit(target, 'ds-change', { detail: { value: 42 } });
    expect(listener).toHaveBeenCalledOnce();
    const event = listener.mock.calls[0]![0] as CustomEvent<{ value: number }>;
    expect(event.detail.value).toBe(42);
    expect(event.bubbles).toBe(true);
    expect(event.composed).toBe(true);
  });

  it('respects overrides', () => {
    const target = new EventTarget();
    const listener = vi.fn();
    target.addEventListener('ds-input', listener as EventListener);
    emit(target, 'ds-input', { detail: null, bubbles: false, cancelable: true });
    const event = listener.mock.calls[0]![0] as CustomEvent<null>;
    expect(event.bubbles).toBe(false);
    expect(event.cancelable).toBe(true);
  });
});
