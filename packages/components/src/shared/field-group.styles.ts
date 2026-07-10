import { css } from 'lit';

/* Fieldset layout shared by ds-radio-group and ds-checkbox-group. */
export const fieldGroupStyles = css`
  :host {
    display: block;
    width: 100%;
  }
  .fieldset {
    border: none;
    margin: 0;
    padding: 0;
    min-inline-size: 0;
  }
  .label {
    margin-bottom: var(--ds-space-2);
    padding: 0;
  }
  :host([invalid]) .label {
    color: var(--ds-color-danger);
  }
  .items {
    display: flex;
    flex-direction: column;
    gap: var(--ds-space-2);
  }
  .description,
  .error {
    margin-top: var(--ds-space-1);
  }
`;
