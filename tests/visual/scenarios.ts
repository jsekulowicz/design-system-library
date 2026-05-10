import type { Page } from '@playwright/test';
import type { ThemeName, ViewportName, VisualScenario } from './types.js';

const themes: ThemeName[] = ['light', 'dark'];
const desktop: ViewportName[] = ['desktop'];
const responsive: ViewportName[] = ['mobile', 'tablet', 'desktop'];
const storyRoot = '#storybook-root';

export const visualScenarios: VisualScenario[] = [
  staticStory('button-variants', 'atoms-button--variants'),
  staticStory('button-sizes', 'atoms-button--sizes'),
  staticStory('textfield-states', 'atoms-textfield--required'),
  staticStory('select-invalid', 'atoms-select--invalid'),
  {
    name: 'select-open',
    storyId: 'atoms-select--playground',
    themes,
    viewports: responsive,
    beforeCapture: openSelect,
  },
  {
    name: 'searchable-select-open',
    storyId: 'atoms-searchableselect--playground',
    themes,
    viewports: responsive,
    beforeCapture: openSearchableSelect,
  },
  {
    name: 'menu-button-open',
    storyId: 'molecules-menubutton--playground',
    themes,
    viewports: responsive,
    beforeCapture: openMenuButton,
  },
  {
    name: 'dialog-open',
    storyId: 'molecules-dialog--playground',
    themes,
    viewports: responsive,
    beforeCapture: openDialog,
  },
  {
    name: 'color-picker-open',
    storyId: 'molecules-colorpicker--playground',
    themes,
    viewports: responsive,
    beforeCapture: openColorPicker,
  },
  {
    name: 'form-invalid',
    storyId: 'organisms-form--account-details',
    themes,
    viewports: responsive,
    beforeCapture: submitInvalidForm,
  },
  responsiveStory('navbar-responsive', 'organisms-navbar--responsive'),
  responsiveStory('page-shell-sidenav', 'templates-pageshell--with-sidenav'),
  responsiveStory('settings-page-default', 'pages-settingspage--default'),
];

function staticStory(name: string, storyId: string): VisualScenario {
  return { name, storyId, selector: storyRoot, themes, viewports: desktop };
}

function responsiveStory(name: string, storyId: string): VisualScenario {
  return { name, storyId, themes, viewports: responsive };
}

async function openSelect(page: Page): Promise<void> {
  await page.getByRole('combobox', { name: 'Discipline' }).click();
  await page.getByRole('option', { name: 'Engineering' }).waitFor();
}

async function openSearchableSelect(page: Page): Promise<void> {
  await page.getByRole('combobox', { name: 'Framework' }).click();
  await page.getByRole('option', { name: 'React' }).waitFor();
}

async function openMenuButton(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Edit' }).click();
  await page.getByRole('menuitem', { name: 'Duplicate' }).waitFor();
}

async function openDialog(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Open dialog' }).click();
  await page.getByRole('dialog', { name: 'Confirm action' }).waitFor();
}

async function openColorPicker(page: Page): Promise<void> {
  await page.getByRole('button', { name: 'Accent color' }).click();
  await page.getByRole('dialog', { name: 'Accent color' }).waitFor();
}

async function submitInvalidForm(page: Page): Promise<void> {
  await page.locator('ds-button[type="submit"]').click();
  await page.locator('ds-text-field[invalid]').first().waitFor();
}
