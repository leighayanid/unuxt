import nuxtEslintConfig from "@nuxt/eslint-config/flat";

export default [
  ...nuxtEslintConfig,
  {
    rules: {
      // Vue rules
      "vue/multi-word-component-names": "off",
      "vue/require-default-prop": "off",
      "vue/no-multiple-template-root": "off",

      // TypeScript rules
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],

      // General rules
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "prefer-const": "error",
    },
  },
  {
    ignores: [
      "**/node_modules/**",
      "**/.nuxt/**",
      "**/.output/**",
      "**/dist/**",
      "**/.turbo/**",
    ],
  },
];
