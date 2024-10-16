module.exports = {
  parser: '@babel/eslint-parser',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'plugin:jest/recommended',
    'plugin:react/jsx-runtime',
    'plugin:storybook/recommended',
  ],
  plugins: ['react', 'jest', "react-hooks"],
  env: {
    browser: true,
    'jest/globals': true,
  },
  globals: {},
  rules: {
    'react/jsx-filename-extension': [
      1,
      {
        allow: 'as-needed',
        extensions: ['.jsx'],
      },
    ],
    'no-multiple-empty-lines': [
      'error',
      {
        'max': 3
      }
    ],
    'react-hooks/exhaustive-deps': 'warn',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 0,
    'react/jsx-closing-bracket-location': 0,
    'react/self-closing-comp': 1,
    'react/function-component-definition': 0,
    'react/jsx-props-no-spreading': 0,
    'react/require-default-props': 0,
    'react/jsx-wrap-multilines': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-curly-newline': 0,
    'no-restricted-imports': ['error', { 'paths': ['@mui/lab'] }],
    'implicit-arrow-linebreak': 0,
    'linebreak-style': 'off',
    'max-len': 0,
    'max-classes-per-file': 0,
    'function-paren-newline': 'off',
    'arrow-body-style': 0,
    'operator-linebreak': 0,
    'padded-blocks': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'click-events-have-key-events': 0,
    'object-curly-newline': 0,
    'import/no-unresolved': 0,
    // this is tmp solution > need to fix import/no-unresolved configuration
    'import/prefer-default-export': 0,
  },
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      plugins: ['@typescript-eslint'],
      parserOptions: {
        project: './tsconfig.json',
        ecmaFeatures: {
          jsx: true,
        },
      },
      extends: ['airbnb-typescript'],
      rules: {
        'react/prop-types': 'off',
        'react/jsx-indent': 'off',
        'react/destructuring-assignment': 'off',
        'no-use-before-define': 'off',
        indent: 'off',
        '@typescript-eslint/naming-convention': [
          'error',
          {
            selector: 'variableLike',
            format: ['snake_case', 'camelCase', 'PascalCase', 'UPPER_CASE'],
          },
        ],
        '@typescript-eslint/indent': 'off',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/quotes': [
          'error',
          'single',
          {
            allowTemplateLiterals: true,
          },
        ],
        // temporary... need to turn on after refactoring phase
        '@typescript-eslint/no-explicit-any': 'off',
      },
    },
  ],
};
