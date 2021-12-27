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
      .post('/api/create')
      .send({
        name: 'New job',
        schedule: 'in 10 seconds',
        data: {},
      })
      .expect(200);

    const created = await agenda.jobs({ name: 'New job' });
    expect(created.length).toBe(1);
  });

  test('should create a repeating job', async () => {
    await supertest(app)
      .post('/api/create')
      .send({
        name: 'New job',
        repeatInterval: '10 seconds',
        data: {},
      })
      .expect(200);

    const created = await agenda.jobs({ name: 'New job' });
    expect(created.length).toBe(1);
  });
});
