import 'src/config';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';
import { getAgendaInstance } from 'src/agenda-instance';

describe('requeue jobs controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test('should requeue a job by id', async () => {
    const beforeRequeue = await getAgendaInstance().jobs({
      name: 'completed job',
    });
    expect(beforeRequeue.length).toBe(1);

    await supertest(app)
      .post('/api/requeue/id')
      .send({ ids: [beforeRequeue[0].attrs._id] })
      .expect(200)
      .expect(({ body }) => {
        expect(body.requeued.length).toBe(1);
      });

    const afterRequeue = await getAgendaInstance().jobs({
      name: 'completed job',
    });
    expect(afterRequeue.length).toBe(2);
  });

  test('should requeue a job by name', async () => {
    const beforeRequeue = await getAgendaInstance().jobs({
      name: 'completed job',
    });
    expect(beforeRequeue.length).toBe(1);

    await supertest(app)
      .post('/api/requeue/query?name=completed job')
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body.requeued.length).toBe(1);
      });

    const afterRequeue = await getAgendaInstance().jobs({
      name: 'completed job',
    });
    expect(afterRequeue.length).toBe(2);
  });

  test('should requeue a job by property value', async () => {
    const beforeRequeue = await getAgendaInstance().jobs({
      name: 'completed job',
    });
    expect(beforeRequeue.length).toBe(1);

    await supertest(app)
      .post('/api/requeue/query?property=data.type&value=completed')
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body.requeued.length).toBe(1);
      });

    const afterRequeue = await getAgendaInstance().jobs({
      name: 'completed job',
    });
    expect(afterRequeue.length).toBe(2);
  });

  test('should requeue a job by status', async () => {
    const beforeRequeue = await getAgendaInstance().jobs({
      name: 'completed job',
    });
    expect(beforeRequeue.length).toBe(1);

    await supertest(app)
      .post('/api/requeue/query?status=completed')
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body.requeued.length).toBe(1);
      });

    const afterRequeue = await getAgendaInstance().jobs({
      name: 'completed job',
    });
    expect(afterRequeue.length).toBe(2);
  });
});
