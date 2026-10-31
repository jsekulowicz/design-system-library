import type { SelectOption } from '@jsekulowicz/ds-components/select';

export const HELP_TOPICS: SelectOption[] = [
  { value: 'email', label: 'Change the email address you sign in with' },
  { value: 'password', label: 'Reset a forgotten password' },
  { value: 'export', label: 'Export every project as an archive, including the files other members shared with you' },
  { value: 'invoice', label: 'Download an invoice' },
  {
    value: 'seats',
    label: 'Add seats to your plan in the middle of a billing period, and how the extra time is charged',
  },
  { value: 'delete', label: 'Delete your account' },
  { value: 'roles', label: 'Give a member permission to manage billing without letting them invite or remove anyone' },
  { value: 'sso', label: 'Sign in with your company account' },
  {
    value: 'restore',
    label: 'Restore a project from the trash, along with its comments, files and the members who could open it',
  },
  { value: 'language', label: 'Change the language' },
  { value: 'notifications', label: 'Choose which notifications reach you by email and which only appear in the app' },
  { value: 'contact', label: 'Contact support' },
  { value: 'two-step', label: 'Turn on two-step sign-in' },
  {
    value: 'transfer',
    label: 'Move a project to another workspace without losing its history or the links people already share',
  },
  { value: 'storage', label: 'See how much storage you use' },
  { value: 'api', label: 'Create an access token for scripts that read your projects but cannot change them' },
];

export function filterHelpTopics(event: CustomEvent<{ query: string }>): void {
  const query = event.detail.query.toLowerCase();
  (event.currentTarget as HTMLElement & { options: SelectOption[] }).options = query
    ? HELP_TOPICS.filter((topic) => topic.label.toLowerCase().includes(query))
    : HELP_TOPICS;
}
