import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';

describe('get overview and jobs controller', () => {
  beforeEach(setup);
  afterEach(teardown);

  test('should check if body is an array', async () => {
    await supertest(app)
      .get('/api/overview-and-jobs')
      .expect(200)
      .expect(({ body }) => {
        expect(Array.isArray(body));
        expect(body.length).toBe(2);
      });
  });
});
