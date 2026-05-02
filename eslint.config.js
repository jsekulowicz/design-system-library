import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import litPlugin from 'eslint-plugin-lit';
import wcPlugin from 'eslint-plugin-wc';

const litFiles = ['packages/components/src/**/*.ts', 'packages/core/src/**/*.ts'];
const litRecommended = litPlugin.configs['flat/recommended'];
const wcRecommended = wcPlugin.configs['flat/recommended'];

export default [
  {
    ignores: ['**/dist/**', '**/node_modules/**', '**/storybook-static/**', '**/coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      globals: {
        window: 'readonly',
        document: 'readonly',
        customElements: 'readonly',
        HTMLElement: 'readonly',
        ElementInternals: 'readonly',
        ShadowRoot: 'readonly',
        CustomEvent: 'readonly',
        globalThis: 'readonly',
        console: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': 'error',
    },
  },
  {
    files: litFiles,
    plugins: {
      ...litRecommended.plugins,
      ...wcRecommended.plugins,
    },
    rules: {
      ...litRecommended.rules,
      ...wcRecommended.rules,
    },
  },
];
