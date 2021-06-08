module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2017,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  env: {
    browser: true,
    es6: true
  },
  globals: {
    Routes: false,
    CONFIG: false
  },
  settings: {
    react: {
      version: 'detect' // Tells eslint-plugin-react to automatically detect the version of React to use
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  extends: ['plugin:react-hooks/recommended'],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  rules: {
    'no-undef': 'error',
    quotes: ['error', 'single', {avoidEscape: true}],
    semi: 'warn',
    'no-var': 'warn',
    curly: ['warn', 'multi-line'],
    'brace-style': ['warn', 'stroustrup', {allowSingleLine: true}],
    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': ['error']
  }
};
