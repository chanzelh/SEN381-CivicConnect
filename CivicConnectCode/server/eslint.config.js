const js = require("@eslint/js");
const globals = require("globals");
const forbidRequire = (pathPattern, message) => ({
  selector: `CallExpression[callee.name='require'][arguments.0.value=/${pathPattern}/]`,
  message,
});

module.exports = [
  { ignores: ["node_modules/", "coverage/"] },

  js.configs.recommended,

  {
    files: ["**/*.js"],
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: "commonjs",
      globals: { ...globals.node },
    },
  },

  {
    files: ["tests/**/*.js"],
    languageOptions: { globals: { ...globals.node, ...globals.jest } },
  },

  // Enforce the layered architecture to limit cross-module coupling (RISK-012).
  {
    files: ["src/routes/**/*.js"],
    rules: {
      "no-restricted-syntax": [
        "error",
        forbidRequire("models|config\\/database", "Routes must go through controllers, not models or the database (layered architecture, RISK-012)."),
      ],
    },
  },
  {
    files: ["src/controllers/**/*.js"],
    rules: {
      "no-restricted-syntax": [
        "error",
        forbidRequire("config\\/database", "Controllers must use models for persistence, not the database pool directly (RISK-012)."),
        forbidRequire("routes", "Controllers must not depend on routes (RISK-012)."),
      ],
    },
  },
  {
    files: ["src/models/**/*.js"],
    rules: {
      "no-restricted-syntax": [
        "error",
        forbidRequire("controllers|routes|middleware", "Models must not depend on upper layers (RISK-012)."),
      ],
    },
  },
  {
    files: ["src/utils/**/*.js"],
    rules: {
      "no-restricted-syntax": [
        "error",
        forbidRequire("models|controllers|routes|middleware|config", "Utils must stay pure: no dependencies on other layers (RISK-012)."),
      ],
    },
  },
];