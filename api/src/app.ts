import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';

import apiRouter from 'src/routes';
import finalize from 'src/middleware/finalize';
import { authentication } from 'src/middleware/authentication';

const app = express();

app.use(cors());

app.use(express.json());

app.use(authentication);
app.use('/', express.static(path.join(__dirname, '../../client/build')));
app.use('/api', apiRouter);
app.use(finalize);

app.use((error: any, req: Request, res: Response) => {
  const status = error.status || 500;
  const message = error.message || 'Something went wrong!';
  res.status(status).send({ status, message });
});

export default app;
