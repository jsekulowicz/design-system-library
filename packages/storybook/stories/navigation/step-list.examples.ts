import type { StepListStep } from '@jsekulowicz/ds-components/step-list';

export const CHECKOUT_STEPS: StepListStep[] = [
  { label: 'Contact', description: 'Name and email' },
  { label: 'Shipping', description: 'Where it goes' },
  { label: 'Payment', description: 'How you pay' },
  { label: 'Review' },
];

interface StepListElement extends HTMLElement {
  currentIndex: number;
}

export function moveToTheSelectedStep(event: Event): void {
  const list = event.currentTarget as StepListElement;
  list.currentIndex = (event as CustomEvent<{ index: number }>).detail.index;
}

export function startOverFromTheFirstStep(event: Event): void {
  const list = (event.currentTarget as HTMLElement).closest<StepListElement>('ds-step-list');
  if (list) {
    list.currentIndex = 0;
  }
}

export const LABEL_ONLY_STEPS: StepListStep[] = [{ label: 'Details' }, { label: 'Vocabulary' }, { label: 'Summary' }];

export const DISABLED_STEPS: StepListStep[] = [
  { label: 'Name', description: 'Required' },
  { label: 'Vocabulary', description: 'Using every word' },
  {
    label: 'Extra words',
    description: 'Unavailable',
    disabled: true,
    reason: 'Narrow the vocabulary first - there is nothing for extra words to add to.',
  },
  { label: 'Summary' },
];

export const LONG_LABEL_STEPS: StepListStep[] = [
  { label: 'Name and size', description: 'Required' },
  { label: 'Who can open this crossword', description: 'Optional' },
  { label: 'Words this crossword is built from', description: 'Optional' },
  { label: 'Check and finish', description: 'Almost there' },
];
