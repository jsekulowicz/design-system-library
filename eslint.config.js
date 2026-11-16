import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import litPlugin from 'eslint-plugin-lit';
import wcPlugin from 'eslint-plugin-wc';
import storybook from 'eslint-plugin-storybook';
import unusedImports from 'eslint-plugin-unused-imports';

const litFiles = ['packages/components/src/**/*.ts', 'packages/core/src/**/*.ts'];
const litRecommended = litPlugin.configs['flat/recommended'];
const wcRecommended = wcPlugin.configs['flat/recommended'];

const privatesDecoratorsCanReach = [
  { selector: 'classProperty', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
  { selector: 'classMethod', modifiers: ['private'], format: ['camelCase'], leadingUnderscore: 'require' },
];
const litElementBaseClasses = ['LitElement', 'DsElement'];
const explicitKebabAttributes = { convention: 'kebab' };

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
      eqeqeq: ['error', 'always'],
      'id-length': ['error', { min: 1, max: 35, properties: 'always', exceptionPatterns: ['^[A-Z][A-Za-z0-9]*$'] }],
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
      '@typescript-eslint/naming-convention': ['error', ...privatesDecoratorsCanReach],
    },
  },
  {
    files: litFiles,
    plugins: {
      ...litRecommended.plugins,
      ...wcRecommended.plugins,
    },
    settings: { lit: { elementBaseClasses: litElementBaseClasses } },
    rules: {
      ...litRecommended.rules,
      ...wcRecommended.rules,
      'lit/attribute-names': ['error', explicitKebabAttributes],
    },
  },
  ...storybook.configs['flat/recommended'],
];
