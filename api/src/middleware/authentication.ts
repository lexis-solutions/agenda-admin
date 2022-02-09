import { NextFunction, Request, Response } from 'express';
import basicAuth from 'express-basic-auth';
import { getOptions } from 'src/options';

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { username, password } = getOptions();

  if (process.env.NODE_ENV === 'testing' || !password) {
    return next();
  }

  basicAuth({
    users: {
      [username]: password,
    },
    challenge: true,
  })(req, res, next);
};
