module.exports = {
  testEnvironment: "jsdom",
  transform: {
    "^.+\\.[jt]sx?$": "babel-jest"
  },
  moduleFileExtensions: ["js", "jsx"],
  setupFilesAfterEnv: ["@testing-library/jest-dom/jest-globals"],
  setupFiles: ["<rootDir>/jest.setup.js"],
  moduleDirectories: ["node_modules", "src"],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  }
}; 