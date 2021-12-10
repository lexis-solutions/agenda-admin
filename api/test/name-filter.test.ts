import 'src/config';
import { expect } from 'chai';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from 'test/common';

describe('jobs name filter tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  it(`should return a job with name 'completed job'`, async () => {
    const name = 'completed job';
    await supertest(app)
      .get(`/api/jobs?name=${name}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.name).to.be.equal(name);
      });
  });
});
