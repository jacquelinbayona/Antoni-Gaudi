module.exports = {
  testEnvironment: "jsdom",
  roots: ["<rootDir>/tests"],
  transform: {
    "^.+\\.js$": "babel-jest",
  },
  transformIgnorePatterns: ["/node_modules/"],
};
