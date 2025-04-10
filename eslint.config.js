import eslint from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tseslintParser from '@typescript-eslint/parser';
import vue from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import pluginVueA11y from "eslint-plugin-vuejs-accessibility";



export default [
  eslint.configs.recommended,
  ...pluginVueA11y.configs["flat/recommended"],
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tseslintParser,
        ecmaVersion: 'latest',
        sourceType: 'module',
        extraFileExtensions: ['.vue'],
      },
    },
    plugins: {
      'vue': vue,
    },
    rules: {
      ...vue.configs['vue3-essential'].rules,
      'vuejs-accessibility/tabindex-no-positive' : 'off',   // this rules makes no sense
      'vuejs-accessibility/label-has-for': 'warn',          // currently broken, keep as warn until resolved
      'vuejs-accessibility/media-has-caption': 'warn',      // this is an audio product thus this isn't a valid
      'vue/multi-word-component-names': 'off',
      'no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
    },
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tseslintParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_'
      }],
    },
  },
  {
    files: ['**/*'],
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        HTMLAudioElement: 'readonly',
        HTMLDivElement: 'readonly',
        HTMLDialogElement: 'readonly',
        HTMLElement: 'readonly',
        HTMLInputElement: 'readonly',
        CustomEvent: 'readonly',
        MouseEvent: 'readonly',
        fetch: 'readonly',
        __dirname: 'readonly',
        Location: 'readonly',
      },
    },
  },
]; 