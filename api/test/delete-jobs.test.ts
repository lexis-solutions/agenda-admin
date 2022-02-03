import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';
import { getAgendaInstance } from 'src/agenda-instance';

describe('delete jobs controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test('should delete a job by id', async () => {
    const beforeDelete = await getAgendaInstance().jobs({ name: 'failed job' });
    expect(beforeDelete.length).toBe(1);

    await supertest(app)
      .delete('/api/delete/id')
      .send({ ids: [beforeDelete[0].attrs._id] })
      .expect(200)
      .expect(({ body }) => {
        expect(body.deleted).toBe(1);
      });

    const afterDelete = await getAgendaInstance().jobs({ name: 'failed job' });
    expect(afterDelete.length).toBe(0);
  });

  test('should delete a job by name', async () => {
    const beforeDelete = await getAgendaInstance().jobs({ name: 'failed job' });
    expect(beforeDelete.length).toBe(1);

    await supertest(app)
      .delete('/api/delete/query?name=failed job')
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body.deleted).toBe(1);
      });

    const afterDelete = await getAgendaInstance().jobs({ name: 'failed job' });
    expect(afterDelete.length).toBe(0);
  });

  test('should delete a job by property value', async () => {
    const beforeDelete = await getAgendaInstance().jobs({ name: 'failed job' });
    expect(beforeDelete.length).toBe(1);

    await supertest(app)
      .delete('/api/delete/query?property=data.type&value=failed')
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body.deleted).toBe(1);
      });

    const afterDelete = await getAgendaInstance().jobs({ name: 'failed job' });
    expect(afterDelete.length).toBe(0);
  });

  test('should delete a job by status', async () => {
    const beforeDelete = await getAgendaInstance().jobs({ name: 'failed job' });
    expect(beforeDelete.length).toBe(1);

    await supertest(app)
      .delete('/api/delete/query?status=failed')
      .send()
      .expect(200)
      .expect(({ body }) => {
        expect(body.deleted).toBe(1);
      });

    const afterDelete = await getAgendaInstance().jobs({ name: 'failed job' });
    expect(afterDelete.length).toBe(0);
  });
});
