import html from 'eslint-plugin-html';
import globals from 'globals';
import js from '@eslint/js';

export default [
  // base ignores
  {
    ignores: ['dist/**', 'node_modules/**', 'plugins/**', 'src/snippets/**'],
  },

  // project-specific rules and HTML plugin
  {
    files: ['**/*.{js,html}'],
    languageOptions: {
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      html,
    },
    rules: {
      'no-unused-vars': 'warn',
      'no-console': 'warn',
      'prefer-const': 'error',
      'no-var': 'error',
    },
  },

  // include @eslint/js recommended config
  ...(Array.isArray(js.configs.recommended) ? js.configs.recommended : [js.configs.recommended]),
];
