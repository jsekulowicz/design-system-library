import { css } from 'lit';

export const fieldsetStyles = css`
  .fieldset {
    border: 1px solid var(--ds-color-border);
    border-radius: var(--ds-radius-sm);
    margin: 0;
    padding: var(--ds-space-2) var(--ds-space-3) var(--ds-space-3);
    min-inline-size: 0;
  }
  :host([borderless]) .fieldset {
    border: none;
    padding: 0;
  }
  .label {
    margin-bottom: 0;
    padding: 0 var(--ds-space-1);
  }
  :host([borderless]) .label {
    padding: 0;
    margin-bottom: var(--ds-space-2);
  }
  .items {
    display: flex;
    /* Explicit: the shared field-group styles lay their items out in a column,
       so a horizontal fieldset has to say so or it silently stacks. */
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: var(--ds-fieldset-gap, var(--ds-space-4));
  }
  :host([orientation='vertical']) .items {
    flex-direction: column;
    align-items: stretch;
    flex-wrap: nowrap;
  }
`;
