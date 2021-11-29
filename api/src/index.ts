require('tsconfig-paths/register');

import dotenv from 'dotenv';
dotenv.config();

import agenda from 'src/agenda';
import app from 'src/app';

agenda.start().then(() => {
  app.listen(4000, () => console.info('App running on port 4000'));
});
