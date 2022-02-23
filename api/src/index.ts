import dotenv from 'dotenv-flow';
dotenv.config();

import { getAgendaInstance } from 'src/agenda-instance';
import app from 'src/app';

try {
  getAgendaInstance()
    .start()
    .then(() => {
      app.listen(7878, () => console.info('App running on port 7878'));
    });
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
