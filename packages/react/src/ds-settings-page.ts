import * as React from 'react';
import { createComponent, type EventName } from '@lit/react';
import { DsSettingsPage } from '@ds/components/settings-page';
import '@ds/components/settings-page/define';

export const SettingsPage = createComponent({
  tagName: 'ds-settings-page',
  elementClass: DsSettingsPage,
  react: React,
  events: {},
  displayName: 'SettingsPage',
});
