import { NextFunction, Request, Response } from 'express';
import agenda from 'src/agenda';

interface ReqQuery {
  autocomplete: string;
}

export const autocomplete = async (
  req: Request<any, any, any, ReqQuery>,
  res: Response,
  next: NextFunction
) => {
  const autocomplete = new RegExp(`^${req.query.autocomplete}.*`, 'i');
  const data = await agenda._collection
    .find(
      {
        name: { $regex: autocomplete },
      },
      {
        limit: 10,
        projection: ['name'],
      }
    )
    .toArray();

  res.locals.data = data;

  next();
};
