// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  // Ignore auto-generated and declaration files
  {
    ignores: ['**/types/gql.ts', '**/types/nuxt.d.ts', 'app/types/gql.ts'],
  },
  // SEOHead is intentionally renderless — template has no child elements
  {
    files: ['**/generalElements/SEOHead.vue'],
    rules: { 'vue/valid-template-root': 'off' },
  },
  {
    rules: {
      // Vue
      'vue/html-self-closing': ['error', { html: { void: 'always', normal: 'never', component: 'always' } }],
      'vue/component-name-in-template-casing': ['error', 'PascalCase'],
      'vue/no-v-html': 'warn',

      // TypeScript
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],

      // General
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      '@typescript-eslint/no-unused-expressions': ['error', { allowTernary: true }],
    },
  },
);
