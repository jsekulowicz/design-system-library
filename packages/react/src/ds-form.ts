import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsForm } from '@jsekulowicz/ds-components/form';
import type { FormSubmitDetail } from '@jsekulowicz/ds-components';
import '@jsekulowicz/ds-components/form/define';

export const Form = createComponent({
  tagName: 'ds-form',
  elementClass: DsForm,
  react: React,
  events: {
    'onDsSubmit': 'ds-submit' as EventName<CustomEvent<FormSubmitDetail>>,
    'onDsInvalid': 'ds-invalid' as EventName<CustomEvent>,
  },
  displayName: 'Form',
});
