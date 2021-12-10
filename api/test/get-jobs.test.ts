import 'src/config';
import { expect } from 'chai';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from 'test/common';

describe('get jobs controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  ['completed', 'failed', 'queued', 'scheduled', 'running', 'failed'].forEach(
    (status) => {
      it(`should return a ${status} job`, async () => {
        await supertest(app)
          .get(`/api/jobs?status=${status}`)
          .expect(200)
          .expect(({ body }) => {
            expect(body[0].jobs[0].status[status]).to.be.true;
          });
      });
    }
  );

  it(`should return a job with name 'completed job'`, async () => {
    const name = 'completed job';
    await supertest(app)
      .get(`/api/jobs?name=${name}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.name).to.be.equal(name);
      });
  });

  it(`should return a job with data.id field`, async () => {
    await supertest(app)
      .get(`/api/jobs?property=data.id&value=1`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.data.id).to.be.equal(1);
      });
  });
});
