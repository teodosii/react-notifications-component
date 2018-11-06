const path = require("path");

module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
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
    "plugin:react/recommended"
  ],
  "env": {
    "es6": true,
    "browser": true
  },
  "plugins": [
    "react"
  ],
  "rules": {
    "quotes": "off",
    "linebreak-style": "off",
    "comma-dangle": "off",
    "react/prop-types": "off",
    "allowTernary": true,
    "react/jsx-uses-vars": "error"
  }
}