import { NextFunction, Request, Response } from 'express';
import basicAuth from 'express-basic-auth';

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === 'testing') {
    return next();
  }

  const username = process.env.AGENDA_USERNAME || 'admin';
  const password = process.env.AGENDA_PASSWORD || 'password';

  if (process.env.NODE_ENV !== 'development' && !password) {
    throw new Error('Password cannot be empty!');
  }

  basicAuth({
    users: {
      [username]: password,
    },
    challenge: true,
  })(req, res, next);
};
