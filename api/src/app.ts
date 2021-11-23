import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';

import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../../.env') });

import agenda from './agenda';
import apiRouter from './routes';
import finalize from './middleware/finalize';

const app = express();

app.use(cors());

app.use('/', express.static(path.join(__dirname, '../../client/build')));

app.use('/api', apiRouter);
app.use(finalize);

app.use((error: any, req: Request, res: Response) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong!';
  res.status(status).send({ status, message });
});

agenda.start().then(() => {
  app.listen(4000, () => console.info('App running on port 4000'));
});
