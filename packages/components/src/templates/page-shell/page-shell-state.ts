export type PageShellAsideState = 'visible' | 'compact' | 'hidden';
export type PageShellAsideEndState = 'visible' | 'hidden';
export type PageShellMenuButtonPosition = 'start' | 'end';

export function nextAsideState(state: PageShellAsideState): PageShellAsideState {
  if (state === 'visible') {
    return 'compact';
  }
  if (state === 'compact') {
    return 'hidden';
  }
  return 'visible';
}

export function nextAsideEndState(state: PageShellAsideEndState): PageShellAsideEndState {
  return state === 'visible' ? 'hidden' : 'visible';
}
