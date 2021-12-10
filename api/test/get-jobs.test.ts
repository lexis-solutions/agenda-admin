import 'src/config';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';

describe('get jobs controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test.each([
    'completed',
    'failed',
    'queued',
    'scheduled',
    'running',
    'failed',
  ])('should return a %s job', async (status) => {
    await supertest(app)
      .get(`/api/jobs?status=${status}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].status[status]).toBe(true);
      });
  });

  test(`should return a job with name 'completed job'`, async () => {
    const name = 'completed job';
    await supertest(app)
      .get(`/api/jobs?name=${name}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.name).toBe(name);
      });
  });

  test(`should return a job with data.id field`, async () => {
    await supertest(app)
      .get(`/api/jobs?property=data.id&value=1`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.data.id).toBe(1);
      });
  });
});
