import 'src/config';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';
import agenda from 'src/agenda';

describe('create job controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test('should create a scheduled job', async () => {
    await supertest(app)
      .post('/api/jobs')
      .send({
        name: 'New job',
        schedule: '10 seconds',
        data: null,
      })
      .expect(200);

    const created = await agenda.jobs({ name: 'New job' });
    expect(created.length).toBe(1);
  });

  test('should create a repeating job', async () => {
    await supertest(app)
      .post('/api/jobs')
      .send({
        name: 'New job',
        repeatInterval: '10 seconds',
        data: null,
      })
      .expect(200);

    const created = await agenda.jobs({ name: 'New job' });
    expect(created.length).toBe(1);
  });
});
