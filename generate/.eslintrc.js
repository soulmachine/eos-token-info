const eslintrc = {
  extends: ['airbnb-base', 'plugin:jest/recommended', 'plugin:prettier/recommended'],
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  parser: '@typescript-eslint/parser',
  plugins: ['markdown', 'jest', 'prettier'],
  rules: {
    camelcase: 'off',
    'no-console': 'off',
  },
};

module.exports = eslintrc;
