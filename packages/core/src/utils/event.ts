export interface DsEventOptions<T> {
  detail: T;
  bubbles?: boolean;
  composed?: boolean;
  cancelable?: boolean;
}

export function emit<T>(target: EventTarget, name: string, options: DsEventOptions<T>): boolean {
  const event = new CustomEvent<T>(name, {
    detail: options.detail,
    bubbles: options.bubbles ?? true,
    composed: options.composed ?? true,
    cancelable: options.cancelable ?? false,
  });
  return target.dispatchEvent(event);
}
