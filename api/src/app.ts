import express from 'express';
import path from 'path';

import dotenv from 'dotenv';
dotenv.config();

import agenda from './agenda';
import enableCors from './middleware/enable-cors';
import apiRouter from './routes';

const app = express();

app.use(enableCors);

app.use('/', express.static(path.join(__dirname, '../../client/build')));

app.use('/api', apiRouter);

agenda.start().then(() => {
  app.listen(4000, () => console.info('App running on port 4000'));
});
