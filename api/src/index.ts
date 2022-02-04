require('tsconfig-paths/register');
import dotenv from 'dotenv-flow';
dotenv.config();

import { getAgendaInstance } from 'src/agenda-instance';
import app from 'src/app';

try {
  getAgendaInstance()
    .start()
    .then(() => {
      app.listen(4000, () => console.info('App running on port 4000'));
    });
} catch (error: any) {
  console.error(error.message);
  process.exit(1);
}
