require('tsconfig-paths/register');
import 'src/config';

import { getAgendaInstance } from 'src/agenda-instance';
import app from 'src/app';

getAgendaInstance()
  .start()
  .then(() => {
    app.listen(4000, () => console.info('App running on port 4000'));
  });
