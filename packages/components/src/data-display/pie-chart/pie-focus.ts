export function getSliceIndexFrom(target: EventTarget | null): number | null {
  const group = target instanceof Element ? target.closest('.slice') : null;
  const index = group?.getAttribute('data-index') ?? null;
  return index === null ? null : Number(index);
}

export function isKeyboardFocus(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) {
    return true;
  }
  return matchesFocusVisibleOrUnsupported(target);
}

function matchesFocusVisibleOrUnsupported(element: Element): boolean {
  try {
    return element.matches(':focus-visible');
  } catch {
    return true;
  }
}
