import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import litPlugin from 'eslint-plugin-lit';
import wcPlugin from 'eslint-plugin-wc';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';

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
      parserOptions: {
        jsxPragma: null,
      },
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
    plugins: {
      'unused-imports': unusedImports,
    },
    rules: {
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      curly: ['error', 'all'],
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'prefer-const': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/consistent-type-imports': 'error',
      '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
      'unused-imports/no-unused-imports': 'error',
      'unused-imports/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
  },
  {
    files: litFiles,
    rules: {
      // `@state`/`@query` cannot decorate a `#private` field, so those use `private _x` instead.
      '@typescript-eslint/naming-convention': [
        'error',
        { selector: 'classProperty', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
        { selector: 'classMethod', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
      ],
    },
  },
  {
    files: litFiles,
    plugins: {
      ...litRecommended.plugins,
      ...wcRecommended.plugins,
    },
    // Components extend DsElement, not LitElement directly; without this the
    // lit rules match nothing at all.
    settings: { lit: { elementBaseClasses: ['LitElement', 'DsElement'] } },
    rules: {
      ...litRecommended.rules,
      ...wcRecommended.rules,
      // Lit lowercases a property name for its default attribute, so a camelCase
      // property silently answers to an all-lowercase one. Demand it be explicit.
      'lit/attribute-names': ['error', { convention: 'kebab' }],
    },
  },
  ...storybook.configs['flat/recommended'],
];
