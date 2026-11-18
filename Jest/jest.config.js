module.exports = {
  testEnvironment: "node",

  testMatch: ["**/tests/**/*.test.js"],

  setupFilesAfterEnv: ["<rootDir>/tests/setup.js"],

  testTimeout: 60000,

  collectCoverage: true,

  collectCoverageFrom: ["src/**/*.js", "server.js"],

  coverageDirectory: "coverage",

  coverageReporters: ["text", "html"],
};
