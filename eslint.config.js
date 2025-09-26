const { FlatCompat } = require('@eslint/eslintrc');
const js = require('@eslint/js');
const typescriptEslint = require('@typescript-eslint/eslint-plugin');
const typescriptParser = require('@typescript-eslint/parser');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  // Base configuration for all files
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    plugins: {
      '@typescript-eslint': typescriptEslint,
    },
    rules: {
      // TypeScript specific rules
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/no-namespace': 'off',
      
      // General rules
      'no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      'prefer-const': 'warn',
      
      // React specific rules
      'react/no-unescaped-entities': 'off',
      'react/jsx-no-undef': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
      'react-hooks/rules-of-hooks': 'warn',
      
      // Next.js specific rules
      '@next/next/no-img-element': 'warn',
      
      // JSX accessibility rules  
      'jsx-a11y/alt-text': 'warn',
    },
  },
  
  // Next.js specific configuration
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  
  // Override for TypeScript files
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
  },
  
  // Ignore patterns
  {
    ignores: [
      'node_modules/**',
      '.next/**',
      'out/**',
      'build/**',
      'dist/**',
      '*.config.js',
      '*.config.mjs',
      '*.config.ts',
      'public/**',
      'migrations/**',
      'scripts/**',
      'test/**',
      'tests/**',
      'docs/**',
      'wiki/**',
      '*.md',
      '*.json',
      '*.sql',
      '*.ico',
      '*.png',
      '*.jpg',
      '*.jpeg',
      '*.gif',
      '*.svg',
      '*.woff',
      '*.woff2',
      '*.ttf',
      '*.eot',
    ],
  },
];
