import 'src/config';
import agenda from 'src/agenda';

beforeAll(async () => {
  await agenda.start();
});

afterAll(async () => {
  await agenda.close({ force: true });
});
