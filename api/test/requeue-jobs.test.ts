import 'src/config';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';
import agenda from 'src/agenda';

describe('requeue jobs controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test(`should requeue a job`, async () => {
    const beforeRequeue = await agenda.jobs({ name: 'completed job' });
    expect(beforeRequeue.length).toBe(1);

    await supertest(app)
      .post(`/api/requeue/id`)
      .send({ ids: [beforeRequeue[0].attrs._id] })
      .expect(200)
      .expect(({ body }) => {
        expect(body.requeued.length).toBe(1);
      });

    const afterRequeue = await agenda.jobs({ name: 'completed job' });
    expect(afterRequeue.length).toBe(2);
  });
});
