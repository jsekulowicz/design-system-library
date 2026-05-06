import * as React from 'react';
import { createComponent } from '@lit/react';
import { DsSettingsPage } from '@jsekulowicz/ds-components/settings-page';
import '@jsekulowicz/ds-components/settings-page/define';

export const SettingsPage = createComponent({
  tagName: 'ds-settings-page',
  elementClass: DsSettingsPage,
  react: React,
  events: {},
  displayName: 'SettingsPage',
});
