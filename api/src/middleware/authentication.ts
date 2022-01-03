import { NextFunction, Request, Response } from 'express';
import basicAuth from 'express-basic-auth';

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'testing' || process.env.AGENDA_PASSWORD) {
    return next();
  }

  const username = process.env.AGENDA_USERNAME || 'admin';
  const password = process.env.AGENDA_PASSWORD || '';

  basicAuth({
    users: {
      [username]: password,
    },
    challenge: true,
  })(req, res, next);
};
