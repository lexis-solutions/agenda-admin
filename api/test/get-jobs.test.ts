import 'src/config';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';

describe('get jobs controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test('should sort jobs descending', async () => {
    await supertest(app)
      .get('/api/jobs?sortBy=data.id&sortType=desc')
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs.map((job: any) => job.job.data.id)).toStrictEqual([
          6, 5, 4, 3, 2, 1,
        ]);
      });
  });

  test('should sort jobs ascending', async () => {
    await supertest(app)
      .get('/api/jobs?sortBy=data.id&sortType=asc')
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs.map((job: any) => job.job.data.id)).toStrictEqual([
          1, 2, 3, 4, 5, 6,
        ]);
      });
  });

  test('should filter jobs by id', async () => {
    await supertest(app)
      .get('/api/jobs?property=_id&value=61bb7cd3a056e9d1c01faf5a')
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.name).toBe('completed job');
      });
  });

  test('should return all jobs with property if no value is provided', async () => {
    await supertest(app)
      .get('/api/jobs?property=data')
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs.length).toBe(6);
      });
  });

  test.each([
    'completed',
    'failed',
    'queued',
    'scheduled',
    'running',
    'failed',
  ])('should filter jobs by %s status', async (status) => {
    await supertest(app)
      .get(`/api/jobs?status=${status}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].status[status]).toBe(true);
      });
  });

  test('should filter jobs by name', async () => {
    const name = 'completed job';
    await supertest(app)
      .get(`/api/jobs?name=${name}`)
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.name).toBe(name);
      });
  });

  test('should filter jobs by numeric field value', async () => {
    await supertest(app)
      .get('/api/jobs?property=data.id&value=1')
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.data.id).toBe(1);
      });
  });

  test('should filter jobs by text field value', async () => {
    await supertest(app)
      .get('/api/jobs?property=data.type&value=completed')
      .expect(200)
      .expect(({ body }) => {
        expect(body[0].jobs[0].job.data.type).toBe('completed');
      });
  });
});
