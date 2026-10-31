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

export const LABEL_ONLY_STEPS: StepListStep[] = [{ label: 'Details' }, { label: 'Shipping' }, { label: 'Summary' }];

export const DISABLED_STEPS: StepListStep[] = [
  { label: 'Account', description: 'Personal' },
  {
    label: 'Team members',
    description: 'Unavailable',
    disabled: true,
    reason: 'Switch to a team account first - a personal account has nobody to invite.',
  },
  { label: 'Plan', description: 'Free' },
  {
    label: 'Add-ons',
    description: 'Unavailable',
    disabled: true,
    reason: 'Pick a paid plan first - the free plan takes no add-ons.',
  },
  { label: 'Summary' },
];

export const LONG_LABEL_STEPS: StepListStep[] = [
  { label: 'Name and address', description: 'Required' },
  { label: 'Who can see this project', description: 'Optional' },
  { label: 'Files this project starts from', description: 'Optional' },
  { label: 'Check and finish', description: 'Almost there' },
];
