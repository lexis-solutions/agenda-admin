import 'src/config';
import { getAgendaInstance } from 'src/agenda-instance';

beforeAll(async () => {
  await getAgendaInstance().start();
});

afterAll(async () => {
  await getAgendaInstance().close({ force: true });
});
