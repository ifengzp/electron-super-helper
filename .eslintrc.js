module.exports = {
    root: true,
    parser: "babel-eslint",
    parserOptions: {
      sourceType: "module"
    },
    env: {
      browser: true
    },
    extends: "standard",
    plugins: ["html"],
    rules: {
      "space-before-function-paren": 0,
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "prefer-const": 0,
      "one-var": 0,
      "no-debugger": process.env.NODE_ENV === "production" ? 2 : 0
    },
    globals: {
      $: true,
      KindEditor: true
    }
  };
