// eslint.config.js
const { defineConfig } = require('eslint');

module.exports = defineConfig({
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      plugins: {
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        'angular': require('eslint-plugin-angular'),
      },
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:angular/recommended',
      ],
      rules: {
        // Your custom rules here
      },
    },
    {
      files: ['*.js'],
      parser: 'espree',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
      extends: [
        'eslint:recommended',
      ],
      rules: {
        // Your custom rules here
      },
    },
  ],
});
