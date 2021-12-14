import 'src/config';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';
import agenda from 'src/agenda';

describe('autocomplete controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test(`should return 'completed job' for comp`, async () => {
    const beforeDelete = await agenda.jobs({ name: 'failed job' });
    expect(beforeDelete.length).toBe(1);

    await supertest(app)
      .delete(`/api/delete`)
      .send({ ids: [beforeDelete[0].attrs._id] })
      .expect(200)
      .expect(({ body }) => {
        expect(body.deleted).toBe(1);
      });

    const afterDelete = await agenda.jobs({ name: 'failed job' });
    expect(afterDelete.length).toBe(0);
  });
});
