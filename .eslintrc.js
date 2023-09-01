module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js', 'src/db/data-source.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "no-console": 1,
    "prettier/prettier": [
      "error",
      {
        "endOfLine": "auto"
      }
    ],
    "no-trailing-spaces": "error",
    "no-multiple-empty-lines": ["error",{ "max": 1 }],
    "semi": "error",
    "indent": 'off',
    "object-curly-spacing": ["error", "always"],
    "array-bracket-spacing": ["error", "never"],
    "computed-property-spacing": ["error", "never"],
    "no-multi-spaces": "error",
    "keyword-spacing":"error",
    "space-before-blocks":"error",
    "comma-spacing":"error",
    "arrow-body-style":"error",
    "arrow-parens":"error",
    "@typescript-eslint/no-unused-vars": 'off'
  },
};
