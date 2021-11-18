import express from 'express';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

import agenda from './agenda';

const app = express();

app.use('/', express.static(path.join(__dirname, '../../client/build')));

agenda.start().then(() => {
  app.listen(4000, () => console.info('App running on port 4000'));
});
