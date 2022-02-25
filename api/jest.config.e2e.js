/* eslint-disable @typescript-eslint/no-var-requires */
const { pathsToModuleNameMapper } = require('ts-jest');
const { compilerOptions } = require('./tsconfig.json');
const path = require('path');

module.exports = {
  preset: './jest-puppeteer-preset.js',
  testRegex: './*\\e2e\\.ts$',
  moduleNameMapper: pathsToModuleNameMapper(compilerOptions.paths, {
    prefix: path.resolve(__dirname, '.'),
  }),
};
