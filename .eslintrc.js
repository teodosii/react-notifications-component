const path = require("path");

module.exports = {
  "root": true,
  "parser": '@typescript-eslint/parser',
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "globals": {
    "process": true
  },
  "settings": {
    "react": {
      version: "16.4.2"
    },
    "import/resolver": {
      alias: {
        map: [
          ["src", path.resolve(__dirname, "src")],
          ["samples", path.resolve(__dirname, "samples")]
        ],
        extensions: [".js", ".css", ".scss"]
      }
    }
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "env": {
    "es6": true,
    "browser": true,
    "jest": true
  },
  "plugins": [
    "react",
    "@typescript-eslint"
  ],
  "rules": {
    "quotes": "off",
    "linebreak-style": "off",
    "comma-dangle": "off",
    "react/prop-types": "off",
    "react/jsx-uses-vars": "error",
    "no-console": ["error", {
      allow: ["warn", "error", "trace", "log"]
    }]
  }
}