/**
 * ESLint flat config for `npm run lint:js`.
 *
 * - Two spaces for indentation. Tabs are not allowed.
 * - No spaces inside parentheses, square brackets, template literal braces or JSX braces.
 * - Single quotes in TypeScript, double quotes in JSX attributes, and semicolons.
 * - Trailing commas in multi-line lists.
 * - Lines of at most 120 characters. Comments, strings, templates and URLs are not checked.
 */
const wpPlugin = require('@wordpress/eslint-plugin');
const tseslint = require('typescript-eslint');

module.exports = [
  // Files that ESLint must not check.
  {
    ignores: ['**/build/**', '**/node_modules/**', '**/vendor/**'],
  },

  // ESLint finds only `.js`, `.mjs` and `.cjs` files by default. These extensions are named
  // here so that the TypeScript and React files are checked too.
  { files: ['**/*.jsx', '**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'] },

  // The WordPress rules, including their formatting rules, without the Prettier rule.
  ...wpPlugin.configs['recommended-with-formatting'],

  // TypeScript support. The WordPress `recommended` config adds the same block next to its
  // Prettier rule, so the block is written out here and the Prettier rule is never loaded.
  tseslint.configs.eslintRecommended,
  {
    settings: {
      'import/resolver': {
        [require.resolve('eslint-import-resolver-typescript')]: {
          extensions: ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts'],
        },
      },
    },
    ignores: ['**/*.d.ts', '**/*.d.mts', '**/*.d.cts'],
  },
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      'no-duplicate-imports': 'off',
      'import/no-duplicates': 'error',
      // TypeScript files do not need the types again in the JSDoc comments.
      'jsdoc/require-param-type': 'off',
      'jsdoc/require-returns-type': 'off',
      // ESLint finds unused variables, and TypeScript only checks the files it is given.
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { ignoreRestSiblings: true }],
      // The base rule reports false errors in TypeScript, so the TypeScript version is used.
      'no-shadow': 'off',
      '@typescript-eslint/no-shadow': 'error',
      '@typescript-eslint/method-signature-style': 'error',
      // TypeScript already checks these, so ESLint skips them.
      'import/no-unresolved': 'off',
      'import/default': 'off',
      'import/named': 'off',
    },
  },

  // The rules for unit test files.
  ...wpPlugin.configs['test-unit'].map((config) => ({
    ...config,
    files: [
      '**/@(test|__tests__)/**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
      '**/*.@(test|spec).{js,jsx,ts,tsx,mjs,cjs,mts,cts}',
    ],
  })),

  // The project has no Babel config file, so the WordPress Babel preset reads the
  // TypeScript and JSX syntax.
  {
    languageOptions: {
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: [require.resolve('@wordpress/babel-preset-default')],
        },
      },
    },
  },

  // The formatting rules of the modern style. They replace the WordPress rules of the same names.
  {
    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'no-tabs': 'error',
      'space-in-parens': ['error', 'never'],
      'array-bracket-spacing': ['error', 'never'],
      'computed-property-spacing': ['error', 'never'],
      'template-curly-spacing': ['error', 'never'],
      'object-curly-spacing': ['error', 'always'],
      'space-unary-ops': ['error', { words: true, nonwords: false }],
      'jsx-quotes': ['error', 'prefer-double'],
      'react/jsx-curly-spacing': ['error', { when: 'never', children: true }],
      'react/jsx-indent': ['error', 2],
      'react/jsx-indent-props': ['error', 2],
      'max-len': [
        'error',
        {
          code: 120,
          ignoreComments: true,
          ignoreStrings: true,
          ignoreTemplateLiterals: true,
          ignoreUrls: true,
        },
      ],
    },
  },
];
