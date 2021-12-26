import 'src/config';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from './common';

describe('jobs overview controller tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  test('should return a correct overview', async () => {
    await supertest(app)
      .get('/api/overview')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].running).toBe(1);
        expect(body.data[0].scheduled).toBe(1);
        expect(body.data[0].completed).toBe(1);
        expect(body.data[0].failed).toBe(1);
        expect(body.data[0].queued).toBe(1);
        expect(body.data[0].repeating).toBe(1);
      });
  });

  test('should return a correct overview when filtering by id', async () => {
    await supertest(app)
      .get('/api/overview?property=_id&value=61bb7cd3a056e9d1c01faf5a')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].running).toBe(0);
        expect(body.data[0].scheduled).toBe(0);
        expect(body.data[0].completed).toBe(1);
        expect(body.data[0].failed).toBe(0);
        expect(body.data[0].queued).toBe(0);
        expect(body.data[0].repeating).toBe(0);
      });
  });

  test('should return a correct overview when only property is provided', async () => {
    await supertest(app)
      .get('/api/overview?property=data')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].running).toBe(1);
        expect(body.data[0].scheduled).toBe(1);
        expect(body.data[0].completed).toBe(1);
        expect(body.data[0].failed).toBe(1);
        expect(body.data[0].queued).toBe(1);
        expect(body.data[0].repeating).toBe(1);
      });
  });

  test('should return a correct overview when filtering by name', async () => {
    await supertest(app)
      .get('/api/overview?name=completed job')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].running).toBe(0);
        expect(body.data[0].scheduled).toBe(0);
        expect(body.data[0].completed).toBe(1);
        expect(body.data[0].failed).toBe(0);
        expect(body.data[0].queued).toBe(0);
        expect(body.data[0].repeating).toBe(0);
      });
  });

  test('should return a correct overview when filtering by numeric field value', async () => {
    await supertest(app)
      .get('/api/overview?property=failCount&value=1')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].running).toBe(0);
        expect(body.data[0].scheduled).toBe(0);
        expect(body.data[0].completed).toBe(0);
        expect(body.data[0].failed).toBe(1);
        expect(body.data[0].queued).toBe(0);
        expect(body.data[0].repeating).toBe(0);
      });
  });

  test('should return a correct overview when filtering by text field value', async () => {
    await supertest(app)
      .get('/api/overview?property=data.type&value=completed')
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].running).toBe(0);
        expect(body.data[0].scheduled).toBe(0);
        expect(body.data[0].completed).toBe(1);
        expect(body.data[0].failed).toBe(0);
        expect(body.data[0].queued).toBe(0);
        expect(body.data[0].repeating).toBe(0);
      });
  });
});
