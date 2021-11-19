import { NextFunction, Request, Response } from 'express';

export default (req: Request, res: Response, next: NextFunction) => {
  res.header('Access-Control-Allow-Credentials', '*');
  res.header('Access-Control-Allow-Origin', req.headers.origin);
  res.header('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'Content-Type, Authorization, Content-Length, X-Requested-With, x-client, x-client-version'
  );

  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }

  return next();
};
