import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsForm } from '@ds/components/form';
import '@ds/components/form/define';

export const Form = createComponent({
  tagName: 'ds-form',
  elementClass: DsForm,
  react: React,
  events: {
    'onDsSubmit': 'ds-submit' as EventName<CustomEvent>,
    'onDsInvalid': 'ds-invalid' as EventName<CustomEvent>,
  },
  displayName: 'Form',
});
