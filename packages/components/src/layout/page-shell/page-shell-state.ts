export type PageShellAsideState = 'visible' | 'compact';
export type PageShellAsideEndState = 'visible' | 'hidden';

export type PageShellAsideStateChangeDetail =
  | { side: 'start'; state: PageShellAsideState; previousState: PageShellAsideState }
  | { side: 'end'; state: PageShellAsideEndState; previousState: PageShellAsideEndState };
export type PageShellMenuButtonPosition = 'start' | 'end';
