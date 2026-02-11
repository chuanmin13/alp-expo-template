// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config')
const expoConfig = require('eslint-config-expo/flat')

module.exports = defineConfig([
  expoConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['dist/*'],
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        typescript: {
          project: './tsconfig.json'
        }
      }
    },
    rules: {
      semi: ['error', 'never'],
      quotes: ['error', 'single'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'react/display-name': 'off',
      'no-undef': 'error',
      'no-unused-vars': 'error',
      indent: ['error', 2, { SwitchCase: 1 }],
      'eol-last': ['error', 'always'],
      'import/order': 'off',
      'no-unused-expressions': 'off'
    }
  }
])
