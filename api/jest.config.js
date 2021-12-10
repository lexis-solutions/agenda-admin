/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest/utils');
const path = require('path');

module.exports = {
  preset: 'ts-jest',
  setupFilesAfterEnv: [path.resolve(__dirname, 'test/setup.ts')],
  moduleNameMapper: pathsToModuleNameMapper(
    { 'src/*': ['./src/*'], 'test/*': ['./test/*'] },
    {
      prefix: path.resolve(__dirname, '.'),
    }
  ),
};
