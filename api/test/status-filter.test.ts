import 'src/config';
import { expect } from 'chai';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from 'test/common';

describe('jobs status filter tests', () => {
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
});
