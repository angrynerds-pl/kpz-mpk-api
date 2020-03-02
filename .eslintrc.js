module.exports = {
  root: true,
  extends: ["airbnb-typescript/base", "prettier"],
  plugins: ["prettier"],
  parserOptions: {
    project: "./tsconfig.json"
  },
  rules: {
    "@typescript-eslint/quotes": "off",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-use-before-define": ["warn", { functions: false }],
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/explicit-function-return-type": [
      "error",
      { allowExpressions: true }
    ],
    "@typescript-eslint/no-floating-promises": ["error"],
    "@typescript-eslint/prefer-readonly": ["error"],

    "import/prefer-default-export": "off",
    "import/no-default-export": "warn",

    "no-console": "error",

    "prettier/prettier": "warn"
  }
};
