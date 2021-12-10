/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const { compilerOptions } = require('./tsconfig.json');
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: [path.resolve(__dirname, 'test/setup.ts')],
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: path.resolve(__dirname, '.'),
  }),
};
