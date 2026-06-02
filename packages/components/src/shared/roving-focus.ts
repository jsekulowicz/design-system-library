export type RovingOrientation = 'horizontal' | 'vertical' | 'both';

export interface RovingTargetOptions {
  key: string;
  /** Index the navigation starts from; -1 when nothing is focused yet. */
  currentIndex: number;
  count: number;
  /** Which arrow keys participate. Defaults to `both`. */
  orientation?: RovingOrientation;
  /** Skip indices that can't receive selection (e.g. disabled options). */
  isDisabled?: (index: number) => boolean;
}

const wrap = (value: number, count: number): number => ((value % count) + count) % count;

/**
 * Resolve the index a roving-tabindex widget (radiogroup, segmented control,
 * tablist…) should move to for a given key. Wraps around the ends and skips
 * disabled entries. Returns `null` when the key isn't a navigation key or no
 * enabled target exists, so callers can leave the event untouched.
 */
export function resolveRovingTarget({
  key,
  currentIndex,
  count,
  orientation = 'both',
  isDisabled = () => false,
}: RovingTargetOptions): number | null {
  if (count === 0) {
    return null;
  }
  const horizontal = orientation === 'horizontal' || orientation === 'both';
  const vertical = orientation === 'vertical' || orientation === 'both';
  const forward = (horizontal && key === 'ArrowRight') || (vertical && key === 'ArrowDown');
  const backward = (horizontal && key === 'ArrowLeft') || (vertical && key === 'ArrowUp');

  let from = currentIndex;
  let step: number;
  if (forward) {
    step = 1;
  } else if (backward) {
    step = -1;
  } else if (key === 'Home') {
    from = -1;
    step = 1;
  } else if (key === 'End') {
    from = count;
    step = -1;
  } else {
    return null;
  }

  let index = from;
  for (let i = 0; i < count; i += 1) {
    index = wrap(index + step, count);
    if (!isDisabled(index)) {
      return index;
    }
  }
  return null;
}
