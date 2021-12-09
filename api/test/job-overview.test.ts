import 'src/config';
import { expect } from 'chai';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from 'test/common';

describe('jobs overview tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  it(`should return a correct overview`, async () => {
    await supertest(app)
      .get(`/api/overview`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].running).to.be.equal(1);
        expect(body.data[0].scheduled).to.be.equal(1);
        expect(body.data[0].completed).to.be.equal(1);
        expect(body.data[0].failed).to.be.equal(1);
        expect(body.data[0].queued).to.be.equal(1);
        expect(body.data[0].repeating).to.be.equal(1);
      });
  });
});
