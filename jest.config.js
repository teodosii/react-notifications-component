module.exports = {
  "verbose": true,
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupTestFrameworkScriptFile": "<rootDir>/tests/utils/setup.js",
  "collectCoverage": false,
  "collectCoverageFrom": ["src/*.js"],
  "coverageDirectory": "coverage",
  "moduleNameMapper": {
    "\\.(css|scss)$": "<rootDir>/tests/mocks/style.mock.js"
  }
};
