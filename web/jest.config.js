module.exports = {
  testEnvironment: "jsdom",
  testMatch: ["<rootDir>/tests/unit/**/*.spec.[jt]s?(x)"],
  moduleFileExtensions: ["js", "json", "ts", "vue"],
  transform: {
    "^.+\\.vue$": "@vue/vue3-jest",
    "^.+\\.ts$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.jest.json" }],
  },
  moduleNameMapper: {
    "^@vue/test-utils$": "<rootDir>/node_modules/@vue/test-utils/dist/vue-test-utils.cjs.js",
    "^@/(.*)$": "<rootDir>/src/$1",
  },
};
