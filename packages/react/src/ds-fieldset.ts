import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsFieldset } from '@jsekulowicz/ds-components/fieldset';
import '@jsekulowicz/ds-components/fieldset/define';

export const Fieldset = createComponent({
  tagName: 'ds-fieldset',
  elementClass: DsFieldset,
  react: React,
  events: {},
  displayName: 'Fieldset',
});
