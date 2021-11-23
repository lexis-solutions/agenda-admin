import { expect } from 'chai';
import getJobStatus from '../../src/utils/get-job-status';
import testData, { OutputType, StatusType } from './job-status-test-data';

describe('Job status tests', () => {
  testData.forEach(({ description, input, output }) => {
    it(description, () => {
      const status: OutputType = getJobStatus(input);
      Object.keys(output).forEach((key) => {
        expect(output[key as StatusType]).to.be.equal(
          status[key as StatusType]
        );
      });
    });
  });
});
