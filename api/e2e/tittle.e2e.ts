import app from 'src/app';
import { getAgendaInstance } from 'src/agenda-instance';

import dotenv from 'dotenv-flow';
dotenv.config();

describe('e2e tests', () => {
  let server: any;

  beforeAll(async () => {
    await getAgendaInstance().start();
    server = app.listen(5000);
  });

  afterAll(async () => {
    await getAgendaInstance().close({ force: true });
    server.close();
  });

  test('Tittle test', async () => {
    const page = await browser.newPage();
    await page.goto('http://localhost:5000', { waitUntil: 'domcontentloaded' });
    const title = await page.title();
    expect(title).toBe('Agenda Admin');
  });
});
