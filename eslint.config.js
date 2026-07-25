import js from "@eslint/js";
import prettier from "eslint-config-prettier";

export default [
  js.configs.recommended,
  prettier,
  {
    rules: {
      // Catch common mistakes
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
        },
      ],

      // Code quality
      "eqeqeq": ["error", "always"],
      "curly": ["warn", "all"],
      "no-console": "warn",

      // Better practices
      "no-var": "error",
      "prefer-const": "warn",
      "object-shorthand": "warn",

      // Avoid confusing code
      "no-duplicate-imports": "error",
      "no-unreachable": "error",
    },
  },
];