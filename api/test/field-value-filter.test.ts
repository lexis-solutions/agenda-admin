import 'src/config';
import { expect } from 'chai';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from 'test/common';

describe('jobs field value filter tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  it(`should return a job with data.id field`, async () => {
    await supertest(app)
      .get(`/api/jobs?property=data.id&value=1`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.data.id).to.be.equal(1);
      });
  });
});
