import 'src/config';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';

describe('autocomplete controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test('should return "completed job" for comp', async () => {
    await supertest(app)
      .get('/api/autocomplete?autocomplete=comp')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].name).toBe('completed job');
      });
  });
});
