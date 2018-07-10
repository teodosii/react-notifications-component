module.exports = {
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaVersion": 6,
    "sourceType": "module"
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "airbnb-base"
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
    "import/no-cycle": "off",
    "comma-dangle": "off",
    "react/prop-types": "off",
    "allowShortCircuit": true,
    "allowTernary": true,
    "import/no-extraneous-dependencies": [
      "error",
      { "devDependencies": true }
    ],
    "react/jsx-uses-vars": "error"
  }
}