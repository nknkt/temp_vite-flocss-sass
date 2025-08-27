import js from '@eslint/js';
import globals from 'globals';
import html from 'eslint-plugin-html';

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'plugins/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        gsap: 'readonly',
        ScrollTrigger: 'readonly',
        Alpine: 'readonly',
      },
    },
    plugins: {
      html,
    },
    rules: {
      ...js.configs.recommended.rules,
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      html,
    },
  },
];
