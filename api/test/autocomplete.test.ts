import 'src/config';
import { expect } from 'chai';
import app from 'src/app';
import supertest from 'supertest';
import { setup, teardown } from 'test/common';

describe('autocomplete tests', () => {
  beforeEach(setup);
  afterEach(teardown);

  it(`should return 'completed job' for comp`, async () => {
    await supertest(app)
      .get(`/api/autocomplete?autocomplete=comp`)
      .expect(200)
      .expect(({ body }) => {
        expect(body.data[0].name).to.be.equal('completed job');
      });
  });
});
