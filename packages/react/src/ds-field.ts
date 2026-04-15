import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsField } from '@ds/components/field';
import '@ds/components/field/define';

export const Field = createComponent({
  tagName: 'ds-field',
  elementClass: DsField,
  react: React,
  events: {},
  displayName: 'Field',
});
