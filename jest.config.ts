import type { Config } from "jest";
import { compilerOptions } from "./tsconfig.json";

const config: Config = {
  preset: "ts-jest",
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  slowTestThreshold: 10,
  roots: ["<rootDir>"],
  modulePaths: [compilerOptions.baseUrl],
  testMatch: ["**/__tests__/*.test.ts"],
  globalTeardown: "<rootDir>/CI/cleanup/Zombies.ts",
};

export default config;
