module.exports = {
  root: true,
  extends: [
    "airbnb-typescript/base",
    "plugin:@typescript-eslint/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: "./tsconfig.json",
  },
  rules: {
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-explicit-any": "error",
    "@typescript-eslint/no-use-before-define": ["warn", { functions: false }],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true },
    ],
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/prefer-readonly": ["error"],
    "@typescript-eslint/indent": "off",

    // already handled by global-require
    "@typescript-eslint/no-var-requires": "off",

    "import/prefer-default-export": "off",
    "import/no-default-export": "warn",

    // typeorm relies on this
    "import/no-cycle": "off",

    "no-console": "error",

    "prettier/prettier": "warn",
  },
};
