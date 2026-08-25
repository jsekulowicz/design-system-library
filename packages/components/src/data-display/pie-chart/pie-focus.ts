export function sliceIndexFrom(target: EventTarget | null): number | null {
  const group = target instanceof Element ? target.closest('.slice') : null;
  const index = group?.getAttribute('data-index');
  return index == null ? null : Number(index);
}

/* `:focus-visible` tells hover-initiated focus apart from keyboard focus; jsdom
   rejects the selector, so tests fall back to the keyboard treatment. */
export function isKeyboardFocus(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return true;
  }
  try {
    return target.matches(':focus-visible');
  } catch {
    return true;
  }
}
