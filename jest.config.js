module.exports = {
  "verbose": true,
  "snapshotSerializers": ["enzyme-to-json/serializer"],
  "setupTestFrameworkScriptFile": "<rootDir>/tests/utils/setup.js",
  "collectCoverage": true,
  "collectCoverageFrom": ["src/*.js"],
  "coverageDirectory": "coverage"
};
